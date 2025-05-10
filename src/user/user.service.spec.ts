import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getModelToken } from "@nestjs/mongoose";
import { EncryptionHashService } from "../common/encryption-hash/encryption-hash.service";
import { JwtService } from "@nestjs/jwt";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { User } from "../database/schemas/user.schema";
import { Zodiac } from "../database/schemas/zodiac.schema";
import { Horoscope } from "../database/schemas/horoscope.schema";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";

describe("UserService", () => {
  let service: UserService;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    exec: jest.fn(),
    save: jest.fn()
  };

  const mockZodiacModel = {
    findOne: jest.fn()
  };

  const mockHoroscopeModel = {
    find: jest.fn()
  };

  const mockEncryptService = {
    hash: jest.fn(),
    compare: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn(),
    decode: jest.fn()
  };

  const mockCache = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Zodiac.name), useValue: mockZodiacModel },
        { provide: getModelToken(Horoscope.name), useValue: mockHoroscopeModel },
        { provide: EncryptionHashService, useValue: mockEncryptService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: CACHE_MANAGER, useValue: mockCache }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe("create", () => {
    it("should hash password and save user", async () => {
      const dto = { email: "test@test.com", username: "test", password: "pass123" };
      const save = jest.fn().mockResolvedValue({ _id: "1", ...dto });
      mockEncryptService.hash.mockResolvedValue("hashedPass");
      mockUserModel.constructor = jest.fn(() => ({ ...dto, password: "hashedPass", save }));

      const result = await service.create(dto as any);

      expect(mockEncryptService.hash).toHaveBeenCalledWith("pass123");
      expect(result).toEqual({ _id: "1", ...dto });
    });
  });

  describe("validateUser", () => {
    it("should validate by email", async () => {
      const user = { email: "test@test.com", password: "hashed" };
      mockUserModel.findOne.mockReturnValueOnce({ exec: () => Promise.resolve(user) });
      mockEncryptService.compare.mockResolvedValue(true);

      const result = await service.validateUser("test@test.com", "pass123");
      expect(result).toEqual(user);
    });

    it("should throw if user not found", async () => {
      mockUserModel.findOne.mockReturnValue({ exec: () => Promise.resolve(null) });

      await expect(service.validateUser("notfound", "pass")).rejects.toThrow(NotFoundException);
    });

    it("should throw if password invalid", async () => {
      const user = { password: "hashed" };
      mockUserModel.findOne.mockReturnValueOnce({ exec: () => Promise.resolve(user) });
      mockEncryptService.compare.mockResolvedValue(false);

      await expect(service.validateUser("email", "wrongpass")).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("login", () => {
    it("should sign and cache JWT", async () => {
      const user = { _id: "userId", email: "email", username: "user" };
      mockJwtService.sign.mockReturnValue("token");

      const result = await service.login(user as any);

      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(mockCache.set).toHaveBeenCalledWith("jwt:userId", "token");
      expect(result).toEqual({ access_token: "token" });
    });
  });

  describe("getUserFromCache", () => {
    it("should decode token from cache", async () => {
      const token = "token";
      const payload = { id: "123", email: "test@test.com", username: "abc" };
      mockCache.get.mockResolvedValue(token);
      mockJwtService.decode.mockReturnValue(payload);

      const result = await service.getUserFromCache("123");
      expect(result).toEqual(payload);
    });

    it("should throw if not found", async () => {
      mockCache.get.mockResolvedValue(null);

      await expect(service.getUserFromCache("id")).rejects.toThrow(UnauthorizedException);
    });
  });
});
