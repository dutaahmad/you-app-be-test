import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { CommonModule } from "src/common/common.module";
import { ChatListener } from "./chat.listener";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [CommonModule, UserModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatListener]
})
export class ChatModule {
  constructor() {
    console.log("ChatModule initialized");
  }
}
