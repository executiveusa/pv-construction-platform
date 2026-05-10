"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/servicios", label: t("services") },
    { href: "/portafolio", label: t("portfolio") },
    { href: "/resenas", label: t("reviews") },
    { href: "/nosotros", label: t("about") },
    { href: "/contacto", label: t("contact") },
  ];

  const switchLocale = locale === "es-MX" ? "en" : "es-MX";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🏗️</span>
          <span className="font-bold text-xl text-primary">
            PV Construcción
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Language Toggle + CTA */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href={pathname}
            locale={switchLocale}
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <span>{locale === "es-MX" ? "🇺🇸" : "🇲🇽"}</span>
            <span>{t("switchLang")}</span>
          </Link>
          <Link href="/contacto">
            <Button size="sm">
              {locale === "es-MX" ? "Cotización Gratis" : "Free Quote"}
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={switchLocale}
              className="flex items-center space-x-1 text-sm py-2"
              onClick={() => setMenuOpen(false)}
            >
              <span>{locale === "es-MX" ? "🇺🇸" : "🇲🇽"}</span>
              <span>{t("switchLang")}</span>
            </Link>
            <Link href="/contacto" onClick={() => setMenuOpen(false)}>
              <Button className="w-full">
                {locale === "es-MX" ? "Cotización Gratis" : "Free Quote"}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
