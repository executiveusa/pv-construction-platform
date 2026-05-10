import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/lead-form";

const ZONES: Record<
  string,
  { name: string; lat: number; lng: number; description_es: string; description_en: string }
> = {
  "puerto-vallarta": {
    name: "Puerto Vallarta",
    lat: 20.6534,
    lng: -105.2253,
    description_es:
      "Puerto Vallarta es el destino más popular de la Bahía de Banderas. Con una infraestructura desarrollada, playas espectaculares y una vibrante vida nocturna, es el lugar ideal para construir tu propiedad de inversión o retiro.",
    description_en:
      "Puerto Vallarta is the most popular destination in Bahía de Banderas. With developed infrastructure, spectacular beaches and vibrant nightlife, it's the ideal place to build your investment or retirement property.",
  },
  "zona-romantica": {
    name: "Zona Romántica",
    lat: 20.6423,
    lng: -105.2316,
    description_es:
      "La Zona Romántica es el corazón histórico de Puerto Vallarta. Calles adoquinadas, restaurantes de clase mundial y una comunidad vibrante. Ideal para remodelaciones de casas coloniales y boutique hotels.",
    description_en:
      "Zona Romántica is the historic heart of Puerto Vallarta. Cobblestone streets, world-class restaurants and a vibrant community. Ideal for colonial house remodels and boutique hotels.",
  },
  "marina-vallarta": {
    name: "Marina Vallarta",
    lat: 20.6694,
    lng: -105.2506,
    description_es:
      "Marina Vallarta ofrece la exclusividad de vivir frente al mar con acceso a marina, campo de golf y restaurantes premium. Zona ideal para residencias de lujo y condominios.",
    description_en:
      "Marina Vallarta offers the exclusivity of waterfront living with marina access, golf course and premium restaurants. Ideal area for luxury residences and condominiums.",
  },
  "nuevo-vallarta": {
    name: "Nuevo Vallarta",
    lat: 20.6974,
    lng: -105.2975,
    description_es:
      "Nuevo Vallarta (ahora Nuevo Nayarit) es una zona de rápido crecimiento con resorts, campos de golf y playas vírgenes. Excelente para desarrollo de condominios y proyectos turísticos.",
    description_en:
      "Nuevo Vallarta (now Nuevo Nayarit) is a rapidly growing area with resorts, golf courses and pristine beaches. Excellent for condo development and tourism projects.",
  },
  bucerias: {
    name: "Bucerías",
    lat: 20.7503,
    lng: -105.3376,
    description_es:
      "Bucerías es un pueblo con encanto mexicano auténtico frente al mar. Perfecto para casas de playa, pequeños desarrollos y restaurantes con vista al océano.",
    description_en:
      "Bucerías is a charming authentic Mexican beach town. Perfect for beach houses, small developments and oceanfront restaurants.",
  },
  "punta-de-mita": {
    name: "Punta de Mita",
    lat: 20.7751,
    lng: -105.5192,
    description_es:
      "Punta de Mita es el destino más exclusivo de la región. Hogar de resorts de ultra-lujo como Four Seasons y St. Regis. Zona premium para villas de alta gama y proyectos boutique.",
    description_en:
      "Punta de Mita is the most exclusive destination in the region. Home to ultra-luxury resorts like Four Seasons and St. Regis. Premium area for high-end villas and boutique projects.",
  },
  sayulita: {
    name: "Sayulita",
    lat: 20.8685,
    lng: -105.4416,
    description_es:
      "Sayulita es un pueblo de surf bohemio con energía única. Ideal para proyectos boutique, hostales, restaurantes y casas con carácter. La zona está en constante crecimiento.",
    description_en:
      "Sayulita is a bohemian surf town with unique energy. Ideal for boutique projects, hostels, restaurants and character homes. The area is in constant growth.",
  },
  "san-pancho": {
    name: "San Pancho (San Francisco)",
    lat: 20.8543,
    lng: -105.4084,
    description_es:
      "San Pancho es la alternativa tranquila a Sayulita. Comunidad artística, playas amplias y naturaleza. Perfecto para casas de retiro y eco-desarrollos.",
    description_en:
      "San Pancho is the quiet alternative to Sayulita. Artistic community, wide beaches and nature. Perfect for retirement homes and eco-developments.",
  },
  "la-cruz": {
    name: "La Cruz de Huanacaxtle",
    lat: 20.7415,
    lng: -105.3729,
    description_es:
      "La Cruz es un pueblo pesquero que se ha transformado en un destino gastronómico. Su marina moderna y mercado de pescado lo hacen ideal para restaurantes y proyectos con vista al mar.",
    description_en:
      "La Cruz is a fishing village transformed into a gastronomic destination. Its modern marina and fish market make it ideal for restaurants and ocean-view projects.",
  },
  "lo-de-marcos": {
    name: "Lo de Marcos",
    lat: 20.9511,
    lng: -105.3548,
    description_es:
      "Lo de Marcos es un pueblo tranquilo con playa larga y ambiente relajado. Los precios de terreno siguen siendo accesibles. Oportunidad para inversión temprana.",
    description_en:
      "Lo de Marcos is a quiet town with a long beach and relaxed atmosphere. Land prices are still accessible. Early investment opportunity.",
  },
  "rincon-de-guayabitos": {
    name: "Rincón de Guayabitos",
    lat: 20.9832,
    lng: -105.2844,
    description_es:
      "Rincón de Guayabitos es el destino familiar favorito de México. Aguas tranquilas, precios accesibles y una comunidad creciente de expatriados.",
    description_en:
      "Rincón de Guayabitos is Mexico's favorite family destination. Calm waters, accessible prices and a growing expat community.",
  },
  mezcales: {
    name: "Mezcales",
    lat: 20.7195,
    lng: -105.3158,
    description_es:
      "Mezcales es una zona residencial en crecimiento cerca de Nuevo Vallarta. Ideal para proyectos de vivienda accesible y desarrollos residenciales.",
    description_en:
      "Mezcales is a growing residential area near Nuevo Vallarta. Ideal for affordable housing projects and residential developments.",
  },
  "bahia-de-banderas": {
    name: "Bahía de Banderas",
    lat: 20.7248,
    lng: -105.3003,
    description_es:
      "El municipio de Bahía de Banderas abarca toda la costa de Nayarit frente a Puerto Vallarta. Es una de las zonas de mayor crecimiento en México para inversión inmobiliaria.",
    description_en:
      "The municipality of Bahía de Banderas encompasses the entire Nayarit coast facing Puerto Vallarta. It is one of Mexico's fastest-growing areas for real estate investment.",
  },
};

export function generateStaticParams() {
  return Object.keys(ZONES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const zone = ZONES[slug];
  if (!zone) return {};
  const isEs = locale === "es-MX";

  return {
    title: isEs
      ? `Construcción en ${zone.name} — PV Construcción`
      : `Construction in ${zone.name} — PV Construction`,
    description: isEs ? zone.description_es : zone.description_en,
  };
}

export default async function ZonaPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const zone = ZONES[slug];
  if (!zone) notFound();

  const isEs = locale === "es-MX";

  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center space-y-4 mb-12">
          <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium">
            📍 {zone.name}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold">
            {isEs ? "Construcción Profesional en" : "Professional Construction in"}{" "}
            <span className="text-primary">{zone.name}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isEs ? zone.description_es : zone.description_en}
          </p>
        </div>

        {/* Map + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d30000!2d${zone.lng}!3d${zone.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2smx`}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title={zone.name}
              />
            </div>

            <div className="bg-muted rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold">
                {isEs
                  ? `Servicios disponibles en ${zone.name}`
                  : `Services available in ${zone.name}`}
              </h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {[
                  isEs ? "Construcción nueva" : "New builds",
                  isEs ? "Remodelación" : "Remodeling",
                  isEs ? "Proyectos de lujo" : "Luxury projects",
                  isEs ? "Comercial" : "Commercial",
                  isEs ? "Permisos" : "Permits",
                  isEs ? "Compra de terreno" : "Land purchase",
                ].map((s) => (
                  <li key={s} className="flex items-center space-x-1">
                    <span className="text-jungle">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">
              {isEs
                ? `Cotización Gratis para ${zone.name}`
                : `Free Quote for ${zone.name}`}
            </h2>
            <LeadForm />
          </div>
        </div>

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: `Construction in ${zone.name}`,
              provider: {
                "@type": "LocalBusiness",
                name: "PV Construcción",
              },
              areaServed: {
                "@type": "Place",
                name: zone.name,
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: zone.lat,
                  longitude: zone.lng,
                },
              },
            }),
          }}
        />
      </div>
    </section>
  );
}
