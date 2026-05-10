import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

export default async function NosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NosotrosContent />;
}

function NosotrosContent() {
  const t = useTranslations("about");

  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Mission */}
        <div className="bg-muted rounded-2xl p-8 md:p-12 space-y-4">
          <h2 className="text-2xl font-bold">{t("mission")}</h2>
          <p className="text-lg">{t("missionText")}</p>
        </div>

        <Separator />

        {/* Legal Commitment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-4xl">🛡️</div>
            <h3 className="text-xl font-bold">{t("legalTitle")}</h3>
            <p className="text-muted-foreground">{t("legalDescription")}</p>
            <div className="bg-background border rounded-lg p-4 space-y-2 text-sm">
              <p>
                <strong>Estructura:</strong> S. de R.L. de C.V.
              </p>
              <p>
                <strong>RFC:</strong> En proceso
              </p>
              <p>
                <strong>Licencia Municipal:</strong> Puerto Vallarta
              </p>
              <p>
                <strong>SAT:</strong> Registrado
              </p>
              <p>
                <strong>Contratistas:</strong> IMSS e INFONAVIT verificados
              </p>
              <p>
                <strong>Función:</strong> Plataforma de referidos (no somos
                contratistas directos)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-4xl">🌱</div>
            <h3 className="text-xl font-bold">{t("socialTitle")}</h3>
            <p className="text-muted-foreground">{t("socialDescription")}</p>
            <div className="bg-jungle/5 border border-jungle/20 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-jungle">
                Impacto Social Acumulado
              </h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-jungle">847</p>
                  <p className="text-xs text-muted-foreground">
                    Árboles Plantados
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-jungle">23</p>
                  <p className="text-xs text-muted-foreground">
                    Toneladas CO₂ Compensadas
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-jungle">12</p>
                  <p className="text-xs text-muted-foreground">
                    Familias Apoyadas
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-jungle">$45K</p>
                  <p className="text-xs text-muted-foreground">
                    USD Reinvertidos
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Datos verificables. Próximamente en blockchain.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Team */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Nuestro Equipo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Un colectivo americano-mexicano de profesionales con experiencia
            internacional. Ingenieros, arquitectos, abogados y gerentes de
            proyecto, todos enfocados en hacer las cosas bien.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { flag: "🇺🇸", role: "Director General" },
              { flag: "🇲🇽", role: "Director de Obra" },
              { flag: "🇺🇸🇲🇽", role: "Operaciones" },
              { flag: "🇲🇽", role: "Legal y Permisos" },
            ].map((member, i) => (
              <div
                key={i}
                className="bg-muted rounded-lg p-4 text-center space-y-2"
              >
                <div className="text-3xl">{member.flag}</div>
                <p className="text-sm font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
