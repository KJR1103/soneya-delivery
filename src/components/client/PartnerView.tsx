import React, { useState } from 'react';
import { Partner, Product } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { calculateDistanceKm, calculateDeliveryFeeGnf } from '../../utils/geo';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import { ProductModal } from './ProductModal';
import { ReviewsModal } from './ReviewsModal';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  Search,
  Bike,
  ShieldCheck,
} from 'lucide-react';

interface PartnerViewProps {
  partner: Partner;
  onBack: () => void;
}

export const PartnerView: React.FC<PartnerViewProps> = ({ partner, onBack }) => {
  const {
    location,
    favorites,
    toggleFavorite,
    addToCart,
    showToast,
  } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const isFav = favorites.includes(partner.id);

  const distanceKm = calculateDistanceKm(
    location.quartier.lat,
    location.quartier.lng,
    partner.lat,
    partner.lng
  );

  const feeCalc = calculateDeliveryFeeGnf(distanceKm);

  const categories = ['all', ...Array.from(new Set(partner.products.map((p) => p.category)))];

  const filteredProducts = partner.products.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${partner.name} sur Soneya Delivery`,
          text: `Découvrez ${partner.name} à Conakry sur Soneya Delivery !`,
          url: window.location.href,
        });
      } catch {
        // ignore
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien copié', 'Lien du restaurant copié dans le presse-papier !', 'info');
    }
  };

  const handleQuickAdd = (product: Product) => {
    addToCart(product, partner);
    showToast('Ajouté au panier', `${product.name} ajouté`, 'success');
  };

  return (
    <div className="pb-32 text-[#0F172A] m-reveal">
      {/* Cover Image & Quick Nav */}
      <div className="relative h-56 sm:h-64 w-full bg-[#1E3A8A] overflow-hidden">
        <img
          src={partner.coverImage}
          alt={partner.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/75 transition cursor-pointer"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-11 h-11 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/75 transition cursor-pointer"
              aria-label="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(partner.id)}
              className="w-11 h-11 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/75 transition cursor-pointer"
              aria-label="Ajouter aux favoris"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  isFav ? 'fill-[#D8432F] text-[#D8432F]' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bottom Banner Info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3.5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white p-1 shadow-xl shrink-0 ring-2 ring-white/20">
            <img
              src={partner.logoImage}
              alt={partner.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="text-white min-w-0 flex-1">
            <span className="text-[11px] font-bold text-[#F4B028] uppercase tracking-wider">
              {partner.categoryLabel}
            </span>
            <h1 className="font-headline font-extrabold text-xl sm:text-2xl text-white truncate">
              {partner.name}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/90 mt-1 flex-wrap">
              <button
                onClick={() => setIsReviewsOpen(true)}
                className="flex items-center gap-1 font-bold text-[#F4B028] hover:underline cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-[#F4B028]" />
                <span>
                  {partner.rating} ({partner.reviewsCount} avis)
                </span>
              </button>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{partner.deliveryTimeMin || 20}-{ (partner.deliveryTimeMin || 20) + 15} min</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{partner.address}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-5">
        {/* Distance and delivery fee banner */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Bike className="w-4 h-4 text-[#1E3A8A]" />
            <span>Livraison vers {location.quartier.name} ({distanceKm} km)</span>
          </div>
          <span className="text-xs font-bold text-[#1E3A8A] font-mono">
            Frais : {formatGnf(feeCalc.feeGnf)}
          </span>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder={`Rechercher dans le menu de ${partner.name}...`}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A] text-[#0F172A]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                {cat === 'all' ? 'Tout le menu' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-3">
          <h2 className="font-headline font-extrabold text-lg text-[#0F172A]">
            Articles au menu ({filteredProducts.length})
          </h2>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0]">
              <p className="font-bold text-sm text-[#0F172A]">Aucun article trouvé</p>
              <p className="text-xs text-[#64748B] mt-1">Essayez un autre mot-clé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((prod, index) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  index={index}
                  onSelect={(p) => setSelectedProduct(p)}
                  onAddToCart={(p) => handleQuickAdd(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          partner={partner}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Reviews Modal */}
      <ReviewsModal
        partner={partner}
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
      />
    </div>
  );
};
