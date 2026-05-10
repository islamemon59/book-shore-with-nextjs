export const getHealthStatus = () => ({
  success: true,
  status: "ok",
  service: "bookshore-backend",
  timestamp: new Date().toISOString(),
});
