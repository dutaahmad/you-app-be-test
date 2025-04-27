import { Injectable } from "@nestjs/common";
import { Zodiac } from "./database/schemas/zodiac.schema";
import { Horoscope } from "./database/schemas/horoscope.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class AppService {
  constructor(
    @InjectModel("Zodiac") private readonly zodiacModel: Model<Zodiac>,
    @InjectModel("Horoscope") private readonly horoscopeModel: Model<Horoscope>
  ) {}

  async getZodiacs() {
    const zodiacsDocs = await this.zodiacModel.find().exec();
    const zodiacs = zodiacsDocs;
    // .map((zodiac) => zodiac.toObject());
    return zodiacs;
  }

  async getHorospopes() {
    const horoscopesDocs = await this.horoscopeModel.find().exec();
    const horoscopes = horoscopesDocs;
    // .map((horoscope) => horoscope.toObject());
    return horoscopes;
  }
}
