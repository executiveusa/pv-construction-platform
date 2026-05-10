"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROJECT_TYPES = [
  { value: "new_build", es: "Construcción nueva", en: "New Build" },
  { value: "remodel", es: "Remodelación", en: "Remodel" },
  { value: "luxury", es: "Proyecto de lujo", en: "Luxury Project" },
  { value: "commercial", es: "Comercial", en: "Commercial" },
  { value: "land_purchase", es: "Compra de terreno", en: "Land Purchase" },
  { value: "permits_only", es: "Solo permisos", en: "Permits Only" },
  { value: "other", es: "Otro", en: "Other" },
];

const BUDGET_RANGES = [
  { value: "under_50k", es: "Menos de $50,000 USD", en: "Under $50,000 USD" },
  { value: "50k_100k", es: "$50,000 - $100,000", en: "$50,000 - $100,000" },
  { value: "100k_250k", es: "$100,000 - $250,000", en: "$100,000 - $250,000" },
  { value: "250k_500k", es: "$250,000 - $500,000", en: "$250,000 - $500,000" },
  {
    value: "500k_1m",
    es: "$500,000 - $1,000,000",
    en: "$500,000 - $1,000,000",
  },
  {
    value: "over_1m",
    es: "Más de $1,000,000 USD",
    en: "Over $1,000,000 USD",
  },
];

const ZONES = [
  "Puerto Vallarta Centro",
  "Zona Romántica",
  "Marina Vallarta",
  "Nuevo Vallarta",
  "Bucerías",
  "Punta de Mita",
  "Sayulita",
  "San Pancho",
  "La Cruz de Huanacaxtle",
  "Lo de Marcos",
  "Rincón de Guayabitos",
  "Mezcales",
  "Bahía de Banderas",
  "Otra zona",
];

export function LeadForm() {
  const t = useTranslations("leadForm");
  const locale = useLocale();
  const isEs = locale === "es-MX";
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    project_type: "",
    budget_range: "",
    timeline_months: "",
    location_zone: "",
    property_status: "",
    full_name: "",
    email: "",
    phone: "",
    preferred_contact: "whatsapp",
    preferred_language: isEs ? "es-MX" : "en",
    notes: "",
    source: "website",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          timeline_months: form.timeline_months
            ? parseInt(form.timeline_months)
            : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(t("error"));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4 p-8 bg-jungle/5 border border-jungle/20 rounded-2xl">
        <div className="text-5xl">🎉</div>
        <h3 className="text-2xl font-bold text-jungle">{t("success")}</h3>
        <p className="text-muted-foreground">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <div className="bg-background border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Step indicators */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`w-12 md:w-20 h-0.5 mx-1 ${
                  s < step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Project Type */}
      {step === 1 && (
        <div className="space-y-4">
          <Label className="text-lg font-semibold">{t("projectType")}</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROJECT_TYPES.map((pt) => (
              <button
                key={pt.value}
                type="button"
                className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                  form.project_type === pt.value
                    ? "border-primary bg-primary/5 font-medium"
                    : "hover:bg-muted"
                }`}
                onClick={() => update("project_type", pt.value)}
              >
                {isEs ? pt.es : pt.en}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Budget & Timeline */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-lg font-semibold">{t("budgetRange")}</Label>
            <Select
              value={form.budget_range}
              onValueChange={(v) => update("budget_range", v)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isEs ? "Selecciona..." : "Select..."}
                />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {isEs ? b.es : b.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-lg font-semibold">{t("timeline")}</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={60}
                value={form.timeline_months}
                onChange={(e) => update("timeline_months", e.target.value)}
                className="w-24"
              />
              <span className="text-muted-foreground">
                {t("timelineMonths")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-lg font-semibold">{t("locationZone")}</Label>
            <Select
              value={form.location_zone}
              onValueChange={(v) => update("location_zone", v)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isEs ? "Selecciona zona..." : "Select area..."}
                />
              </SelectTrigger>
              <SelectContent>
                {ZONES.map((z) => (
                  <SelectItem key={z} value={z}>
                    📍 {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-lg font-semibold">
              {t("propertyStatus")}
            </Label>
            <div className="space-y-2">
              {[
                { value: "owned", label: t("propertyYes") },
                { value: "searching", label: t("propertyNo") },
                { value: "considering", label: t("propertyLooking") },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`w-full p-3 rounded-lg border text-left text-sm transition-colors ${
                    form.property_status === opt.value
                      ? "border-primary bg-primary/5 font-medium"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => update("property_status", opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Contact Info */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("fullName")}</Label>
            <Input
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              placeholder={isEs ? "Ej: Juan García" : "e.g. John Smith"}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("phone")}</Label>
            <Input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+1 555 123 4567"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("email")}</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("preferredContact")}</Label>
            <Select
              value={form.preferred_contact}
              onValueChange={(v) => update("preferred_contact", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="phone">
                  {isEs ? "Llamada" : "Phone Call"}
                </SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("notes")}</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            {t("prev")}
          </Button>
        ) : (
          <div />
        )}
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)}>{t("next")}</Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting || !form.full_name}
            className="bg-jungle hover:bg-jungle-dark"
          >
            {submitting
              ? isEs
                ? "Enviando..."
                : "Submitting..."
              : t("submit")}
          </Button>
        )}
      </div>
    </div>
  );
}
