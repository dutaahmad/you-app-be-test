import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { CommonModule } from "src/common/common.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CommonModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"), // ✅ now guaranteed to exist
        signOptions: { expiresIn: "1h" }
      })
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard]
})
export class UserModule {}
