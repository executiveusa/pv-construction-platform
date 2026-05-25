'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Tenant = {
  id: string;
  name: string;
  subdomain: string;
  active: boolean;
  logo_url: string | null;
  primary_color: string | null;
  created_at: string;
};

export function DirectoryDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0f766e');
  const [logoUrl, setLogoUrl] = useState('');
  const [active, setActive] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    const response = await fetch('/api/directory');
    if (!response.ok) {
      setStatusMessage('Failed to load directory listings.');
      return;
    }

    const result = await response.json();
    if (result.success) {
      setTenants(result.tenants);
      setStatusMessage('Loaded directory listings.');
    } else {
      setStatusMessage('Unable to fetch directory data.');
    }
  }

  async function handleCreateTenant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage('Saving new directory client...');

    const payload = {
      name,
      subdomain,
      logoUrl: logoUrl || null,
      primaryColor,
      active,
    };

    const response = await fetch('/api/directory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      setName('');
      setSubdomain('');
      setLogoUrl('');
      setPrimaryColor('#0f766e');
      setActive(true);
      setStatusMessage('Directory client created successfully.');
      await fetchTenants();
    } else {
      setStatusMessage(result.message || 'Failed to create directory client.');
    }

    setIsSaving(false);
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/20">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Directory Management Dashboard
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Manage tenant listings, create new client landing page entries, and begin building a multitenant directory for lead generation.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Create a new directory client</h2>
            <form onSubmit={handleCreateTenant} className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Client Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Subdomain</span>
                <div className="mt-2 flex gap-2">
                  <span className="inline-flex items-center rounded-l-2xl border border-r-0 border-slate-300 bg-slate-100 px-4 text-slate-600">https://</span>
                  <input
                    value={subdomain}
                    onChange={(event) => setSubdomain(event.target.value)}
                    required
                    placeholder="client-name"
                    className="w-full rounded-r-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Logo URL</span>
                <input
                  value={logoUrl}
                  onChange={(event) => setLogoUrl(event.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Primary Brand Color</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                  className="mt-2 h-12 w-24 rounded-2xl border border-slate-300 bg-white p-1"
                />
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(event) => setActive(event.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
                />
                Active listing
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={isSaving} className="rounded-2xl px-6 py-3">
                  {isSaving ? 'Saving...' : 'Create Client'}
                </Button>
                <p className="text-sm text-slate-500">New listings will be visible in the directory dashboard and backend tenant index.</p>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Directory status</h2>
            <p className="mt-2 text-slate-600">Clients and tenant listings currently registered in the directory.</p>
            <div className="mt-6 space-y-4">
              {tenants.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                  No directory clients found yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {tenants.map((tenant) => (
                    <div key={tenant.id} className="rounded-3xl border border-slate-200 p-5 shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-900">{tenant.name}</p>
                          <p className="text-sm text-slate-500">{tenant.subdomain}.your-domain.com</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ backgroundColor: tenant.primary_color || '#0f766e' }} />
                          <span className="text-slate-500">{tenant.active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
          <p>{statusMessage || 'Directory dashboard is ready. Agents can use the API to manage landing page clients.'}</p>
        </div>
      </section>
    </div>
  );
}
