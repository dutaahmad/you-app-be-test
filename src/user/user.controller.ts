import { Controller, Post, Body, Get, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserDto, RegisterUserDto } from "./dto/register-user.dto";
import { ApiResponse } from "@nestjs/swagger";
import { Public, User } from "src/auth/jwt-auth.decorators";
import { TokenPayload } from "./type/user.type";
import { UserProfileDTO } from "./dto/create-user.dto";
import { SearchUserDto } from "./dto/search-user.dto";

@Controller("user/v1")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post("register")
  @ApiResponse({ status: 201, description: "User successfully created." })
  async register(@Body() registrationData: RegisterUserDto) {
    return {
      message: "User registered successfully",
      data: await this.userService.create(registrationData)
    };
  }

  @Public()
  @Post("login")
  @ApiResponse({ status: 200, description: "User successfully logged in." })
  async login(@Body() loginData: LoginUserDto) {
    const usernameOrEmail = loginData.username || loginData.email;
    const user = await this.userService.validateUser(usernameOrEmail!, loginData.password);
    return await this.userService.login(user);
  }

  @Get("profile")
  async getUserProfile(@User() user: TokenPayload) {
    const userData = await this.userService.findById(user.id);
    return {
      message: "Profile retrieved successfully",
      data: userData
    };
  }

  @Post("profile")
  @ApiResponse({ status: 200, description: "User profile updated successfully." })
  async createUserProfile(@Body() userProfile: UserProfileDTO, @User() user: TokenPayload) {
    const updatedProfile = await this.userService.updateUserProfile(user.id, userProfile);
    return {
      message: "User profile created successfully",
      data: updatedProfile
    };
  }

  @Put("profile")
  @ApiResponse({ status: 200, description: "User profile updated successfully." })
  async updateUserProfile(@Body() userProfile: UserProfileDTO, @User() user: TokenPayload) {
    const updatedProfile = await this.userService.updateUserProfile(user.id, userProfile);
    return {
      message: "User profile updated successfully",
      data: updatedProfile
    };
  }

  @Post("search")
  async searchUser(@Body() searchData: SearchUserDto) {
    const users = await this.userService.searchUser(searchData);
    return {
      message: "Users retrieved successfully",
      data: users
    };
  }
}
