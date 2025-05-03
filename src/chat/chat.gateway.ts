import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { ClientProxy } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";
import { SendMessageDTO } from "./dto/create-chat.dto";
import { CHAT_CLIENT_NAME } from "src/app.module";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    @Inject(CHAT_CLIENT_NAME) private client: ClientProxy
  ) {
    console.log("ChatGateway initialized");
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("send_message")
  async handleMessage(client: Socket, payload: SendMessageDTO) {
    this.client.emit("new_chat", payload); // Publish to RabbitMQ
    const savedMessage = await this.chatService.saveMessage(payload);
    this.server.to(payload.recipientId).emit("receive_message", savedMessage);
    return savedMessage;
  }
}
