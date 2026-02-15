import { checkRole } from "../middlewares/roleMiddleware";
import { UserRole } from "../models/Enums";
import { mockRequest, mockResponse } from "mock-req-res";
import { describe, expect, it, jest } from "@jest/globals";

describe("RoleMiddleware", () => {
  it("should call next() if user has required role", () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();

    res.locals = { jwtPayload: { role: UserRole.ADMIN } };

    const middleware = checkRole([UserRole.ADMIN, UserRole.REGULAR]);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 403 if user does not have required role", () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();

    res.locals = { jwtPayload: { role: UserRole.GUEST } };

    const middleware = checkRole([UserRole.ADMIN]);
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied: Insufficient permissions",
    });
  });
});
