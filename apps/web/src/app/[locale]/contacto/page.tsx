import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { LeadForm } from "@/components/lead-form";

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactoContent />;
}

function ContactoContent() {
  const t = useTranslations("contact");
  const form = useTranslations("leadForm");

  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Lead Form */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">{form("title")}</h2>
            <LeadForm />
          </div>

          {/* Contact Info + Map */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-muted rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">
                {t("title")}
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-3">
                  <span>📍</span>
                  <span>{t("address")}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span>📞</span>
                  <span>
                    <a href="tel:+523221234567" className="hover:underline">
                      +52 322 123 4567
                    </a>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span>💬</span>
                  <span>
                    <a
                      href="https://wa.me/523221234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {t("whatsapp")}
                    </a>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span>✉️</span>
                  <span>
                    <a
                      href="mailto:info@pvconstruccion.com"
                      className="hover:underline"
                    >
                      info@pvconstruccion.com
                    </a>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span>🕐</span>
                  <span>{t("hours")}</span>
                </li>
              </ul>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.41!2d-105.30!3d20.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842145635063c87f%3A0x79cfbf3c2c5680!2sPuerto%20Vallarta%2C%20Jalisco%2C%20Mexico!5e0!3m2!1ses!2smx!4v1707580000000!5m2!1ses!2smx"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Puerto Vallarta, México"
              />
            </div>

            {/* Trust badges */}
            <div className="bg-jungle/5 border border-jungle/20 rounded-2xl p-6 text-center space-y-2">
              <p className="text-sm font-medium text-jungle">
                🔒 Plataforma 100% Legal
              </p>
              <p className="text-xs text-muted-foreground">
                Empresa constituida en México • RFC registrado • SAT verificado
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
