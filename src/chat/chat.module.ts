import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { CommonModule } from "src/common/common.module";
import { ChatListener } from "./chat.listener";

@Module({
  imports: [CommonModule],
  providers: [ChatGateway, ChatService, ChatListener]
})
export class ChatModule {}
