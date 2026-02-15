import { SnippetController } from "../controllers/SnippetController";
import { AppDataSource } from "../config/data-source";
import { mockRequest, mockResponse } from "mock-req-res";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("../config/data-source");

describe("SnippetController - Get Snippets", () => {
  let mockSnippetRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSnippetRepo = {
      find: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockSnippetRepo);
  });

  it("should return a list of snippets for the user", async () => {
    const mockSnippets = [{ id: 1, title: "Test Snippet", code: "console.log('hi')", language: "javascript" }];
    mockSnippetRepo.find.mockResolvedValue(mockSnippets);

    const req = mockRequest();
    const res = mockResponse();

    res.locals = { jwtPayload: { userId: 1 } };

    await SnippetController.getSnippets(req, res);

    expect(mockSnippetRepo.find).toHaveBeenCalledWith({
      where: { user: { id: 1 } },
      order: { createdAt: "DESC" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSnippets);
  });

  it("should handle errors gracefully", async () => {
    mockSnippetRepo.find.mockRejectedValue(new Error("Database error"));

    const req = mockRequest();
    const res = mockResponse();
    res.locals = { jwtPayload: { userId: 1 } };

    await SnippetController.getSnippets(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
