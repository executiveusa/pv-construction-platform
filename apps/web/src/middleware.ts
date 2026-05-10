import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Exclude API routes, Next.js internals, static assets, and admin path
    "/((?!api|_next|_vercel|.*\\..*|admin).*)"  
  ],
};
