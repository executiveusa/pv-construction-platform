import { Request, Response, NextFunction } from "express";
import pool from "../db";

export interface TenantRequest extends Request {
  tenantId?: string;
  tenantConfig?: {
    id: string;
    subdomain: string;
    name: string;
    logo_url?: string;
    primary_color?: string;
  };
}

export async function tenantMiddleware(
  req: TenantRequest,
  res: Response,
  next: NextFunction
) {
  const host = req.headers.host || "";
  // Simple subdomain extraction: tenant.pvconstruction.com -> tenant
  // For localhost:3000 -> localhost
  const parts = host.split(".");
  let subdomain = parts.length > 2 ? parts[0] : "www";

  // Handle localhost/dev environments
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    subdomain = "www";
  }

  try {
    const result = await pool.query(
      "SELECT id, subdomain, name, logo_url, primary_color FROM tenants WHERE subdomain = $1 AND active = TRUE",
      [subdomain]
    );

    if (result.rows.length === 0) {
      // Fallback to main tenant if subdomain not found
      const defaultTenant = await pool.query(
        "SELECT id, subdomain, name, logo_url, primary_color FROM tenants WHERE subdomain = 'www'"
      );
      
      if (defaultTenant.rows.length === 0) {
        return res.status(500).json({ error: "System not initialized: Default tenant missing" });
      }
      
      req.tenantId = defaultTenant.rows[0].id;
      req.tenantConfig = defaultTenant.rows[0];
    } else {
      req.tenantId = result.rows[0].id;
      req.tenantConfig = result.rows[0];
    }

    next();
  } catch (err) {
    console.error("Tenant middleware error:", err);
    res.status(500).json({ error: "Internal server error during tenant resolution" });
  }
}
