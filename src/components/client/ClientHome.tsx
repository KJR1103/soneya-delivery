import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryId, Partner, Product } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { calculateDistanceKm, calculateDeliveryFeeGnf } from '../../utils/geo';
import { StoriesRow } from './StoriesRow';
import { FilterSheet } from './FilterSheet';
import { NeighborhoodModal } from './NeighborhoodModal';
import { ExpressParcelModal } from './ExpressParcelModal';

const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = 'text-title-md' }) => (
  <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
    {name}
  </span>
);

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
    icon: string;
    count: number;
    badge?: string;
  }[] = [
    {
      id: 'restaurants',
      label: 'Repas',
      sublabel: 'Burger & Plats chauds',
      icon: 'restaurant',
      count: partners.filter((p) => p.category === 'restaurants').length,
    },
    {
      id: 'pharmacy',
      label: 'Santé',
      sublabel: 'Urgences 24/7',
      icon: 'local_pharmacy',
      count: partners.filter((p) => p.category === 'pharmacy').length,
      badge: '24/7',
    },
    {
      id: 'groceries',
      label: 'Courses',
      sublabel: 'Supermarché & frais',
      icon: 'shopping_cart',
      count: partners.filter((p) => p.category === 'groceries').length,
    },
    {
      id: 'parcels',
      label: 'Colis',
      sublabel: 'Moto immédiate',
      icon: 'package_2',
      count: 10,
      badge: 'Nouveau',
    },
  ];

  const quickFilterChips = [
    { id: 'all', label: 'Tous', icon: 'layers' },
    { id: 'express', label: 'Express < 30 min', icon: 'bolt' },
    { id: 'promo', label: 'Promos du jour', icon: 'local_offer' },
    { id: 'maffe', label: 'Riz & Maffé', icon: 'restaurant' },
    { id: 'chawarma', label: 'Chawarma & Grillades', icon: 'local_fire_department' },
    { id: 'boissons', label: 'Jus & Boissons', icon: 'coffee' },
    { id: 'pharmacie', label: 'Pharmacie 24/7', icon: 'local_pharmacy' },
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
    <div className="relative w-full">
      {/* ===== EDITORIAL HERO ===== */}
      <section className="relative w-full h-[clamp(280px,42vh,380px)] overflow-hidden">
        <img
          src={partners[0]?.coverImage}
          alt="Conakry livraison"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-[#08120D]/95 dark:to-dark-surface/95" />

        <div className="relative h-full max-w-5xl mx-auto px-gutter-lg lg:px-gutter-xl flex flex-col justify-between py-gutter-lg pb-section">
          <div className="flex items-center justify-between gap-gutter-md">
            <button
              onClick={() => setIsNeighborhoodOpen(true)}
              className="inline-flex items-center gap-gutter-sm rounded-full bg-black/35 dark:bg-black/40 backdrop-blur-md px-gutter-md py-gutter-sm text-light-surface-container-low dark:text-dark-on-surface transition cursor-pointer hover:bg-black/50"
            >
              <Icon name="location_on" className="text-title-md text-accent" />
              <span className="font-label font-label-md text-light-surface-container-low dark:text-dark-on-surface truncate max-w-[180px]">
                {location.isGPS ? 'Position GPS Conakry' : location.quartier.name}
              </span>
              <Icon name="arrow_forward" className="text-label-md text-light-surface-container-low/80" />
            </button>

            <div className="inline-flex items-center gap-gutter-xs rounded-full bg-light-primary dark:bg-dark-primary px-gutter-md py-gutter-sm">
              <Icon name="two_wheeler" className="text-title-md text-light-surface-container-low dark:text-dark-surface" />
              <span className="font-label font-label-sm text-light-surface-container-low dark:text-dark-surface">
                ~25-35 min
              </span>
            </div>
          </div>

          <div className="space-y-gutter-md">
            <span className="inline-flex items-center gap-gutter-xs rounded-full bg-accent/15 border border-accent/40 px-gutter-md py-gutter-xs">
              <Icon name="local_offer" className="text-label-md text-accent" />
              <span className="font-label font-label-sm uppercase tracking-wider text-accent">
                {promoBanners[activePromoIndex].badge}
              </span>
            </span>
            <h1 className="font-display text-display-md-mobile lg:text-display-lg text-light-surface-container-low dark:text-dark-on-surface leading-[1.05] max-w-2xl">
              Conakry commande,
              <br />
              <span className="text-accent">Soneya</span> livre.
            </h1>
            <p className="font-body font-body-md text-light-surface-container-low/85 dark:text-dark-on-surface/80 max-w-lg">
              Repas, courses, santé et colis — livrés à moto partout dans la ville.
            </p>
          </div>
        </div>
      </section>

      {/* ===== OVERLAPPING CONTENT SHEET ===== */}
      <div className="relative -mt-section rounded-t-xl bg-light-surface dark:bg-dark-surface px-gutter-lg lg:px-gutter-xl pt-gutter-xl pb-32 space-y-gutter-xl max-w-5xl mx-auto">
        {/* Active order banner */}
        {activeOrder && activeOrder.status !== 'delivered' && (
          <div className="rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline p-gutter-md flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
            <div className="flex items-center gap-gutter-md min-w-0">
              <div className="w-10 h-10 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary flex items-center justify-center shrink-0">
                <Icon name="two_wheeler" className="text-title-md" />
              </div>
              <div className="min-w-0">
                <div className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface truncate">
                  Commande en cours chez {activeOrder.partnerName}
                </div>
                <div className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Code secret :{' '}
                  <strong className="text-light-primary dark:text-dark-primary font-mono font-mono-md">
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
              className="rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface font-label font-label-md px-gutter-lg py-gutter-sm shrink-0 transition cursor-pointer"
            >
              Suivre en direct
            </button>
          </div>
        )}

        {/* ===== SEARCH BAR ===== */}
        <div className="space-y-gutter-sm">
          <div className="flex items-center gap-gutter-sm">
            <div className="relative flex-1 min-w-0">
              <span className="material-symbols-outlined absolute left-gutter-md top-1/2 -translate-y-1/2 text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant" aria-hidden="true">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher un plat, restaurant, pharmacie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-[44px] pr-gutter-lg py-gutter-md rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline font-body font-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant dark:placeholder:text-dark-on-surface-variant focus:outline-none focus:border-light-primary dark:focus:border-dark-primary transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-gutter-md top-1/2 -translate-y-1/2 font-label font-label-sm text-light-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>

            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-gutter-sm px-gutter-md py-gutter-md rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:border-light-primary dark:hover:border-dark-primary transition shrink-0 cursor-pointer"
              title="Trier et filtrer"
            >
              <Icon name="tune" className="text-title-md text-light-primary dark:text-dark-primary" />
              <span className="hidden sm:inline font-label font-label-md">{sortLabels[sortOption]}</span>
            </button>
          </div>

          {/* Quick filter chips */}
          <div className="flex items-center gap-gutter-sm overflow-x-auto no-scrollbar py-gutter-xs">
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
                  className={`flex items-center gap-gutter-xs px-gutter-md py-gutter-sm rounded-full font-label font-label-md whitespace-nowrap transition shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-light-primary text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface border border-light-primary dark:border-dark-primary'
                      : 'bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface-variant dark:text-dark-on-surface-variant border border-light-outline dark:border-dark-outline hover:border-light-primary dark:hover:border-dark-primary'
                  }`}
                >
                  <Icon name={chip.icon} className="text-label-md" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tag cloud + search tabs */}
          {(activeTab === 'search' || searchQuery) && (
            <div className="space-y-gutter-sm pt-gutter-xs">
              <div className="font-label font-label-sm uppercase tracking-wider text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Recherches populaires & Mots-clés
              </div>
              <div className="flex flex-wrap gap-gutter-sm">
                {searchTagCloud.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className={`px-gutter-md py-gutter-xs rounded-full font-label font-label-sm transition cursor-pointer ${
                      searchQuery.toLowerCase() === tag.toLowerCase()
                        ? 'bg-light-on-surface text-light-surface dark:bg-dark-on-surface dark:text-dark-surface'
                        : 'bg-light-primary text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface hover:opacity-90'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-gutter-sm p-gutter-xs bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline rounded-md">
                <button
                  type="button"
                  onClick={() => setSearchTab('food')}
                  className={`flex-1 py-gutter-md px-gutter-sm font-label font-label-md rounded-sm transition cursor-pointer ${
                    searchTab === 'food'
                      ? 'bg-light-primary text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface'
                      : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
                  }`}
                >
                  Plats & Articles ({matchingProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab('restaurants')}
                  className={`flex-1 py-gutter-md px-gutter-sm font-label font-label-md rounded-sm transition cursor-pointer ${
                    searchTab === 'restaurants'
                      ? 'bg-light-primary text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface'
                      : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
                  }`}
                >
                  Établissements ({filteredPartners.length})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== CIRCULAR CATEGORY GRID ===== */}
        <div className="space-y-gutter-md">
          <div className="grid grid-cols-4 gap-gutter-md">
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
                  className="flex flex-col items-center gap-gutter-sm group cursor-pointer"
                >
                  <div
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition border-2 ${
                      isSelected
                        ? 'bg-light-primary border-light-primary text-light-on-primary dark:bg-dark-primary dark:border-dark-primary dark:text-dark-on-surface'
                        : 'bg-light-primary-container border-light-outline text-light-primary dark:bg-dark-primary-container dark:border-dark-outline dark:text-dark-primary group-hover:border-light-primary dark:group-hover:border-dark-primary'
                    }`}
                  >
                    <Icon name={cat.icon} className="text-title-lg" />
                    {cat.badge && (
                      <span className="absolute -top-1 -right-1 text-[9px] font-label-sm font-bold uppercase px-gutter-xs py-[2px] rounded-full bg-accent text-light-on-surface border border-light-surface-container-low dark:border-dark-surface-container-low">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-label font-label-sm text-light-on-surface dark:text-dark-on-surface text-center leading-tight">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stories Carousel */}
        {!searchQuery && activeTab !== 'favorites' && <StoriesRow />}

        {/* ===== PROMO BANNER CAROUSEL ===== */}
        {!searchQuery && activeTab !== 'favorites' && (
          <div className="rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline overflow-hidden">
            <div className="p-gutter-lg flex flex-col justify-between min-h-[145px]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-gutter-sm mb-gutter-sm">
                  <span className="font-mono font-mono-sm uppercase px-gutter-sm py-gutter-xs rounded-sm bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary border border-light-outline dark:border-dark-outline">
                    {promoBanners[activePromoIndex].badge}
                  </span>
                  <span className="font-label font-label-md text-light-primary dark:text-dark-primary font-bold">
                    {promoBanners[activePromoIndex].tag}
                  </span>
                </div>
                <h3 className="font-title font-title-lg text-light-on-surface dark:text-dark-on-surface leading-tight">
                  {promoBanners[activePromoIndex].title}
                </h3>
                <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-gutter-xs max-w-md">
                  {promoBanners[activePromoIndex].subtitle}
                </p>
              </div>

              <div className="mt-gutter-lg flex flex-wrap items-center justify-between gap-gutter-md">
                <button
                  onClick={() => handleCopyCode(promoBanners[activePromoIndex].code)}
                  className="flex items-center gap-gutter-sm px-gutter-lg py-gutter-sm rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface font-label font-label-md transition cursor-pointer"
                  title="Copier le code promo"
                >
                  {copiedCode === promoBanners[activePromoIndex].code ? (
                    <>
                      <Icon name="check" className="text-label-md" />
                      <span>Code copié !</span>
                    </>
                  ) : (
                    <>
                      <Icon name="content_copy" className="text-label-md" />
                      <span>Code : {promoBanners[activePromoIndex].code}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-gutter-xs">
                  {promoBanners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePromoIndex(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activePromoIndex === i
                          ? 'w-6 bg-light-primary dark:bg-dark-primary'
                          : 'w-2 bg-light-outline dark:bg-dark-outline'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== PHARMACIE 24/7 ===== */}
        <div className="rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline p-gutter-md flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
          <div className="flex items-start sm:items-center gap-gutter-md min-w-0">
            <div className="w-11 h-11 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary flex items-center justify-center shrink-0">
              <Icon name="local_pharmacy" className="text-title-lg" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-gutter-sm">
                <span className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface">
                  Pharmacie & Ordonnances 24/7
                </span>
                <span className="font-label font-label-sm px-gutter-sm py-gutter-xs rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary border border-light-outline dark:border-dark-outline">
                  Urgences Santé
                </span>
              </div>
              <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-gutter-xs">
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
            className="rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface font-label font-label-md px-gutter-lg py-gutter-sm flex items-center justify-center gap-gutter-sm shrink-0 cursor-pointer transition"
          >
            <Icon name="cloud_upload" className="text-title-md" />
            <span>Joindre une ordonnance</span>
          </button>
        </div>

        {/* ===== POPULAR DISHES ===== */}
        {!searchQuery && activeTab !== 'favorites' && (
          <div className="space-y-gutter-md">
            <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <div>
                <h2 className="font-title font-title-lg text-light-on-surface dark:text-dark-on-surface flex items-center gap-gutter-sm">
                  <Icon name="local_fire_department" className="text-title-md text-light-primary dark:text-dark-primary" />
                  <span>Les Incontournables de Conakry</span>
                </h2>
                <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Les plats les plus commandés · Ajout rapide en 1 clic
                </p>
              </div>
              <span className="font-label font-label-md text-light-primary dark:text-dark-primary">
                Top 5 Bestsellers
              </span>
            </div>

            <div className="flex gap-gutter-md overflow-x-auto no-scrollbar py-gutter-xs">
              {popularDishes.map(({ product, partner }) => {
                const isAdded = addedProductId === product.id;
                return (
                  <div
                    key={product.id}
                    className="w-52 sm:w-56 shrink-0 p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex flex-col justify-between hover:border-light-primary dark:hover:border-dark-primary transition group"
                  >
                    <div>
                      <div className="relative h-28 w-full rounded-md overflow-hidden mb-gutter-sm bg-light-primary-container/40 dark:bg-dark-primary-container/40">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-surface-enter"
                        />
                        <span className="absolute bottom-gutter-xs left-gutter-xs font-label font-label-sm px-gutter-xs py-gutter-xs rounded-sm bg-light-on-surface/80 text-light-surface backdrop-blur-xs truncate max-w-[150px]">
                          {partner.name}
                        </span>
                      </div>
                      <h3 className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="font-mono font-mono-md text-light-primary dark:text-dark-primary mt-gutter-xs">
                        {formatGnf(product.priceGnf)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product, partner)}
                      className={`mt-gutter-sm w-full py-gutter-sm rounded-md font-label font-label-md flex items-center justify-center gap-gutter-xs transition cursor-pointer ${
                        isAdded
                          ? 'bg-light-on-surface text-light-surface dark:bg-dark-on-surface dark:text-dark-surface'
                          : 'bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Icon name="check" className="text-label-md" />
                          <span>Ajouté !</span>
                        </>
                      ) : (
                        <>
                          <Icon name="add" className="text-label-md" />
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

        {/* ===== LIVRAISON EXPRESS ===== */}
        {!searchQuery && activeTab !== 'favorites' && expressPartners.length > 0 && (
          <div className="space-y-gutter-md">
            <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <h2 className="font-title font-title-lg text-light-on-surface dark:text-dark-on-surface flex items-center gap-gutter-sm">
                <Icon name="bolt" className="text-title-md text-light-primary dark:text-dark-primary" />
                <span>Livraison Express en Moins de 30 Min</span>
              </h2>
              <span className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                {expressPartners.length} adresses rapides
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-md">
              {expressPartners.map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-md hover:border-light-primary dark:hover:border-dark-primary transition cursor-pointer group"
                >
                  <div className="flex items-center gap-gutter-md min-w-0">
                    <img
                      src={partner.logoImage}
                      alt={partner.name}
                      className="w-12 h-12 rounded-md object-cover border border-light-outline dark:border-dark-outline shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface truncate">
                        {partner.name}
                      </div>
                      <div className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant truncate">
                        {partner.categoryLabel} · {partner.quartierName} ({partner.distanceKm} km)
                      </div>
                      <div className="font-mono font-mono-sm text-light-primary dark:text-dark-primary">
                        Livraison {formatGnf(partner.deliveryFeeGnf)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-on-surface dark:text-dark-on-surface font-label font-label-md border border-light-outline dark:border-dark-outline">
                      <Icon name="schedule" className="text-label-md text-light-primary dark:text-dark-primary" />
                      <span>{partner.deliveryTimeMin} min</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== QUICK REORDER ===== */}
        {orders.length > 0 && !searchQuery && activeTab !== 'favorites' && (
          <div className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
            <div className="flex items-center gap-gutter-md min-w-0">
              <div className="w-9 h-9 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary flex items-center justify-center shrink-0">
                <Icon name="restart_alt" className="text-title-md" />
              </div>
              <div className="min-w-0">
                <div className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface truncate">
                  Commander à nouveau chez {orders[0].partnerName}
                </div>
                <div className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant truncate">
                  {orders[0].items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                </div>
              </div>
            </div>
            <button
              onClick={() => reorder(orders[0])}
              className="px-gutter-lg py-gutter-sm rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface font-label font-label-md shrink-0 transition cursor-pointer"
            >
              Recommander
            </button>
          </div>
        )}

        {/* ===== CATEGORY BUBBLES ===== */}
        {!searchQuery && activeTab !== 'favorites' && (
          <div className="space-y-gutter-md pt-gutter-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-title font-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Univers & Catégories
                </h2>
                <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Explorer par type d'établissement
                </p>
              </div>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="font-label font-label-md text-light-primary dark:text-dark-primary underline cursor-pointer"
                >
                  Tout voir
                </button>
              )}
            </div>

            <div className="flex gap-gutter-lg overflow-x-auto no-scrollbar py-gutter-xs">
              {categoryBubbles.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                    className="flex flex-col items-center gap-gutter-sm shrink-0 group cursor-pointer"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 border-2 transition ${
                        isSelected
                          ? 'border-light-primary dark:border-dark-primary ring-2 ring-light-primary/20 dark:ring-dark-primary/20 scale-105'
                          : 'border-light-outline dark:border-dark-outline group-hover:border-light-primary dark:group-hover:border-dark-primary'
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="font-label font-label-md text-light-on-surface dark:text-dark-on-surface group-hover:text-light-primary dark:group-hover:text-dark-primary transition">
                      {cat.label}
                    </span>
                    <span className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant -mt-1">
                      {cat.placesCount} adresses
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== PARTNERS / FOOD ITEMS ===== */}
        {(activeTab === 'search' || searchQuery) && searchTab === 'food' ? (
          <div className="space-y-gutter-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-title font-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Plats & Articles trouvés
                </h2>
                <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  {matchingProducts.length} articles disponibles à la commande
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-md sm:gap-gutter-lg">
              {matchingProducts.map(({ product, partner }) => {
                const isFav = favorites.includes(product.id);
                const isAdded = addedProductId === product.id;
                return (
                  <div
                    key={`${partner.id}_${product.id}`}
                    className="group relative rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline overflow-hidden hover:border-light-primary dark:hover:border-dark-primary transition flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full bg-light-primary-container/40 dark:bg-dark-primary-container/40 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-surface-enter"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      <button
                        type="button"
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-gutter-md right-gutter-md w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-light-surface-container-low hover:bg-black/60 transition cursor-pointer"
                      >
                        <Icon
                          name="favorite"
                          className={`text-title-md ${isFav ? 'text-accent' : 'text-light-surface-container-low'}`}
                        />
                      </button>

                      <div className="absolute bottom-gutter-sm left-gutter-sm flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-full bg-light-on-surface/80 backdrop-blur-md text-light-surface font-label font-label-sm">
                        <span>{partner.name}</span>
                      </div>
                    </div>

                    <div className="p-gutter-md flex flex-col justify-between flex-1 space-y-gutter-sm">
                      <div>
                        <h3 className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface">
                          {product.name}
                        </h3>
                        <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant line-clamp-2 mt-gutter-xs">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
                        <div>
                          <div className="font-mono font-mono-md text-light-primary dark:text-dark-primary">
                            {formatGnf(product.priceGnf)}
                          </div>
                          <div className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            Livraison ~{partner.deliveryTimeMin} min
                          </div>
                        </div>

                        <button
                          onClick={() => handleQuickAdd(product, partner)}
                          className={`px-gutter-md py-gutter-sm rounded-md font-label font-label-md flex items-center gap-gutter-xs transition cursor-pointer ${
                            isAdded
                              ? 'bg-light-on-surface text-light-surface dark:bg-dark-on-surface dark:text-dark-surface'
                              : 'bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Icon name="check" className="text-label-md" />
                              <span>Ajouté</span>
                            </>
                          ) : (
                            <>
                              <Icon name="add" className="text-label-md" />
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
          <div id="partners-catalog" className="space-y-gutter-md">
            <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <div>
                <h2 className="font-title font-title-lg text-light-on-surface dark:text-dark-on-surface">
                  {activeTab === 'favorites'
                    ? 'Mes Favoris'
                    : 'Tous les Établissements Partenaires'}
                </h2>
                <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  {sortLabels[sortOption]} · Position {location.quartier.name}
                </p>
              </div>
              <span className="font-label font-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                {filteredPartners.length} adresses
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-md sm:gap-gutter-lg">
              {filteredPartners.map((partner) => {
                const isFav = favorites.includes(partner.id);
                return (
                  <div
                    key={partner.id}
                    onClick={() => setSelectedPartnerId(partner.id)}
                    className="group relative rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline overflow-hidden hover:border-light-primary dark:hover:border-dark-primary transition cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full bg-light-primary-container/40 dark:bg-dark-primary-container/40 overflow-hidden">
                      <img
                        src={partner.coverImage}
                        alt={partner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-surface-enter"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                      <div className="absolute top-gutter-md left-gutter-md w-10 h-10 rounded-md overflow-hidden border border-light-surface-container-low/80 bg-light-surface-container-low">
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
                        className="absolute top-gutter-md right-gutter-md w-9 h-9 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-light-surface-container-low hover:bg-black/60 transition cursor-pointer"
                      >
                        <Icon
                          name="favorite"
                          className={`text-title-md ${isFav ? 'text-accent' : 'text-light-surface-container-low'}`}
                        />
                      </button>

                      {partner.bannerOffer && (
                        <div className="absolute top-14 left-gutter-md px-gutter-sm py-gutter-xs rounded-sm bg-light-primary text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface font-label font-label-sm">
                          Offre en cours
                        </div>
                      )}

                      <div className="absolute bottom-gutter-sm left-gutter-sm flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-full bg-light-on-surface/80 backdrop-blur-md text-light-surface font-label font-label-sm">
                        <Icon name="location_on" className="text-label-md text-accent" />
                        <span>
                          {partner.distanceKm} km · {partner.quartierName}
                        </span>
                      </div>

                      <div className="absolute bottom-gutter-sm right-gutter-sm flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-full bg-light-on-surface/80 backdrop-blur-md text-light-surface font-label font-label-sm">
                        <Icon name="schedule" className="text-label-md text-accent" />
                        <span>~{partner.deliveryTimeMin} min</span>
                      </div>
                    </div>

                    <div className="p-gutter-lg space-y-gutter-sm">
                      <div className="flex items-start justify-between gap-gutter-sm">
                        <div className="min-w-0">
                          <span className="font-label font-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant uppercase tracking-wider">
                            {partner.categoryLabel}
                          </span>
                          <h3 className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface truncate">
                            {partner.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-gutter-xs shrink-0 bg-light-primary-container dark:bg-dark-primary-container px-gutter-sm py-gutter-xs rounded-md text-light-on-surface dark:text-dark-on-surface font-label font-label-md border border-light-outline dark:border-dark-outline">
                          <Icon name="star" className="text-label-md text-accent" />
                          <span>{partner.rating}</span>
                          <span className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            ({partner.reviewsCount})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-gutter-xs font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        {partner.tags.slice(0, 3).map((tag, i) => (
                          <span key={tag}>
                            {tag}
                            {i < 2 ? ' · ' : ''}
                          </span>
                        ))}
                      </div>

                      <div className="pt-gutter-sm border-t border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-sm">
                        <div className="flex items-center gap-gutter-xs font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          <span>Livraison GPS :</span>
                          <span className="font-mono font-mono-sm text-light-on-surface dark:text-dark-on-surface font-bold">
                            {formatGnf(partner.deliveryFeeGnf)}
                          </span>
                        </div>
                        <span className="font-label font-label-md text-light-primary dark:text-dark-primary flex items-center gap-gutter-xs group-hover:translate-x-1 transition shrink-0">
                          Menu <Icon name="arrow_forward" className="text-label-md" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPartners.length === 0 && (
              <div className="py-12 text-center space-y-gutter-md">
                <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Aucun établissement ne correspond à votre filtre actuel.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setActiveQuickFilter('all');
                  }}
                  className="font-label font-label-md text-light-primary dark:text-dark-primary underline cursor-pointer"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== WHY SONEYA ===== */}
        {!searchQuery && activeTab !== 'favorites' && (
          <div className="p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline space-y-gutter-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-sm border-b border-light-outline dark:border-dark-outline pb-gutter-md">
              <div>
                <div className="inline-flex items-center gap-gutter-xs px-gutter-sm py-gutter-xs rounded-sm font-label font-label-sm bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary border border-light-outline dark:border-dark-outline mb-gutter-xs">
                  <Icon name="shield" className="text-label-md" />
                  <span>Plateforme Intégrée de Guinée</span>
                </div>
                <h3 className="font-title font-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Pourquoi choisir Soneya Delivery ?
                </h3>
              </div>
              <span className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Développé par Guinée Hub Technologie
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
              {[
                { icon: 'navigation', title: '1. Calcul GPS Kilométrique Exact', text: '5 000 GNF de base + 3 500 GNF/km réel. Prix transparent et calculé automatiquement sans négociation téléphonique.' },
                { icon: 'shield', title: '2. Code Secret 4 Chiffres', text: 'Le livreur ne peut clôturer la course sans votre code secret client. Zéro contestation, sécurité maximale.' },
                { icon: 'trending_up', title: '3. 100% Mobile Money Sans Espèces', text: 'Orange Money et MTN MoMo sécurisés. Reçus fiscaux numériques et sécurité totale pour les coursiers.' },
                { icon: 'check_circle', title: '4. Motards Certifiés KYC & Charte', text: 'CNI, carte grise, selfie guidé et charte de sécurité signée avant toute attribution de course.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-gutter-md rounded-md bg-light-surface dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline space-y-gutter-xs"
                >
                  <div className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface flex items-center gap-gutter-xs">
                    <Icon name={item.icon} className="text-label-md text-light-primary dark:text-dark-primary" />
                    <span>{item.title}</span>
                  </div>
                  <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TESTIMONIALS ===== */}
        {!searchQuery && activeTab !== 'favorites' && (
          <div className="space-y-gutter-md pt-gutter-xs">
            <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <div>
                <h2 className="font-title font-title-lg text-light-on-surface dark:text-dark-on-surface">
                  Avis et Témoignages Conakry
                </h2>
                <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Avis certifiés de résidents et professionnels à Conakry
                </p>
              </div>
              <span className="font-label font-label-md text-light-on-surface dark:text-dark-on-surface flex items-center gap-gutter-xs">
                <Icon name="star" className="text-label-md text-accent" />
                <span>4.9/5 sur +1 200 avis</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
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
                  className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline space-y-gutter-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-gutter-xs text-accent">
                      {[...Array(5)].map((_, idx) => (
                        <Icon key={idx} name="star" className="text-label-sm" />
                      ))}
                    </div>
                  </div>
                  <div className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    {item.area}
                  </div>
                  <p className="font-body font-body-sm text-light-on-surface dark:text-dark-on-surface leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== FOOTER ===== */}
        {!searchQuery && activeTab !== 'favorites' && (
          <footer className="mt-gutter-xl pt-gutter-lg border-t border-light-outline dark:border-dark-outline space-y-gutter-md font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-gutter-md">
              <div className="space-y-gutter-xs">
                <div className="flex items-center gap-gutter-md">
                  <img
                    src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
                    alt="Guinée Hub Technologie Logo"
                    className="w-10 h-10 object-contain rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline p-gutter-xs shrink-0"
                  />
                  <div>
                    <span className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface">
                      Soneya Delivery Conakry
                    </span>
                    <div className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      « Conakry commande · Soneya livre »
                    </div>
                  </div>
                </div>
                <p className="font-body font-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant max-w-md leading-relaxed">
                  Développé par{' '}
                  <strong className="text-light-on-surface dark:text-dark-on-surface">
                    Guinée Hub Technologie (GHT)
                  </strong>
                  , entreprise immatriculée en juillet 2026 et fondée par{' '}
                  <strong className="text-light-on-surface dark:text-dark-on-surface">René Kaba Tolno</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-gutter-sm">
                <button
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="px-gutter-md py-gutter-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface hover:border-light-primary dark:hover:border-dark-primary transition font-label font-label-md border border-light-outline dark:border-dark-outline cursor-pointer"
                >
                  Politique de Confidentialité
                </button>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-gutter-md py-gutter-sm rounded-md bg-light-primary hover:opacity-90 text-light-on-primary dark:bg-dark-primary dark:text-dark-on-surface transition font-label font-label-md cursor-pointer"
                >
                  Rejoindre comme Partenaire
                </button>
              </div>
            </div>

            <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline font-body font-body-sm leading-relaxed space-y-gutter-xs">
              <div className="font-title font-title-md text-light-on-surface dark:text-dark-on-surface flex items-center gap-gutter-xs">
                <Icon name="shield" className="text-label-md text-light-primary dark:text-dark-primary" />
                <span>Conformité Réglementaire République de Guinée</span>
              </div>
              <p className="text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Conforme à la Loi L/2016/037/AN sur la protection des données personnelles et aux directives des télécommunications ARPT. Paiements sécurisés via protocoles bancaires et mobiles Orange Money & MTN MoMo.
              </p>
            </div>

            <div className="font-body font-body-sm text-center text-light-on-surface-variant dark:text-dark-on-surface-variant pt-gutter-sm pb-gutter-lg">
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
    </div>
  );
};
