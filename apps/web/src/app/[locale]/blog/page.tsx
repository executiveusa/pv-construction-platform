import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEs = locale === "es-MX";
  return {
    title: isEs ? "Blog — PV Construcción" : "Blog — PV Construction",
    description: isEs
      ? "Guías, consejos y noticias sobre construcción e inversión inmobiliaria en Puerto Vallarta"
      : "Guides, tips and news about construction and real estate investment in Puerto Vallarta",
  };
}

// Placeholder blog posts — will be replaced with CMS/MDX
const POSTS = [
  {
    slug: "guia-fideicomiso",
    title_es: "Guía Completa del Fideicomiso para Extranjeros en México",
    title_en: "Complete Guide to Fideicomiso (Bank Trust) for Foreigners in Mexico",
    excerpt_es:
      "Todo lo que necesitas saber sobre la compra de propiedad en zona restringida como extranjero mediante fideicomiso bancario.",
    excerpt_en:
      "Everything you need to know about purchasing property in restricted zones as a foreigner through a bank trust.",
    date: "2024-12-15",
    category_es: "Legal",
    category_en: "Legal",
  },
  {
    slug: "costos-construccion-2025",
    title_es: "Costos de Construcción en Puerto Vallarta 2025",
    title_en: "Construction Costs in Puerto Vallarta 2025",
    excerpt_es:
      "Desglose actualizado de costos por metro cuadrado para diferentes tipos de construcción en la región.",
    excerpt_en:
      "Updated breakdown of per-square-meter costs for different construction types in the region.",
    date: "2024-12-01",
    category_es: "Precios",
    category_en: "Pricing",
  },
  {
    slug: "permisos-construccion",
    title_es: "Permisos de Construcción: Proceso Paso a Paso",
    title_en: "Building Permits: Step-by-Step Process",
    excerpt_es:
      "Navegando la burocracia mexicana para obtener tus permisos de construcción en Jalisco y Nayarit.",
    excerpt_en:
      "Navigating Mexican bureaucracy to obtain your building permits in Jalisco and Nayarit.",
    date: "2024-11-15",
    category_es: "Guías",
    category_en: "Guides",
  },
  {
    slug: "mejores-zonas-inversion",
    title_es: "Las 5 Mejores Zonas para Inversión Inmobiliaria en Bahía de Banderas",
    title_en: "Top 5 Areas for Real Estate Investment in Bahía de Banderas",
    excerpt_es:
      "Análisis comparativo de ROI, crecimiento y potencial de las principales zonas de inversión.",
    excerpt_en:
      "Comparative analysis of ROI, growth and potential of the main investment areas.",
    date: "2024-11-01",
    category_es: "Inversión",
    category_en: "Investment",
  },
];

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEs = locale === "es-MX";

  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            {isEs ? "Blog" : "Blog"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isEs
              ? "Guías, consejos y noticias sobre construcción e inversión en Puerto Vallarta"
              : "Guides, tips and news about construction and investment in Puerto Vallarta"}
          </p>
        </div>

        <div className="space-y-6">
          {POSTS.map((post) => (
            <Card key={post.slug} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                    {isEs ? post.category_es : post.category_en}
                  </span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString(
                      isEs ? "es-MX" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                </div>
                <CardTitle className="text-xl">
                  {isEs ? post.title_es : post.title_en}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {isEs ? post.excerpt_es : post.excerpt_en}
                </p>
                <p className="mt-4 text-sm text-primary font-medium">
                  {isEs ? "Próximamente →" : "Coming soon →"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
