import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default async function ResenasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ResenasContent />;
}

function ResenasContent() {
  const t = useTranslations("reviews");

  // Placeholder reviews — will be pulled from Postgres
  const reviews = [
    {
      name: "Jennifer M.",
      rating: 5,
      text: "Increíble experiencia. Como americana, tenía miedo de construir en México, pero PV Construcción hizo todo transparente y legal. Mi villa quedó perfecta.",
      project: "Villa en Punta de Mita",
      verified: true,
      date: "Enero 2026",
    },
    {
      name: "Robert & Susan K.",
      rating: 5,
      text: "Professional, on-time, and exactly what we expected. The bilingual communication made everything seamless.",
      project: "Remodel in Zona Romántica",
      verified: true,
      date: "Diciembre 2025",
    },
    {
      name: "Carlos A.",
      rating: 4,
      text: "Excelente equipo. Los permisos fueron un dolor de cabeza pero ellos se encargaron de todo. Recomiendo 100%.",
      project: "Casa en Bucerías",
      verified: true,
      date: "Noviembre 2025",
    },
  ];

  return (
    <section className="container py-16 md:py-24">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">{t("title")}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
              <div className="flex text-sand">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.text}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-primary/10 text-primary rounded-full px-2 py-1">
                {review.project}
              </span>
              {review.verified && (
                <span className="bg-jungle/10 text-jungle rounded-full px-2 py-1">
                  ✓ {t("verified")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          {t("writeReview")}
        </Button>
      </div>
    </section>
  );
}
