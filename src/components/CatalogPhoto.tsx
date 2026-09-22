import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import crops from "@/data/photo-crops.json";

/** Fill the frame using the photograph itself, excluding baked-in border bands. */
export function CatalogPhoto({ className, style, src, onLoad, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const frame = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const filename = (src || "").split("/").pop() || "";
  const crop = Object.entries(crops).find(([name]) => filename === name + ".jpg" || filename.startsWith(name + "-"))?.[1];
  useEffect(() => {
    if (!frame.current || !crop) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, [src, crop]);
  let imageStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" };
  if (crop && size.width && size.height) {
    const [width, height, top, bottom, left, right] = crop;
    const innerWidth = width - left - right;
    const innerHeight = height - top - bottom;
    const scale = Math.max(size.width / innerWidth, size.height / innerHeight);
    imageStyle = { position: "absolute", maxWidth: "none", width: width * scale, height: height * scale, left: (size.width - innerWidth * scale) / 2 - left * scale, top: (size.height - innerHeight * scale) / 2 - top * scale };
  }
  return <span ref={frame} className={className} style={{ ...style, display: "block", overflow: "hidden" }}><img {...props} src={src} onLoad={onLoad} style={imageStyle} /></span>;
}
