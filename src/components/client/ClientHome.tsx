import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryId, Partner, Product } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { calculateDistanceKm, calculateDeliveryFeeGnf } from '../../utils/geo';
import { StoriesRow } from './StoriesRow';
import { FilterSheet } from './FilterSheet';
import { NeighborhoodModal } from './NeighborhoodModal';
import { ExpressParcelModal } from './ExpressParcelModal';
import {
  Search,
  UtensilsCrossed,
  Cross,
  Star,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Plus,
  ShieldCheck,
  Package,
  Zap,
  Bike,
  Check,
  Copy,
  Navigation,
  Flame,
  CheckCircle2,
  TrendingUp,
  Tag,
  Utensils,
  Coffee,
  Layers,
  Shirt,
  ShoppingCart,
  UploadCloud,
} from 'lucide-react';

export const ClientHome: React.FC = () => {
  const {
    partners,
    location,
    favorites,
    toggleFavorite,
    setSelectedPartnerId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    activeOrder,
    setSelectedOrderId,
    sortOption,
    setIsFilterModalOpen,
    orders,
    reorder,
    addToCart,
    setIsAuthModalOpen,
    setIsPrivacyModalOpen,
  } = useApp();

  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);
  const [isParcelModalOpen, setIsParcelModalOpen] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('all');
  const [searchTab, setSearchTab] = useState<'food' | 'restaurants'>('food');

  const searchTagCloud = [
    'Burger',
    'Pizza',
    'Chawarma',
    'Riz & Maffé',
    'Fast food',
    'Poulet braisé',
    'Végétarien',
    'Doliprane',
    'Jus de Bissap',
    'Courses express',
  ];

  const categories: {
    id: CategoryId | 'parcels';
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    count: number;
    badge?: string;
  }[] = [
    {
      id: 'restaurants',
      label: 'Restaurants',
      sublabel: 'Burger & Plats chauds',
      icon: <UtensilsCrossed className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
      count: partners.filter((p) => p.category === 'restaurants').length,
    },
    {
      id: 'pharmacy',
      label: 'Pharmacie',
      sublabel: 'Urgences santé 24/7',
      icon: <Cross className="w-5 h-5 text-[#0B7A4B] dark:text-emerald-400" />,
      count: partners.filter((p) => p.category === 'pharmacy').length,
      badge: '24/7',
    },
    {
      id: 'groceries',
      label: 'Supermarché',
      sublabel: 'Courses & frais',
      icon: <ShoppingCart className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
      count: partners.filter((p) => p.category === 'groceries').length,
    },
    {
      id: 'shops',
      label: 'Mode & Bazar',
      sublabel: 'Vêtements & tech',
      icon: <Shirt className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
      count: partners.filter((p) => p.category === 'shops').length,
    },
    {
      id: 'parcels',
      label: 'Colis Express',
      sublabel: 'Course moto immédiate',
      icon: <Package className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
      count: 10,
      badge: 'Nouveau',
    },
  ];

  const quickFilterChips = [
    { id: 'all', label: 'Tous', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'express', label: 'Express < 30 min', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'promo', label: 'Promos du jour', icon: <Tag className="w-3.5 h-3.5" /> },
    { id: 'maffe', label: 'Riz & Maffé', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'chawarma', label: 'Chawarma & Grillades', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'boissons', label: 'Jus & Boissons', icon: <Coffee className="w-3.5 h-3.5" /> },
    { id: 'pharmacie', label: 'Pharmacie 24/7', icon: <Cross className="w-3.5 h-3.5" /> },
  ];

  const promoBanners = [
    {
      id: 1,
      badge: 'OFFRE EXCLUSIVE CONAKRY',
      title: '-20% sur votre commande',
      subtitle: 'Code SONEYA20 (réduction plafonnée à 40 000 GNF)',
      code: 'SONEYA20',
      tag: 'Économisez jusqu à 40 000 GNF',
    },
    {
      id: 2,
      badge: 'LIVRAISON OFFERTE',
      title: 'Frais de livraison à 0 GNF',
      subtitle: 'Code LIVRAISON0 : nos motards livrent chez vous sans frais',
      code: 'LIVRAISON0',
      tag: 'Course 100% offerte',
    },
    {
      id: 3,
      badge: 'BIENVENUE GHT',
      title: '-15 000 GNF Immédiats',
      subtitle: 'Code BIENVENUE dès 100 000 GNF d achat',
      code: 'BIENVENUE',
      tag: 'Offert par Guinée Hub Technologie',
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const partnersWithDistance = partners
    .map((partner) => {
      const distanceKm = calculateDistanceKm(
        location.quartier.lat,
        location.quartier.lng,
        partner.lat,
        partner.lng
      );
      const feeInfo = calculateDeliveryFeeGnf(distanceKm);
      return {
        ...partner,
        distanceKm,
        deliveryFeeGnf: feeInfo.feeGnf,
      };
    })
    .sort((a, b) => {
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'speed') return a.deliveryTimeMin - b.deliveryTimeMin;
      if (sortOption === 'fee') return a.deliveryFeeGnf - b.deliveryFeeGnf;
      return a.distanceKm - b.distanceKm;
    });

  const expressPartners = partnersWithDistance.filter(
    (p) => p.deliveryTimeMin <= 30 && p.isOpen
  );

  const filteredPartners = partnersWithDistance.filter((partner) => {
    if (activeTab === 'favorites' && !favorites.includes(partner.id)) {
      return false;
    }
    if (selectedCategory && partner.category !== selectedCategory) {
      return false;
    }

    if (activeQuickFilter === 'express' && partner.deliveryTimeMin > 30) {
      return false;
    }
    if (activeQuickFilter === 'promo' && !partner.bannerOffer) {
      return false;
    }
    if (activeQuickFilter === 'maffe') {
      const hasMaffe = partner.products.some(
        (p) =>
          p.name.toLowerCase().includes('maffé') ||
          p.description.toLowerCase().includes('arachide')
      );
      if (!hasMaffe) return false;
    }
    if (activeQuickFilter === 'chawarma') {
      const hasChawarma =
        partner.tags.some((t) => t.toLowerCase().includes('chawarma')) ||
        partner.products.some((p) => p.name.toLowerCase().includes('chawarma'));
      if (!hasChawarma) return false;
    }
    if (activeQuickFilter === 'boissons') {
      const hasDrink = partner.products.some(
        (p) =>
          p.category.toLowerCase().includes('boisson') ||
          p.name.toLowerCase().includes('jus')
      );
      if (!hasDrink) return false;
    }
    if (activeQuickFilter === 'pharmacie' && partner.category !== 'pharmacy') {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = partner.name.toLowerCase().includes(q);
      const matchQuartier = partner.quartierName.toLowerCase().includes(q);
      const matchTags = partner.tags.some((t) => t.toLowerCase().includes(q));
      const matchProducts = partner.products.some((pr) =>
        pr.name.toLowerCase().includes(q)
      );
      return matchName || matchQuartier || matchTags || matchProducts;
    }
    return true;
  });

  const popularDishes: { product: Product; partner: Partner }[] = [
    { product: partners[0].products[0], partner: partners[0] },
    { product: partners[1].products[0], partner: partners[1] },
    { product: partners[0].products[1], partner: partners[0] },
    { product: partners[0].products[2], partner: partners[0] },
    { product: partners[0].products[4], partner: partners[0] },
  ];

  const matchingProducts: { product: Product; partner: Partner }[] = [];
  partners.forEach((p) => {
    p.products.forEach((pr) => {
      if (!searchQuery.trim()) {
        matchingProducts.push({ product: pr, partner: p });
      } else {
        const q = searchQuery.toLowerCase();
        if (
          pr.name.toLowerCase().includes(q) ||
          pr.description.toLowerCase().includes(q) ||
          pr.category.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q)
        ) {
          matchingProducts.push({ product: pr, partner: p });
        }
      }
    });
  });

  const categoryBubbles = [
    {
      id: 'restaurants' as CategoryId,
      label: 'Restaurants',
      placesCount: partners.filter((p) => p.category === 'restaurants').length,
      image: partners[0].coverImage,
    },
    {
      id: 'groceries' as CategoryId,
      label: 'Courses',
      placesCount: partners.filter((p) => p.category === 'groceries').length,
      image: partners[2].coverImage,
    },
    {
      id: 'pharmacy' as CategoryId,
      label: 'Pharmacie 24/7',
      placesCount: partners.filter((p) => p.category === 'pharmacy').length,
      image: partners[3].coverImage,
    },
    {
      id: 'shops' as CategoryId,
      label: 'Boutiques',
      placesCount: partners.filter((p) => p.category === 'shops').length,
      image: partners[1].coverImage,
    },
  ];

  const handleQuickAdd = (product: Product, partner: Partner) => {
    addToCart(product, partner);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const sortLabels = {
    distance: 'Plus proche',
    rating: 'Mieux noté',
    speed: 'Plus rapide',
    fee: 'Frais réduits',
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 py-3 pb-32 space-y-6">
      {/* 1. TOP DELIVERY CONTEXT & FAST ETA */}
      <div className="bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-emerald-50 p-4 rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold shrink-0 border border-[#D4E9DD] dark:border-[#1E3B2D]">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-[#5C7A6E] dark:text-emerald-200/70 font-medium flex flex-wrap items-center gap-1.5">
              <span>Livrer à Conakry :</span>
              <span className="text-xs font-semibold text-[#0B7A4B] dark:text-emerald-300">
                Livreurs disponibles
              </span>
            </div>
            <button
              onClick={() => setIsNeighborhoodOpen(true)}
              className="text-sm font-bold text-[#0B2B1E] dark:text-white hover:text-[#0B7A4B] transition flex items-center gap-1 text-left max-w-full cursor-pointer"
            >
              <span className="truncate">
                {location.isGPS ? 'Position GPS Conakry' : location.quartier.name}
              </span>
              <span className="text-xs text-[#0B7A4B] dark:text-[#FFB81F] font-semibold underline ml-1 shrink-0">
                Modifier
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#10231B] font-semibold text-[#0B2B1E] dark:text-emerald-100 border border-[#D4E9DD] dark:border-[#1E3B2D] min-h-[40px]">
            <Clock className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
            <span>~25-35 min</span>
          </div>
          <button
            onClick={() => setIsParcelModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-semibold transition shadow-xs cursor-pointer min-h-[40px]"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Envoyer un colis</span>
          </button>
        </div>
      </div>

      {/* ACTIVE ORDER BANNER */}
      {activeOrder && activeOrder.status !== 'delivered' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold border border-[#D4E9DD] dark:border-[#1E3B2D]">
              <Bike className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-heading font-bold text-[#0B2B1E] dark:text-white truncate">
                Commande en cours chez {activeOrder.partnerName}
              </div>
              <div className="text-[11px] text-[#2F4F42] dark:text-emerald-200/80">
                Code secret :{' '}
                <strong className="text-[#0B7A4B] dark:text-[#FFB81F] font-mono text-xs">
                  {activeOrder.deliveryCode}
                </strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedOrderId(activeOrder.id);
              setActiveTab('orders');
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-semibold text-xs shrink-0 transition shadow-xs cursor-pointer min-h-[42px]"
          >
            Suivre en direct
          </button>
        </div>
      )}

      {/* 2. SEARCH BAR & QUICK FILTER CHIPS */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C7A6E]" />
            <input
              type="text"
              placeholder="Rechercher un plat, restaurant, supermarché, pharmacie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-16 py-3 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs sm:text-sm shadow-xs focus:outline-none focus:border-[#0B7A4B] dark:focus:border-[#FFB81F] text-[#0B2B1E] dark:text-white placeholder:text-[#5C7A6E] transition min-h-[44px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5C7A6E] hover:text-[#0B2B1E] dark:hover:text-white cursor-pointer"
              >
                Effacer
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50/50 dark:hover:bg-[#10231B] transition shadow-xs shrink-0 min-h-[44px] cursor-pointer"
            title="Trier et filtrer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
            <span className="hidden sm:inline">{sortLabels[sortOption]}</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {quickFilterChips.map((chip) => {
            const isActive = activeQuickFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  setActiveQuickFilter(chip.id);
                  if (chip.id === 'pharmacie') {
                    setSelectedCategory('pharmacy');
                  } else if (chip.id === 'all') {
                    setSelectedCategory(null);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer min-h-[36px] ${
                  isActive
                    ? 'bg-[#0B7A4B] text-white shadow-xs border border-[#0B7A4B]'
                    : 'bg-white dark:bg-[#0C1913] text-[#2F4F42] dark:text-emerald-100 border border-[#D4E9DD] dark:border-[#1E3B2D] hover:border-[#0B7A4B]'
                }`}
              >
                {chip.icon && <span className="shrink-0">{chip.icon}</span>}
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tag Cloud of Popular Keywords */}
        {(activeTab === 'search' || searchQuery) && (
          <div className="space-y-2 pt-1 animate-in fade-in">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C7A6E] dark:text-emerald-300/70">
              Recherches populaires & Mots-clés
            </div>
            <div className="flex flex-wrap gap-1.5">
              {searchTagCloud.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    searchQuery.toLowerCase() === tag.toLowerCase()
                      ? 'bg-[#0B2B1E] text-white shadow-xs'
                      : 'bg-[#0B7A4B] text-white hover:bg-[#08613B]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 p-1 bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] rounded-xl mt-2">
              <button
                type="button"
                onClick={() => setSearchTab('food')}
                className={`flex-1 py-2.5 px-2 text-xs font-bold rounded-lg transition cursor-pointer min-h-[40px] ${
                  searchTab === 'food'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
                }`}
              >
                Plats & Articles ({matchingProducts.length})
              </button>
              <button
                type="button"
                onClick={() => setSearchTab('restaurants')}
                className={`flex-1 py-2.5 px-2 text-xs font-bold rounded-lg transition cursor-pointer min-h-[40px] ${
                  searchTab === 'restaurants'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
                }`}
              >
                Établissements ({filteredPartners.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stories Carousel */}
      {!searchQuery && activeTab !== 'favorites' && <StoriesRow />}

      {/* 3. PROMO BANNERS CAROUSEL */}
      {!searchQuery && activeTab !== 'favorites' && (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-white shadow-xs border border-[#E2ECE7] dark:border-[#1E3B2D]">
            <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[145px] transition-all duration-300">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D] font-mono">
                    {promoBanners[activePromoIndex].badge}
                  </span>
                  <span className="text-xs text-[#0B7A4B] dark:text-[#FFB81F] font-bold">
                    {promoBanners[activePromoIndex].tag}
                  </span>
                </div>
                <h3 className="font-heading font-black text-lg sm:text-xl text-[#0B2B1E] dark:text-white leading-tight">
                  {promoBanners[activePromoIndex].title}
                </h3>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80 mt-1 max-w-md">
                  {promoBanners[activePromoIndex].subtitle}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleCopyCode(promoBanners[activePromoIndex].code)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold transition shadow-xs cursor-pointer min-h-[40px]"
                  title="Copier le code promo"
                >
                  {copiedCode === promoBanners[activePromoIndex].code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Code copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white/90" />
                      <span>Code : {promoBanners[activePromoIndex].code}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  {promoBanners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePromoIndex(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activePromoIndex === i ? 'w-6 bg-[#0B7A4B] dark:bg-[#FFB81F]' : 'w-2 bg-[#D4E9DD] dark:bg-[#1E3B2D]'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRIMARY CATEGORIES GRID */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white">
            Catégories & Services
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-semibold text-[#0B7A4B] dark:text-[#FFB81F] hover:underline cursor-pointer"
            >
              Voir tout
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {categories.map((cat) => {
            const isParcels = cat.id === 'parcels';
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (isParcels) {
                    setIsParcelModalOpen(true);
                  } else {
                    setSelectedCategory(isSelected ? null : (cat.id as CategoryId));
                  }
                }}
                className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer min-h-[100px] ${
                  isSelected
                    ? 'border-[#0B7A4B] bg-[#0B7A4B] text-white shadow-sm'
                    : 'border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-emerald-50 hover:border-[#0B7A4B]'
                }`}
              >
                {cat.badge && (
                  <span
                    className={`absolute top-2 right-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                      isSelected
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] border-[#D4E9DD] dark:border-[#1E3B2D]'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition mb-1.5 border ${
                    isSelected
                      ? 'bg-white text-[#0B7A4B] border-white'
                      : 'bg-emerald-50/60 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] border-[#D4E9DD] dark:border-[#1E3B2D]'
                  }`}
                >
                  {cat.icon}
                </div>
                <span className="text-xs font-bold tracking-tight text-center truncate w-full">
                  {cat.label}
                </span>
                <span className="text-[10px] opacity-80 truncate w-full text-center">
                  {cat.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PHARMACIE 24/7 */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-[#D4E9DD] dark:border-[#1E3B2D]">
            <Cross className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                Pharmacie & Ordonnances Médicales 24/7
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50/80 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                Urgences Santé
              </span>
            </div>
            <p className="text-xs text-[#2F4F42] dark:text-emerald-200/75 mt-0.5">
              Envoyez la photo de votre ordonnance : un pharmacien agréé de Conakry prépare vos médicaments en priorité.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const pharmacyPartner = partners.find((p) => p.category === 'pharmacy') || partners[3];
            if (pharmacyPartner) {
              setSelectedPartnerId(pharmacyPartner.id);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs min-h-[44px]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Joindre une ordonnance</span>
        </button>
      </div>

      {/* 5. POPULAR DISHES & QUICK ADD */}
      {!searchQuery && activeTab !== 'favorites' && (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <span>Les Incontournables de Conakry</span>
              </h2>
              <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70">
                Les plats les plus commandés · Ajout rapide en 1 clic
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0B7A4B] dark:text-[#FFB81F]">
              Top 5 Bestsellers
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            {popularDishes.map(({ product, partner }) => {
              const isAdded = addedProductId === product.id;
              return (
                <div
                  key={product.id}
                  className="w-52 sm:w-56 shrink-0 p-3 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] flex flex-col justify-between shadow-xs hover:border-[#0B7A4B] transition group"
                >
                  <div>
                    <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2 bg-emerald-50/40 dark:bg-[#10231B]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#0B2B1E]/80 text-white backdrop-blur-xs truncate max-w-[150px]">
                        {partner.name}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-xs text-[#0B2B1E] dark:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="text-xs font-bold text-[#0B7A4B] dark:text-[#FFB81F] mt-1">
                      {formatGnf(product.priceGnf)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(product, partner)}
                    className={`mt-2.5 w-full py-2.5 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs min-h-[40px] ${
                      isAdded
                        ? 'bg-[#0B2B1E] text-white'
                        : 'bg-[#0B7A4B] hover:bg-[#08613B] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Ajouté !</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter au panier</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. LIVRAISON EXPRESS (< 30 MIN) */}
      {!searchQuery && activeTab !== 'favorites' && expressPartners.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span>Livraison Express en Moins de 30 Min</span>
            </h2>
            <span className="text-xs text-[#5C7A6E] dark:text-emerald-200/70 font-medium">
              {expressPartners.length} adresses rapides
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {expressPartners.map((partner) => (
              <div
                key={partner.id}
                onClick={() => setSelectedPartnerId(partner.id)}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between gap-3 hover:border-[#0B7A4B] transition cursor-pointer shadow-xs group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={partner.logoImage}
                    alt={partner.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E2ECE7] dark:border-[#1E3B2D] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0B2B1E] dark:text-white truncate">
                        {partner.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70 truncate">
                      {partner.categoryLabel} · {partner.quartierName} ({partner.distanceKm} km)
                    </div>
                    <div className="text-[11px] font-semibold text-[#0B7A4B] dark:text-emerald-300">
                      Livraison {formatGnf(partner.deliveryFeeGnf)}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50/70 dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-100 font-bold text-xs border border-[#D4E9DD] dark:border-[#1E3B2D]">
                    <Clock className="w-3 h-3 text-[#0B7A4B] dark:text-[#FFB81F]" />
                    <span>{partner.deliveryTimeMin} min</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK REORDER */}
      {orders.length > 0 && !searchQuery && activeTab !== 'favorites' && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center shrink-0 border border-[#D4E9DD] dark:border-[#1E3B2D]">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0B2B1E] dark:text-white truncate">
                Commander à nouveau chez {orders[0].partnerName}
              </div>
              <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70 truncate">
                {orders[0].items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => reorder(orders[0])}
            className="px-4 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-semibold shrink-0 transition shadow-xs cursor-pointer min-h-[40px]"
          >
            Recommander
          </button>
        </div>
      )}

      {/* Category Circular Avatar Bubbles */}
      {!searchQuery && activeTab !== 'favorites' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white">
                Univers & Catégories
              </h2>
              <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70">
                Explorer par type d'établissement
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-semibold text-[#0B7A4B] dark:text-[#FFB81F] underline cursor-pointer"
              >
                Tout voir
              </button>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {categoryBubbles.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 border-2 transition-all ${
                      isSelected
                        ? 'border-[#0B7A4B] ring-2 ring-[#0B7A4B]/20 scale-105 shadow-sm'
                        : 'border-[#D4E9DD] dark:border-[#1E3B2D] group-hover:border-[#0B7A4B]'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="font-heading font-bold text-xs text-[#0B2B1E] dark:text-white group-hover:text-[#0B7A4B] transition">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70 font-medium -mt-1">
                    {cat.placesCount} adresses
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. ALL PARTNERS OR FOOD ITEMS */}
      {(activeTab === 'search' || searchQuery) && searchTab === 'food' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white">
                Plats & Articles trouvés
              </h2>
              <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70">
                {matchingProducts.length} articles disponibles à la commande
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {matchingProducts.map(({ product, partner }) => {
              const isFav = favorites.includes(product.id);
              const isAdded = addedProductId === product.id;
              return (
                <div
                  key={`${partner.id}_${product.id}`}
                  className="group relative rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] overflow-hidden hover:border-[#0B7A4B] hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-emerald-50/40 dark:bg-[#10231B] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    <button
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/60 transition cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'fill-rose-500 text-rose-500' : 'text-white'
                        }`}
                      />
                    </button>

                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B2B1E]/80 backdrop-blur-md text-white text-[11px] font-semibold">
                      <span>{partner.name}</span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                    <div>
                      <h3 className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/75 line-clamp-2 mt-0.5">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D]">
                      <div>
                        <div className="font-heading font-black text-sm text-[#0B7A4B] dark:text-[#FFB81F]">
                          {formatGnf(product.priceGnf)}
                        </div>
                        <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">
                          Livraison ~{partner.deliveryTimeMin} min
                        </div>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(product, partner)}
                        className={`px-3.5 py-2 rounded-xl font-heading font-bold text-xs flex items-center gap-1.5 transition cursor-pointer min-h-[38px] ${
                          isAdded
                            ? 'bg-[#0B2B1E] text-white'
                            : 'bg-[#0B7A4B] hover:bg-[#08613B] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ajouté</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ajouter</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div id="partners-catalog" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white">
                {activeTab === 'favorites'
                  ? 'Mes Favoris'
                  : 'Tous les Établissements Partenaires'}
              </h2>
              <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70">
                {sortLabels[sortOption]} · Position {location.quartier.name}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#5C7A6E] dark:text-emerald-200/70">
              {filteredPartners.length} adresses
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredPartners.map((partner) => {
              const isFav = favorites.includes(partner.id);
              return (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className="group relative rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] overflow-hidden hover:border-[#0B7A4B] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-emerald-50/40 dark:bg-[#10231B] overflow-hidden">
                    <img
                      src={partner.coverImage}
                      alt={partner.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl overflow-hidden border border-white/80 shadow-sm bg-white">
                      <img
                        src={partner.logoImage}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(partner.id);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/60 transition cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'fill-rose-500 text-rose-500' : 'text-white'
                        }`}
                      />
                    </button>

                    {partner.bannerOffer && (
                      <div className="absolute top-14 left-3 px-2 py-0.5 rounded bg-[#0B7A4B] text-white text-[10px] font-semibold">
                        Offre en cours
                      </div>
                    )}

                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B2B1E]/80 backdrop-blur-md text-white text-[11px] font-semibold">
                      <MapPin className="w-3 h-3 text-[#FFB81F]" />
                      <span>
                        {partner.distanceKm} km · {partner.quartierName}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0B2B1E]/80 backdrop-blur-md text-white text-[11px] font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#FFB81F]" />
                      <span>~{partner.deliveryTimeMin} min</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold text-[#5C7A6E] dark:text-emerald-300/70 uppercase tracking-wider">
                          {partner.categoryLabel}
                        </span>
                        <h3 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white truncate transition">
                          {partner.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 bg-emerald-50/70 dark:bg-[#10231B] px-2 py-0.5 rounded-lg text-[#0B2B1E] dark:text-emerald-100 font-semibold text-xs border border-[#D4E9DD] dark:border-[#1E3B2D]">
                        <Star className="w-3 h-3 fill-[#FFB81F] text-[#FFB81F]" />
                        <span>{partner.rating}</span>
                        <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">
                          ({partner.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[11px] text-[#5C7A6E] dark:text-emerald-200/70">
                      {partner.tags.slice(0, 3).map((tag, i) => (
                        <span key={tag}>
                          {tag}
                          {i < 2 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1 text-[#5C7A6E] dark:text-emerald-200/70 text-[11px]">
                        <span>Livraison GPS :</span>
                        <span className="font-bold text-[#0B2B1E] dark:text-white">
                          {formatGnf(partner.deliveryFeeGnf)}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#0B7A4B] dark:text-[#FFB81F] flex items-center gap-0.5 group-hover:translate-x-1 transition shrink-0">
                        Menu <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPartners.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/70">
                Aucun établissement ne correspond à votre filtre actuel.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setActiveQuickFilter('all');
                }}
                className="text-xs font-semibold text-[#0B7A4B] dark:text-[#FFB81F] underline cursor-pointer"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          )}
        </div>
      )}

      {/* 8. WHY SONEYA */}
      {!searchQuery && activeTab !== 'favorites' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2ECE7] dark:border-[#1E3B2D] pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D] mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Plateforme Intégrée de Guinée</span>
              </div>
              <h3 className="font-heading font-black text-base sm:text-lg text-[#0B2B1E] dark:text-white">
                Pourquoi choisir Soneya Delivery ?
              </h3>
            </div>
            <span className="text-xs text-[#5C7A6E] dark:text-emerald-200/70 font-medium">
              Développé par Guinée Hub Technologie
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1">
              <div className="font-bold text-[#0B2B1E] dark:text-white flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <span>1. Calcul GPS Kilométrique Exact</span>
              </div>
              <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/80 leading-relaxed">
                5 000 GNF de base + 3 500 GNF/km réel. Prix transparent et calculé automatiquement sans négociation téléphonique.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1">
              <div className="font-bold text-[#0B2B1E] dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <span>2. Code Secret 4 Chiffres</span>
              </div>
              <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/80 leading-relaxed">
                Le livreur ne peut clôturer la course sans votre code secret client. Zéro contestation, sécurité maximale.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1">
              <div className="font-bold text-[#0B2B1E] dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <span>3. 100% Mobile Money Sans Espèces</span>
              </div>
              <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/80 leading-relaxed">
                Orange Money et MTN MoMo sécurisés. Reçus fiscaux numériques et sécurité totale pour les coursiers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1">
              <div className="font-bold text-[#0B2B1E] dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <span>4. Motards Certifiés KYC & Charte</span>
              </div>
              <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/80 leading-relaxed">
                CNI, carte grise, selfie guidé et charte de sécurité signée avant toute attribution de course.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      {!searchQuery && activeTab !== 'favorites' && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white">
                Avis et Témoignages Conakry
              </h2>
              <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/70">
                Avis certifiés de résidents et professionnels à Conakry
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0B2B1E] dark:text-emerald-100 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#FFB81F] text-[#FFB81F]" />
              <span>4.9/5 sur +1 200 avis</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                name: 'Mariama C.',
                area: 'Quartier Kipé',
                text: '« Mes commandes arrivent bien chaudes même aux heures de pointe. Le livreur connaissait parfaitement mon repère près de la mosquée. »',
              },
              {
                name: 'Mohamed S.',
                area: 'Kaloum (Almamya)',
                text: '« Indispensable pour nos déjeuners d’équipe au bureau. Le paiement Orange Money est instantané et les reçus fiscaux sont parfaits. »',
              },
              {
                name: 'Dr. Ibrahima D.',
                area: 'Lambanyi',
                text: '« Pouvoir se faire livrer des médicaments urgents de la pharmacie de nuit en moins de 25 minutes est une avancée majeure pour la ville. »',
              },
            ].map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-heading font-bold text-xs text-[#0B2B1E] dark:text-white">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-0.5 text-[#FFB81F]">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-[#FFB81F] text-[#FFB81F]" />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70">{item.area}</div>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-100/80 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER OFFICIEL GUINÉE HUB TECHNOLOGIE */}
      {!searchQuery && activeTab !== 'favorites' && (
        <footer className="mt-8 pt-6 border-t border-[#E2ECE7] dark:border-[#1E3B2D] space-y-4 text-xs text-[#2F4F42] dark:text-emerald-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
                  alt="Guinée Hub Technologie Logo"
                  className="w-10 h-10 object-contain rounded-xl bg-white border border-[#D4E9DD] dark:border-[#1E3B2D] p-1 shrink-0"
                />
                <div>
                  <span className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                    Soneya Delivery Conakry
                  </span>
                  <div className="text-xs text-[#5C7A6E] dark:text-emerald-200/70">
                    « Conakry commande · Soneya livre »
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/70 max-w-md leading-relaxed">
                Développé par{' '}
                <strong className="text-[#0B2B1E] dark:text-white">
                  Guinée Hub Technologie (GHT)
                </strong>
                , entreprise immatriculée en juillet 2026 et fondée par{' '}
                <strong className="text-[#0B2B1E] dark:text-white">René Kaba Tolno</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-emerald-100 hover:border-[#0B7A4B] transition font-medium border border-[#D4E9DD] dark:border-[#1E3B2D] cursor-pointer min-h-[40px]"
              >
                Politique de Confidentialité
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white transition font-medium shadow-xs cursor-pointer min-h-[40px]"
              >
                Rejoindre comme Partenaire
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] text-[11px] leading-relaxed space-y-1">
            <div className="font-semibold text-[#0B2B1E] dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span>Conformité Réglementaire République de Guinée</span>
            </div>
            <p className="text-[#2F4F42] dark:text-emerald-200/75">
              Conforme à la Loi L/2016/037/AN sur la protection des données personnelles et aux directives des télécommunications ARPT. Paiements sécurisés via protocoles bancaires et mobiles Orange Money & MTN MoMo.
            </p>
          </div>

          <div className="text-[11px] text-center text-[#5C7A6E] dark:text-emerald-200/70 pt-2 pb-6">
            © {new Date().getFullYear()} Soneya Delivery · Développé par Guinée Hub Technologie · Tous droits réservés.
          </div>
        </footer>
      )}

      {/* Modals */}
      <FilterSheet />
      <NeighborhoodModal
        isOpen={isNeighborhoodOpen}
        onClose={() => setIsNeighborhoodOpen(false)}
      />
      <ExpressParcelModal
        isOpen={isParcelModalOpen}
        onClose={() => setIsParcelModalOpen(false)}
      />
    </div>
  );
};
