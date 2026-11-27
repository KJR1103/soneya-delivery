import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryId, Partner, Product } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { calculateDistanceKm, calculateDeliveryFeeGnf } from '../../utils/geo';
import { StoriesRow } from './StoriesRow';
import { FilterSheet } from './FilterSheet';
import { NeighborhoodModal } from './NeighborhoodModal';
import { ExpressParcelModal } from './ExpressParcelModal';

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

  const filteredPartners = partnersWithDistance.filter((partner) => {
    if (activeTab === 'favorites' && !favorites.includes(partner.id)) return false;
    if (selectedCategory && partner.category !== selectedCategory) return false;
    if (activeQuickFilter === 'express' && partner.deliveryTimeMin > 30) return false;
    if (activeQuickFilter === 'promo' && !partner.bannerOffer) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        partner.name.toLowerCase().includes(q) ||
        partner.quartierName.toLowerCase().includes(q) ||
        partner.tags.some((t) => t.toLowerCase().includes(q)) ||
        partner.products.some((pr) => pr.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const popularDishes: { product: Product; partner: Partner }[] = [
    { product: partners[0].products[0], partner: partners[0] },
    { product: partners[1].products[0], partner: partners[1] },
    { product: partners[0].products[1], partner: partners[0] },
    { product: partners[0].products[2], partner: partners[0] },
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

  const handleQuickAdd = (product: Product, partner: Partner) => {
    addToCart(product, partner);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const categories: { id: CategoryId | 'parcels'; label: string; icon: string; color: string }[] = [
    { id: 'restaurants', label: 'Repas', icon: 'restaurant', color: 'text-light-primary' },
    { id: 'groceries', label: 'Courses', icon: 'shopping_cart', color: 'text-partner' },
    { id: 'pharmacy', label: 'Santé', icon: 'local_pharmacy', color: 'text-light-primary' },
    { id: 'parcels', label: 'Colis', icon: 'package_2', color: 'text-courier' },
  ];

  const promoBanners = [
    { badge: 'Offre Conakry · -20%', title: 'Saveurs de Conakry', subtitle: 'Code SONEYA20 sur votre prochain Maffé Tiga', code: 'SONEYA20' },
    { badge: 'Livraison offerte', title: 'Frais à 0 GNF', subtitle: 'Code LIVRAISON0 : nos motards livrent chez vous sans frais', code: 'LIVRAISON0' },
  ];

  return (
    <div className="flex flex-col pb-32">
      {/* Full-bleed editorial hero */}
      <section className="relative h-56 sm:h-64 w-full overflow-hidden">
        <img
          src="/assets/aistudio/3c2f1a0b9066ca7b77fce6116e13e1bc__1__6a6dc086.jpg"
          alt="Soneya Delivery Conakry"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-surface/70 via-dark-surface/50 to-dark-surface/90 p-gutter-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-title text-title-md text-light-on-primary">Soneya</span>
            <button
              onClick={() => setIsNeighborhoodOpen(true)}
              className="inline-flex items-center gap-gutter-xs px-3 py-1 rounded-full bg-light-surface-container-low/90 text-light-on-surface font-label text-label-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-label-md text-light-primary" aria-hidden="true">location_on</span>
              <span>{location.isGPS ? 'GPS' : location.quartier.name}</span>
            </button>
          </div>

          <div className="pb-gutter-md flex flex-col gap-gutter-xs">
            <span className="self-start px-2.5 py-0.5 rounded-full bg-accent text-on-accent font-label text-label-sm">
              {promoBanners[activePromoIndex].badge}
            </span>
            <h1 className="font-display text-display-md-mobile text-light-on-primary">
              {promoBanners[activePromoIndex].title}
            </h1>
            <p className="font-body text-body-sm text-dark-on-surface-variant">
              Livré en 25 min · Orange Money & MoMo
            </p>
          </div>
        </div>
      </section>

      {/* Overlapping content sheet */}
      <main className="flex-1 -mt-4 relative z-10 rounded-t-xl bg-light-surface dark:bg-dark-surface px-gutter-md pt-gutter-lg flex flex-col gap-gutter-lg">
        {/* Search bar */}
        <form
          role="search"
          className="flex items-center gap-gutter-sm w-full px-gutter-md py-2.5 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline shadow-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <span className="material-symbols-outlined text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant" aria-hidden="true">search</span>
          <input
            type="search"
            placeholder="Maffé Tiga, Prima Center, pharmacie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 p-0 font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:ring-0 focus:outline-none placeholder:text-light-on-surface-variant"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="cursor-pointer">
              <span className="material-symbols-outlined text-label-md text-light-on-surface-variant" aria-hidden="true">close</span>
            </button>
          )}
        </form>

        {/* Active order banner */}
        {activeOrder && activeOrder.status !== 'delivered' && (
          <button
            onClick={() => { setSelectedOrderId(activeOrder.id); setActiveTab('orders'); }}
            className="p-gutter-md rounded-lg bg-light-primary-container dark:bg-dark-primary-container border border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-md text-left cursor-pointer"
          >
            <div className="flex items-center gap-gutter-md">
              <span className="material-symbols-outlined text-title-lg text-light-primary dark:text-dark-primary" aria-hidden="true">two_wheeler</span>
              <div>
                <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">Commande en cours</p>
                <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">{activeOrder.partnerName} · Code {activeOrder.deliveryCode}</p>
              </div>
            </div>
            <span className="font-label text-label-md text-light-primary dark:text-dark-primary">Suivre →</span>
          </button>
        )}

        {/* 4 circular category icons */}
        <section className="grid grid-cols-4 gap-gutter-sm text-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'parcels') setIsParcelModalOpen(true);
                else setSelectedCategory(selectedCategory === cat.id ? null : (cat.id as CategoryId));
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
            >
              <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-light-primary-container dark:bg-dark-primary-container ${cat.color}`}>
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">{cat.icon}</span>
              </span>
              <span className="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface">{cat.label}</span>
            </button>
          ))}
        </section>

        {/* Stories carousel */}
        {!searchQuery && activeTab !== 'favorites' && <StoriesRow />}

        {/* Filter chips */}
        <section className="flex flex-wrap items-center justify-between gap-gutter-md">
          <div className="flex flex-wrap items-center gap-gutter-sm">
            <button
              onClick={() => { setActiveQuickFilter('all'); setSelectedCategory(null); }}
              className={`inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                activeQuickFilter === 'all'
                  ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary'
                  : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
              }`}
            >
              Tout voir
            </button>
            <button
              onClick={() => { setActiveQuickFilter('express'); setSelectedCategory('restaurants'); }}
              className="inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface font-label text-label-md hover:bg-light-surface-container cursor-pointer"
            >
              <span className="material-symbols-outlined text-title-md text-light-primary dark:text-dark-primary" aria-hidden="true">restaurant</span>
              Restaurants
            </button>
            <button
              onClick={() => { setActiveQuickFilter('promo'); setSelectedCategory('groceries'); }}
              className="inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface font-label text-label-md hover:bg-light-surface-container cursor-pointer"
            >
              <span className="material-symbols-outlined text-title-md text-light-primary dark:text-dark-primary" aria-hidden="true">shopping_cart</span>
              Courses
            </button>
            <button
              onClick={() => { setActiveQuickFilter('all'); setSelectedCategory('pharmacy'); }}
              className="inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface font-label text-label-md hover:bg-light-surface-container cursor-pointer"
            >
              <span className="material-symbols-outlined text-title-md text-light-primary dark:text-dark-primary" aria-hidden="true">local_pharmacy</span>
              Pharmacie
            </button>
          </div>

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface font-label text-label-md hover:bg-light-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">tune</span>
            Filtres
          </button>
        </section>

        {/* Express parcel card */}
        {!searchQuery && activeTab !== 'favorites' && (
          <article className="flex flex-col justify-between gap-gutter-md p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-sm">
            <div className="flex flex-col gap-gutter-md">
              <div className="flex items-center gap-gutter-md">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-light-surface-container text-courier">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">package_2</span>
                </span>
                <div>
                  <h2 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface">Soneya Express Colis</h2>
                  <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                    Envoyez un pli ou un colis entre Kaloum, Kipé et Lambanyi avec suivi GPS.
                  </p>
                </div>
              </div>
            </div>
            <footer className="flex items-center justify-between pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
              <span className="font-mono text-mono-sm tabular-nums text-light-on-surface-variant dark:text-dark-on-surface-variant">Dès 15 000 GNF</span>
              <button
                type="button"
                onClick={() => setIsParcelModalOpen(true)}
                className="px-gutter-md py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md hover:opacity-90 cursor-pointer"
              >
                Expédier un colis
              </button>
            </footer>
          </article>
        )}

        {/* Popular dishes */}
        {!searchQuery && activeTab !== 'favorites' && popularDishes.length > 0 && (
          <section className="flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface">Tendances à {location.quartier.name}</h2>
              <span className="font-label text-label-md text-light-primary dark:text-dark-primary">Voir tout</span>
            </div>

            <div className="flex gap-gutter-md overflow-x-auto no-scrollbar py-1">
              {popularDishes.map(({ product, partner }) => {
                const isAdded = addedProductId === product.id;
                return (
                  <div
                    key={product.id}
                    className="w-48 sm:w-52 shrink-0 rounded-lg overflow-hidden bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-sm flex flex-col"
                  >
                    <div className="relative h-28 w-full overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1.5 left-1.5 text-label-sm font-label px-2 py-0.5 rounded-full bg-dark-surface/80 text-light-on-primary backdrop-blur-sm truncate max-w-[140px]">
                        {partner.name}
                      </span>
                    </div>
                    <div className="p-gutter-sm flex flex-col gap-gutter-xs">
                      <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface line-clamp-1">{product.name}</h3>
                      <span className="font-mono text-mono-sm text-light-primary dark:text-dark-primary tabular-nums">{formatGnf(product.priceGnf)}</span>
                      <button
                        onClick={() => handleQuickAdd(product, partner)}
                        className={`w-full py-2 rounded-md font-label text-label-md flex items-center justify-center gap-gutter-xs transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-light-on-surface text-light-surface-container-low dark:bg-dark-on-surface'
                            : 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary hover:opacity-90'
                        }`}
                      >
                        <span className="material-symbols-outlined text-label-md" aria-hidden="true">{isAdded ? 'check' : 'add'}</span>
                        {isAdded ? 'Ajouté' : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Search results: food items */}
        {searchQuery && matchingProducts.length > 0 && (
          <section className="flex flex-col gap-gutter-md">
            <h2 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface">
              Plats & Articles trouvés ({matchingProducts.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-md">
              {matchingProducts.map(({ product, partner }) => {
                const isAdded = addedProductId === product.id;
                return (
                  <article
                    key={`${partner.id}_${product.id}`}
                    className="rounded-lg overflow-hidden bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-sm flex flex-col"
                  >
                    <div className="relative h-36 w-full overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-dark-surface/60 backdrop-blur-sm flex items-center justify-center text-light-on-primary cursor-pointer"
                      >
                        <span
                          className="material-symbols-outlined text-label-md"
                          style={favorites.includes(product.id) ? { fontVariationSettings: "'FILL' 1", color: '#E11D48' } : undefined}
                          aria-hidden="true"
                        >favorite</span>
                      </button>
                    </div>
                    <div className="p-gutter-sm flex flex-col gap-gutter-xs">
                      <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface line-clamp-1">{product.name}</h3>
                      <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between pt-gutter-xs border-t border-light-outline dark:border-dark-outline">
                        <span className="font-mono text-mono-md text-light-primary dark:text-dark-primary tabular-nums">{formatGnf(product.priceGnf)}</span>
                        <button
                          onClick={() => handleQuickAdd(product, partner)}
                          className="px-gutter-md py-1.5 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-sm hover:opacity-90 cursor-pointer"
                        >
                          {isAdded ? 'Ajouté' : 'Ajouter'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Partners grid */}
        <section className="flex flex-col gap-gutter-lg">
          <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
            <h2 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
              {activeTab === 'favorites' ? 'Mes Favoris' : 'Enseignes à ' + location.quartier.name}
            </h2>
            <span className="font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant whitespace-nowrap">
              {filteredPartners.length} ouvertes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-lg items-stretch">
            {filteredPartners.map((partner) => (
              <article
                key={partner.id}
                onClick={() => setSelectedPartnerId(partner.id)}
                className="h-full flex flex-col justify-between gap-gutter-md p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-sm hover:border-light-primary dark:hover:border-dark-primary transition-colors duration-state-change cursor-pointer"
              >
                <div className="flex flex-col gap-gutter-md">
                  <div className="relative rounded-md overflow-hidden h-36">
                    <img src={partner.coverImage} alt={partner.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(partner.id); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-dark-surface/60 backdrop-blur-sm flex items-center justify-center text-light-on-primary cursor-pointer"
                    >
                      <span
                        className="material-symbols-outlined text-label-md"
                        style={favorites.includes(partner.id) ? { fontVariationSettings: "'FILL' 1", color: '#E11D48' } : undefined}
                        aria-hidden="true"
                      >favorite</span>
                    </button>
                  </div>
                  <header className="flex items-start justify-between gap-gutter-sm">
                    <div>
                      <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">{partner.name}</h3>
                      <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        {partner.categoryLabel} · {partner.quartierName}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-on-primary-container dark:text-dark-on-primary-container font-label text-label-md tabular-nums shrink-0">
                      <span className="material-symbols-outlined text-label-md text-accent" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">star</span>
                      {partner.rating}
                    </span>
                  </header>
                </div>
                <div className="flex items-center justify-between pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
                  <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant tabular-nums">
                    {partner.deliveryTimeMin} min · {formatGnf(partner.deliveryFeeGnf)}
                  </span>
                  {partner.bannerOffer && (
                    <span className="font-label text-label-sm text-light-primary dark:text-dark-primary">Offre en cours</span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="py-12 text-center space-y-gutter-md">
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Aucun établissement ne correspond à votre filtre.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); setActiveQuickFilter('all'); }}
                className="font-label text-label-md text-light-primary dark:text-dark-primary underline cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </section>

        {/* Quick reorder */}
        {orders.length > 0 && !searchQuery && activeTab !== 'favorites' && (
          <button
            onClick={() => reorder(orders[0])}
            className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-md cursor-pointer hover:border-light-primary transition-colors"
          >
            <div className="flex items-center gap-gutter-md">
              <span className="material-symbols-outlined text-title-lg text-light-primary dark:text-dark-primary" aria-hidden="true">restart_alt</span>
              <div className="text-left">
                <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">Recommander chez {orders[0].partnerName}</p>
                <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant truncate">
                  {orders[0].items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                </p>
              </div>
            </div>
            <span className="font-label text-label-md text-light-primary dark:text-dark-primary shrink-0">Recommander →</span>
          </button>
        )}
      </main>

      <FilterSheet />
      <NeighborhoodModal isOpen={isNeighborhoodOpen} onClose={() => setIsNeighborhoodOpen(false)} />
      <ExpressParcelModal isOpen={isParcelModalOpen} onClose={() => setIsParcelModalOpen(false)} />
    </div>
  );
};
