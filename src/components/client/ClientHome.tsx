import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Partner, Product } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { ProductCard } from '../common/ProductCard';
import { ProductModal } from './ProductModal';
import { ExpressParcelModal } from './ExpressParcelModal';
import { NeighborhoodModal } from './NeighborhoodModal';
import {
  Utensils,
  ShoppingBag,
  Package,
  HeartPulse,
  MapPin,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Search,
  Star,
} from 'lucide-react';

export const ClientHome: React.FC = () => {
  const {
    partners,
    location,
    setSelectedPartnerId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    showToast,
  } = useApp();

  const [selectedProductForModal, setSelectedProductForModal] = useState<{
    product: Product;
    partner: Partner;
  } | null>(null);

  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);
  const [isParcelModalOpen, setIsParcelModalOpen] = useState(false);

  // Extract Plats du Jour from partners
  const dailySpecials = useMemo(() => {
    const list: { product: Product; partner: Partner }[] = [];
    partners.forEach((p) => {
      p.products.forEach((pr) => {
        if (pr.isDailySpecial) {
          list.push({ product: pr, partner: p });
        }
      });
    });
    // Fallback if none explicitly flagged: pick top signature dishes from partners
    if (list.length === 0 && partners.length > 0) {
      partners.slice(0, 4).forEach((p) => {
        if (p.products[0]) {
          list.push({
            product: { ...p.products[0], isDailySpecial: true },
            partner: p,
          });
        }
      });
    }
    return list;
  }, [partners]);

  // All products for curated catalog
  const allPartnerProducts = useMemo(() => {
    const items: { product: Product; partner: Partner }[] = [];
    partners.forEach((p) => {
      p.products.forEach((pr) => {
        items.push({ product: pr, partner: p });
      });
    });
    return items;
  }, [partners]);

  // Filtered products based on search & category
  const filteredItems = useMemo(() => {
    return allPartnerProducts.filter(({ product, partner }) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all') {
        const cat = selectedCategory.toLowerCase();
        const matchesCategory =
          product.category.toLowerCase().includes(cat) ||
          partner.category.toLowerCase().includes(cat);
        if (!matchesCategory) return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          partner.name.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [allPartnerProducts, selectedCategory, searchQuery]);

  const handleSelectProduct = (product: Product, partner: Partner) => {
    setSelectedProductForModal({ product, partner });
  };

  const handleQuickAdd = (product: Product, partner: Partner) => {
    addToCart(product, partner);
    showToast('Ajouté au panier', `${product.name} chez ${partner.name}`, 'success');
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col gap-6 pb-28 text-[#0F172A]">
      {/* 4 Circular Category Icons (Bleu profond & Bleu clair Soneya V2) */}
      <section className="grid grid-cols-4 gap-2 sm:gap-4 text-center py-2" aria-label="Catégories rapides">
        <button
          type="button"
          onClick={() => setSelectedCategory(selectedCategory === 'restaurant' ? null : 'restaurant')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <span
            className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-200 group-hover:scale-105 shadow-xs ${
              selectedCategory === 'restaurant'
                ? 'bg-[#1E3A8A] text-white ring-4 ring-[#DCE3F4]'
                : 'bg-[#DCE3F4] text-[#1E3A8A] hover:bg-[#1E3A8A]/15'
            }`}
          >
            <Utensils className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <span className="font-semibold text-xs sm:text-sm text-[#0F172A]">Repas</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory(selectedCategory === 'grocery' || selectedCategory === 'boutique' ? null : 'grocery')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <span
            className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-200 group-hover:scale-105 shadow-xs ${
              selectedCategory === 'grocery' || selectedCategory === 'boutique'
                ? 'bg-[#1E3A8A] text-white ring-4 ring-[#DCE3F4]'
                : 'bg-[#DCE3F4] text-[#1E3A8A] hover:bg-[#1E3A8A]/15'
            }`}
          >
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <span className="font-semibold text-xs sm:text-sm text-[#0F172A]">Courses</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory(selectedCategory === 'pharmacy' ? null : 'pharmacy')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <span
            className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-200 group-hover:scale-105 shadow-xs ${
              selectedCategory === 'pharmacy'
                ? 'bg-[#1E3A8A] text-white ring-4 ring-[#DCE3F4]'
                : 'bg-[#DCE3F4] text-[#1E3A8A] hover:bg-[#1E3A8A]/15'
            }`}
          >
            <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <span className="font-semibold text-xs sm:text-sm text-[#0F172A]">Pharmacie</span>
        </button>

        <button
          type="button"
          onClick={() => setIsParcelModalOpen(true)}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <span className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#DCE3F4] text-[#1E3A8A] hover:bg-[#1E3A8A]/20 transition-all duration-200 group-hover:scale-105 shadow-xs">
            <Package className="w-6 h-6 sm:w-7 sm:h-7" />
          </span>
          <span className="font-semibold text-xs sm:text-sm text-[#0F172A]">Colis</span>
        </button>
      </section>

      {/* Bento Top Row: Editorial Promo Banner + Express Parcel Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Featured Editorial Banner */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#1E3A8A] text-white grid grid-cols-1 md:grid-cols-12 items-center shadow-xs">
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col gap-3">
            <span className="inline-flex items-center gap-1 self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider">
              Offre Spéciale Conakry · -20%
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Saveurs guinéennes livrées chaudes en 25 min.
            </h2>
            <p className="text-sm text-[#DCE3F4] leading-relaxed">
              Utilisez le code promo <strong className="font-mono text-white underline decoration-[#D8432F] decoration-2">SONEYA20</strong> sur votre prochain Maffé Tiga ou Capitaine Braisé.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const fanta = partners[0];
                  if (fanta) setSelectedPartnerId(fanta.id);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D8432F] text-white font-bold text-sm hover:opacity-90 active:scale-95 transition shadow-sm cursor-pointer"
              >
                <span>Découvrir Chez Fanta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="md:col-span-5 h-full min-h-[200px]">
            <img
              src="https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=800&q=80"
              alt="Plats gastronomiques Chez Fanta Conakry"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Express Parcel Card */}
        <article className="lg:col-span-4 h-full flex flex-col justify-between gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex flex-col gap-3">
            <div className="relative rounded-xl overflow-hidden h-32 bg-[#DCE3F4]">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                alt="Coursier moto Soneya Express Conakry"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#1E3A8A] text-white text-[11px] font-bold">
                Urbain Express
              </span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-[#0F172A]">
                Soneya Express Colis
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Envoyez un pli ou un colis entre Kaloum, Kipé et Lambanyi avec motards géolocalisés.
              </p>
            </div>
          </div>
          <footer className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <span className="font-mono text-xs font-bold text-[#1E3A8A]">
              Dès 15 000 GNF
            </span>
            <button
              type="button"
              onClick={() => setIsParcelModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D8432F] text-white text-xs font-bold hover:opacity-90 transition active:scale-95 cursor-pointer shadow-xs"
            >
              Expédier
            </button>
          </footer>
        </article>
      </section>

      {/* ⭐ DEDICATED SECTION: LES PLATS DU JOUR À CONAKRY */}
      {dailySpecials.length > 0 && (
        <section className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#DCE3F4] text-[#1E3A8A] flex items-center justify-center font-bold">
                <Star className="w-4 h-4 fill-[#F4B028] text-[#F4B028]" />
              </span>
              <div>
                <h2 className="font-headline text-lg sm:text-xl font-extrabold text-[#0F172A]">
                  Les Plats du Jour à Conakry
                </h2>
                <p className="text-xs text-[#64748B]">
                  Cuisinés ce matin par nos restaurants partenaires
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#DCE3F4] text-[#1E3A8A] text-xs font-bold">
              {dailySpecials.length} suggestions
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {dailySpecials.slice(0, 4).map(({ product, partner }, index) => (
              <ProductCard
                key={`daily-${product.id}`}
                product={product}
                index={index}
                onSelect={(pr) => handleSelectProduct(pr, partner)}
                onAddToCart={(pr) => handleQuickAdd(pr, partner)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filter Row & Search & Quartier Selection */}
      <section className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
              !selectedCategory
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            Tout voir
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('restaurant')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'restaurant'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            Restaurants
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('grocery')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'grocery'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            Courses &amp; Boutiques
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('pharmacy')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'pharmacy'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
            }`}
          >
            Pharmacie
          </button>
        </div>

        {/* Quartier Filter Pill */}
        <button
          type="button"
          onClick={() => setIsNeighborhoodOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] transition cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <span>{location.quartier?.name || 'Kipé'}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
        </button>
      </section>

      {/* Main Curated Products Grid */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-lg sm:text-xl font-extrabold text-[#0F172A]">
            Catalogue &amp; Plats disponibles
          </h2>
          <span className="text-xs text-[#64748B]">
            {filteredItems.length} article{filteredItems.length > 1 ? 's' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-2">
            <p className="font-bold text-sm text-[#0F172A]">Aucun article ne correspond à votre recherche</p>
            <p className="text-xs text-[#64748B]">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.slice(0, 24).map(({ product, partner }, index) => (
              <ProductCard
                key={`${partner.id}-${product.id}`}
                product={product}
                index={index}
                onSelect={(pr) => handleSelectProduct(pr, partner)}
                onAddToCart={(pr) => handleQuickAdd(pr, partner)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Selected Product Modal */}
      {selectedProductForModal && (
        <ProductModal
          product={selectedProductForModal.product}
          partner={selectedProductForModal.partner}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}

      {/* Express Parcel Modal */}
      <ExpressParcelModal
        isOpen={isParcelModalOpen}
        onClose={() => setIsParcelModalOpen(false)}
      />

      {/* Neighborhood Modal */}
      <NeighborhoodModal
        isOpen={isNeighborhoodOpen}
        onClose={() => setIsNeighborhoodOpen(false)}
      />
    </div>
  );
};
