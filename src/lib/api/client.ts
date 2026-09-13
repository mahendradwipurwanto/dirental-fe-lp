import "server-only";
import createClient from "openapi-fetch";
import type { paths } from "./schema";
import { env } from "@/lib/env";

/** Server-side client for public reads. */
export const api = createClient<paths>({ baseUrl: env.API_URL });

/** Server-side client for booking mutations; carries the shared key so the API trusts the forwarded IP. */
export function apiWithKey(clientIp: string | null) {
  return createClient<paths>({
    baseUrl: env.API_URL,
    headers: {
      "x-web-key": env.WEB_API_KEY,
      ...(clientIp ? { "x-forwarded-for": clientIp } : {}),
    },
  });
}

export type ApiError = { error: { code: string; message: string; issues?: { path: string; message: string }[] } };

export function isApiError(v: unknown): v is ApiError {
  return typeof v === "object" && v !== null && "error" in v && typeof (v as ApiError).error?.code === "string";
}
