import { GoogleProvider } from "../services/providers/GoogleProvider";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockGenerateContent = jest.fn<(...args: any[]) => Promise<any>>();

const mockGetGenerativeModel = jest.fn(() => ({
  generateContent: mockGenerateContent,
}));

jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    })),
  };
});

describe("GoogleProvider", () => {
  let provider: GoogleProvider;

  beforeEach(() => {
    provider = new GoogleProvider();
    jest.clearAllMocks();
  });

  it("should return text when API call is successful", async () => {
    const mockResponseText = "Hello from Gemini";

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockResponseText,
      },
    });

    const result = await provider.ask("Hello");

    expect(result).toBe(mockResponseText);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it("should return fallback message on error", async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Error"));

    const result = await provider.ask("Hello");

    expect(result).toBe("Google AI unavailable.");
  });
});
