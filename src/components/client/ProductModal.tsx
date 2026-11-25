import React, { useState } from 'react';
import { Partner, Product } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, X, ShoppingBag, Star, Clock } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0F172A]/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto m-reveal">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-[#FFFFFF] text-[#0F172A] shadow-2xl border border-[#E2E8F0] overflow-y-auto">
        {/* Contextual Header */}
        <header className="px-4 py-3 flex items-center justify-between border-b border-[#E2E8F0] shrink-0">
          <button
            onClick={onClose}
            aria-label="Retour"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:bg-[#DCE3F4] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-headline font-bold text-sm text-[#0F172A] truncate max-w-[200px]">
            {partner.name}
          </span>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:bg-[#DCE3F4] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <main className="flex-1 px-5 py-4 flex flex-col gap-4">
          {/* Centered Dish Photo & Stepper */}
          <div className="flex flex-col items-center gap-3 pt-1">
            <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-[#F8FAFC] shadow-md shrink-0 bg-[#DCE3F4]">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] font-bold flex items-center justify-center hover:bg-[#DCE3F4] cursor-pointer"
              >
                -
              </button>
              <span className="font-mono text-sm text-[#0F172A] tabular-nums font-bold px-2">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white font-bold flex items-center justify-center hover:bg-[#1E3A8A]/90 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Title, Price & Metadata */}
          <section className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-headline text-lg font-bold text-[#0F172A]">
                {product.name}
              </h1>
              <span className="font-headline text-lg text-[#1E3A8A] tabular-nums shrink-0 font-extrabold">
                {formatGnf(unitPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748B] pt-0.5">
              <span className="inline-flex items-center gap-1 font-bold text-[#0F172A]">
                <Star className="w-3.5 h-3.5 fill-[#F4B028] text-[#F4B028]" />
                {(product as { rating?: number | string }).rating || '4.9'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{product.prepTimeMin || 18} min prép.</span>
              </span>
              <span>·</span>
              <span className="text-[#1E3A8A] font-semibold">Kipé · Halal</span>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed pt-1">
              {product.description || "Recette traditionnelle de Conakry préparée avec des ingrédients frais du marché."}
            </p>
          </section>

          {/* Accompagnement & Options Selector */}
          <section className="flex flex-col gap-2 pt-2 border-t border-[#E2E8F0]">
            <h2 className="font-headline font-bold text-xs text-[#0F172A]">
              Accompagnement &amp; piment
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedSpicy('mild')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSpicy === 'mild'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#DCE3F4]'
                }`}
              >
                Piment modéré
              </button>

              <button
                type="button"
                onClick={() => setSelectedSpicy('hot')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSpicy === 'hot'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#DCE3F4]'
                }`}
              >
                Piment fort
              </button>

              <button
                type="button"
                onClick={() => setSelectedSpicy('extra_meat')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSpicy === 'extra_meat'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#DCE3F4]'
                }`}
              >
                Extra viande (+12 000 GNF)
              </button>
            </div>
          </section>

          {/* Special Instructions Note */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#64748B]">
              Instructions pour la cuisine (optionnel)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ex: Sans oignon, bien chaud, sauce à part..."
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] outline-none focus:border-[#1E3A8A]"
            />
          </div>

          {/* Add to Cart Button (Primary action: Corail #D8432F) */}
          <button
            type="button"
            onClick={handleAdd}
            className="mt-1 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#D8432F] hover:bg-[#D8432F]/90 text-white font-headline text-sm font-bold shadow-sm transition active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ajouter au panier · {formatGnf(totalPrice)}</span>
          </button>
        </main>
      </div>
    </div>
  );
};
