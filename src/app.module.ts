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
import { ClientsModule, Transport } from "@nestjs/microservices";

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
        return {
          uri: `${db_host}:${db_port}/${db_name}`,
          autoCreate: true
        };
      }
    }),
    ClientsModule.register([
      {
        name: CHAT_CLIENT_NAME,
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "chat_queue",
          queueOptions: {
            durable: false
          }
        }
      }
    ]),
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
