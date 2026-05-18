import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://pvplatform:changeme@localhost:5432/pvplatform",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export default pool;

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

// Multitenant query helper
export async function queryTenant<T = Record<string, unknown>>(
  text: string,
  params: unknown[],
  tenantId: string
): Promise<T[]> {
  // Very basic tenant isolation by appending WHERE or AND
  // In a real app, you might use Row Level Security (RLS)
  const hasWhere = /WHERE/i.test(text);
  const separator = hasWhere ? "AND" : "WHERE";
  
  // We need to find the last parameter index to append the tenant_id
  const tenantParamIndex = params.length + 1;
  
  // Handle ORDER BY, LIMIT, OFFSET which should come after WHERE
  let tenantQuery = text;
  if (/ORDER BY|LIMIT|OFFSET/i.test(text)) {
    tenantQuery = text.replace(
      /(ORDER BY|LIMIT|OFFSET)/i,
      `${separator} tenant_id = $${tenantParamIndex} $1`
    );
  } else {
    tenantQuery = `${text} ${separator} tenant_id = $${tenantParamIndex}`;
  }
  
  return query<T>(tenantQuery, [...params, tenantId]);
}