'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default function ServiciosPage() {
  const params = useParams();
  const locale = params.locale as string;
  
  useEffect(() => {
    setRequestLocale(locale);
  }, [locale]);
  const t = useTranslations('services');
  const hero = useTranslations('hero');

  const services = [
    {
      id: 'design-studios',
      titleKey: 'designStudios.title',
      descKey: 'designStudios.description',
      features: ['Diseño personalizado', 'Blanco etiquetado', 'Herramientas de colaboración'],
      price: 'Desde $15K',
    },
    {
      id: 'marketplaces',
      titleKey: 'marketplaces.title',
      descKey: 'marketplaces.description',
      features: ['Multi-vendedor', 'Pagos integrados', 'Sistema de reseñas'],
      price: 'Desde $25K',
    },
    {
      id: 'directories',
      titleKey: 'directories.title',
      descKey: 'directories.description',
      features: ['Filtros avanzados', 'Geo-localización', 'Generación de leads'],
      price: 'Desde $20K',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-cormorant text-5xl md:text-6xl font-light mb-6">
            {t('title')}
          </h1>
          <p className="font-dm-sans text-xl text-slate-600 mb-8">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white border border-slate-200 p-8 hover:border-emerald-300 transition-colors">
                <h3 className="font-cormorant text-2xl font-light mb-3">
                  {t(service.titleKey)}
                </h3>
                <p className="font-dm-sans text-slate-600 mb-6">
                  {t(service.descKey)}
                </p>
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="font-dm-sans text-sm text-slate-600 flex items-start">
                      <span className="text-emerald-600 mr-3 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="font-cormorant text-lg text-emerald-600 mb-6">
                  {service.price}
                </p>
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href="/contacto">{hero('cta')}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-cormorant text-4xl font-light mb-12 text-center">
            {t('process')}
          </h2>
          <div className="space-y-8">
            {[
              { num: '1', title: 'Descubrimiento', desc: 'Entendemos su visión y mercado' },
              { num: '2', title: 'Diseño', desc: 'Minimalismo de lujo con propósito' },
              { num: '3', title: 'Desarrollo', desc: 'Infraestructura escalable y segura' },
              { num: '4', title: 'Lanzamiento', desc: 'Estrategia de mercado incluida' },
            ].map((step) => (
              <div key={step.num} className="border-b border-slate-200 pb-8 flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-600">
                    <span className="font-cormorant text-lg text-emerald-600">{step.num}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-cormorant text-xl font-light mb-2">{step.title}</h3>
                  <p className="font-dm-sans text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-cormorant text-4xl font-light mb-6">
            {t('cta')}
          </h2>
          <p className="font-dm-sans text-lg text-slate-600 mb-8">
            {t('ctaDescription')}
          </p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
            <Link href="/contacto">{hero('cta')}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
