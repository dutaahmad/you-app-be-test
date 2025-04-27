import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./auth/jwt-auth.decorators";

export type LOVCategory = "zodiac" | "horoscope";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get("lov")
  getHello(@Query("lovCategory") lovCategory: LOVCategory) {
    if (lovCategory === "zodiac") {
      return this.appService.getZodiacs();
    } else if (lovCategory === "horoscope") {
      return this.appService.getHorospopes();
    } else throw new BadRequestException("Invalid lovCategory");
  }
}
