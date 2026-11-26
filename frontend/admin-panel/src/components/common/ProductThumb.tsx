/** Small square product photo for tables. */
export default function ProductThumb({ src, alt }: { src?: string; alt: string }) {
  return <span className="thumb">{src ? <img src={src} alt={alt} loading="lazy" /> : <span aria-hidden="true">◇</span>}</span>;
}
