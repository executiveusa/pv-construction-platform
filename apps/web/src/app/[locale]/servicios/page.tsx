import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function ServiciosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServiciosContent />;
}

function ServiciosContent() {
  const t = useTranslations("services");
  const hero = useTranslations("hero");

  const services = [
    {
      key: "newBuild",
      icon: "🏠",
      features: [
        "Diseño arquitectónico",
        "Permisos incluidos",
        "Materiales premium",
        "Garantía de 5 años",
      ],
    },
    {
      key: "remodel",
      icon: "🔨",
      features: [
        "Evaluación gratuita",
        "Diseño personalizado",
        "Mínima interrupción",
        "Presupuesto detallado",
      ],
    },
    {
      key: "luxury",
      icon: "✨",
      features: [
        "Acabados de alta gama",
        "Vistas al mar",
        "Domótica",
        "Piscinas infinity",
      ],
    },
    {
      key: "commercial",
      icon: "🏢",
      features: [
        "Restaurantes",
        "Boutique hotels",
        "Oficinas",
        "Retail",
      ],
    },
    {
      key: "permits",
      icon: "📋",
      features: [
        "Licencia de construcción",
        "Impacto ambiental",
        "Uso de suelo",
        "Registro catastral",
      ],
    },
    {
      key: "landPurchase",
      icon: "🌴",
      features: [
        "Fideicomiso bancario",
        "Due diligence",
        "Verificación de escrituras",
        "Asesoría legal",
      ],
    },
  ] as const;

  return (
    <>
      <section className="container py-16 md:py-24">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">{t("title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map(({ key, icon, features }) => (
            <Card key={key} className="overflow-hidden">
              <CardHeader className="bg-muted">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{icon}</span>
                  <div>
                    <CardTitle className="text-xl">
                      {t(`${key}.title`)}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <CardDescription className="text-base">
                  {t(`${key}.description`)}
                </CardDescription>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {features.map((f) => (
                    <li key={f} className="flex items-center space-x-1">
                      <span className="text-jungle">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/contacto">
            <Button size="lg">{hero("cta")}</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
