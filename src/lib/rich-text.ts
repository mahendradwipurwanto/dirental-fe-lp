import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import type { RichTextDoc } from "@/lib/site-schema";

const extensions = [StarterKit.configure({ heading: { levels: [2, 3, 4] } })];

/** Renders owner-authored Tiptap JSON to HTML using a fixed, safe extension set. */
export function richTextToHtml(doc: RichTextDoc | null | undefined): string {
  if (!doc || !doc.content || doc.content.length === 0) return "";
  try {
    return generateHTML(doc as Parameters<typeof generateHTML>[0], extensions);
  } catch {
    return "";
  }
}

export function richTextToPlain(doc: RichTextDoc | null | undefined, max = 160): string {
  const html = richTextToHtml(doc);
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
