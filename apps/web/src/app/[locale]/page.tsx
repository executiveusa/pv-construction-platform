import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  const services = [
    { key: "newBuild", icon: "🏠" },
    { key: "remodel", icon: "🔨" },
    { key: "luxury", icon: "✨" },
    { key: "commercial", icon: "🏢" },
    { key: "permits", icon: "📋" },
    { key: "landPurchase", icon: "🌴" },
  ] as const;

  const trustItems = [
    { key: "licensed", icon: "🛡️" },
    { key: "american", icon: "🤝" },
    { key: "social", icon: "🌱" },
    { key: "transparent", icon: "🔍" },
  ] as const;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean-dark via-ocean to-ocean-light text-white">
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <span className="inline-block bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm font-medium">
              {t("hero.badge")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t("hero.title")}{" "}
              <span className="text-sand-light">
                {t("hero.titleHighlight")}
              </span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contacto">
                <Button
                  size="lg"
                  className="bg-sand hover:bg-sand-dark text-foreground font-semibold w-full sm:w-auto"
                >
                  {t("hero.cta")}
                </Button>
              </Link>
              <Link href="/portafolio">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-70 pt-4">{t("hero.trustLine")}</p>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto">
            <path
              fill="hsl(30 25% 98%)"
              d="M0,40 C360,80 720,0 1440,40 L1440,60 L0,60 Z"
            />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="container py-16 md:py-24" id="servicios">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("services.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ key, icon }) => (
            <Card
              key={key}
              className="hover:shadow-lg transition-shadow group cursor-pointer"
            >
              <CardHeader>
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <CardTitle>{t(`services.${key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t(`services.${key}.description`)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("trust.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("trust.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map(({ key, icon }) => (
              <div
                key={key}
                className="text-center space-y-3 p-6 rounded-lg bg-background shadow-sm"
              >
                <div className="text-4xl">{icon}</div>
                <h3 className="font-semibold text-lg">
                  {t(`trust.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`trust.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="bg-gradient-to-r from-ocean to-jungle rounded-2xl p-8 md:p-16 text-white text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("leadForm.title")}
          </h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            {t("leadForm.subtitle")}
          </p>
          <Link href="/contacto">
            <Button
              size="lg"
              className="bg-sand hover:bg-sand-dark text-foreground font-semibold"
            >
              {t("hero.cta")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Zones Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t("geo.heading")}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { slug: "puerto-vallarta", key: "puertoVallarta" },
              { slug: "zona-romantica", key: "zonaRomantica" },
              { slug: "marina-vallarta", key: "marinaVallarta" },
              { slug: "nuevo-vallarta", key: "nuevoVallarta" },
              { slug: "bucerias", key: "bucerias" },
              { slug: "punta-de-mita", key: "puntaDeMita" },
              { slug: "sayulita", key: "sayulita" },
              { slug: "san-pancho", key: "sanPancho" },
              { slug: "la-cruz", key: "laCruz" },
              { slug: "lo-de-marcos", key: "loDeMarcos" },
              { slug: "rincon-de-guayabitos", key: "rinconDeGuayabitos" },
              { slug: "mezcales", key: "mezcales" },
              { slug: "bahia-de-banderas", key: "bahiaDeBanderas" },
            ].map(({ slug, key }) => (
              <Link
                key={slug}
                href={`/zona/${slug}`}
                className="bg-background border rounded-full px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                📍 {t(`zones.${key}`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "PV Construcción",
            description: t("metadata.description"),
            url: "https://pvconstruccion.com",
            telephone: "+523221234567",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Puerto Vallarta",
              addressRegion: "Jalisco",
              addressCountry: "MX",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 20.6534,
              longitude: -105.2253,
            },
            areaServed: [
              {
                "@type": "GeoCircle",
                geoMidpoint: {
                  "@type": "GeoCoordinates",
                  latitude: 20.6534,
                  longitude: -105.2253,
                },
                geoRadius: "200 mi",
              },
            ],
            openingHours: "Mo-Sa 08:00-18:00",
            priceRange: "$$$",
          }),
        }}
      />
    </>
  );
}
