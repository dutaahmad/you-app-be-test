import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatModule } from "./chat/chat.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./database/database.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { CommonModule } from "./common/common.module";

export const CHAT_CLIENT_NAME = "CHAT_SERVICE";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db_host = configService.get<string>("MONGO_HOST");
        const db_port = configService.get<string>("MONGO_PORT");
        const db_name = configService.get<string>("MONGO_DB");
        const DB_URI = `${db_host}:${db_port}/${db_name}`;
        console.log({ DB_URI });
        return {
          uri: DB_URI,
          autoCreate: true
        };
      }
    }),
    DatabaseModule,
    ChatModule,
    UserModule,
    CommonModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {}
