import React, { useState } from 'react';
import { Partner, Product, ProductOption } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

interface ProductModalProps {
  product: Product | null;
  partner: Partner;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, partner, onClose }) => {
  const { addToCart, showToast } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedSpicy, setSelectedSpicy] = useState<'mild' | 'hot' | 'extra_meat'>('mild');
  const [instructions, setInstructions] = useState('');

  if (!product) return null;

  const extraCostGnf = selectedSpicy === 'extra_meat' ? 12000 : 0;
  const unitPrice = product.priceGnf + extraCostGnf;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const spicyLabels = {
      mild: 'Piment modéré',
      hot: 'Piment fort',
      extra_meat: 'Extra viande (+12 000 GNF)',
    };

    const customSummary = [
      spicyLabels[selectedSpicy],
      instructions.trim() ? `Note: ${instructions.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' · ');

    addToCart(product, partner, undefined, customSummary);
    showToast('Ajouté au panier', `${quantity}x ${product.name} chez ${partner.name}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-t-xl sm:rounded-xl bg-light-surface dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface shadow-2xl border border-light-outline dark:border-dark-outline overflow-y-auto">
        {/* Contextual Header (Matching fiche_produit_client.html) */}
        <header className="px-gutter-md py-gutter-md flex items-center justify-between border-b border-light-outline dark:border-dark-outline shrink-0">
          <button
            onClick={onClose}
            aria-label="Retour"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_back</span>
          </button>
          <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold truncate max-w-[200px]">
            {partner.name}
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">close</span>
          </button>
        </header>

        <main className="flex-1 px-gutter-md py-gutter-md flex flex-col gap-gutter-lg">
          {/* Centered Dish Photo & Stepper (Reference img_0414 Center) */}
          <div className="flex flex-col items-center gap-gutter-md pt-2">
            <div className="w-52 h-52 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-light-surface-container-low dark:border-dark-surface-container-low shadow-sm shrink-0 bg-light-surface-container">
              <img
                src={product.image || 'https://lh3.googleusercontent.com/aida/ALJJyrDnokUuTLr-3l9vcS9ozchfhDN6Gj60eXrukGqR5Z-mzNSA3zDJTByndiDA7Q5ybD-i0wVlO-C4KMgwyD2LeZ9ETsDBfdBVGKKBImsgY2iV307XeXfk5CKow6YE1e8lP9f_TL2rlDWJUrTKucnFtqvrbv74fofuwi8qZF0G4_WShgtoHWlNnjuI2gmDWrlNhXOs1Mqp9pQc_101o2dWHw4HKsuoBx2EUIgy3Achl8tJmasKg8vdEcJF'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="inline-flex items-center gap-gutter-md px-gutter-md py-1.5 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface font-label text-label-lg flex items-center justify-center hover:opacity-80 cursor-pointer"
              >
                -
              </button>
              <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold px-2">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-lg flex items-center justify-center hover:opacity-90 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Title, Price & Metadata */}
          <section className="flex flex-col gap-gutter-xs">
            <div className="flex items-start justify-between gap-gutter-md">
              <h1 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface font-bold">
                {product.name}
              </h1>
              <span className="font-mono text-headline-md text-light-primary dark:text-dark-primary tabular-nums shrink-0 font-bold">
                {formatGnf(unitPrice)}
              </span>
            </div>

            <div className="flex items-center gap-gutter-md text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant pt-1">
              <span className="inline-flex items-center gap-1 font-semibold text-light-on-surface dark:text-dark-on-surface">
                <span className="material-symbols-outlined text-label-md text-accent" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                  star
                </span>
                {(product as { rating?: number | string }).rating || '4.9'}
              </span>
              <span>·</span>
              <span>{product.prepTimeMin || 18} min prép.</span>
              <span>·</span>
              <span className="text-light-primary dark:text-dark-primary font-medium">Kipé · Halal</span>
            </div>

            <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant text-pretty pt-1">
              {product.description || "Sauce onctueuse à la pâte d'arachide pure de Kindia, morceaux tendres de bœuf fumé, servie avec riz blanc parfumé."}
            </p>
          </section>

          {/* Accompagnement & Options Selector */}
          <section className="flex flex-col gap-gutter-sm pt-2 border-t border-light-outline dark:border-dark-outline">
            <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">
              Accompagnement &amp; piment
            </h2>
            <div className="flex flex-wrap gap-gutter-sm">
              <button
                type="button"
                onClick={() => setSelectedSpicy('mild')}
                className={`px-gutter-md py-2 rounded-md font-label text-label-md transition-all cursor-pointer ${
                  selectedSpicy === 'mild'
                    ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold shadow-xs'
                    : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
                }`}
              >
                <span>Piment modéré</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSpicy('hot')}
                className={`px-gutter-md py-2 rounded-md font-label text-label-md transition-all cursor-pointer ${
                  selectedSpicy === 'hot'
                    ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold shadow-xs'
                    : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
                }`}
              >
                <span>Piment fort</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSpicy('extra_meat')}
                className={`px-gutter-md py-2 rounded-md font-label text-label-md transition-all cursor-pointer ${
                  selectedSpicy === 'extra_meat'
                    ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold shadow-xs'
                    : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
                }`}
              >
                <span>Extra viande (+12 000 GNF)</span>
              </button>
            </div>
          </section>

          {/* Special Instructions Note */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Instructions pour la cuisine (optionnel)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ex: Sans oignon, bien chaud, sauce à part..."
              className="w-full px-3 py-2 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-body-sm text-light-on-surface dark:text-dark-on-surface outline-hidden focus:border-light-primary"
            />
          </div>

          {/* Add to Cart Button (Matching Stitch Ultra button-primary) */}
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3.5 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-lg hover:opacity-90 active:scale-98 transition-all shadow-sm font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-md">shopping_bag</span>
            <span>Ajouter au panier · {formatGnf(totalPrice)}</span>
          </button>
        </main>
      </div>
    </div>
  );
};
