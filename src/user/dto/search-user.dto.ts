import { IsOptional, IsString, IsEmail, IsDate, IsNumber } from "class-validator";

export class SearchUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  age?: number;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsDate()
  birthday?: Date;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  interest?: string;
}
