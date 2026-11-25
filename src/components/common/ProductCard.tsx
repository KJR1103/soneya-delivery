import React from 'react';
import { Product } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { Plus, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  onSelect,
  onAddToCart,
}) => {
  return (
    <article
      onClick={() => onSelect(product)}
      className="card m-press group relative flex flex-col justify-between p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden"
      style={{ '--i': index % 10 } as React.CSSProperties}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#DCE3F4]/50 mb-2.5">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Daily Special Badge */}
        {product.isDailySpecial && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#1E3A8A] text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
            <Star className="w-3 h-3 text-[#F4B028] fill-[#F4B028]" />
            <span>Plat du jour</span>
          </span>
        )}

        {/* Prep time badge */}
        {product.prepTimeMin && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#0F172A] text-[10px] font-semibold">
            {product.prepTimeMin} min
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0 flex-1 justify-between">
        <div>
          <h3
            className="t-2 font-bold text-sm text-[#0F172A] leading-snug group-hover:text-[#1E3A8A] transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="t-2 text-xs text-[#64748B] mt-0.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add button */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#E2E8F0]/60">
          <span className="price font-headline font-extrabold text-sm text-[#1E3A8A]">
            {formatGnf(product.priceGnf)}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) onAddToCart(product);
              else onSelect(product);
            }}
            className="w-8 h-8 rounded-full bg-[#DCE3F4] text-[#1E3A8A] hover:bg-[#D8432F] hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Ajouter au panier"
            aria-label={`Ajouter ${product.name}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
