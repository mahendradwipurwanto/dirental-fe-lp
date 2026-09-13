import "server-only";

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing environment variable ${name}`);
  return v;
}

export const env = {
  API_URL: required("API_URL", "http://localhost:4000"),
  WEB_API_KEY: required("WEB_API_KEY", "dev-web-key"),
  REVALIDATE_SECRET: required("REVALIDATE_SECRET", "dev-revalidate-secret"),
  ADMIN_URL: required("ADMIN_URL", "http://localhost:3001"),
  SITE_URL: required("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
};
