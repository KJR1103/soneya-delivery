import React, { useState } from 'react';
import { Partner, Product } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { calculateDistanceKm, calculateDeliveryFeeGnf } from '../../utils/geo';
import { useApp } from '../../context/AppContext';
import { ProductModal } from './ProductModal';
import { ReviewsModal } from './ReviewsModal';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Heart,
  Plus,
  Sparkles,
  Check,
  Share2,
  Search,
  MessageSquare,
  UtensilsCrossed,
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
    cart,
    cartCount,
    cartSubtotalGnf,
    setActiveTab,
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
      showToast('Lien copié', 'Lien du restaurant copié dans le presse-papier !', 'success');
    }
  };

  return (
    <div className="pb-32">
      {/* Cover Image & Quick Nav */}
      <div className="relative h-56 sm:h-64 w-full bg-[#081C13] overflow-hidden">
        <img
          src={partner.coverImage}
          alt={partner.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

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
                  isFav ? 'fill-rose-500 text-rose-500' : 'text-white'
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
            <span className="text-[11px] font-bold text-[#FFB81F] uppercase tracking-wider">
              {partner.categoryLabel}
            </span>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white truncate">
              {partner.name}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/90 mt-1 flex-wrap">
              <button
                onClick={() => setIsReviewsOpen(true)}
                className="flex items-center gap-1 font-bold text-[#FFB81F] hover:underline cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-[#FFB81F]" />
                <span>
                  {partner.rating} ({partner.reviewsCount} avis)
                </span>
              </button>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {partner.quartierName} ({distanceKm} km)
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{partner.deliveryTimeMin} min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main container */}
      <div className="max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 mt-4 space-y-4">
        {/* Delivery Fee Info Banner */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between gap-2 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold text-xs border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
              GNF
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[#0B2B1E] dark:text-white block">
                Frais de livraison : {formatGnf(feeCalc.feeGnf)}
              </span>
              <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75 truncate">
                Calculé selon {distanceKm} km depuis ({location.quartier.name})
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsReviewsOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#0B7A4B] dark:text-[#FFB81F] bg-white dark:bg-[#10231B] hover:bg-emerald-50 px-3 py-2 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] transition cursor-pointer shrink-0 min-h-[40px]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Avis</span>
          </button>
        </div>

        {/* Promo Announcement Banner */}
        {partner.bannerOffer && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center gap-2.5 text-xs shadow-xs">
            <Sparkles className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
            <span className="font-semibold text-[#0B2B1E] dark:text-emerald-100">
              {partner.bannerOffer}
            </span>
          </div>
        )}

        {/* Search inside menu */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C7A6E]" />
          <input
            type="text"
            placeholder={`Rechercher chez ${partner.name}...`}
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:border-[#0B7A4B] text-[#0B2B1E] dark:text-white placeholder:text-[#5C7A6E] shadow-xs min-h-[44px]"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer min-h-[38px] ${
                  isActive
                    ? 'bg-[#0B7A4B] text-white shadow-xs border border-[#0B7A4B]'
                    : 'bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#2F4F42] dark:text-emerald-100 hover:border-[#0B7A4B]'
                }`}
              >
                {cat === 'all' ? (
                  <span className="flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Tout le menu</span>
                  </span>
                ) : (
                  cat
                )}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProducts.map((product) => {
            const inCart = cart.find((i) => i.product.id === product.id);
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group relative flex gap-3.5 p-3 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] hover:border-[#0B7A4B] hover:shadow-xs transition cursor-pointer"
              >
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white group-hover:text-[#0B7A4B] transition line-clamp-1">
                        {product.name}
                      </h3>
                      {product.isPopular && (
                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-400 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                          Populaire
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#5C7A6E] dark:text-emerald-200/75 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-heading font-extrabold text-sm text-[#0B7A4B] dark:text-[#FFB81F]">
                      {formatGnf(product.priceGnf)}
                    </span>
                    {inCart ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#0B7A4B] dark:text-white bg-emerald-50 dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3" />
                        {inCart.quantity} au panier
                      </span>
                    ) : (
                      <span className="w-8 h-8 rounded-lg bg-emerald-50/70 dark:bg-[#10231B] group-hover:bg-[#0B7A4B] group-hover:text-white transition flex items-center justify-center text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D]">
                        <Plus className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-24 h-24 rounded-xl overflow-hidden bg-emerald-50/40 dark:bg-[#10231B] shrink-0 relative border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-xs text-[#5C7A6E] dark:text-emerald-200/70">
            Aucun article trouvé pour « {menuSearch} »
          </div>
        )}
      </div>

      {/* Floating Checkout bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 lg:bottom-5 left-3 right-3 z-30 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#0B7A4B] hover:bg-[#08613B] text-white shadow-xl font-bold text-sm transition transform hover:-translate-y-0.5 cursor-pointer border border-[#08613B] min-h-[52px]"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-[#0B7A4B] text-xs font-black flex items-center justify-center">
                {cartCount}
              </span>
              <span>Voir le panier</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-base">
                {formatGnf(cartSubtotalGnf)}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        partner={partner}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        partner={partner}
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
      />
    </div>
  );
};
