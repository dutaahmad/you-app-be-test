import { Controller, Get, Param } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ChatService } from "./chat.service";
import { SendMessageDTO } from "./dto/create-chat.dto";

@Controller("chat/v1")
export class ChatListener {
  constructor(private readonly chatService: ChatService) {}

  @EventPattern("chat")
  handleChat(@Payload() data: SendMessageDTO) {
    // await this.chatService.saveMessage(data);
    // additional logic can be placed here
    console.log("Chat event received via ChatListener:", data);
  }

  @Get("socket_id/:userId")
  getUserProfile(@Param("userId") userId: string) {
    const socketId = this.chatService.getSocketId(userId);
    return {
      message: "SocketId retrieved successfully",
      data: socketId
    };
  }
}
