const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const publicAuthBaseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL || `${publicApiBaseUrl}/api/auth`;
const publicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const appConfig = {
  apiBaseUrl: process.env.API_BASE_URL || publicApiBaseUrl,
  publicApiBaseUrl,
  authBaseUrl: `${publicSiteUrl}/api/auth`,
  backendAuthBaseUrl: publicAuthBaseUrl,
  siteUrl: publicSiteUrl,
  siteName: "BookShore",
};
