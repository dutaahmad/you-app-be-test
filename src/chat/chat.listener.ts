import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ChatService } from "./chat.service";
import { SendMessageDTO } from "./dto/create-chat.dto";

@Controller()
export class ChatListener {
  constructor(private readonly chatService: ChatService) {}

  @EventPattern("new_chat")
  async handleChat(@Payload() data: SendMessageDTO) {
    await this.chatService.saveMessage(data);
    // additional logic can be placed here
  }
}
