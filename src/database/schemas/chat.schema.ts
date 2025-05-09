// chat.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  recipientId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false, type: Boolean })
  isSent: boolean;

  @Prop({ default: false, type: Boolean })
  isRead: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
