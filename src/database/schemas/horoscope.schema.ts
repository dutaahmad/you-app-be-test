import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Horoscope extends Document {
  @Prop()
  symbol: string;

  @Prop()
  name: string;

  @Prop()
  alias: string;

  @Prop()
  start: string; // MM-DD

  @Prop()
  end: string; // MM-DD
}

export const HoroscopeSchema = SchemaFactory.createForClass(Horoscope);
