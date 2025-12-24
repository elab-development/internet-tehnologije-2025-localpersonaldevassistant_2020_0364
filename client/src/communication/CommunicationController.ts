import axios, { isAxiosError } from "axios";
import type { AxiosResponse } from "axios";

type HTTPRequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type Response = { ok: boolean; status: number; payload: object };

class CommunicationController {
  static async sendRequest(method: HTTPRequestMethod, api: string, { queryParams = {}, body = {}, headers = {} }): Promise<Response> {
    let response: AxiosResponse;

    headers = { ...headers, Authorization: `Bearer ${localStorage.getItem("token") || ""}` };

    try {
      switch (method) {
        case "GET":
          response = await axios.get(api, {
            params: queryParams,
            headers: headers,
          });
          break;

        case "POST":
          response = await axios.post(api, body, {
            params: queryParams,
            headers: headers,
          });
          break;

        case "PUT":
          response = await axios.put(api, body, {
            params: queryParams,
            headers: headers,
          });
          break;

        case "DELETE":
          response = await axios.delete(api, {
            data: body,
            params: queryParams,
            headers: headers,
          });
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
        return {
          ok: false,
          status: error.response?.status || 500,
          payload: error.response?.data || { error: error.message },
        };
      }

      if (error instanceof Error) {
        return {
          ok: false,
          status: 500,
          payload: { error: error.message },
        };
      }

      throw error;
    }
  }
}

export default CommunicationController;
