"use client";

import { useEffect } from "react";

export function TiledeskWidget() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_TILEDESK_PROJECT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_TILEDESK_BASE_URL;

    if (!projectId) return; // Skip if not configured

    // Set Tiledesk config
    (window as unknown as Record<string, unknown>).tiledeskSettings = {
      projectid: projectId,
      align: "right",
      marginX: 20,
      marginY: 20,
      calloutTimer: 5000,
      calloutTitle: "¡Hola! ¿Podemos ayudarte?",
    };

    // Inject widget script
    const script = document.createElement("script");
    script.id = "tiledesk-jssdk";
    script.async = true;
    script.src = baseUrl
      ? `${baseUrl}/widget/launch.js`
      : "https://widget.tiledesk.com/v6/launch.js";
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById("tiledesk-jssdk");
      if (el) el.remove();
    };
  }, []);

  return null;
}
