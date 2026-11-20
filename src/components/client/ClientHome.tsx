import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Partner, Product } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { ProductModal } from './ProductModal';
import { ExpressParcelModal } from './ExpressParcelModal';
import { NeighborhoodModal } from './NeighborhoodModal';

export const ClientHome: React.FC = () => {
  const {
    partners,
    location,
    setSelectedPartnerId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeOrder,
    setActiveTab,
    showToast,
  } = useApp();

  const [selectedProductForModal, setSelectedProductForModal] = useState<{
    product: Product;
    partner: Partner;
  } | null>(null);

  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);
  const [isParcelModalOpen, setIsParcelModalOpen] = useState(false);

  // Sample dishes from Stitch Ultra for instant rich display
  const featuredDishes = [
    {
      partner: partners[0] || { id: 'p-1', name: 'Chez Fanta' },
      product: {
        id: 'fanta-maffe',
        name: 'Maffé Tiga au Bœuf',
        priceGnf: 45000,
        description: "Sauce onctueuse à la pâte d'arachide pure de Kindia, morceaux tendres de bœuf fumé, servie avec riz blanc parfumé.",
        image: 'https://lh3.googleusercontent.com/aida/ALJJyrDnokUuTLr-3l9vcS9ozchfhDN6Gj60eXrukGqR5Z-mzNSA3zDJTByndiDA7Q5ybD-i0wVlO-C4KMgwyD2LeZ9ETsDBfdBVGKKBImsgY2iV307XeXfk5CKow6YE1e8lP9f_TL2rlDWJUrTKucnFtqvrbv74fofuwi8qZF0G4_WShgtoHWlNnjuI2gmDWrlNhXOs1Mqp9pQc_101o2dWHw4HKsuoBx2EUIgy3Achl8tJmasKg8vdEcJF',
        category: 'Plats Chauds',
        isAvailable: true,
        prepTimeMinutes: 18,
        rating: 4.9,
      },
      tag: 'Alloco offert',
      duration: '25 min',
    },
    {
      partner: partners[1] || { id: 'p-2', name: 'Le Cèdre Grillades' },
      product: {
        id: 'cedre-chawarma',
        name: 'Assiette Grillades & Chawarma',
        priceGnf: 55000,
        description: 'Brochettes marinées, houmous frais de Kaloum, frites dorées et pain pita chaud fait maison.',
        image: 'https://lh3.googleusercontent.com/aida/ALJJyrC9u_t06R_N_idPbs4c99rPK0gKz1APils_62_VEocNmFTX-Nxbx_uHREiR46ZjifhDVWK-9J2iEU6VpV0zWbfo1QQliTfeP1fWn5U5bMQUC1VnwOccq3kPSUq9HXZdThXXP-K9UphwNE1AdJqvwX_XIhYJf7vGnevBpJSJ8VrxzVxA2TzaKwgWzOnSvnxBLuByMwz-BX8c7iIzl90G8CKCWgo9GaxEYoMQbVRV973SYLjPA1vt8w6PnRRbnAjS-A',
        category: 'Cuisine Libanaise',
        isAvailable: true,
        prepTimeMinutes: 20,
        rating: 4.8,
      },
      tag: 'Boisson offerte',
      duration: '30 min',
    },
    {
      partner: partners[2] || { id: 'p-3', name: 'Prima Center' },
      product: {
        id: 'prima-fruits',
        name: 'Panier Frais & Épicerie Fine',
        priceGnf: 60000,
        description: 'Sélection primeur de fruits locaux, légumes croquants et produits laitiers importés.',
        image: 'https://lh3.googleusercontent.com/aida/ALJJyrBhaCNh70uK0jc5u-kBXh9XIB0WRHuiRvTLb5rUPUncyNKFZ-pjQnT46aFY3S2S-f3OfErBNhre8KjMDYFCYa-hhYp4G73OjRlaqm81gUmvewYLjmDZQbmlhbk3wfvmQQORfuX_j3ygS_fRXo6nSEPfMAmR34_5Qnr0xL_qRTJO_bONI_Kc4Z1idqNkRu6EBoIw0Ob_clI9oY6vD_fcCfp7XrgKdaEy2wR0R0CAAL4WcOtvmfoQMKKnBr3Y-w',
        category: 'Supermarché',
        isAvailable: true,
        prepTimeMinutes: 35,
        rating: 4.7,
      },
      tag: 'Livraison express',
      duration: '35 min',
    },
    {
      partner: partners[3] || { id: 'p-4', name: 'Pharmacie Kipé' },
      product: {
        id: 'pharmacie-soins',
        name: 'Kit Premiers Soins & Vitamines',
        priceGnf: 35000,
        description: 'Antalgiques certifiés, vitamine C effervescente et pansements stériles délivrés sous contrôle.',
        image: 'https://lh3.googleusercontent.com/aida/ALJJyrBFyhXQ7v5iIkmiNDuukstEd_SYcsyu4vE7P6dFoAXJ2MhHC6LtSi5cxwOvibTgF1anB_wjl82Zt-3z2xXkjRbKC3yOe0Nkl65axVjSd7a42qYok9a0NRVWpNBTAFO_Qq_rruef3ZJuOm_ld_cbWPKjulS2wrnNIRiOHmph9JXhpF7yp2L9fTB8log1VVg7L8aEEf8LTalW3MQOq9Lf5I7lzLrDLgG6dqseLCqtngYv9_gKI-LFVd4WqgM',
        category: 'Pharmacie',
        isAvailable: true,
        prepTimeMinutes: 15,
        rating: 4.9,
      },
      tag: 'Garde 24h/24',
      duration: '20 min',
    },
  ];

  const handleOpenDish = (dish: typeof featuredDishes[0]) => {
    setSelectedProductForModal({
      product: dish.product as any,
      partner: dish.partner as any,
    });
  };

  const filteredDishes = featuredDishes.filter((dish) => {
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'restaurants' && !dish.product.category.includes('Plats') && !dish.product.category.includes('Libanaise')) return false;
      if (selectedCategory === 'supermarché' && !dish.product.category.includes('Supermarché')) return false;
      if (selectedCategory === 'pharmacie' && !dish.product.category.includes('Pharmacie')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        dish.product.name.toLowerCase().includes(q) ||
        dish.partner.name.toLowerCase().includes(q) ||
        dish.product.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-gutter-md md:px-gutter-lg py-gutter-md flex flex-col gap-gutter-lg pb-24 text-light-on-surface dark:text-dark-on-surface">
      {/* 4 Circular Tinted Category Icons (Matching Stitch Ultra accueil_client_mobile.html) */}
      <section className="grid grid-cols-4 gap-gutter-sm text-center py-2">
        <button
          type="button"
          onClick={() => setSelectedCategory(selectedCategory === 'restaurants' ? null : 'restaurants')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <span
            className={`inline-flex items-center justify-center w-14 h-14 rounded-full transition-all duration-state-change group-hover:scale-105 shadow-xs ${
              selectedCategory === 'restaurants'
                ? 'bg-light-primary dark:bg-dark-primary text-white ring-4 ring-light-primary/20'
                : 'bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary'
            }`}
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">restaurant</span>
          </span>
          <span className="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface font-semibold">
            Repas
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory(selectedCategory === 'supermarché' ? null : 'supermarché')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <span
            className={`inline-flex items-center justify-center w-14 h-14 rounded-full transition-all duration-state-change group-hover:scale-105 shadow-xs ${
              selectedCategory === 'supermarché'
                ? 'bg-partner text-white ring-4 ring-partner/20'
                : 'bg-amber-100 dark:bg-amber-950/40 text-partner'
            }`}
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">shopping_cart</span>
          </span>
          <span className="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface font-semibold">
            Courses
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory(selectedCategory === 'pharmacie' ? null : 'pharmacie')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <span
            className={`inline-flex items-center justify-center w-14 h-14 rounded-full transition-all duration-state-change group-hover:scale-105 shadow-xs ${
              selectedCategory === 'pharmacie'
                ? 'bg-light-primary dark:bg-dark-primary text-white ring-4 ring-light-primary/20'
                : 'bg-emerald-100 dark:bg-emerald-950/40 text-light-primary dark:text-dark-primary'
            }`}
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">local_pharmacy</span>
          </span>
          <span className="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface font-semibold">
            Santé
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsParcelModalOpen(true)}
          className="flex flex-col items-center gap-1.5 group cursor-pointer"
        >
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950/40 text-courier transition-all duration-state-change group-hover:scale-105 shadow-xs">
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">package_2</span>
          </span>
          <span className="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface font-semibold">
            Colis
          </span>
        </button>
      </section>

      {/* Bento Top Row: Featured Editorial Offer + Express Parcel (Matching accueil_client_web.html) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-stretch">
        {/* Left: Featured Editorial Offer */}
        <div className="lg:col-span-8 rounded-xl overflow-hidden border border-light-outline dark:border-dark-outline bg-light-primary-container dark:bg-dark-primary-container grid grid-cols-1 md:grid-cols-12 items-center shadow-xs">
          <div className="md:col-span-7 p-gutter-lg md:p-gutter-xl flex flex-col gap-gutter-md">
            <span className="inline-flex items-center gap-1 self-start px-3 py-1 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary font-label text-label-sm font-semibold">
              Offre Conakry · -20%
            </span>
            <h2 className="font-display text-display-md-mobile md:text-display-md text-light-on-primary-container dark:text-dark-on-primary-container text-balance leading-tight">
              Saveurs guinéennes livrées chaudes en 25 min.
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Utilisez le code <span className="font-mono text-mono-sm font-bold text-light-primary dark:text-dark-primary">SONEYA20</span> sur votre prochain Maffé Tiga ou Capitaine Braisé.
            </p>
            <div>
              <button
                type="button"
                onClick={() => {
                  const fanta = partners[0];
                  if (fanta) setSelectedPartnerId(fanta.id);
                }}
                className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary font-label text-label-lg font-bold hover:opacity-90 active:scale-98 transition shadow-xs cursor-pointer"
              >
                <span>Découvrir Chez Fanta</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="md:col-span-5 h-full min-h-[220px]">
            <img
              src="https://lh3.googleusercontent.com/aida/ALJJyrDOVbyCG7iDk1IqvVsS3i9m3bqn_yDySv4ygE4Mo59SXzlDAQpJv_kquFGVRLcdpgs51hz7PdjG6t_2FS44qtBZQ9GRAscCnB0AC9XRcptw9UB4jijVXD_FtOn3n0yHcUzqeOeNFzla-4169GT5FD7wsqef3RfIjjFeuN7_Fbt3ysP5UgrVyL_rG0sALBcukd4SY3nKwn6DiesytRju-ZF6u6ENcATvEXWeqWntTnUc77gni6-34Kc4yDoCpFJLKg"
              alt="Cuisine guinéenne Soneya"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Express Parcel Card */}
        <article className="lg:col-span-4 h-full flex flex-col justify-between gap-gutter-md p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs">
          <div className="flex flex-col gap-gutter-md">
            <img
              src="https://lh3.googleusercontent.com/aida/ALJJyrBRsOwm3aWjCy_15LJJcOlh6Jz6_tBNONkmhy9gD0Irtw3RR47qoAu8EGMN3FlEqczR3iJwLQx1JFOE160jTSmd7AJA0P04b0BtfB8IuMpel1OuH68eLz9B2RPJpJh96hf6rIAbkqphuCXEGiZjKmuz6MDVDMWZAe2dGBlJzswbL8pPN1bYqKPGjQ79cu1Pc7dL6BmwyEklVSCkSL0dakHXkmIK608KxkRyWTFhT5ncVtAI-MCyHRCpbykz3DE"
              alt="Coursier moto Soneya Express"
              className="w-full h-36 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-bold">
                Soneya Express Colis
              </h3>
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                Envoyez un pli ou un colis entre Kaloum, Kipé et Lambanyi avec motards géolocalisés.
              </p>
            </div>
          </div>
          <footer className="flex items-center justify-between pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
            <span className="font-mono text-mono-sm tabular-nums text-light-on-surface-variant font-semibold">
              Dès 15 000 GNF
            </span>
            <button
              type="button"
              onClick={() => setIsParcelModalOpen(true)}
              className="px-gutter-md py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary font-label text-label-md font-bold hover:opacity-90 transition cursor-pointer shadow-xs"
            >
              <span>Expédier un colis</span>
            </button>
          </footer>
        </article>
      </section>

      {/* Category Filter Row & Search (Matching Stitch Ultra) */}
      <section className="flex flex-wrap items-center justify-between gap-gutter-md pt-2">
        <div className="flex flex-wrap items-center gap-gutter-sm">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full font-label text-label-md transition cursor-pointer ${
              !selectedCategory
                ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary font-bold shadow-xs'
                : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
            }`}
          >
            <span>Tout voir</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('restaurants')}
            className={`inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full font-label text-label-md transition cursor-pointer ${
              selectedCategory === 'restaurants'
                ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary font-bold shadow-xs'
                : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-title-md text-light-primary">restaurant</span>
            <span>Restaurants</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('supermarché')}
            className={`inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full font-label text-label-md transition cursor-pointer ${
              selectedCategory === 'supermarché'
                ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary font-bold shadow-xs'
                : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-title-md text-partner">shopping_cart</span>
            <span>Courses &amp; Marchés</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('pharmacie')}
            className={`inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full font-label text-label-md transition cursor-pointer ${
              selectedCategory === 'pharmacie'
                ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary font-bold shadow-xs'
                : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-title-md text-emerald-600">local_pharmacy</span>
            <span>Pharmacie</span>
          </button>
        </div>

        {/* Quartier Filter Pill */}
        <button
          type="button"
          onClick={() => setIsNeighborhoodOpen(true)}
          className="inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface font-label text-label-md hover:bg-light-surface-container transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-title-md text-light-primary">location_on</span>
          <span>{location.quartier?.name || 'Kipé'}</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>
      </section>

      {/* Curated Conakry Partners & Dishes Grid (Matching Stitch Ultra) */}
      <section className="flex flex-col gap-gutter-lg">
        <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
          <h2 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface font-bold">
            Enseignes &amp; Plats à Kipé &amp; Kaloum
          </h2>
          <span className="font-label text-label-md text-light-on-surface-variant whitespace-nowrap">
            {filteredDishes.length} enseignes disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-lg items-stretch">
          {filteredDishes.map((dish, idx) => (
            <article
              key={idx}
              onClick={() => handleOpenDish(dish)}
              className="h-full flex flex-col justify-between gap-gutter-md p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs hover:shadow-md hover:border-light-primary transition-all duration-state-change cursor-pointer group"
            >
              <div className="flex flex-col gap-gutter-md">
                <div className="relative rounded-md overflow-hidden h-44 bg-light-surface-container">
                  <img
                    src={dish.product.image}
                    alt={dish.product.name}
                    className="w-full h-full object-cover transition-transform duration-surface-enter group-hover:scale-105"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-mono font-bold">
                    {formatGnf(dish.product.priceGnf)}
                  </span>
                </div>

                <header className="flex items-start justify-between gap-gutter-sm">
                  <div>
                    <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold group-hover:text-light-primary transition-colors">
                      {dish.partner.name}
                    </h3>
                    <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      {dish.product.name}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-on-primary-container dark:text-dark-on-primary-container font-label text-label-md tabular-nums shrink-0 font-bold">
                    <span className="material-symbols-outlined text-label-md text-accent" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                      star
                    </span>
                    {dish.product.rating}
                  </span>
                </header>
              </div>

              <div className="flex items-center justify-between pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
                <span className="font-body text-body-sm text-light-on-surface-variant tabular-nums">
                  {dish.duration}
                </span>
                <span className="font-label text-label-sm text-light-primary dark:text-dark-primary font-semibold">
                  {dish.tag}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Selected Product Sheet Modal (Fiche Produit Client) */}
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
