import type { ComponentType } from "react";
import type { BlockCtx } from "@/components/storefront/BlockRenderer";
import type { BlockOfType, BlockType } from "@/lib/site-schema";
import { ButtonBlock, DividerBlock, HeadingBlock, ImageBlock, SpacerBlock, TextBlock } from "./basic";
import { ColumnsBlock, GroupBlock } from "./ColumnsBlock";
import { ContactBlock } from "./ContactBlock";
import { CtaBlock, FaqBlock, FeaturesBlock, StatsBlock, TestimonialsBlock } from "./marketing";
import { GalleryBlock, MapBlock, VideoBlock } from "./media";
import { HeroBlock } from "./HeroBlock";
import { ListingGridBlock, ListingSpotlightBlock } from "./store";

export type BlockProps<T extends BlockType> = { block: BlockOfType<T>; ctx: BlockCtx };

export const blockRegistry: { [K in BlockType]: ComponentType<BlockProps<K>> } = {
  hero: HeroBlock,
  heading: HeadingBlock,
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  spacer: SpacerBlock,
  divider: DividerBlock,
  group: GroupBlock,
  columns: ColumnsBlock,
  listing_grid: ListingGridBlock,
  listing_spotlight: ListingSpotlightBlock,
  gallery: GalleryBlock,
  faq: FaqBlock,
  features: FeaturesBlock,
  testimonials: TestimonialsBlock,
  cta: CtaBlock,
  contact: ContactBlock,
  map: MapBlock,
  video: VideoBlock,
  stats: StatsBlock,
};
