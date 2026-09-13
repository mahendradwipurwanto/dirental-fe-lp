"use client";
import createClient from "openapi-fetch";
import type { paths } from "./schema";

/**
 * Browser client. `/api/storefront/*` is rewritten to the API's `/v1/public/*` by next.config.ts,
 * so the generated `paths` (which start with `/v1/public`) are mapped by stripping that prefix.
 */
export const browserApi = createClient<paths>({
  baseUrl: "/api/storefront",
  fetch: async (input) => {
    const req = input instanceof Request ? input : new Request(input);
    const url = new URL(req.url);
    url.pathname = url.pathname.replace("/api/storefront/v1/public", "/api/storefront");
    // Re-issue with a buffered body. Wrapping `req` in a new Request turns the body into a
    // ReadableStream, and Chrome refuses to send streamed bodies over HTTP/1.1.
    const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer();
    return fetch(url.toString(), { method: req.method, headers: req.headers, body, credentials: req.credentials, cache: req.cache, signal: req.signal });
  },
});
