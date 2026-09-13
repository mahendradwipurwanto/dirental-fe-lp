import { richTextToHtml } from "@/lib/rich-text";
import type { RichTextDoc } from "@/lib/site-schema";

export function RichText({ doc, className = "" }: { doc: RichTextDoc | null | undefined; className?: string }) {
  const html = richTextToHtml(doc);
  if (!html) return null;
  return <div className={`prose-storefront ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
