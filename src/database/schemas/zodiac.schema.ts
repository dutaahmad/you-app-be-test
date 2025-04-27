import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Zodiac extends Document {
  @Prop()
  startDate: string; // YYYY-MM-DD
  @Prop()
  endDate: string; // YYYY-MM-DD
  @Prop()
  animal: string;
}

export const ZodiacSchema = SchemaFactory.createForClass(Zodiac);
