import { setRequestLocale } from 'next-intl/server';
import { DirectoryDashboard } from '@/components/DirectoryDashboard';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DirectoryDashboard />;
}
