// create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsDate,
  IsNumber,
  Min,
  IsObject,
  IsArray
} from "class-validator";
import { Type } from "class-transformer";

export class UserProfileDTO {
  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthday?: Date;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
}

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsObject()
  @IsOptional()
  profile?: UserProfileDTO;
}
