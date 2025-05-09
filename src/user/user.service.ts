import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, MongooseError, QueryOptions } from "mongoose";
import { User } from "src/database/schemas/user.schema";
import { RegisterUserDto } from "./dto/register-user.dto";
import { EncryptionHashService } from "src/common/encryption-hash/encryption-hash.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { TokenPayload } from "./type/user.type";
import { UserProfileDTO } from "./dto/create-user.dto";
import * as dayjs from "dayjs";
import { Zodiac } from "src/database/schemas/zodiac.schema";
import { Horoscope } from "src/database/schemas/horoscope.schema";
import { SearchUserDto } from "./dto/search-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Zodiac.name) private readonly zodiacModel: Model<Zodiac>,
    @InjectModel(Horoscope.name) private readonly horoscopeModel: Model<Horoscope>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly encryptHashService: EncryptionHashService,
    private jwtService: JwtService
  ) {}

  private async findByEmail(email: string) {
    const user = await this.userModel
      .findOne({ email })
      .exec()
      .then((user) => user?.toObject());
    return user;
  }

  private async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username }).exec();
    return user?.toObject();
  }

  private async getZodiacAndHoroscope(birthday: Date) {
    const date = dayjs(birthday);

    // Find horoscope
    const allHoroscopes = await this.horoscopeModel.find().exec();
    const formatted = date.format("MM-DD");
    console.log({ formatted });
    const horoscope = allHoroscopes.find((h) => {
      const start = dayjs(h.start, "MM-DD");
      const end = dayjs(h.end, "MM-DD");
      if (start.isBefore(end)) {
        return formatted >= h.start && formatted <= h.end;
      } else {
        return formatted >= h.start || formatted <= h.end;
      }
    });

    // Find Chinese zodiac
    const zodiac = await this.zodiacModel
      .findOne({
        startDate: { $lte: birthday },
        endDate: { $gte: birthday }
      })
      .exec();

    return {
      horoscope: horoscope ? horoscope.name : null,
      zodiac: zodiac ? zodiac.animal : null
    };
  }

  async findById(userId: string) {
    return await this.userModel.findById(userId).exec();
  }

  async create(requiredData: RegisterUserDto) {
    try {
      const hashedPassword = await this.encryptHashService.hash(requiredData.password);
      const newUser = new this.userModel({
        ...requiredData,
        password: hashedPassword
      });
      return await newUser.save();
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new BadRequestException({
          message: `${error.message}. Please provide the requestId to the support team for the details.`
        });
      }
    }
  }

  async validateUser(emailOrUsername: string, password: string) {
    let user = await this.findByEmail(emailOrUsername);
    if (!user) {
      user = await this.findByUsername(emailOrUsername);
      if (!user) throw new NotFoundException("User not found");
    }

    const isPasswordValid = await this.encryptHashService.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }

  async login(user: User) {
    // @ts-expect-error user._id is type unknown
    const userId = user._id.toString() as string;
    const userData = {
      id: userId,
      email: user.email,
      username: user.username
    };
    const payload = { sub: userId, ...userData };
    const token = this.jwtService.sign(payload);

    // Save token to in-memory cache (can add TTL if needed)
    await this.cacheManager.set(`jwt:${userId}`, token);

    return { access_token: token };
  }

  async logout(userId: string) {
    await this.cacheManager.del(`jwt:${userId}`);
  }

  async getUserFromCache(userId: string) {
    const token = await this.cacheManager.get<string>(`jwt:${userId}`);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const user = this.jwtService.decode(token!) as TokenPayload;
    if (!user) {
      throw new UnauthorizedException("User not found in session!");
    }
    return user;
  }

  async verifyUndecodedToken(token: string) {
    try {
      const decoded = this.jwtService.decode(token);
      if (!decoded) {
        throw new UnauthorizedException("Invalid token");
      }
      return await this.getUserFromCache(decoded.id);
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException("Invalid token");
    }
  }

  async verifyToken(decodedToken: TokenPayload) {
    try {
      const decodedCahedToken = await this.getUserFromCache(decodedToken.id);

      if (decodedCahedToken.email !== decodedToken.email) {
        throw new UnauthorizedException("Token mismatch");
      }

      return decodedToken;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException("Invalid token");
    }
  }

  async updateUserProfile(userId: string, userProfile: UserProfileDTO) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found");

    userProfile.birthday = dayjs(userProfile.birthday, "MM-DD-YYYY", true).toDate();

    if (userProfile.birthday) {
      const { horoscope, zodiac } = await this.getZodiacAndHoroscope(userProfile.birthday);
      console.log({ horoscope, zodiac });

      Object.assign(userProfile, { horoscope, zodiac });

      console.log({ userProfile });
    }

    user.profile = {
      ...userProfile,
      ...user.profile
    };

    console.log({ updatedProfile: user.profile });

    await user.save();
    return user;
  }

  async searchUser(searchData: SearchUserDto) {
    const { username, email, age, fullname, birthday, height, weight, interest } = searchData;
    const query: QueryOptions<User> = {
      $or: [
        username && { username: { $regex: username, $options: "i" } },
        email && { email: { $regex: email, $options: "i" } },
        fullname && { "profile.fullname": { $regex: fullname, $options: "i" } },
        age && { "profile.age": +age }, // direct number match
        birthday && { "profile.birthday": new Date(birthday) }, // date match
        height && { "profile.height": +height },
        weight && { "profile.weight": +weight },
        interest && { "profile.interests": { $regex: interest, $options: "i" } } // match one interest string
      ].filter(Boolean) // Remove undefined/null conditions
    };
    return await this.userModel
      .find(query)
      .select(["username", "profile.age", "profile.fullname"])
      .exec();
  }
}
