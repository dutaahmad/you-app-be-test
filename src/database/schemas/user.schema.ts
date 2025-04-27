import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ _id: false })
export class UserProfile extends Document {
  @Prop({ required: false })
  age?: number;
  @Prop({ required: false })
  fullname?: string;
  @Prop({ required: false })
  birthday?: Date;
  @Prop({ required: false })
  horoscope?: string;
  @Prop({ required: false })
  zodiac?: string;
  @Prop({ required: false })
  height?: number;
  @Prop({ required: false })
  weight?: number;
  @Prop({ required: false, type: [String] })
  interests?: string[];
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: false, type: UserProfile })
  profile?: {
    age?: number;
    fullname?: string;
    birthday?: Date;
    horoscope?: string;
    zodiac?: string;
    height?: number;
    weight?: number;
    interests?: string[];
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
