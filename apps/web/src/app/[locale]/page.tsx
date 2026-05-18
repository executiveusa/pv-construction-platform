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
      {/* Hero Section — Synthia Luxury Minimalism */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex items-center">
        <div className="container py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge — Single accent, no overload */}
            <span className="inline-block bg-emerald-500/10 backdrop-blur rounded-full px-6 py-3 text-sm font-medium text-emerald-300 border border-emerald-500/20">
              🎨 Luxury Design Studio + Directory Infrastructure
            </span>

            {/* Headline — Cormorant Garamond display */}
            <h1 className="text-5xl md:text-7xl font-serif leading-tight tracking-tight">
              Build directories and marketplaces{" "}
              <span className="text-emerald-300">
                that make money
              </span>
            </h1>

            {/* Subheadline — DM Sans body */}
            <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto font-light leading-relaxed">
              Premium design + systems automation for founders who scale fast. We work with 50+ founders in Latin America.
            </p>

            {/* Trust Line — Subtle, not aggressive */}
            <p className="text-sm opacity-60 pt-4 font-mono">
              Free audit • Delivery in 4 weeks • Awwwards SOTD caliber
            </p>

            {/* CTAs — One primary, one secondary */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/contacto">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 text-lg rounded-none border-0 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  Request Free Design Audit
                </Button>
              </Link>
              <Link href="/portafolio">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 px-8 py-4 text-lg rounded-none backdrop-blur"
                >
                  View Case Studies
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle wave divider — No aggressive transitions */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto">
            <path
              fill="hsl(210 40% 98%)"
              d="M0,40 C360,80 720,0 1440,40 L1440,60 L0,60 Z"
            />
          </svg>
        </div>
      </section>

      {/* What We Do — 3-column, no generic cards */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="container">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              What We Build
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Premium design systems and directory infrastructure for high-growth SaaS founders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Design Studios */}
            <div className="text-center space-y-6 p-8">
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl font-serif font-medium">Design Studios</h3>
              <p className="text-slate-600 leading-relaxed">
                UDEC 8.5+ landing pages and product interfaces. Luxury minimalism that converts.
              </p>
            </div>

            {/* Marketplace Infrastructure */}
            <div className="text-center space-y-6 p-8">
              <div className="text-6xl mb-6">⚡</div>
              <h3 className="text-2xl font-serif font-medium">Marketplace Infrastructure</h3>
              <p className="text-slate-600 leading-relaxed">
                Next.js + Supabase + Stripe. Automated systems that scale to millions.
              </p>
            </div>

            {/* Directory Platforms */}
            <div className="text-center space-y-6 p-8">
              <div className="text-6xl mb-6">📊</div>
              <h3 className="text-2xl font-serif font-medium">Directory Platforms</h3>
              <p className="text-slate-600 leading-relaxed">
                Curated marketplaces that beat Google. Subscription revenue models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works — Alternating layout, no generic sections */}
      <section className="bg-white py-24 md:py-32">
        <div className="container max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Design drives conversion */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">
                Design drives conversion
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Every pixel engineered for psychological impact. Luxury minimalism communicates confidence and quality, not emptiness.
              </p>
              <div className="text-6xl opacity-20">✨</div>
            </div>
            <div className="bg-slate-100 rounded-2xl p-12 text-center">
              <div className="text-8xl mb-6">📈</div>
              <p className="text-2xl font-serif">+340% conversion lift</p>
              <p className="text-slate-500 mt-2">Average across client redesigns</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-32">
            {/* Automation saves time */}
            <div className="bg-slate-900 text-white rounded-2xl p-12">
              <div className="text-6xl mb-6">⚡</div>
              <h3 className="text-3xl font-serif font-light mb-4">Automation saves time</h3>
              <p className="text-lg leading-relaxed opacity-90">
                Systems that handle scaling automatically. From 1K to 1M users without manual intervention.
              </p>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-light leading-tight">
                Directories generate recurring revenue
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Subscription models that compound. Directory listings, featured spots, affiliate commissions.
              </p>
              <div className="text-6xl opacity-20">💰</div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Success — Case studies, not generic testimonials */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="container">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Client Success
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Real outcomes from premium design + infrastructure partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Case Study 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-serif font-medium mb-4">Commercial Real Estate Directory</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Built a $50K directory platform that generates $8K/month in subscriptions. 300+ listings, automated onboarding.
              </p>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Revenue: $96K ARR</span>
                <span>Time: 8 weeks</span>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-serif font-medium mb-4">SaaS Landing Page Redesign</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                UDEC 9.2 landing page increased conversion by 280%. Premium design that positioned them as market leaders.
              </p>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Conversion: +280%</span>
                <span>UDEC Score: 9.2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process — 4-step timeline, clear and simple */}
      <section className="bg-white py-24 md:py-32">
        <div className="container">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Our Process
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              From audit to launch in 4 weeks. Every step measured and optimized.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-serif font-medium">Audit</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Deep analysis of your current system and market position.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-xl font-serif font-medium">Strategy</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Detailed roadmap with technical specifications and timelines.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-serif font-medium">Design</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Premium interfaces built to UDEC 8.5+ standards.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-serif font-medium">Launch</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Production deployment with monitoring and optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — 3 tiers, clear value */}
      <section className="bg-slate-900 text-white py-24 md:py-32">
        <div className="container">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-light">
              Investment Options
            </h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
              Choose the engagement level that matches your growth stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Audit Only */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <h3 className="text-2xl font-serif font-medium mb-4">Strategy Audit</h3>
              <div className="text-4xl font-bold mb-6">$5K</div>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li>• 30-page design audit</li>
                <li>• Technical architecture review</li>
                <li>• Monetization strategy brief</li>
                <li>• 2-week delivery</li>
              </ul>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-none">
                Start Audit
              </Button>
            </div>

            {/* Design Sprint */}
            <div className="bg-emerald-600 rounded-2xl p-8 text-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-serif font-medium mb-4">Design Sprint</h3>
              <div className="text-4xl font-bold mb-6">$15K</div>
              <ul className="space-y-3 mb-8">
                <li>• Everything in Audit</li>
                <li>• Complete design system</li>
                <li>• Figma files + component library</li>
                <li>• 4-week delivery</li>
              </ul>
              <Button className="w-full bg-white text-emerald-600 hover:bg-slate-100 rounded-none">
                Start Sprint
              </Button>
            </div>

            {/* Full Build */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <h3 className="text-2xl font-serif font-medium mb-4">Full Build</h3>
              <div className="text-4xl font-bold mb-6">$50K–$75K</div>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li>• Everything in Design Sprint</li>
                <li>• Production-ready application</li>
                <li>• Infrastructure + deployment</li>
                <li>• 12-week delivery</li>
              </ul>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-none">
                Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — Dark hero, single focus */}
      <section className="bg-slate-900 text-white py-24 md:py-32">
        <div className="container text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-serif font-light leading-tight">
            Ready to build your next revenue stream?
          </h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
            Join 50+ founders who've transformed their businesses with premium design and systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/contacto">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 text-lg rounded-none shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
              >
                Schedule Free Consultation
              </Button>
            </Link>
            <Link href="mailto:hello@synthia.design">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 px-8 py-4 text-lg rounded-none backdrop-blur"
              >
                Email Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Synthia Design Studio",
            description: "Premium design studio + directory infrastructure for SaaS founders. UDEC 8.5+ quality floor.",
            url: "https://synthia.design",
            telephone: "+523221234567",
            serviceType: "Design Studio, Directory Infrastructure, Marketplace Development",
            areaServed: "Global",
            priceRange: "$$$"
          }),
        }}
      />
    </>
  );
}
