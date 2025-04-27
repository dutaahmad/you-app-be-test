import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat } from "src/database/schemas/chat.schema";

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private readonly chatModel: Model<Chat>) {}

  async saveMessage(data: { senderId: string; recipientId: string; content: string }) {
    const newMessage = new this.chatModel(data);
    return newMessage.save();
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
