"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏗️</span>
              <span className="font-bold text-lg">PV Construcción</span>
            </div>
            <p className="text-sm opacity-80">{t("tagline")}</p>
            <p className="text-xs opacity-60">{t("socialPurpose")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/" className="hover:opacity-100">
                  {nav("home")}
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:opacity-100">
                  {nav("services")}
                </Link>
              </li>
              <li>
                <Link href="/portafolio" className="hover:opacity-100">
                  {nav("portfolio")}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:opacity-100">
                  {nav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3">{t("legal")}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/legal" className="hover:opacity-100">
                  {t("disclaimer")}
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:opacity-100">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:opacity-100">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">
              {nav("contact")}
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>📍 Puerto Vallarta, Jalisco, MX</li>
              <li>📞 +52 322 123 4567</li>
              <li>💬 WhatsApp</li>
              <li>✉️ info@pvconstruccion.com</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-background/20" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-60">
          <p>{t("copyright")}</p>
          <p className="mt-2 md:mt-0">
            RFC: XXXX000000XXX • Licencia Municipal: En Trámite
          </p>
        </div>
      </div>
    </footer>
  );
}
