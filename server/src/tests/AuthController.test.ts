import { AuthController } from "../controllers/AuthController";
import { AppDataSource } from "../config/data-source";
import { mockRequest, mockResponse } from "mock-req-res";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../config/data-source");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
  let mockUserRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepo);
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const req = mockRequest({ body: { username: "newuser", password: "password123" } });
      const res = mockResponse() as any;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      mockUserRepo.findOneBy.mockResolvedValue(null);

      (bcrypt.hash as jest.Mock<any>).mockResolvedValue("hashed_password");
      (jwt.sign as jest.Mock<any>).mockReturnValue("fake_token");

      await AuthController.register(req, res);

      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: "fake_token" }));
    });

    it("should return 409 if username already exists", async () => {
      mockUserRepo.findOneBy.mockResolvedValue({ id: 1, username: "existing" });

      const req = mockRequest({ body: { username: "existing", password: "password123" } });
      const res = mockResponse() as any;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await AuthController.register(req, res);

      expect(mockUserRepo.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "Username already exists." });
    });
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = { id: 1, username: "test", password: "hashed_password", role: "REGULAR" };
      mockUserRepo.findOneBy.mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock<any>).mockResolvedValue(true);
      (jwt.sign as jest.Mock<any>).mockReturnValue("fake_login_token");

      const req = mockRequest({ body: { username: "test", password: "password123" } });
      const res = mockResponse() as any;
      res.json = jest.fn();

      await AuthController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "fake_login_token",
      });
    });

    it("should return 401 for invalid password", async () => {
      const mockUser = { id: 1, username: "test", password: "hashed_password" };
      mockUserRepo.findOneBy.mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock<any>).mockResolvedValue(false);

      const req = mockRequest({ body: { username: "test", password: "wrongpassword" } });
      const res = mockResponse() as any;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials." });
    });
  });
});
