import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { SendMessageDTO } from "./dto/create-chat.dto";
import { UserService } from "src/user/user.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";
import { Cache } from "cache-manager";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    console.log("ChatGateway initialized");
  }

  private async getUserSocketId(userId: string) {
    const socketId = await this.cacheManager.get<string>(`user.socket:${userId}`);
    return socketId;
  }

  private async setUserSocketId(userId: string, socketId: string) {
    await this.cacheManager.set(`user.socket:${userId}`, socketId, 3600 * 24 * 30); // 30 days
  }

  private async deleteUserSocketId(userId: string) {
    await this.cacheManager.del(`user.socket:${userId}`);
  }

  async handleConnection(client: Socket) {
    const AuthorizationToken = client.handshake.auth?.token || client.handshake.headers?.token;
    try {
      const res = await this.userService.verifyUndecodedToken(AuthorizationToken);
      console.log(`Client connected. clientId: ${client.id}. User Data:`, res);
      await this.setUserSocketId(res.id, client.id);
    } catch (error) {
      console.log(`Client not authorized: ${client.id}. Error:`, error);
      this.server.to(client.id).emit("authorization", { message: "Unauthorized" });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    await this.deleteUserSocketId(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("chat") // subscribe to chat event messages
  async handleMessage(@MessageBody() payload: SendMessageDTO) {
    console.log(`new message from ${payload.senderId}. Contents: `, { content: payload.content });
    const recipientSocketId = await this.getUserSocketId(payload.recipientId);
    const savedMessage = await this.chatService.saveMessage(payload);

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit("chat", savedMessage);
      // @ts-expect-error socketId is a string
      const savedSentMessage = await this.chatService.markMessageAsSent(savedMessage._id);
      return {
        message: "Message sent successfully",
        data: savedSentMessage
      };
    } else {
      return {
        message: "Message did not sent but saved in the database",
        data: savedMessage
      };
    }
  }
}
