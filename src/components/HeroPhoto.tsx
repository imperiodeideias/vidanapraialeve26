export function HeroPhoto({ src, alt, className, eager = false }: { src: string; alt: string; className: string; eager?: boolean }) {
  return <div className={className + " overflow-hidden"}>
    <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} width={1254} height={1254} className="absolute inset-0 h-full w-full object-cover object-center" />
  </div>;
}
