import { Test, TestingModule } from "@nestjs/testing";
import { AppController, LOVCategory } from "./app.controller";
import { AppService } from "./app.service";
import { BadRequestException } from "@nestjs/common";

describe("AppController", () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    getZodiacs: jest.fn(() => ["Aries", "Taurus"]),
    getHorospopes: jest.fn(() => ["Capricorn", "Aquarius"])
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService
        }
      ]
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe("getHello", () => {
    it("should return zodiacs when lovCategory is 'zodiac'", () => {
      const result = appController.getHello("zodiac");
      expect(result).toEqual(["Aries", "Taurus"]);
      expect(appService.getZodiacs).toHaveBeenCalled();
    });

    it("should return horoscopes when lovCategory is 'horoscope'", () => {
      const result = appController.getHello("horoscope");
      expect(result).toEqual(["Capricorn", "Aquarius"]);
      expect(appService.getHorospopes).toHaveBeenCalled();
    });

    it("should throw BadRequestException for invalid lovCategory", () => {
      expect(() => appController.getHello("invalid" as LOVCategory)).toThrow(BadRequestException);
    });
  });
});
