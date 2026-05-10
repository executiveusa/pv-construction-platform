import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function PortafolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PortafolioContent />;
}

function PortafolioContent() {
  const t = useTranslations();

  // Placeholder projects — replace with CMS/database data
  const projects = [
    {
      title: "Villa Vista al Mar — Punta de Mita",
      type: "Construcción Nueva",
      budget: "$850,000 USD",
      image: "/images/placeholder-project-1.jpg",
      status: "Completado",
    },
    {
      title: "Remodelación Casa Colonial — Zona Romántica",
      type: "Remodelación",
      budget: "$180,000 USD",
      image: "/images/placeholder-project-2.jpg",
      status: "Completado",
    },
    {
      title: "Boutique Hotel — Sayulita",
      type: "Comercial",
      budget: "$1,200,000 USD",
      image: "/images/placeholder-project-3.jpg",
      status: "En Progreso",
    },
    {
      title: "Residencia de Lujo — Marina Vallarta",
      type: "Lujo",
      budget: "$650,000 USD",
      image: "/images/placeholder-project-4.jpg",
      status: "Completado",
    },
    {
      title: "Departamentos — Bucerías",
      type: "Construcción Nueva",
      budget: "$2,100,000 USD",
      image: "/images/placeholder-project-5.jpg",
      status: "En Progreso",
    },
    {
      title: "Restaurante Playa — La Cruz",
      type: "Comercial",
      budget: "$320,000 USD",
      image: "/images/placeholder-project-6.jpg",
      status: "Completado",
    },
  ];

  return (
    <section className="container py-16 md:py-24">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">
          {t("nav.portfolio")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Proyectos reales completados y en progreso en la zona de Puerto
          Vallarta y Bahía de Banderas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <div
            key={i}
            className="group rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Placeholder image area */}
            <div className="aspect-video bg-muted flex items-center justify-center text-6xl">
              🏗️
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{project.title}</h3>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1">
                  {project.type}
                </span>
                <span
                  className={`rounded-full px-2 py-1 ${
                    project.status === "Completado"
                      ? "bg-jungle/10 text-jungle"
                      : "bg-sand/20 text-sand-dark"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {project.budget}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link href="/contacto">
          <Button size="lg">{t("hero.cta")}</Button>
        </Link>
      </div>
    </section>
  );
}
