import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es-MX", "en"],
  defaultLocale: "es-MX",
  localePrefix: "as-needed", // es-MX has no prefix, /en/ for English
});
