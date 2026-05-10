import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://pvconstruccion.com";

const ZONES = [
  "puerto-vallarta",
  "zona-romantica",
  "marina-vallarta",
  "nuevo-vallarta",
  "bucerias",
  "punta-de-mita",
  "sayulita",
  "san-pancho",
  "la-cruz",
  "lo-de-marcos",
  "rincon-de-guayabitos",
  "mezcales",
  "bahia-de-banderas",
];

const PAGES = [
  "",
  "servicios",
  "portafolio",
  "resenas",
  "nosotros",
  "contacto",
  "legal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages in both locales
  for (const page of PAGES) {
    // Spanish (default, no prefix)
    entries.push({
      url: `${BASE_URL}/${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "weekly" : "monthly",
      priority: page === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          "es-MX": `${BASE_URL}/${page}`,
          en: `${BASE_URL}/en/${page}`,
        },
      },
    });
  }

  // Geo zone pages
  for (const slug of ZONES) {
    entries.push({
      url: `${BASE_URL}/zona/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          "es-MX": `${BASE_URL}/zona/${slug}`,
          en: `${BASE_URL}/en/zona/${slug}`,
        },
      },
    });
  }

  return entries;
}
