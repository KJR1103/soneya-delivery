import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';
import { Product } from '../../types';
import { SettingsView } from '../common/SettingsView';

export const PartnerDashboard: React.FC = () => {
  const {
    partners,
    orders,
    updateOrderStatus,
    addProductToPartner,
    showToast,
  } = useApp();

  const partner = partners[0] || {
    id: 'p-1',
    name: 'Chez Fanta',
    category: 'restaurants',
    quartierName: 'Kipé',
    isOpen: true,
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'catalog' | 'inventory' | 'settings'>('dashboard');
  const [period, setPeriod] = useState<'jour' | 'semaine' | 'mois' | 'annee'>('jour');
  const [searchQuery, setSearchQuery] = useState('');

  // New product form states (Matching espace_business_produits_promos.html)
  const [prodName, setProdName] = useState('Maffé Tiga au Bœuf Fumé');
  const [prodPrice, setProdPrice] = useState('45 000');
  const [prodDesc, setProdDesc] = useState("Sauce onctueuse à la pâte d'arachide de Kindia, bœuf fumé tendre et riz blanc parfumé.");
  const [prodImage, setProdImage] = useState(
    'https://lh3.googleusercontent.com/aida/ALJJyrDnokUuTLr-3l9vcS9ozchfhDN6Gj60eXrukGqR5Z-mzNSA3zDJTByndiDA7Q5ybD-i0wVlO-C4KMgwyD2LeZ9ETsDBfdBVGKKBImsgY2iV307XeXfk5CKow6YE1e8lP9f_TL2rlDWJUrTKucnFtqvrbv74fofuwi8qZF0G4_WShgtoHWlNnjuI2gmDWrlNhXOs1Mqp9pQc_101o2dWHw4HKsuoBx2EUIgy3Achl8tJmasKg8vdEcJF'
  );

  // Promo code form states
  const [promoCode, setPromoCode] = useState('FANTA15');
  const [promoVal, setPromoVal] = useState('15 %');
  const [promoMin, setPromoMin] = useState('60 000 GNF');
  const [activePromos, setActivePromos] = useState([
    { code: 'SONEYA20', discount: '20%', min: '50 000 GNF' },
    { code: 'KIPE10', discount: '10%', min: '30 000 GNF' },
  ]);

  // Live order status management
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({
    'SNY-8421': 'En cuisine',
    'SNY-8422': 'En préparation',
    'SNY-8423': 'Prête',
  });

  const handleMarkOrderReady = (orderId: string) => {
    setOrderStatuses((prev) => ({
      ...prev,
      [orderId]: prev[orderId] === 'Prête' ? 'Remise au rider' : 'Prête',
    }));
    showToast('Commande mise à jour', `La commande #${orderId} est marquée comme prête pour le coursier Soneya.`, 'success');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPrice = parseInt(prodPrice.replace(/\D/g, ''), 10) || 45000;
    addProductToPartner(partner.id, {
      name: prodName,
      priceGnf: cleanPrice,
      description: prodDesc,
      image: prodImage,
      category: 'Spécialités de Conakry',
      available: true,
      prepTimeMin: 20,
    });
    showToast('Article publié', `${prodName} est maintenant en ligne au menu Chez Fanta !`, 'success');
    setProdName('');
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setActivePromos((prev) => [
      { code: promoCode.toUpperCase().trim(), discount: promoVal, min: promoMin },
      ...prev,
    ]);
    showToast('Code promo activé', `Le code ${promoCode.toUpperCase()} est disponible pour les clients.`, 'success');
    setPromoCode('');
  };

  // Dynamic stats based on period
  const statsMap = {
    jour: {
      sales: '4 850 000 GNF',
      salesDiff: '+18% vs hier',
      orders: '17',
      ordersDetail: '3 prêtes',
      month: '114,9 M GNF',
      monthDetail: '1 690 commandes',
      year: '1,28 Md GNF',
      yearDetail: 'Note 4.9 / 5',
    },
    semaine: {
      sales: '28 450 000 GNF',
      salesDiff: '+12% vs sem. dernière',
      orders: '118',
      ordersDetail: '14 prêtes',
      month: '114,9 M GNF',
      monthDetail: '1 690 commandes',
      year: '1,28 Md GNF',
      yearDetail: 'Note 4.9 / 5',
    },
    mois: {
      sales: '114 900 000 GNF',
      salesDiff: '+24% vs mois dernier',
      orders: '1 690',
      ordersDetail: 'Taux complétion 99.1%',
      month: '114,9 M GNF',
      monthDetail: '1 690 commandes',
      year: '1,28 Md GNF',
      yearDetail: 'Note 4.9 / 5',
    },
    annee: {
      sales: '1 280 000 000 GNF',
      salesDiff: '+35% croissance 2026',
      orders: '18 400',
      ordersDetail: 'Top 3 Conakry',
      month: '114,9 M GNF',
      monthDetail: '1 690 commandes',
      year: '1,28 Md GNF',
      yearDetail: 'Note 4.9 / 5',
    },
  };

  const currentStats = statsMap[period];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-light-surface dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface font-body antialiased selection:bg-partner/20 selection:text-partner">
      {/* Left Dedicated Business Sidebar (Matching espace_business_tableau_de_bord.html) */}
      <aside className="lg:w-64 lg:shrink-0 flex flex-col justify-between bg-dark-surface text-dark-on-surface p-gutter-lg border-r border-dark-outline dark:border-dark-outline">
        <div className="flex flex-col gap-gutter-xl">
          <div className="flex items-center gap-gutter-sm">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent text-on-accent font-bold shrink-0">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">storefront</span>
            </span>
            <div className="min-w-0">
              <span className="font-title text-title-md text-white block font-bold truncate">Soneya Pro</span>
              <span className="font-label text-label-sm text-dark-on-surface-variant">Espace Business</span>
            </div>
          </div>

          <nav aria-label="Menu Business" className="flex flex-col gap-gutter-xs">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-gutter-sm px-gutter-md py-2.5 rounded-md font-label text-label-md transition-all cursor-pointer text-left ${
                activeTab === 'dashboard'
                  ? 'bg-dark-primary text-dark-on-primary font-bold shadow-xs'
                  : 'text-dark-on-surface-variant hover:bg-dark-surface-container hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">dashboard</span>
              <span>Tableau de bord</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between px-gutter-md py-2.5 rounded-md font-label text-label-md transition-all cursor-pointer text-left ${
                activeTab === 'orders'
                  ? 'bg-dark-primary text-dark-on-primary font-bold shadow-xs'
                  : 'text-dark-on-surface-variant hover:bg-dark-surface-container hover:text-white'
              }`}
            >
              <span className="flex items-center gap-gutter-sm">
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">receipt_long</span>
                <span>Commandes</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-accent text-on-accent font-mono text-mono-sm font-bold">
                3
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-gutter-sm px-gutter-md py-2.5 rounded-md font-label text-label-md transition-all cursor-pointer text-left ${
                activeTab === 'catalog'
                  ? 'bg-dark-primary text-dark-on-primary font-bold shadow-xs'
                  : 'text-dark-on-surface-variant hover:bg-dark-surface-container hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">restaurant_menu</span>
              <span>Produits &amp; Promos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-gutter-sm px-gutter-md py-2.5 rounded-md font-label text-label-md transition-all cursor-pointer text-left ${
                activeTab === 'inventory'
                  ? 'bg-dark-primary text-dark-on-primary font-bold shadow-xs'
                  : 'text-dark-on-surface-variant hover:bg-dark-surface-container hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">inventory_2</span>
              <span>Inventaire ventes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-gutter-sm px-gutter-md py-2.5 rounded-md font-label text-label-md transition-all cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-dark-primary text-dark-on-primary font-bold shadow-xs'
                  : 'text-dark-on-surface-variant hover:bg-dark-surface-container hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">settings</span>
              <span>Paramètres</span>
            </button>
          </nav>
        </div>

        {/* Partner Verified Status Box */}
        <div className="p-gutter-md rounded-lg bg-dark-surface-container border border-dark-outline flex items-center gap-gutter-sm mt-6">
          <span className="material-symbols-outlined text-title-lg text-accent" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
            verified
          </span>
          <div className="min-w-0">
            <p className="font-label text-label-md text-dark-on-surface font-semibold truncate">Chez Fanta</p>
            <p className="font-body text-body-sm text-dark-on-surface-variant">Kipé · En service ouvert</p>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Search & Period Switcher Bar */}
        <header className="sticky top-0 z-30 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline px-gutter-lg py-gutter-md flex items-center justify-between gap-gutter-md">
          <div className="hidden sm:flex items-center gap-gutter-sm flex-1 max-w-md px-gutter-md py-2 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline">
            <span className="material-symbols-outlined text-title-md text-light-on-surface-variant" aria-hidden="true">search</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher commande, plat, code..."
              className="w-full bg-transparent border-0 p-0 font-body text-body-md text-light-on-surface dark:text-dark-on-surface outline-hidden"
            />
          </div>

          <div className="flex items-center gap-gutter-md ml-auto">
            {/* Period Switcher: Jour / Semaine / Mois / Année */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline">
              {(['jour', 'semaine', 'mois', 'annee'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-full font-label text-label-sm capitalize transition cursor-pointer ${
                    period === p
                      ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-bold shadow-xs'
                      : 'text-light-on-surface-variant hover:text-light-on-surface'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => showToast('Notifications', 'Aucune alerte urgente en attente.', 'info')}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-variant transition cursor-pointer"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">notifications</span>
            </button>
          </div>
        </header>

        {activeTab === 'settings' ? (
          <SettingsView />
        ) : activeTab === 'catalog' ? (
          /* Products & Promos Creation View (espace_business_produits_promos.html) */
          <main className="flex-1 max-w-7xl w-full mx-auto p-gutter-lg grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-start">
            {/* Left: Create Product / Article */}
            <section className="lg:col-span-7 p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-lg">
              <h1 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface font-bold">
                Ajouter un produit ou article
              </h1>

              {/* Photo Upload Box */}
              <div className="p-gutter-lg rounded-lg bg-light-surface-container dark:bg-dark-surface-container border border-dashed border-light-outline dark:border-dark-outline flex flex-col items-center justify-center gap-gutter-sm text-center">
                <img
                  src={prodImage}
                  alt="Aperçu produit"
                  className="w-28 h-20 object-cover rounded-md shadow-xs"
                />
                <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">
                  Photo haute définition du plat
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProdImage(
                        'https://lh3.googleusercontent.com/aida/ALJJyrDOVbyCG7iDk1IqvVsS3i9m3bqn_yDySv4ygE4Mo59SXzlDAQpJv_kquFGVRLcdpgs51hz7PdjG6t_2FS44qtBZQ9GRAscCnB0AC9XRcptw9UB4jijVXD_FtOn3n0yHcUzqeOeNFzla-4169GT5FD7wsqef3RfIjjFeuN7_Fbt3ysP5UgrVyL_rG0sALBcukd4SY3nKwn6DiesytRju-ZF6u6ENcATvEXWeqWntTnUc77gni6-34Kc4yDoCpFJLKg'
                      );
                      showToast('Photo modifiée', 'Nouvelle photo sélectionnée.', 'info');
                    }}
                    className="px-gutter-md py-1.5 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary font-label text-label-md font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Changer la photo
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateProduct} className="flex flex-col gap-gutter-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
                  <div className="flex flex-col gap-gutter-xs">
                    <label htmlFor="prod-name" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-medium">
                      Nom de l'article
                    </label>
                    <input
                      id="prod-name"
                      type="text"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      required
                      className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-body text-body-md text-light-on-surface dark:text-dark-on-surface outline-hidden focus:border-light-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-gutter-xs">
                    <label htmlFor="prod-price" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-medium">
                      Prix (GNF)
                    </label>
                    <input
                      id="prod-price"
                      type="text"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      required
                      className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface outline-hidden focus:border-light-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-gutter-xs">
                  <label htmlFor="prod-desc" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-medium">
                    Description
                  </label>
                  <textarea
                    id="prod-desc"
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-body text-body-md text-light-on-surface dark:text-dark-on-surface outline-hidden focus:border-light-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="self-start inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary font-label text-label-lg hover:opacity-90 active:scale-98 transition shadow-xs font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-title-md">add_circle</span>
                  <span>Publier l'article</span>
                </button>
              </form>
            </section>

            {/* Right: Create Discount / Promo Code */}
            <section className="lg:col-span-5 flex flex-col gap-gutter-lg">
              <div className="p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-md">
                <h2 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-bold">
                  Créer une remise / Code Promo
                </h2>

                <form onSubmit={handleCreatePromo} className="flex flex-col gap-gutter-md">
                  <div className="flex flex-col gap-gutter-xs">
                    <label htmlFor="promo-code" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-medium">
                      Code promo
                    </label>
                    <input
                      id="promo-code"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Ex : FANTA15"
                      required
                      className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface uppercase outline-hidden focus:border-light-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-gutter-md">
                    <div className="flex flex-col gap-gutter-xs">
                      <label htmlFor="promo-val" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-medium">
                        Réduction
                      </label>
                      <input
                        id="promo-val"
                        type="text"
                        value={promoVal}
                        onChange={(e) => setPromoVal(e.target.value)}
                        className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface outline-hidden"
                      />
                    </div>

                    <div className="flex flex-col gap-gutter-xs">
                      <label htmlFor="promo-min" className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-medium">
                        Panier min.
                      </label>
                      <input
                        id="promo-min"
                        type="text"
                        value={promoMin}
                        onChange={(e) => setPromoMin(e.target.value)}
                        className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-gutter-lg py-3 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary font-label text-label-lg hover:bg-light-surface-variant font-bold transition cursor-pointer"
                  >
                    Activer le code promo
                  </button>
                </form>
              </div>

              {/* Active Promos List */}
              <div className="p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-sm">
                <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
                  Promos actives
                </h3>
                <div className="flex flex-col gap-gutter-xs">
                  {activePromos.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-gutter-md rounded-md bg-light-primary-container/60 dark:bg-dark-primary-container/60 border border-light-outline/40 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-mono-md font-bold text-light-primary dark:text-dark-primary">
                          {p.code}
                        </span>
                        <p className="text-xs text-light-on-surface-variant">Min. {p.min}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-light-primary text-light-on-primary font-mono text-mono-sm font-bold">
                        -{p.discount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        ) : (
          /* Dashboard & Live Orders & Inventory (espace_business_tableau_de_bord.html) */
          <main className="flex-1 p-gutter-lg flex flex-col gap-gutter-lg">
            {/* Restora-Style Photo Welcome Banner */}
            <section className="relative rounded-xl overflow-hidden border border-light-outline dark:border-dark-outline">
              <img
                src="https://lh3.googleusercontent.com/aida/ALJJyrDOVbyCG7iDk1IqvVsS3i9m3bqn_yDySv4ygE4Mo59SXzlDAQpJv_kquFGVRLcdpgs51hz7PdjG6t_2FS44qtBZQ9GRAscCnB0AC9XRcptw9UB4jijVXD_FtOn3n0yHcUzqeOeNFzla-4169GT5FD7wsqef3RfIjjFeuN7_Fbt3ysP5UgrVyL_rG0sALBcukd4SY3nKwn6DiesytRju-ZF6u6ENcATvEXWeqWntTnUc77gni6-34Kc4yDoCpFJLKg"
                alt="Cuisine Chez Fanta Conakry"
                className="w-full h-36 sm:h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark-surface/95 via-dark-surface/75 to-transparent p-gutter-lg sm:p-gutter-xl flex flex-col justify-center gap-gutter-xs">
                <h1 className="font-headline text-headline-lg text-white font-bold">
                  Bonjour, Fanta
                </h1>
                <p className="font-body text-body-md text-dark-on-surface-variant max-w-lg">
                  Voici la performance et l'inventaire des ventes à Kipé pour la période : <strong className="text-white capitalize">{period}</strong>.
                </p>
              </div>
            </section>

            {/* 4 Financial KPI Cards (Matching Stitch Ultra) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter-md">
              <article className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex items-center justify-between gap-gutter-md">
                <div className="flex flex-col gap-gutter-xs">
                  <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Ventes ({period})
                  </span>
                  <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
                    {currentStats.sales}
                  </span>
                  <span className="font-label text-label-sm text-light-primary dark:text-dark-primary font-semibold">
                    {currentStats.salesDiff}
                  </span>
                </div>
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary shrink-0">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">payments</span>
                </span>
              </article>

              <article className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex items-center justify-between gap-gutter-md">
                <div className="flex flex-col gap-gutter-xs">
                  <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Commandes actives
                  </span>
                  <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
                    {currentStats.orders}
                  </span>
                  <span className="font-label text-label-sm text-courier font-semibold">
                    {currentStats.ordersDetail}
                  </span>
                </div>
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-light-surface-container dark:bg-dark-surface-container text-courier shrink-0">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">receipt_long</span>
                </span>
              </article>

              <article className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex items-center justify-between gap-gutter-md">
                <div className="flex flex-col gap-gutter-xs">
                  <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Ventes du mois
                  </span>
                  <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
                    {currentStats.month}
                  </span>
                  <span className="font-label text-label-sm text-partner font-semibold">
                    {currentStats.monthDetail}
                  </span>
                </div>
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-light-surface-container dark:bg-dark-surface-container text-partner shrink-0">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">trending_up</span>
                </span>
              </article>

              <article className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex items-center justify-between gap-gutter-md">
                <div className="flex flex-col gap-gutter-xs">
                  <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Bilan annuel 2026
                  </span>
                  <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
                    {currentStats.year}
                  </span>
                  <span className="font-label text-label-sm text-light-primary dark:text-dark-primary font-semibold">
                    {currentStats.yearDetail}
                  </span>
                </div>
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-accent text-on-accent shrink-0 font-bold">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">star</span>
                </span>
              </article>
            </section>

            {/* Sales Chart + Live Orders Grid */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-gutter-lg items-start">
              {/* Sales Bar Chart (Today's Sales Overview in GNF) */}
              <div className="xl:col-span-5 p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-md">
                <div className="flex items-center justify-between">
                  <h2 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-bold">
                    Courbe des ventes (GNF)
                  </h2>
                  <span className="px-2.5 py-1 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary font-label text-label-sm font-semibold capitalize">
                    {period}
                  </span>
                </div>

                <div className="h-44 flex items-end justify-between gap-gutter-sm pt-gutter-md border-b border-light-outline dark:border-dark-outline pb-gutter-sm">
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-14 rounded-t-sm bg-light-primary-container dark:bg-dark-primary-container transition-all hover:opacity-80" />
                    <span className="font-label text-label-sm text-light-on-surface-variant">10h</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-24 rounded-t-sm bg-light-primary-container dark:bg-dark-primary-container transition-all hover:opacity-80" />
                    <span className="font-label text-label-sm text-light-on-surface-variant">12h</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-36 rounded-t-sm bg-light-primary dark:bg-dark-primary shadow-xs transition-all hover:opacity-80" />
                    <span className="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface font-bold">14h</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-20 rounded-t-sm bg-light-primary-container dark:bg-dark-primary-container transition-all hover:opacity-80" />
                    <span className="font-label text-label-sm text-light-on-surface-variant">16h</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-32 rounded-t-sm bg-light-primary dark:bg-dark-primary shadow-xs transition-all hover:opacity-80" />
                    <span className="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface font-bold">19h</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-28 rounded-t-sm bg-light-primary-container dark:bg-dark-primary-container transition-all hover:opacity-80" />
                    <span className="font-label text-label-sm text-light-on-surface-variant">21h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Pic d'affluence constaté entre 13h et 20h
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast('Rapport PDF', 'Téléchargement de l inventaire des ventes Chez Fanta.', 'success')}
                    className="font-label text-label-md text-light-primary dark:text-dark-primary hover:underline font-semibold cursor-pointer"
                  >
                    Exporter PDF
                  </button>
                </div>
              </div>

              {/* Live Order Cards Grid (Matching Stitch Ultra Aloom-Style) */}
              <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-gutter-md">
                {/* Order 1: Mamadou Diallo */}
                <article className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col justify-between gap-gutter-md">
                  <div className="flex items-center justify-between gap-gutter-sm">
                    <div>
                      <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface block font-bold">
                        Mamadou Diallo
                      </span>
                      <span className="font-mono text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        #SNY-8421 · il y a 2 min
                      </span>
                    </div>
                    <span
                      className={`shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-full font-label text-label-sm font-semibold ${
                        orderStatuses['SNY-8421'] === 'Prête'
                          ? 'bg-light-primary-container text-light-primary'
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {orderStatuses['SNY-8421']}
                    </span>
                  </div>

                  <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant flex flex-col gap-1 border-y border-light-outline dark:border-dark-outline py-gutter-sm">
                    <div className="flex justify-between">
                      <span>2× Maffé Tiga au Bœuf</span>
                      <span className="font-mono font-semibold">90 000 GNF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1× Jus de Bissap Frais</span>
                      <span className="font-mono font-semibold">12 000 GNF</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
                      102 000 GNF
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMarkOrderReady('SNY-8421')}
                      className="px-gutter-md py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary font-label text-label-sm font-bold hover:opacity-90 transition cursor-pointer shadow-xs"
                    >
                      {orderStatuses['SNY-8421'] === 'Prête' ? 'Remis au rider' : 'Marquer prêt'}
                    </button>
                  </div>
                </article>

                {/* Order 2: Aïssatou Barry */}
                <article className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col justify-between gap-gutter-md">
                  <div className="flex items-center justify-between gap-gutter-sm">
                    <div>
                      <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface block font-bold">
                        Aïssatou Barry
                      </span>
                      <span className="font-mono text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        #SNY-8422 · il y a 8 min
                      </span>
                    </div>
                    <span
                      className={`shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-full font-label text-label-sm font-semibold ${
                        orderStatuses['SNY-8422'] === 'Prête'
                          ? 'bg-light-primary-container text-light-primary'
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {orderStatuses['SNY-8422']}
                    </span>
                  </div>

                  <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant flex flex-col gap-1 border-y border-light-outline dark:border-dark-outline py-gutter-sm">
                    <div className="flex justify-between">
                      <span>1× Capitaine Braisé Conakry</span>
                      <span className="font-mono font-semibold">65 000 GNF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1× Portion Alloco Doré</span>
                      <span className="font-mono font-semibold">15 000 GNF</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
                      80 000 GNF
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMarkOrderReady('SNY-8422')}
                      className="px-gutter-md py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary font-label text-label-sm font-bold hover:opacity-90 transition cursor-pointer shadow-xs"
                    >
                      {orderStatuses['SNY-8422'] === 'Prête' ? 'Remis au rider' : 'Marquer prêt'}
                    </button>
                  </div>
                </article>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
};
