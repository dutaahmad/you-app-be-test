import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cache } from "cache-manager";
import { Model } from "mongoose";
import { Chat } from "src/database/schemas/chat.schema";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async saveMessage(data: { senderId: string; recipientId: string; content: string }) {
    const newMessage = new this.chatModel(data);
    return newMessage.save();
  }

  async getMessage(messageId: string) {
    return this.chatModel.findById(messageId);
  }

  async getMessagesBySenderId(senderId: string) {
    return this.chatModel.find({ senderId });
  }

  async getMessagesByRecipientId(recipientId: string) {
    return this.chatModel.find({ recipientId });
  }

  async markMessageAsRead(messageId: string) {
    return this.chatModel.findByIdAndUpdate(messageId, { isRead: true });
  }

  async markMessageAsSent(messageId: string) {
    return this.chatModel.findByIdAndUpdate(messageId, { isSent: true });
  }

  async getSocketId(userId: string) {
    const socketId = await this.cacheManager.get<string>(`user.socket:${userId}`);

    return socketId;
  }

  async getMessages(senderId: string, recipientId: string) {
    return this.chatModel.find({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId }
      ]
    });
  }
}
