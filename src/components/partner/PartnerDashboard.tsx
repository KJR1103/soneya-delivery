import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';
import { Product, Order } from '../../types';
import { SettingsView } from '../common/SettingsView';
import {
  LayoutDashboard,
  Receipt,
  UtensilsCrossed,
  Package,
  CircleDollarSign,
  Settings,
  Headphones,
  Search,
  Plus,
  Star,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  TrendingUp,
  Download,
  Eye,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const PartnerDashboard: React.FC = () => {
  const {
    partners,
    orders,
    updateOrderStatus,
    addProductToPartner,
    updatePartnerStock,
    updatePartnerProduct,
    showToast,
    setShowLandingPortal,
  } = useApp();

  const partner = partners[0] || {
    id: 'chez-fanta',
    name: 'Chez Fanta - Délices de Guinée',
    category: 'restaurants',
    quartierName: 'Kipé',
    isOpen: true,
    products: [],
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'catalog' | 'inventory' | 'finances' | 'support' | 'settings'>('dashboard');
  const [period, setPeriod] = useState<'jour' | 'semaine' | 'mois' | 'annee'>('jour');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);

  // New product form states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategory, setProdCategory] = useState('Plats Traditionnels');
  const [prodImage, setProdImage] = useState(
    'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80'
  );
  const [isProdDailySpecial, setIsProdDailySpecial] = useState(false);

  // Live order status management
  const [orderStatuses, setOrderStatuses] = useState<Record<string, 'received' | 'preparing' | 'ready' | 'picked_up'>>({
    'sny-8421': 'preparing',
    'sny-8422': 'received',
    'sny-8423': 'ready',
  });

  const handleUpdateStatus = (orderId: string, nextStatus: 'received' | 'preparing' | 'ready' | 'picked_up') => {
    setOrderStatuses((prev) => ({
      ...prev,
      [orderId]: nextStatus,
    }));
    const statusLabels = {
      received: 'Reçue',
      preparing: 'En cuisine',
      ready: 'Prête pour le coursier',
      picked_up: 'Remise au rider',
    };
    showToast('Statut mis à jour', `Commande #${orderId.toUpperCase()} : ${statusLabels[nextStatus]}`, 'success');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    const cleanPrice = parseInt(prodPrice.replace(/\D/g, ''), 10) || 45000;
    addProductToPartner(partner.id, {
      name: prodName.trim(),
      priceGnf: cleanPrice,
      description: prodDesc.trim() || 'Recette savoureuse préparée avec des ingrédients frais de Conakry.',
      image: prodImage,
      category: prodCategory,
      available: true,
      isDailySpecial: isProdDailySpecial,
      salesCount: 0,
      prepTimeMin: 20,
    });
    showToast('Produit ajouté', `${prodName} a été ajouté au menu de ${partner.name}.`, 'success');
    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setIsAddProductOpen(false);
  };

  const handleToggleDailySpecial = (prod: Product) => {
    const updated = !prod.isDailySpecial;
    updatePartnerProduct(partner.id, prod.id, { isDailySpecial: updated });
    showToast(
      updated ? 'Élu Plat du Jour ⭐' : 'Plat du jour retiré',
      `${prod.name} est ${updated ? 'maintenant mis en vedette pour les clients' : 'remis en affichage standard'}.`,
      'info'
    );
  };

  const handleToggleAvailability = (prod: Product) => {
    const nextState = !prod.available;
    updatePartnerStock(partner.id, prod.id, nextState);
    showToast(
      nextState ? 'Produit disponible' : 'Produit épuisé',
      `${prod.name} est ${nextState ? 'activé pour les commandes' : 'marqué en rupture temporaire'}.`,
      nextState ? 'success' : 'status'
    );
  };

  // Dynamic statistics
  const statsMap = {
    jour: {
      salesGnf: 4850000,
      ordersCount: 18,
      commissionSoneyaGnf: 582000,
      netPayoutGnf: 4268000,
      avgPrepMin: 18,
    },
    semaine: {
      salesGnf: 29400000,
      ordersCount: 114,
      commissionSoneyaGnf: 3528000,
      netPayoutGnf: 25872000,
      avgPrepMin: 19,
    },
    mois: {
      salesGnf: 118500000,
      ordersCount: 462,
      commissionSoneyaGnf: 14220000,
      netPayoutGnf: 104280000,
      avgPrepMin: 17,
    },
    annee: {
      salesGnf: 1240000000,
      ordersCount: 4890,
      commissionSoneyaGnf: 148800000,
      netPayoutGnf: 1091200000,
      avgPrepMin: 18,
    },
  };

  const currentStats = statsMap[period];

  // Sample live incoming orders for the merchant
  const livePartnerOrders: (Order & { cookingNotes?: string })[] = [
    {
      id: 'sny-8421',
      trackingNumber: 'SNY-8421',
      deliveryCode: '4921',
      createdAt: new Date(Date.now() - 6 * 60000).toISOString(),
      partnerId: partner.id,
      partnerName: partner.name,
      partnerPhone: '+224 622 10 20 30',
      partnerLat: 9.5855,
      partnerLng: -13.6358,
      partnerAddress: 'Centre Commercial Prima Center, Kipé',
      clientName: 'Mamadou Bailo Diallo',
      clientPhone: '+224 622 45 67 89',
      clientAddress: 'Villa 12, Rue KP-4, Kipé Centre',
      clientQuartier: 'Kipé',
      clientLat: 9.589,
      clientLng: -13.632,
      deliveryLandmark: 'Portail blanc face à la mosquée de Kipé',
      cookingNotes: 'Piment très modéré s\'il vous plaît, sauce bien chaude',
      items: [
        {
          product: {
            id: 'p1',
            name: 'Maffé Tiga Authentique au Bœuf Fumé',
            description: 'Sauce arachide Kindia',
            priceGnf: 45000,
            image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80',
            category: 'Plats',
            available: true,
          },
          quantity: 2,
          partnerId: partner.id,
          partnerName: partner.name,
        },
        {
          product: {
            id: 'p2',
            name: 'Jus de Bissap Artisanal',
            description: 'Fleurs d\'hibiscus et menthe fraîche',
            priceGnf: 12000,
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
            category: 'Boissons',
            available: true,
          },
          quantity: 1,
          partnerId: partner.id,
          partnerName: partner.name,
        },
      ],
      itemsSubtotalGnf: 102000,
      deliveryDistanceKm: 1.8,
      deliveryFeeGnf: 12000,
      serviceFeeGnf: 3000,
      tipGnf: 5000,
      discountGnf: 0,
      totalGnf: 122000,
      paymentMethod: 'orange_money',
      status: 'preparing',
      estimatedDeliveryMinutes: 20,
      partnerPayoutGnf: 89760,
      courierPayoutGnf: 14600,
      soneyaCommissionGnf: 17640,
      paymentFeeGnf: 3355,
      commissionRatePercent: 12,
      timeline: [],
    },
    {
      id: 'sny-8422',
      trackingNumber: 'SNY-8422',
      deliveryCode: '7104',
      createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
      partnerId: partner.id,
      partnerName: partner.name,
      partnerPhone: '+224 622 10 20 30',
      partnerLat: 9.5855,
      partnerLng: -13.6358,
      partnerAddress: 'Centre Commercial Prima Center, Kipé',
      clientName: 'Aïssatou Barry',
      clientPhone: '+224 664 12 90 34',
      clientAddress: 'Immeuble KPC, Camayenne',
      clientQuartier: 'Camayenne',
      clientLat: 9.54,
      clientLng: -13.68,
      deliveryLandmark: '3ème étage, porte B, code 1234',
      cookingNotes: 'Extra oignons caramélisés avec le capitaine',
      items: [
        {
          product: {
            id: 'p3',
            name: 'Riz Gras Guinéen au Capitaine Frais',
            description: 'Poisson capitaine doré et légumes',
            priceGnf: 55000,
            image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
            category: 'Plats',
            available: true,
          },
          quantity: 1,
          partnerId: partner.id,
          partnerName: partner.name,
        },
      ],
      itemsSubtotalGnf: 55000,
      deliveryDistanceKm: 4.2,
      deliveryFeeGnf: 18000,
      serviceFeeGnf: 3000,
      tipGnf: 0,
      discountGnf: 10000,
      totalGnf: 66000,
      paymentMethod: 'mtn_momo',
      status: 'submitted',
      estimatedDeliveryMinutes: 25,
      partnerPayoutGnf: 48400,
      courierPayoutGnf: 14400,
      soneyaCommissionGnf: 12200,
      paymentFeeGnf: 1815,
      commissionRatePercent: 12,
      timeline: [],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] text-[#0F172A] font-body antialiased">
      {/* Sidebar - Desktop & Tablet navigation in Soneya Deep Blue */}
      <aside className="w-full lg:w-64 lg:shrink-0 bg-[#1E3A8A] text-white flex flex-col justify-between p-5 border-r border-[#1E3A8A]">
        <div className="flex flex-col gap-6">
          {/* Header Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#1E3A8A] flex items-center justify-center font-black text-xl shadow-xs">
                S
              </div>
              <div>
                <span className="font-headline font-black text-base text-white tracking-tight block">
                  Soneya Pro
                </span>
                <span className="text-[11px] text-[#DCE3F4]">Espace Entreprise</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setShowLandingPortal(true);
              }}
              className="text-white/70 hover:text-white p-1 rounded-lg text-xs"
              title="Retour accueil"
            >
              Quitter
            </button>
          </div>

          {/* Commerce active pill */}
          <div className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="min-w-0">
              <strong className="text-xs font-bold text-white block truncate">{partner.name}</strong>
              <span className="text-[10px] text-[#DCE3F4] block">{partner.quartierName || 'Kipé'} · En service</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#1E3A8A] font-bold shadow-sm'
                  : 'text-[#DCE3F4] hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tableau de bord</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeTab === 'orders'
                  ? 'bg-white text-[#1E3A8A] font-bold shadow-sm'
                  : 'text-[#DCE3F4] hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4" />
                <span>Commandes</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#D8432F] text-white text-[11px] font-bold">
                {livePartnerOrders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeTab === 'catalog'
                  ? 'bg-white text-[#1E3A8A] font-bold shadow-sm'
                  : 'text-[#DCE3F4] hover:bg-white/10 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Produits &amp; Menu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeTab === 'inventory'
                  ? 'bg-white text-[#1E3A8A] font-bold shadow-sm'
                  : 'text-[#DCE3F4] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Stock &amp; Inventaire</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('finances')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeTab === 'finances'
                  ? 'bg-white text-[#1E3A8A] font-bold shadow-sm'
                  : 'text-[#DCE3F4] hover:bg-white/10 hover:text-white'
              }`}
            >
              <CircleDollarSign className="w-4 h-4" />
              <span>Finances &amp; Payouts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('support')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeTab === 'support'
                  ? 'bg-white text-[#1E3A8A] font-bold shadow-sm'
                  : 'text-[#DCE3F4] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Support Partenaire</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-white text-[#1E3A8A] font-bold shadow-sm'
                  : 'text-[#DCE3F4] hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Paramètres</span>
            </button>
          </nav>
        </div>

        {/* Support Direct Call Box */}
        <div className="mt-6 pt-4 border-t border-white/15 text-xs text-[#DCE3F4]">
          <p className="font-bold text-white">Ligne directe commerces :</p>
          <a href="tel:+224622000000" className="text-[#F8FAFC] underline font-mono text-[11px] block mt-1">
            +224 622 00 00 00
          </a>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-lg font-extrabold text-[#1E3A8A] font-headline truncate">
              {activeTab === 'dashboard' && 'Tableau de bord commercial'}
              {activeTab === 'orders' && 'Commandes en direct'}
              {activeTab === 'catalog' && 'Gestion du Catalogue & Produits'}
              {activeTab === 'inventory' && 'Stock & Inventaire des ventes'}
              {activeTab === 'finances' && 'Finances & Rapprochement'}
              {activeTab === 'support' && 'Assistance & Support Partenaire'}
              {activeTab === 'settings' && 'Paramètres du commerce'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Period switcher */}
            {(activeTab === 'dashboard' || activeTab === 'finances') && (
              <div className="flex bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] text-xs font-semibold">
                {(['jour', 'semaine', 'mois', 'annee'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded-lg capitalize transition cursor-pointer ${
                      period === p ? 'bg-[#1E3A8A] text-white font-bold shadow-xs' : 'text-[#64748B] hover:text-[#1E3A8A]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'catalog' && (
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#D8432F] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau plat</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="p-6 flex-1 flex flex-col gap-6 max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 m-reveal">
              {/* 4 Financial KPIs in Ivory & White Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <article className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748B]">Ventes ({period})</span>
                  <span className="text-2xl font-extrabold text-[#1E3A8A] font-headline">
                    {formatGnf(currentStats.salesGnf)}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +18% de croissance
                  </span>
                </article>

                <article className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748B]">Commandes traitées</span>
                  <span className="text-2xl font-extrabold text-[#1E3A8A] font-headline">
                    {currentStats.ordersCount}
                  </span>
                  <span className="text-xs text-[#64748B]">Taux de complétion 99.2%</span>
                </article>

                <article className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748B]">Net à reverser (MoMo)</span>
                  <span className="text-2xl font-extrabold text-[#D8432F] font-headline">
                    {formatGnf(currentStats.netPayoutGnf)}
                  </span>
                  <span className="text-xs text-[#64748B]">Commission 12% déduite</span>
                </article>

                <article className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748B]">Temps moyen prép.</span>
                  <span className="text-2xl font-extrabold text-[#1E3A8A] font-headline">
                    {currentStats.avgPrepMin} min
                  </span>
                  <span className="text-xs text-[#64748B]">Conforme aux standards</span>
                </article>
              </div>

              {/* Live Orders preview + Hourly sales curve */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Hourly Sales Chart */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#1E3A8A]">Volume des ventes horaires</h3>
                      <p className="text-xs text-[#64748B]">Activité de midi à 21h à Conakry</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DCE3F4] text-[#1E3A8A] text-xs font-bold">
                      Aujourd'hui
                    </span>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-2 pt-4 border-b border-[#E2E8F0] pb-2">
                    {[
                      { h: '11h', val: 25 },
                      { h: '12h', val: 65 },
                      { h: '13h', val: 100 },
                      { h: '14h', val: 80 },
                      { h: '17h', val: 35 },
                      { h: '19h', val: 90 },
                      { h: '21h', val: 45 },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div
                          className={`w-full rounded-t-md transition-all hover:opacity-80 ${
                            bar.val === 100 ? 'bg-[#D8432F]' : 'bg-[#1E3A8A]'
                          }`}
                          style={{ height: `${bar.val}%` }}
                        />
                        <span className="text-[11px] font-semibold text-[#64748B]">{bar.h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span>Pic d'affluence : 13h - 14h (Déjeuner)</span>
                    <button
                      type="button"
                      onClick={() => showToast('Rapport téléchargé', 'Rapport des ventes exporté.', 'success')}
                      className="text-[#1E3A8A] font-bold hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Rapport PDF</span>
                    </button>
                  </div>
                </div>

                {/* Orders Incoming list */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#1E3A8A]">Commandes entrantes en direct</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#1E3A8A] hover:underline"
                    >
                      Voir toutes ({livePartnerOrders.length})
                    </button>
                  </div>

                  {livePartnerOrders.map((ord) => {
                    const status = orderStatuses[ord.id] || 'preparing';
                    return (
                      <article
                        key={ord.id}
                        className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-3 hover:border-[#1E3A8A] transition cursor-pointer"
                        onClick={() => setSelectedOrderForDetails(ord)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-headline font-extrabold text-sm text-[#1E3A8A]">
                              #{ord.trackingNumber}
                            </span>
                            <span className="text-xs text-[#64748B]">· {ord.clientName}</span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              status === 'ready'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'preparing'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-[#DCE3F4] text-[#1E3A8A]'
                            }`}
                          >
                            {status === 'ready' ? 'Prête' : status === 'preparing' ? 'En cuisine' : 'Nouvelle'}
                          </span>
                        </div>

                        <div className="text-xs text-[#0F172A] divide-y divide-[#E2E8F0]/60">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="py-1 flex justify-between">
                              <span>
                                {it.quantity}x {it.product.name}
                              </span>
                              <span className="font-mono font-bold text-[#1E3A8A]">
                                {formatGnf(it.product.priceGnf * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {ord.cookingNotes && (
                          <div className="p-2 rounded-lg bg-[#EFE6D8]/60 text-[11px] text-[#64748B] flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-[#D8432F] shrink-0" />
                            <span>Note client : {ord.cookingNotes}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]/60">
                          <span className="font-headline font-extrabold text-sm text-[#1E3A8A]">
                            Total : {formatGnf(ord.itemsSubtotalGnf)}
                          </span>

                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {status === 'received' && (
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'preparing')}
                                className="px-3 py-1.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:opacity-90"
                              >
                                Mettre en cuisine
                              </button>
                            )}
                            {status === 'preparing' && (
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'ready')}
                                className="px-3 py-1.5 rounded-xl bg-[#D8432F] text-white text-xs font-bold hover:opacity-90 shadow-sm"
                              >
                                Marquer prête
                              </button>
                            )}
                            {status === 'ready' && (
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'picked_up')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:opacity-90"
                              >
                                Remis au rider
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrderForDetails(ord)}
                              className="w-8 h-8 rounded-xl border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8FAFC]"
                              title="Détails"
                            >
                              <Eye className="w-4 h-4 text-[#64748B]" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL ORDERS & MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-4 m-reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">Toutes les commandes</h2>
                  <p className="text-xs text-[#64748B]">Consultez, préparez et validez les commandes en temps réel</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {livePartnerOrders.map((ord) => {
                  const status = orderStatuses[ord.id] || 'preparing';
                  return (
                    <article
                      key={ord.id}
                      className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                          <div>
                            <span className="font-headline font-black text-base text-[#1E3A8A]">
                              #{ord.trackingNumber}
                            </span>
                            <p className="text-xs text-[#64748B] mt-0.5">
                              Client : <strong>{ord.clientName}</strong> ({ord.clientQuartier})
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCE3F4] text-[#1E3A8A]">
                            Code PIN : {ord.deliveryCode}
                          </span>
                        </div>

                        <div className="py-3 flex flex-col gap-1.5 text-xs">
                          {ord.items.map((item, i) => (
                            <div key={i} className="flex justify-between font-semibold">
                              <span>
                                {item.quantity}x {item.product.name}
                              </span>
                              <span className="font-mono text-[#1E3A8A]">
                                {formatGnf(item.product.priceGnf * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {ord.cookingNotes && (
                          <div className="p-2.5 rounded-xl bg-[#EFE6D8]/70 text-xs text-[#0F172A] mb-3">
                            <strong>Note spéciale :</strong> {ord.cookingNotes}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                        <span className="font-headline font-extrabold text-base text-[#1E3A8A]">
                          {formatGnf(ord.itemsSubtotalGnf)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrderForDetails(ord)}
                            className="px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#1E3A8A] hover:bg-[#F8FAFC]"
                          >
                            Consulter
                          </button>

                          {status !== 'ready' && status !== 'picked_up' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'ready')}
                              className="px-4 py-2 rounded-xl bg-[#D8432F] text-white text-xs font-bold hover:opacity-95 shadow-sm"
                            >
                              Valider &amp; Marquer prête
                            </button>
                          )}
                          {status === 'ready' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'picked_up')}
                              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:opacity-95"
                            >
                              Remise au livreur
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CATALOG & PRODUCT MANAGEMENT (Plats du jour ⭐) */}
          {activeTab === 'catalog' && (
            <div className="flex flex-col gap-6 m-reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">Catalogue des plats &amp; articles</h2>
                  <p className="text-xs text-[#64748B]">
                    Gérez vos prix, activez vos plats du jour ⭐ et ajustez votre menu
                  </p>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un plat</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {partner.products?.map((prod) => (
                  <article
                    key={prod.id}
                    className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-20 h-20 rounded-xl object-cover bg-[#DCE3F4]/50 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-bold text-sm text-[#0F172A] truncate" title={prod.name}>
                            {prod.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[#64748B] line-clamp-2 mt-0.5">{prod.description}</p>
                        <span className="font-headline font-extrabold text-sm text-[#1E3A8A] block mt-1">
                          {formatGnf(prod.priceGnf)}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Daily special & Availability */}
                    <div className="pt-3 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => handleToggleDailySpecial(prod)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold transition cursor-pointer ${
                          prod.isDailySpecial
                            ? 'bg-[#1E3A8A] text-white'
                            : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:text-[#1E3A8A]'
                        }`}
                        title="Mettre en vedette comme plat du jour"
                      >
                        <Star className={`w-3.5 h-3.5 ${prod.isDailySpecial ? 'fill-[#F4B028] text-[#F4B028]' : ''}`} />
                        <span>{prod.isDailySpecial ? 'Plat du jour' : 'Élire du jour'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(prod)}
                        className={`inline-flex items-center gap-1 font-semibold cursor-pointer ${
                          prod.available ? 'text-emerald-700' : 'text-[#D8432F]'
                        }`}
                      >
                        {prod.available ? (
                          <>
                            <ToggleRight className="w-5 h-5" />
                            <span>Disponible</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5" />
                            <span>Épuisé</span>
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STOCK & INVENTORY TABLE */}
          {activeTab === 'inventory' && (
            <div className="flex flex-col gap-4 m-reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">Inventaire &amp; Ventes par article</h2>
                  <p className="text-xs text-[#64748B]">
                    Suivez le stock en direct et le chiffre d'affaires cumulé par référence
                  </p>
                </div>
                <button
                  onClick={() => showToast('Export Excel', 'Fichier inventaire Chez Fanta téléchargé.', 'success')}
                  className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#1E3A8A] bg-white hover:bg-[#F8FAFC] flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter Inventaire (.csv)</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Plat / Article</th>
                      <th className="p-3.5">Catégorie</th>
                      <th className="p-3.5 text-right">Prix Unitaire</th>
                      <th className="p-3.5 text-center">Ventes cumulées</th>
                      <th className="p-3.5 text-right">CA Généré</th>
                      <th className="p-3.5 text-center">Plat du jour</th>
                      <th className="p-3.5 text-center">Disponibilité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]/60">
                    {partner.products?.map((prod) => {
                      const sales = prod.salesCount || 64;
                      const caGnf = sales * prod.priceGnf;
                      return (
                        <tr key={prod.id} className="hover:bg-[#F8FAFC]/80 transition">
                          <td className="p-3.5 flex items-center gap-2.5">
                            <img
                              src={prod.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-[#DCE3F4]/50 shrink-0"
                            />
                            <span className="font-bold text-[#0F172A]">{prod.name}</span>
                          </td>
                          <td className="p-3.5 text-[#64748B]">{prod.category}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-[#1E3A8A]">
                            {formatGnf(prod.priceGnf)}
                          </td>
                          <td className="p-3.5 text-center font-bold">{sales} cmd</td>
                          <td className="p-3.5 text-right font-mono font-bold text-[#1E3A8A]">
                            {formatGnf(caGnf)}
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleToggleDailySpecial(prod)}
                              className={`p-1 rounded-full ${
                                prod.isDailySpecial ? 'text-[#F4B028]' : 'text-[#E2E8F0] hover:text-[#64748B]'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${prod.isDailySpecial ? 'fill-[#F4B028]' : ''}`} />
                            </button>
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleToggleAvailability(prod)}
                              className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                                prod.available
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {prod.available ? 'En stock' : 'Épuisé'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: FINANCES & PAYOUTS */}
          {activeTab === 'finances' && (
            <div className="flex flex-col gap-6 m-reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">Rapprochement &amp; Versements Mobile Money</h2>
                  <p className="text-xs text-[#64748B]">
                    Suivi des commissions Soneya et des virements Orange Money / MTN MoMo
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <span className="text-xs text-[#64748B] font-semibold">Chiffre d'Affaires Brut</span>
                  <div className="text-2xl font-extrabold text-[#1E3A8A] font-headline mt-1">
                    {formatGnf(currentStats.salesGnf)}
                  </div>
                  <span className="text-xs text-[#64748B] mt-1 block">Sur la période sélectionnée</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <span className="text-xs text-[#64748B] font-semibold">Commission Plateforme (12%)</span>
                  <div className="text-2xl font-extrabold text-[#64748B] font-headline mt-1">
                    -{formatGnf(currentStats.commissionSoneyaGnf)}
                  </div>
                  <span className="text-xs text-[#64748B] mt-1 block">Frais de mise en relation &amp; logistique</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <span className="text-xs text-[#64748B] font-semibold">Net Reversé au Restaurant</span>
                  <div className="text-2xl font-extrabold text-emerald-700 font-headline mt-1">
                    {formatGnf(currentStats.netPayoutGnf)}
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                    ✓ Transféré quotidiennement sur Orange Money
                  </span>
                </div>
              </div>

              {/* Recent Payout Transfers */}
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-3">
                <h3 className="font-bold text-sm text-[#1E3A8A]">Derniers versements Orange Money &amp; MoMo</h3>
                <div className="divide-y divide-[#E2E8F0]/60 text-xs">
                  {[
                    { date: 'Hier, 23h30', ref: 'OM-GN-982144', mnt: 4120000, stat: 'Versé' },
                    { date: '20 Nov 2026', ref: 'OM-GN-979102', mnt: 3890000, stat: 'Versé' },
                    { date: '19 Nov 2026', ref: 'MOMO-GN-84102', mnt: 4340000, stat: 'Versé' },
                  ].map((p, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <strong className="text-[#0F172A] block">{p.ref}</strong>
                        <span className="text-[#64748B]">{p.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-700 block">{formatGnf(p.mnt)}</span>
                        <span className="text-emerald-600 font-bold text-[11px]">{p.stat}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SUPPORT */}
          {activeTab === 'support' && (
            <div className="max-w-2xl mx-auto w-full p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-4 m-reveal">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#DCE3F4] text-[#1E3A8A] flex items-center justify-center">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">Support &amp; Ligne Partenaire Soneya</h2>
                  <p className="text-xs text-[#64748B]">Une question sur un versement, un rider ou une commande ?</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-2 text-xs">
                <p className="font-bold text-[#0F172A]">Coordonnées d'astreinte commerçants :</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Téléphone : <strong>+224 622 00 00 00</strong> (7j/7, 9h - 23h)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Bureau Soneya : Immeuble Kipé Centre, Conakry</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast('Ticket ouvert', 'Un agent Soneya Business vous contacte sous 5 minutes.', 'success')}
                className="w-full py-3 rounded-xl bg-[#1E3A8A] text-white font-bold text-xs hover:opacity-90 cursor-pointer"
              >
                Ouvrir un ticket d'assistance prioritaire
              </button>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modal: Order Inspection Details */}
      {selectedOrderForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs m-reveal">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <span className="font-headline font-black text-lg text-[#1E3A8A]">
                  Commande #{selectedOrderForDetails.trackingNumber}
                </span>
                <p className="text-xs text-[#64748B]">
                  Code de sécurité client : <strong className="font-mono text-[#D8432F]">{selectedOrderForDetails.deliveryCode}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForDetails(null)}
                className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client Coordinates */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <strong>Client : {selectedOrderForDetails.clientName}</strong>
                <a
                  href={`tel:${selectedOrderForDetails.clientPhone}`}
                  className="px-2.5 py-1 rounded-lg bg-[#1E3A8A] text-white font-bold flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Appeler</span>
                </a>
              </div>
              <span className="text-[#64748B]">{selectedOrderForDetails.clientPhone}</span>
              <span className="text-[#64748B]">{selectedOrderForDetails.clientAddress} ({selectedOrderForDetails.clientQuartier})</span>
              {selectedOrderForDetails.deliveryLandmark && (
                <span className="italic text-[#1E3A8A]">Repère : {selectedOrderForDetails.deliveryLandmark}</span>
              )}
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
              <strong className="text-xs uppercase text-[#64748B]">Détail des plats commandés :</strong>
              <div className="divide-y divide-[#E2E8F0] text-xs">
                {selectedOrderForDetails.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between">
                    <div>
                      <strong className="text-[#0F172A]">{it.quantity}x {it.product.name}</strong>
                      {it.selectedOption && <p className="text-[#64748B]">Option : {it.selectedOption.name}</p>}
                    </div>
                    <span className="font-mono font-bold text-[#1E3A8A]">
                      {formatGnf(it.product.priceGnf * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and actions */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#64748B] block">Montant marchand net</span>
                <span className="font-headline font-black text-lg text-[#1E3A8A]">
                  {formatGnf(selectedOrderForDetails.itemsSubtotalGnf)}
                </span>
              </div>

              <button
                onClick={() => {
                  handleUpdateStatus(selectedOrderForDetails.id, 'ready');
                  setSelectedOrderForDetails(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#D8432F] text-white font-bold text-xs shadow-sm hover:opacity-95"
              >
                Marquer Prête pour le coursier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Product */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs m-reveal">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-headline font-bold text-base text-[#1E3A8A]">Nouveau plat au menu</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#0F172A]">Nom du plat</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ex : Riz Gras Capitaine Braisé"
                  required
                  className="px-3 py-2 rounded-xl border border-[#E2E8F0] outline-hidden focus:border-[#1E3A8A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#0F172A]">Prix en GNF</label>
                  <input
                    type="text"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="Ex : 55 000"
                    required
                    className="px-3 py-2 rounded-xl border border-[#E2E8F0] font-mono outline-hidden focus:border-[#1E3A8A]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-[#0F172A]">Catégorie</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-[#E2E8F0] outline-hidden focus:border-[#1E3A8A]"
                  >
                    <option value="Plats Traditionnels">Plats Traditionnels</option>
                    <option value="Grillades">Grillades</option>
                    <option value="Boissons &amp; Jus">Boissons &amp; Jus</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#0F172A]">Description des ingrédients</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  rows={2}
                  placeholder="Ingrédients locaux, assaisonnement, accompagnement..."
                  className="px-3 py-2 rounded-xl border border-[#E2E8F0] outline-hidden focus:border-[#1E3A8A]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isProdDailySpecial}
                  onChange={(e) => setIsProdDailySpecial(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1E3A8A] accent-[#1E3A8A]"
                />
                <span className="font-bold text-[#1E3A8A]">Définir comme Plat du jour ⭐ pour les clients</span>
              </label>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#D8432F] text-white font-bold shadow-sm hover:opacity-95"
                >
                  Publier au menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
