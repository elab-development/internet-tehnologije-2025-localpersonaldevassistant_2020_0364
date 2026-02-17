import axios, { isAxiosError } from "axios";
import type { AxiosResponse } from "axios";

type HTTPRequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type Response = { ok: boolean; status: number; payload: object };
type QueryParams = Record<string, string | number | boolean | undefined>;
type Headers = Record<string, string>;

class CommunicationController {
  static async sendRequest(
    method: HTTPRequestMethod,
    api: string,
    {
      queryParams = {},
      body = {},
      headers = {},
    }: {
      queryParams?: QueryParams;
      body?: unknown;
      headers?: Headers;
    },
  ): Promise<Response> {
    let response: AxiosResponse;
    headers = { ...headers, Authorization: `Bearer ${localStorage.getItem("token") || ""}` };

    try {
      switch (method) {
        case "GET":
          response = await axios.get(api, { params: queryParams, headers: headers });
          break;
        case "POST":
          response = await axios.post(api, body, { params: queryParams, headers: headers });
          break;
        case "PUT":
          response = await axios.put(api, body, { params: queryParams, headers: headers });
          break;
        case "DELETE":
          response = await axios.delete(api, { data: body, params: queryParams, headers: headers });
          break;
        default:
          throw new Error(`Method ${method} is not supported`);
      }

      return {
        ok: true,
        status: response.status,
        payload: response.data,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401 && api !== "/api/login") {
          console.warn("Session expired or unauthorized. Redirecting to login...");
          localStorage.removeItem("token");
          window.location.href = "/";
          return { ok: false, status: 401, payload: {} };
        }
        return {
          ok: false,
          status: error.response?.status || 500,
          payload: error.response?.data || { error: error.message },
        };
      }
      if (error instanceof Error) {
        return { ok: false, status: 500, payload: { error: error.message } };
      }
      throw error;
    }
  }

  static async streamRequest(
    api: string,
    body: object,
    onChunk: (chunk: string) => void,
    onComplete: (data: { messageId?: number; sessionId?: number }) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const token = localStorage.getItem("token") || "";

    try {
      const response = await fetch(`${axios.defaults.baseURL}${api}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.type === "DONE") {
                onComplete(data);
              } else if (data.content) {
                onChunk(data.content);
              } else if (data.error) {
                console.error("Stream error from server:", data.error);
              }
            } catch (e) {
              console.error("Error parsing stream JSON", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream network error", error);
    }
  }
}

export default CommunicationController;
