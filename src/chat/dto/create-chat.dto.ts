import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageDTO {
  @IsString()
  @IsNotEmpty()
  senderId: string;
  @IsString()
  @IsNotEmpty()
  recipientId: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}
