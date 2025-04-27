// jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: UserService,
    configService: ConfigService
  ) {
    const jwtSecret = configService.get<string>("JWT_SECRET");
    console.log({ jwtSecret });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret! // change to env var
    });
  }

  async validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.authService.verifyToken(payload); // ensures token is still in cache
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return payload;
  }
}
