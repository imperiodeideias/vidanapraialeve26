export function HeroPhoto({ src, mobileSrc, alt, className, eager = false }: { src: string; mobileSrc?: string; alt: string; className: string; eager?: boolean }) {
  return <div className={className + " overflow-hidden"}>
    <picture><source media="(max-width: 767px)" srcSet={mobileSrc || src} /><img src={src} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} width={1254} height={1254} sizes="(min-width: 1024px) 42vw, 80vw" className="absolute inset-0 h-full w-full object-cover object-center" /></picture>
  </div>;
}
