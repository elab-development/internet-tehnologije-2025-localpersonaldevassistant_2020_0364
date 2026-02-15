import { checkJwt } from "../middlewares/authMiddleware";
import { AppDataSource } from "../config/data-source";
import { mockRequest, mockResponse } from "mock-req-res";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import jwt from "jsonwebtoken";

jest.mock("../config/data-source");
jest.mock("jsonwebtoken");

describe("AuthMiddleware - checkJwt", () => {
  let mockBlacklistRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockBlacklistRepo = {
      findOneBy: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockBlacklistRepo);
  });

  it("should call next() if token is valid and not blacklisted", async () => {
    const req = mockRequest({
      headers: { authorization: "Bearer valid_token" },
    });
    const res = mockResponse() as any;
    const next = jest.fn();

    mockBlacklistRepo.findOneBy.mockResolvedValue(null);
    (jwt.verify as jest.Mock).mockReturnValue({ userId: 1, role: "REGULAR" });

    await checkJwt(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.locals.jwtPayload).toEqual({ userId: 1, role: "REGULAR" });
  });

  it("should return 401 if token is blacklisted (logged out)", async () => {
    const req = mockRequest({
      headers: { authorization: "Bearer old_token" },
    });
    const res = mockResponse() as any;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    const next = jest.fn();

    mockBlacklistRepo.findOneBy.mockResolvedValue({ id: 1 });

    await checkJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token invalidated (Logged out)" });
  });

  it("should return 401 if no token provided", async () => {
    const req = mockRequest({ headers: {} });
    const res = mockResponse() as any;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    const next = jest.fn();

    await checkJwt(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
  });
});
