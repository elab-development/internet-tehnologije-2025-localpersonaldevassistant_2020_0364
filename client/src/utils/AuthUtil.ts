export interface UserTokenPayload {
  userId: number;
  username: string;
  role: "ADMIN" | "REGULAR" | "GUEST";
  exp: number;
  iat: number;
}

export class AuthUtil {
  /**
   * Retrieves the raw token from local storage.
   */
  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Decodes the JWT and returns the payload object.
   * Handles base64 decoding safely (including UTF-8 characters).
   */
  static getDecodedToken(): UserTokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  }

  /**
   * Helper to get just the username, defaulting to "Guest" if not logged in.
   */
  static getUsername(): string {
    const payload = this.getDecodedToken();
    return payload ? payload.username : "Guest";
  }

  /**
   * Helper to check if the current user is a Guest.
   */
  static isGuest(): boolean {
    const payload = this.getDecodedToken();
    return payload?.role === "GUEST";
  }
}
