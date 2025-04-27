import {
  IsString,
  IsEmail,
  MinLength,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsOptional,
  Validate,
  ValidateIf
} from "class-validator";

export class RegisterUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}

@ValidatorConstraint({ name: "usernameOrEmail", async: false })
class UsernameOrEmailConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.email || obj.username);
  }

  defaultMessage() {
    return "Either email or username must be provided";
  }
}

export class LoginUserDto {
  @ValidateIf((o) => !o.username)
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ValidateIf((o) => !o.email)
  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  @Validate(UsernameOrEmailConstraint)
  _usernameOrEmailValidator: string; // dummy property to trigger class-level validation
}
