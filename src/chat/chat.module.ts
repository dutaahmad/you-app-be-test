import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { CommonModule } from "src/common/common.module";
import { ChatListener } from "./chat.listener";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CHAT_CLIENT_NAME } from "src/app.module";

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: CHAT_CLIENT_NAME,
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"], // adjust if needed
          queue: "chat_queue",
          queueOptions: {
            durable: false
          }
        }
      }
    ])
  ],
  providers: [
    ChatGateway,
    ChatService,
    ChatListener
    // {
    //   provide: CHAT_CLIENT_NAME,
    //   useExisting: CHAT_CLIENT_NAME // 👈 important magic here
    // }
  ],
  exports: [ClientsModule, CHAT_CLIENT_NAME]
})
export class ChatModule {
  constructor() {
    console.log("ChatModule initialized");
  }
}
