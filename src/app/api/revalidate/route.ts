import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

function authorized(req: NextRequest) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(token);
  const b = Buffer.from(env.REVALIDATE_SECRET);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Called by rental-api after an owner publishes or edits something. */
export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let tags: unknown;
  try {
    tags = (await req.json())?.tags;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string" || t.length === 0 || t.length > 256)) {
    return NextResponse.json({ error: "tags must be a non-empty string array" }, { status: 400 });
  }
  for (const tag of tags as string[]) {
    // Owners expect to see their publish immediately, so stale content is not served.
    revalidateTag(tag, { expire: 0 });
  }
  return NextResponse.json({ revalidated: true, tags, at: new Date().toISOString() });
}
