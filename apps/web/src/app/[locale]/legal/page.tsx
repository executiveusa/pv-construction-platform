import { setRequestLocale } from "next-intl/server";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isEs = locale === "es-MX";

  return (
    <section className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto prose prose-slate">
        <h1>{isEs ? "Aviso Legal" : "Legal Disclaimer"}</h1>

        <h2>
          {isEs ? "Naturaleza del Servicio" : "Nature of Service"}
        </h2>
        <p>
          {isEs
            ? "PV Construcción opera como una plataforma de referidos y generación de leads. NO somos una empresa constructora directa. Actuamos como intermediarios entre inversionistas y contratistas certificados e independientes."
            : "PV Construction operates as a referral and lead-generation platform. We are NOT a direct construction company. We act as intermediaries between investors and certified, independent contractors."}
        </p>

        <h2>
          {isEs ? "Responsabilidad del Contratista" : "Contractor Responsibility"}
        </h2>
        <p>
          {isEs
            ? "Cada contratista referido es responsable de obtener sus propios permisos de construcción, registros ante el IMSS e INFONAVIT, y cumplir con todas las regulaciones municipales, estatales y federales de México. PV Construcción verifica credenciales pero no asume responsabilidad directa por la ejecución de la obra."
            : "Each referred contractor is responsible for obtaining their own construction permits, IMSS and INFONAVIT registrations, and complying with all municipal, state and federal Mexican regulations. PV Construction verifies credentials but does not assume direct responsibility for construction execution."}
        </p>

        <h2>{isEs ? "Inversión Extranjera" : "Foreign Investment"}</h2>
        <p>
          {isEs
            ? "Los inversionistas extranjeros que deseen adquirir propiedades en la zona restringida (dentro de 50 km de la costa) deben hacerlo a través de un fideicomiso bancario o una empresa mexicana, según la Ley de Inversión Extranjera. Recomendamos asesoría legal independiente."
            : "Foreign investors wishing to acquire properties in the restricted zone (within 50 km of the coast) must do so through a bank trust (fideicomiso) or a Mexican company, as per the Foreign Investment Law. We recommend independent legal advice."}
        </p>

        <h2>
          {isEs ? "Empresa con Propósito Social" : "Social Purpose Company"}
        </h2>
        <p>
          {isEs
            ? "PV Construcción se compromete voluntariamente a reinvertir una parte de sus ganancias en la comunidad y en compensación ambiental. Mientras la ley BIC de México esté en proceso legislativo, estos compromisos están establecidos en nuestros documentos internos y se reportan anualmente."
            : "PV Construction voluntarily commits to reinvesting a portion of its profits in the community and in environmental offset. While Mexico's BIC law is still in legislative process, these commitments are established in our internal documents and reported annually."}
        </p>

        <h2>{isEs ? "Privacidad" : "Privacy"}</h2>
        <p>
          {isEs
            ? "Recopilamos información personal únicamente para conectarte con contratistas calificados. No vendemos ni compartimos tu información con terceros no relacionados con tu proyecto. Tus datos se almacenan de forma segura."
            : "We collect personal information solely to connect you with qualified contractors. We do not sell or share your information with third parties unrelated to your project. Your data is stored securely."}
        </p>

        <h2>{isEs ? "Contacto Legal" : "Legal Contact"}</h2>
        <p>
          {isEs
            ? "Para consultas legales, escriba a: legal@pvconstruccion.com"
            : "For legal inquiries, write to: legal@pvconstruccion.com"}
        </p>

        <p className="text-sm text-muted-foreground mt-8">
          {isEs
            ? "Última actualización: Febrero 2026"
            : "Last updated: February 2026"}
        </p>
      </div>
    </section>
  );
}
