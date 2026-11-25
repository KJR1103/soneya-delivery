import { useState, useEffect, useRef, useCallback } from "react";
import "./motion.css";
import "./content.css";

export type Product = { id: string; name: string; description: string; priceGnf: number; photo: string };
const gnf = new Intl.NumberFormat("fr-FR");

export function ProductCard({ p, i = 0 }: { p: Product; i?: number }) {
  return (
    <article className="card m-press" style={{ "--i": i } as React.CSSProperties}>
      <img src={p.photo} alt="" loading="lazy" decoding="async" />
      <h3 className="t-2" title={p.name}>{p.name}</h3>
      <p className="t-2">{p.description}</p>
      <span className="price">{gnf.format(p.priceGnf)} GNF</span>
    </article>
  );
}

const SkeletonCard = () => (
  <div className="card"><div className="m-skeleton thumb" /><div className="m-skeleton" style={{ height: 14, margin: "10px 0 6px" }} /><div className="m-skeleton" style={{ height: 12, width: "70%" }} /></div>
);

type Page = { items: Product[]; hasMore: boolean };
/** Défilement infini : charge 24 produits à la fois, jamais les milliers d'un coup. */
export function ProductGrid({ fetchPage }: { fetchPage: (page: number) => Promise<Page> }) {
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (busy || !more) return;
    setBusy(true); setError(false);
    try {
      const r = await fetchPage(page);
      setItems((old) => { const seen = new Set(old.map((x) => x.id)); return [...old, ...r.items.filter((x) => !seen.has(x.id))]; });
      setMore(r.hasMore); setPage((n) => n + 1);
    } catch { setError(true); } finally { setBusy(false); }
  }, [busy, more, page, fetchPage]);

  useEffect(() => {
    const el = sentinel.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && !error && load(), { rootMargin: "400px" });
    io.observe(el); return () => io.disconnect();
  }, [load, error]);

  if (!busy && !error && items.length === 0 && !more) return <p>Aucun produit trouvé.</p>;
  return (
    <>
      <div className="grid-products m-stagger">{items.map((p, i) => <ProductCard key={p.id} p={p} i={i % 24} />)}</div>
      {busy && <div className="grid-products">{Array.from({ length: 6 }, (_, k) => <SkeletonCard key={k} />)}</div>}
      {error && <button className="m-press" onClick={load}>Erreur de chargement. Réessayer</button>}
      <div ref={sentinel} aria-hidden="true" />
    </>
  );
}
