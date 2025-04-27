import { ChatSchema } from "./chat.schema";
import { HoroscopeSchema } from "./horoscope.schema";
import { UserSchema } from "./user.schema";
import { ZodiacSchema } from "./zodiac.schema";

export const databaseSchemas = [
  { name: "User", schema: UserSchema },
  { name: "Horoscope", schema: HoroscopeSchema },
  { name: "Zodiac", schema: ZodiacSchema },
  { name: "Chat", schema: ChatSchema } // Assuming Chat is a Mongoose model
];
