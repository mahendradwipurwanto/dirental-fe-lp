import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq({ items }: { items: { id: string; q: string; a: string }[] }) {
  return (
    <Accordion multiple={false} className="w-full">
      {items.map((it) => (
        <AccordionItem key={it.id} value={it.id}>
          <AccordionTrigger className="py-4 text-left text-[17px] font-semibold">{it.q}</AccordionTrigger>
          <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
