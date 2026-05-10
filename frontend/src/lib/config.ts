const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const publicAuthBaseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL || `${publicApiBaseUrl}/api/auth`;

export const appConfig = {
  apiBaseUrl: process.env.API_BASE_URL || publicApiBaseUrl,
  publicApiBaseUrl,
  authBaseUrl: publicAuthBaseUrl,
  siteName: "BookShore",
};
