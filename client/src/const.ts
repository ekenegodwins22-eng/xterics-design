export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  "https://placehold.co/128x128/E1E7EF/1F2937?text=App";

// Generate Google OAuth login URL at runtime
export const getLoginUrl = () => {
  // Use the backend endpoint to initiate Google OAuth flow
  return `${window.location.origin}/api/oauth/login`;
};

