"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Lead {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  project_type: string;
  budget_range?: string;
  location_zone?: string;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [stats, setStats] = useState({ total: 0, new: 0, assigned: 0, completed: 0 });

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads?limit=1", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        setAuthenticated(true);
        localStorage.setItem("admin_token", password);
        await fetchLeads(password);
      } else {
        setError("Contraseña incorrecta");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function fetchLeads(token?: string) {
    const t = token || localStorage.getItem("admin_token") || password;
    setLoading(true);
    try {
      const url = statusFilter
        ? `/api/leads?status=${statusFilter}&limit=100`
        : "/api/leads?limit=100";
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        // Calculate stats
        const all = data.leads || [];
        setStats({
          total: all.length,
          new: all.filter((l: Lead) => l.status === "new").length,
          assigned: all.filter((l: Lead) => l.status === "assigned").length,
          completed: all.filter((l: Lead) => l.status === "completed").length,
        });
      }
    } catch {
      setError("Error cargando leads");
    } finally {
      setLoading(false);
    }
  }

  async function updateLeadStatus(id: string, status: string) {
    const t = localStorage.getItem("admin_token") || password;
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      await fetchLeads(t);
    } catch {
      console.error("Error updating lead");
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
      fetchLeads(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authenticated) fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    qualified: "bg-purple-100 text-purple-800",
    assigned: "bg-orange-100 text-orange-800",
    in_progress: "bg-cyan-100 text-cyan-800",
    completed: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
  };

  if (!authenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>🔐 Panel de Administración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={login} disabled={loading} className="w-full">
              {loading ? "Verificando..." : "Entrar"}
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("admin_token");
            setAuthenticated(false);
            setPassword("");
          }}
        >
          Cerrar sesión
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
            <p className="text-sm text-muted-foreground">Nuevos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-600">
              {stats.assigned}
            </p>
            <p className="text-sm text-muted-foreground">Asignados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats.completed}
            </p>
            <p className="text-sm text-muted-foreground">Completados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "new", "contacted", "qualified", "assigned", "in_progress", "completed", "lost"].map(
          (s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s === "" ? "Todos" : s.replace("_", " ")}
            </Button>
          )
        )}
      </div>

      <Separator className="mb-6" />

      {/* Lead Table */}
      {loading ? (
        <p className="text-center text-muted-foreground py-12">Cargando...</p>
      ) : leads.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No hay leads {statusFilter ? `con estado "${statusFilter}"` : ""}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Nombre</th>
                <th className="pb-3 font-medium">Teléfono</th>
                <th className="pb-3 font-medium">Proyecto</th>
                <th className="pb-3 font-medium">Presupuesto</th>
                <th className="pb-3 font-medium">Zona</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">{lead.full_name}</td>
                  <td className="py-3">{lead.phone || "—"}</td>
                  <td className="py-3">{lead.project_type}</td>
                  <td className="py-3">{lead.budget_range || "—"}</td>
                  <td className="py-3">{lead.location_zone || "—"}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || "bg-gray-100"}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString("es-MX")}
                  </td>
                  <td className="py-3">
                    <select
                      className="text-xs border rounded px-2 py-1"
                      value={lead.status}
                      onChange={(e) =>
                        updateLeadStatus(lead.id, e.target.value)
                      }
                    >
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="qualified">qualified</option>
                      <option value="assigned">assigned</option>
                      <option value="in_progress">in_progress</option>
                      <option value="completed">completed</option>
                      <option value="lost">lost</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
