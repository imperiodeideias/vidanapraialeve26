export function HeroPhoto({ src, alt, className, eager = false }: { src: string; alt: string; className: string; eager?: boolean }) {
  return <div className={className + " overflow-hidden"}>
    <img src={src} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover blur-xl opacity-40" />
    <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} width={1254} height={1254} className="absolute left-[15%] top-[15%] h-[70%] w-[70%] object-contain rounded-xl" />
  </div>;
}
