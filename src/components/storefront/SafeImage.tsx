import Image, { type ImageProps } from "next/image";

const assetHosts = (process.env.NEXT_PUBLIC_ASSET_HOSTS ?? "kencana.basic.box.cloudeka.id").split(",").map((h) => h.trim()).filter(Boolean);
const optimizable = new Set([...assetHosts, "picsum.photos"]);

function canOptimize(src: string): boolean {
  try {
    return optimizable.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

type Props = Omit<ImageProps, "src"> & { src: string };

/** next/image for our own hosts; plain <img> fallback for owner-pasted external URLs. */
export function SafeImage({ src, alt, ...rest }: Props) {
  if (!src) return null;
  if (canOptimize(src)) return <Image src={src} alt={alt} {...rest} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={rest.className} style={rest.style} loading="lazy" />;
}
