import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf, formatTime } from '../../utils/formatters';
import { Product } from '../../types';
import { sound } from '../../utils/audio';

export const PartnerDashboard: React.FC = () => {
  const {
    partners,
    orders,
    updateOrderStatus,
    updatePartnerStock,
    addProductToPartner,
    updatePartnerProduct,
    deletePartnerProduct,
    subscribePartnerService,
    showToast,
  } = useApp();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || 'p-1');
  const partner = partners.find((p) => p.id === selectedPartnerId) || partners[0];
  const [isOpen, setIsOpen] = useState(partner?.isOpen ?? true);
  const [activeTab, setActiveTab] = useState<'commandes' | 'catalogue' | 'partage' | 'services'>('commandes');

  const [mobileKanbanCol, setMobileKanbanCol] = useState<
    'nouvelles' | 'preparation' | 'pretes' | 'terminees'
  >('nouvelles');
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(true);

  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogStockFilter, setCatalogStockFilter] = useState<
    'all' | 'in_stock' | 'out_of_stock'
  >('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // In-app reject / delete confirmations (no native window.prompt / window.confirm)
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Ingrédient en rupture / Rush cuisine');
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formPrepTime, setFormPrepTime] = useState('20');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const partnerOrders = orders.filter((o) => o.partnerId === partner?.id);

  const totalRevenueGnf =
    partnerOrders.reduce(
      (sum, o) => sum + (o.partnerPayoutGnf || o.itemsSubtotalGnf * 0.88),
      0
    ) + 420000;

  if (!partner) return null;

  const handleAIAssist = () => {
    if (!formName.trim()) {
      showToast(
        'Assistant IA',
        'Veuillez d abord saisir un nom de produit (ex: Poulet Yassa, Paracétamol, Jus de Bissap...)',
        'status'
      );
      return;
    }
    setIsGeneratingAI(true);

    setTimeout(() => {
      const q = formName.toLowerCase();
      let cat = 'Spécialités de Conakry';
      let desc =
        'Préparé avec soin le jour même avec des ingrédients frais sélectionnés sur les marchés de Conakry. Recette authentique et généreuse.';
      let price = 35000;
      let img =
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

      if (
        q.includes('poulet') ||
        q.includes('brais') ||
        q.includes('viande') ||
        q.includes('brochette')
      ) {
        cat = 'Grillades & Rôtisseries';
        desc =
          'Viande locale marinée aux épices du terroir guinéen, rôtie à cœur et croustillante, servie avec alloco ou frites fraîches et oignons confits.';
        price = 55000;
        img =
          'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80';
      } else if (
        q.includes('maffé') ||
        q.includes('riz') ||
        q.includes('sauce') ||
        q.includes('gras')
      ) {
        cat = 'Plats Traditionnels';
        desc =
          'Plat emblématique cuisiné selon la tradition guinéenne avec riz étuvé parfumé et sauce onctueuse aux saveurs de Kindia.';
        price = 45000;
        img =
          'https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&auto=format&fit=crop&q=80';
      } else if (
        q.includes('chawarma') ||
        q.includes('burger') ||
        q.includes('sandwich') ||
        q.includes('wrap')
      ) {
        cat = 'Fast Food & Snacks';
        desc =
          'Pain croustillant garni à souhait, sauce maison crémeuse et légumes croquants, servi chaud sous emballage thermique.';
        price = 35000;
        img =
          'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80';
      } else if (
        q.includes('jus') ||
        q.includes('bissap') ||
        q.includes('gingembre') ||
        q.includes('eau')
      ) {
        cat = 'Boissons Fraîches';
        desc =
          'Boisson rafraîchissante préparée à base de fruits et plantes de Guinée Maritime, sans conservateur, servie glacée.';
        price = 15000;
        img =
          'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80';
      } else if (
        q.includes('paracétamol') ||
        q.includes('vitamine') ||
        q.includes('médicament') ||
        q.includes('pansement')
      ) {
        cat = 'Soins & Pharmacie';
        desc =
          'Produit certifié d officine conforme aux normes pharmaceutiques guinéennes, conservé en lieu climatisé.';
        price = 20000;
        img =
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';
      }

      setFormCategory(cat);
      setFormDescription(desc);
      setFormPrice(price.toString());
      setFormImage(img);
      setIsGeneratingAI(false);
      showToast(
        'Assistant IA Soneya',
        'Catégorie, description gourmande et prix de référence suggérés !',
        'success'
      );
    }, 750);
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormPrice('35000');
    setFormCategory('Plats du jour');
    setFormDescription('Préparé le jour même avec des ingrédients frais de Conakry.');
    setFormImage(
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
    );
    setFormPrepTime('20');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.priceGnf.toString());
    setFormCategory(product.category);
    setFormDescription(product.description);
    setFormImage(product.image);
    setFormPrepTime((product.prepTimeMin || 20).toString());
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(formPrice.replace(/\D/g, ''), 10) || 10000;
    const prepTime = parseInt(formPrepTime, 10) || 15;

    if (!formName.trim()) {
      showToast('Erreur', 'Veuillez saisir un nom pour l’article', 'status');
      return;
    }

    if (editingProduct) {
      updatePartnerProduct(partner.id, editingProduct.id, {
        name: formName,
        priceGnf: price,
        category: formCategory || 'Général',
        description: formDescription,
        image:
          formImage ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        prepTimeMin: prepTime,
      });
      showToast('Article mis à jour', `${formName} a été actualisé dans le menu.`, 'success');
      setEditingProduct(null);
    } else {
      addProductToPartner(partner.id, {
        name: formName,
        priceGnf: price,
        category: formCategory || 'Nouveautés',
        description: formDescription,
        image:
          formImage ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
        available: true,
        prepTimeMin: prepTime,
      });
      showToast('Article ajouté', `${formName} est désormais disponible à la vente.`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmRejectOrder = () => {
    if (!rejectOrderId) return;
    const reasonText = rejectReason.trim() || 'Établissement momentanément indisponible';
    updateOrderStatus(rejectOrderId, 'cancelled', `Refusée par le restaurant : ${reasonText}`);
    showToast('Commande refusée', `Motif notifié au client : ${reasonText}`, 'info');
    setRejectOrderId(null);
  };

  const shareUrl = `https://soneya.gn/p/${partner.id}`;
  const whatsappShareText = encodeURIComponent(
    `Retrouvez notre boutique "${partner.name}" en livraison express sur Soneya Delivery à Conakry ! Commandez en ligne avec Orange Money & MTN MoMo : ${shareUrl}`
  );

  return (
    <div className="max-w-5xl mx-auto px-gutter-sm sm:px-gutter-md lg:px-gutter-lg py-gutter-md pb-32 space-y-gutter-md">
      {/* Partner Header & Store Switcher */}
      <div className="p-gutter-md sm:p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs space-y-gutter-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-md min-w-0">
            <div className="w-12 h-12 rounded-md overflow-hidden bg-light-primary-container dark:bg-dark-surface-container-low ring-2 ring-light-outline dark:ring-dark-outline shrink-0">
              <img
                src={partner.logoImage}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-gutter-sm">
                <h1 className="font-headline font-black text-title-md text-light-on-surface dark:text-dark-on-surface truncate">
                  {partner.name}
                </h1>
                {partner.isFirstMonthExempt && (
                  <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-full bg-light-primary-container dark:bg-dark-surface-container-low text-partner dark:text-accent border border-light-outline dark:border-dark-outline shrink-0">
                    1er mois 0% com.
                  </span>
                )}
              </div>
              <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant truncate">
                {partner.quartierName} · Commission :{' '}
                {partner.isFirstMonthExempt
                  ? '0% (Offerte)'
                  : `${partner.commissionRatePercent ?? 12}%`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOpen(!isOpen);
              showToast(
                isOpen ? 'Commerce fermé' : 'Commerce ouvert',
                isOpen
                  ? 'Les clients ne peuvent plus commander temporairement'
                  : 'Vous recevez les commandes',
                'info'
              );
            }}
            className={`flex items-center justify-center gap-gutter-sm px-gutter-md py-gutter-sm rounded-md text-label-md font-bold transition shadow-xs cursor-pointer border min-h-[42px] shrink-0 ${
              isOpen
                ? 'bg-partner text-on-partner border-partner hover:opacity-90'
                : 'bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface border-light-outline dark:border-dark-outline'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen ? 'bg-on-partner animate-pulse' : 'bg-light-on-surface-variant'
              }`}
            />
            <span>{isOpen ? 'Ouvert aux commandes' : 'Fermé'}</span>
          </button>
        </div>

        {/* Change partner selector */}
        <div className="pt-gutter-sm border-t border-light-outline dark:border-dark-outline flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-sm text-body-sm">
          <span className="text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Sélectionner votre établissement :
          </span>
          <select
            value={selectedPartnerId}
            onChange={(e) => setSelectedPartnerId(e.target.value)}
            className="w-full sm:w-auto px-gutter-md py-gutter-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface text-label-md font-bold border border-light-outline dark:border-dark-outline focus:outline-none focus:border-partner min-h-[40px]"
          >
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.quartierName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-4 gap-gutter-xs bg-light-surface-container-low dark:bg-dark-surface p-gutter-xs rounded-xl border border-light-outline dark:border-dark-outline text-center">
        <button
          onClick={() => setActiveTab('commandes')}
          className={`shrink-0 px-gutter-md sm:px-gutter-sm py-2.5 text-label-sm font-bold rounded-md transition cursor-pointer min-h-[42px] ${
            activeTab === 'commandes'
              ? 'bg-partner text-on-partner shadow-xs'
              : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
          }`}
        >
          Commandes ({partnerOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('catalogue')}
          className={`shrink-0 px-gutter-md sm:px-gutter-sm py-2.5 text-label-sm font-bold rounded-md transition cursor-pointer min-h-[42px] ${
            activeTab === 'catalogue'
              ? 'bg-partner text-on-partner shadow-xs'
              : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
          }`}
        >
          Catalogue ({partner.products.length})
        </button>
        <button
          onClick={() => setActiveTab('partage')}
          className={`shrink-0 px-gutter-md sm:px-gutter-sm py-2.5 text-label-sm font-bold rounded-md transition cursor-pointer min-h-[42px] ${
            activeTab === 'partage'
              ? 'bg-partner text-on-partner shadow-xs'
              : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
          }`}
        >
          Partage & QR
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`shrink-0 px-gutter-md sm:px-gutter-sm py-2.5 text-label-sm font-bold rounded-md transition flex items-center justify-center gap-gutter-xs cursor-pointer min-h-[42px] ${
            activeTab === 'services'
              ? 'bg-partner text-on-partner shadow-xs'
              : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-title-md text-accent" aria-hidden="true">auto_awesome</span>
          <span>Services GHT</span>
        </button>
      </div>

      {/* TAB 1: COMMANDES KANBAN */}
      {activeTab === 'commandes' && (
        <div className="space-y-gutter-md">
          {/* Revenue metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter-md">
            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs">
              <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Net commerçant encaissé
              </div>
              <div className="font-mono font-black text-title-md sm:text-headline-sm text-partner dark:text-accent mt-gutter-xs">
                {formatGnf(totalRevenueGnf)}
              </div>
            </div>

            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs">
              <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Nouvelles à traiter
              </div>
              <div className="font-mono font-black text-title-md sm:text-headline-sm text-rose-600 dark:text-rose-400 mt-gutter-xs flex items-center gap-1.5">
                <span>{partnerOrders.filter((o) => o.status === 'submitted').length}</span>
                {partnerOrders.filter((o) => o.status === 'submitted').length > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                )}
              </div>
            </div>

            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs">
              <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                En préparation
              </div>
              <div className="font-mono font-black text-title-md sm:text-headline-sm text-amber-600 dark:text-accent mt-gutter-xs">
                {partnerOrders.filter((o) => o.status === 'preparing').length}
              </div>
            </div>

            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs">
              <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Note moyenne clients
              </div>
              <div className="font-mono font-black text-title-md sm:text-headline-sm text-light-on-surface dark:text-dark-on-surface mt-gutter-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-title-md text-accent" aria-hidden="true">star</span>
                <span>{partner.rating} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Flash Alert Banner */}
          {partnerOrders.filter((o) => o.status === 'submitted').length > 0 && (
            <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border-2 border-rose-500/80 shadow-md flex items-center justify-between gap-gutter-md animate-pulse">
              <div className="flex items-center gap-gutter-sm min-w-0">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping shrink-0" />
                <div className="min-w-0">
                  <div className="font-headline font-black text-label-md uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Flash : {partnerOrders.filter((o) => o.status === 'submitted').length}{' '}
                    Nouvelle(s) commande(s) reçue(s) !
                  </div>
                  <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Cliquez sur « Accepter » pour lancer la préparation sans tarder.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setAudioAlertEnabled(!audioAlertEnabled);
                  if (!audioAlertEnabled) sound.playAlert();
                }}
                className="p-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:border-partner transition shrink-0 cursor-pointer"
                title="Activer/Désactiver signal sonore"
              >
                <span
                  className="material-symbols-outlined text-title-md"
                  aria-hidden="true"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {audioAlertEnabled ? 'volume_up' : 'volume_off'}
                </span>
              </button>
            </div>
          )}

          {/* Kanban Mobile Switcher */}
          <div className="grid grid-cols-4 gap-gutter-xs bg-light-surface-container-low dark:bg-dark-surface p-gutter-xs rounded-xl border border-light-outline dark:border-dark-outline text-center lg:hidden">
            <button
              onClick={() => setMobileKanbanCol('nouvelles')}
              className={`py-2 text-label-sm font-bold rounded-md transition cursor-pointer flex flex-col items-center gap-0.5 min-h-[44px] justify-center ${
                mobileKanbanCol === 'nouvelles'
                  ? 'bg-partner text-on-partner shadow-xs'
                  : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
              }`}
            >
              <span className="flex items-center gap-gutter-xs">
                <span>Nouvelles</span>
                {partnerOrders.filter((o) => o.status === 'submitted').length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </span>
              <span className="text-mono-sm opacity-80">
                ({partnerOrders.filter((o) => o.status === 'submitted').length})
              </span>
            </button>

            <button
              onClick={() => setMobileKanbanCol('preparation')}
              className={`py-2 text-label-sm font-bold rounded-md transition cursor-pointer flex flex-col items-center gap-0.5 min-h-[44px] justify-center ${
                mobileKanbanCol === 'preparation'
                  ? 'bg-partner text-on-partner shadow-xs'
                  : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
              }`}
            >
              <span>En cours</span>
              <span className="text-mono-sm opacity-80">
                ({partnerOrders.filter((o) => o.status === 'preparing').length})
              </span>
            </button>

            <button
              onClick={() => setMobileKanbanCol('pretes')}
              className={`py-2 text-label-sm font-bold rounded-md transition cursor-pointer flex flex-col items-center gap-0.5 min-h-[44px] justify-center ${
                mobileKanbanCol === 'pretes'
                  ? 'bg-partner text-on-partner shadow-xs'
                  : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
              }`}
            >
              <span>Prêtes</span>
              <span className="text-mono-sm opacity-80">
                ({partnerOrders.filter((o) => o.status === 'ready').length})
              </span>
            </button>

            <button
              onClick={() => setMobileKanbanCol('terminees')}
              className={`py-2 text-label-sm font-bold rounded-md transition cursor-pointer flex flex-col items-center gap-0.5 min-h-[44px] justify-center ${
                mobileKanbanCol === 'terminees'
                  ? 'bg-partner text-on-partner shadow-xs'
                  : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
              }`}
            >
              <span>Livrées</span>
              <span className="text-mono-sm opacity-80">
                (
                {
                  partnerOrders.filter(
                    (o) => o.status === 'delivering' || o.status === 'delivered'
                  ).length
                }
                )
              </span>
            </button>
          </div>

          {/* KANBAN BOARD */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter-md items-start">
            {/* COL 1: NOUVELLES */}
            <div
              className={`space-y-gutter-md ${
                mobileKanbanCol !== 'nouvelles' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border-2 border-rose-500/50 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-gutter-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span className="font-headline font-black text-label-md uppercase tracking-wider text-light-on-surface dark:text-dark-on-surface">
                    1. Nouvelles
                  </span>
                </div>
                <span className="px-gutter-sm py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-extrabold text-label-sm">
                  {partnerOrders.filter((o) => o.status === 'submitted').length}
                </span>
              </div>

              {partnerOrders.filter((o) => o.status === 'submitted').length > 0 ? (
                partnerOrders
                  .filter((o) => o.status === 'submitted')
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border-2 border-rose-500/60 space-y-gutter-md shadow-md animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-label-md font-mono font-bold text-rose-600 dark:text-rose-400">
                          #{order.trackingNumber}
                        </span>
                        <span className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          {formatTime(order.createdAt)}
                        </span>
                      </div>

                      <div>
                        <div className="font-headline font-bold text-body-md text-light-on-surface dark:text-dark-on-surface">
                          {order.clientName}
                        </div>
                        <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          {order.clientQuartier}
                        </div>
                        {order.deliveryLandmark && (
                          <div className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mt-0.5 font-medium">
                            Repère : {order.deliveryLandmark}
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 rounded-md bg-light-primary-container/40 dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-body-sm space-y-gutter-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between font-medium gap-gutter-sm">
                            <span className="text-light-on-surface dark:text-dark-on-surface">
                              {it.quantity}x {it.product.name}
                            </span>
                            <span className="text-light-on-surface-variant dark:text-dark-on-surface-variant shrink-0">
                              {formatGnf(it.product.priceGnf * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-gutter-xs text-body-sm">
                        <span className="text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          Net restaurant
                        </span>
                        <span className="font-mono font-black text-body-md text-partner dark:text-accent">
                          {formatGnf(order.partnerPayoutGnf || order.itemsSubtotalGnf * 0.88)}
                        </span>
                      </div>

                      <div className="space-y-gutter-sm pt-gutter-xs">
                        <button
                          onClick={() => {
                            sound.playAlert();
                            updateOrderStatus(order.id, 'preparing', 'Acceptée par le manager');
                            showToast(
                              'Commande acceptée',
                              'Début de préparation. Le motard sera notifié dès que prêt.',
                              'success'
                            );
                          }}
                          className="w-full py-3.5 rounded-md bg-partner hover:opacity-90 text-on-partner font-headline font-black text-body-md uppercase tracking-wider flex items-center justify-center gap-gutter-sm shadow-sm transition active:scale-[0.99] cursor-pointer min-h-[48px]"
                        >
                          <span className="material-symbols-outlined text-title-lg" aria-hidden="true">check</span>
                          <span>Accepter</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectOrderId(order.id);
                            setRejectReason('Ingrédient en rupture / Rush cuisine');
                          }}
                          className="w-full py-2.5 rounded-md border border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface-variant dark:text-dark-on-surface-variant hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 font-headline font-bold text-label-md transition cursor-pointer text-center min-h-[42px]"
                        >
                          Refuser avec motif
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center bg-light-surface-container-low dark:bg-dark-surface rounded-xl border border-light-outline dark:border-dark-outline text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Aucune nouvelle commande en attente.
                </div>
              )}
            </div>

            {/* COL 2: EN PRÉPARATION */}
            <div
              className={`space-y-gutter-md ${
                mobileKanbanCol !== 'preparation' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-gutter-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-headline font-black text-label-md uppercase tracking-wider text-light-on-surface dark:text-dark-on-surface">
                    2. En Préparation
                  </span>
                </div>
                <span className="px-gutter-sm py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-label-sm">
                  {partnerOrders.filter((o) => o.status === 'preparing').length}
                </span>
              </div>

              {partnerOrders.filter((o) => o.status === 'preparing').length > 0 ? (
                partnerOrders
                  .filter((o) => o.status === 'preparing')
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-amber-300 dark:border-amber-700/60 space-y-gutter-md shadow-xs animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-label-md font-mono font-bold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          #{order.trackingNumber}
                        </span>
                        <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Au fourneau / Comptoir
                        </span>
                      </div>

                      <div>
                        <div className="font-headline font-bold text-body-md text-light-on-surface dark:text-dark-on-surface">
                          {order.clientName}
                        </div>
                        <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          {order.clientQuartier}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-md bg-light-primary-container/40 dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-body-sm space-y-gutter-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between font-medium gap-gutter-sm">
                            <span className="text-light-on-surface dark:text-dark-on-surface">
                              {it.quantity}x {it.product.name}
                            </span>
                            <span className="text-light-on-surface-variant dark:text-dark-on-surface-variant shrink-0">
                              {formatGnf(it.product.priceGnf * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          sound.playSuccess();
                          updateOrderStatus(
                            order.id,
                            'ready',
                            'Prête pour le coursier Soneya'
                          );
                          showToast(
                            'Commande prête',
                            'Le coursier dédié a été notifié pour venir récupérer le colis.',
                            'success'
                          );
                        }}
                        className="w-full py-4 rounded-md bg-light-on-surface dark:bg-dark-on-surface hover:opacity-90 text-light-surface dark:text-dark-surface font-headline font-black text-body-md uppercase tracking-wider flex items-center justify-center gap-gutter-sm shadow-md transition active:scale-[0.99] cursor-pointer min-h-[48px]"
                      >
                        <span className="material-symbols-outlined text-title-lg" aria-hidden="true">package_2</span>
                        <span>Marquer « Prête »</span>
                      </button>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center bg-light-surface-container-low dark:bg-dark-surface rounded-xl border border-light-outline dark:border-dark-outline text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Aucune commande en préparation.
                </div>
              )}
            </div>

            {/* COL 3: PRÊTES */}
            <div
              className={`space-y-gutter-md ${
                mobileKanbanCol !== 'pretes' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-gutter-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-light-primary" />
                  <span className="font-headline font-black text-label-md uppercase tracking-wider text-light-on-surface dark:text-dark-on-surface">
                    3. Prêtes (Coursier)
                  </span>
                </div>
                <span className="px-gutter-sm py-0.5 rounded-full bg-light-primary-container dark:bg-dark-surface-container-low text-light-primary dark:text-dark-primary border border-light-outline dark:border-dark-outline font-extrabold text-label-sm">
                  {partnerOrders.filter((o) => o.status === 'ready').length}
                </span>
              </div>

              {partnerOrders.filter((o) => o.status === 'ready').length > 0 ? (
                partnerOrders
                  .filter((o) => o.status === 'ready')
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-md shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-label-md font-mono font-bold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          #{order.trackingNumber}
                        </span>
                        <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-md bg-light-primary-container dark:bg-dark-surface-container-low text-light-primary dark:text-dark-primary border border-light-outline dark:border-dark-outline">
                          Emballée
                        </span>
                      </div>

                      <div>
                        <div className="font-headline font-bold text-body-md text-light-on-surface dark:text-dark-on-surface">
                          {order.clientName}
                        </div>
                        <div className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          {order.clientQuartier}
                        </div>
                      </div>

                      <div className="p-gutter-md rounded-md bg-light-primary-container/40 dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-body-sm space-y-gutter-xs">
                        <div className="flex items-center justify-between font-bold text-light-on-surface dark:text-dark-on-surface">
                          <span>Coursier Soneya :</span>
                          <span>{order.courier?.name || 'Mamadou S.'}</span>
                        </div>
                        <div className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant flex items-center justify-between gap-gutter-sm">
                          <span>Véhicule : {order.courier?.vehicle || 'Moto TVS Star'}</span>
                          <span className="font-mono">
                            {order.courier?.phone || '622 45 89 12'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-md bg-light-primary-container dark:bg-dark-surface-container-low text-light-primary dark:text-dark-primary text-body-sm font-bold flex items-center justify-center gap-1.5 border border-light-outline dark:border-dark-outline">
                        <span className="material-symbols-outlined text-title-md animate-spin" aria-hidden="true">schedule</span>
                        <span>Motard en route vers votre boutique</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center bg-light-surface-container-low dark:bg-dark-surface rounded-xl border border-light-outline dark:border-dark-outline text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Aucune commande en attente de coursier.
                </div>
              )}
            </div>

            {/* COL 4: LIVRÉES */}
            <div
              className={`space-y-gutter-md ${
                mobileKanbanCol !== 'terminees' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-gutter-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-light-primary" />
                  <span className="font-headline font-black text-label-md uppercase tracking-wider text-light-on-surface dark:text-dark-on-surface">
                    4. Livrées
                  </span>
                </div>
                <span className="px-gutter-sm py-0.5 rounded-full bg-light-primary-container dark:bg-dark-surface-container-low text-light-primary dark:text-dark-primary border border-light-outline dark:border-dark-outline font-extrabold text-label-sm">
                  {
                    partnerOrders.filter(
                      (o) => o.status === 'delivering' || o.status === 'delivered'
                    ).length
                  }
                </span>
              </div>

              {partnerOrders.filter(
                (o) => o.status === 'delivering' || o.status === 'delivered'
              ).length > 0 ? (
                partnerOrders
                  .filter((o) => o.status === 'delivering' || o.status === 'delivered')
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-sm text-body-sm shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          #{order.trackingNumber}
                        </span>
                        <span className="font-bold text-partner dark:text-accent">
                          {formatGnf(order.partnerPayoutGnf || order.itemsSubtotalGnf * 0.88)}
                        </span>
                      </div>
                      <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                        {order.clientName} ({order.clientQuartier})
                      </div>
                      <div className="flex items-center gap-1.5 text-light-primary dark:text-dark-primary font-semibold text-label-md">
                        <span className="material-symbols-outlined text-title-md" aria-hidden="true">check_circle</span>
                        <span>Validée par code secret ({order.deliveryCode})</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center bg-light-surface-container-low dark:bg-dark-surface rounded-xl border border-light-outline dark:border-dark-outline text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Les commandes finalisées apparaîtront ici.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="space-y-gutter-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
            <div>
              <h2 className="font-headline font-black text-title-md text-light-on-surface dark:text-dark-on-surface">
                Gestion du Catalogue & Disponibilités ({partner.products.length})
              </h2>
              <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Basculez un produit en « Rupture de stock » en un seul clic pendant le rush
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 rounded-md bg-partner hover:opacity-90 text-on-partner font-headline font-bold text-label-md shadow-xs transition active:scale-95 cursor-pointer min-h-[44px]"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">add</span>
              <span>Ajouter un article</span>
            </button>
          </div>

          {/* Search & Stock Filters */}
          <div className="flex flex-col sm:flex-row gap-gutter-sm">
            <div className="relative flex-1">
              <span className="material-symbols-outlined text-title-md absolute left-3.5 top-1/2 -translate-y-1/2 text-light-on-surface-variant" aria-hidden="true">search</span>
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Rechercher un plat, médicament, article..."
                className="w-full pl-10 pr-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline text-body-sm font-medium text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant focus:outline-none focus:border-partner min-h-[44px]"
              />
            </div>

            <div className="flex items-center gap-gutter-xs overflow-x-auto no-scrollbar bg-light-surface-container-low dark:bg-dark-surface p-gutter-xs rounded-md border border-light-outline dark:border-dark-outline">
              <button
                onClick={() => setCatalogStockFilter('all')}
                className={`px-gutter-md py-2 rounded-md text-body-sm font-bold transition cursor-pointer shrink-0 ${
                  catalogStockFilter === 'all'
                    ? 'bg-partner text-on-partner shadow-xs'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                Tous ({partner.products.length})
              </button>
              <button
                onClick={() => setCatalogStockFilter('in_stock')}
                className={`px-gutter-md py-2 rounded-md text-body-sm font-bold transition cursor-pointer shrink-0 ${
                  catalogStockFilter === 'in_stock'
                    ? 'bg-partner text-on-partner shadow-xs'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                En stock ({partner.products.filter((p) => p.available).length})
              </button>
              <button
                onClick={() => setCatalogStockFilter('out_of_stock')}
                className={`px-gutter-md py-2 rounded-md text-body-sm font-bold transition cursor-pointer shrink-0 ${
                  catalogStockFilter === 'out_of_stock'
                    ? 'bg-partner text-on-partner shadow-xs'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface'
                }`}
              >
                Ruptures ({partner.products.filter((p) => !p.available).length})
              </button>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid gap-gutter-md">
            {partner.products
              .filter((p) => {
                const matchesSearch =
                  p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                  p.category.toLowerCase().includes(catalogSearch.toLowerCase());
                if (!matchesSearch) return false;
                if (catalogStockFilter === 'in_stock') return p.available;
                if (catalogStockFilter === 'out_of_stock') return !p.available;
                return true;
              })
              .map((product) => (
                <div
                  key={product.id}
                  className={`p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border transition flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md shadow-xs ${
                    !product.available
                      ? 'border-rose-300 dark:border-rose-900/50 bg-rose-50/30'
                      : 'border-light-outline dark:border-dark-outline'
                  }`}
                >
                  <div className="flex items-center gap-gutter-md min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-md object-cover shrink-0 border border-light-outline dark:border-dark-outline"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-gutter-sm">
                        <span className="font-headline font-bold text-body-md text-light-on-surface dark:text-dark-on-surface truncate">
                          {product.name}
                        </span>
                        <span className="text-label-sm px-gutter-sm py-0.5 rounded-md bg-light-primary-container/70 dark:bg-dark-surface-container-low text-light-primary dark:text-dark-primary border border-light-outline dark:border-dark-outline shrink-0 font-medium">
                          {product.category}
                        </span>
                      </div>
                      <div className="text-body-sm text-partner dark:text-accent font-bold mt-0.5">
                        {formatGnf(product.priceGnf)}
                      </div>
                      <div className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant truncate max-w-md">
                        {product.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-gutter-sm shrink-0 pt-gutter-sm sm:pt-0 border-t sm:border-t-0 border-light-outline dark:border-dark-outline">
                    <button
                      onClick={() => {
                        sound.playPop();
                        const nextState = !product.available;
                        updatePartnerStock(partner.id, product.id, nextState);
                        showToast(
                          nextState ? 'Remis en stock' : 'Bascule en rupture',
                          `${product.name} est maintenant ${
                            nextState
                              ? 'disponible à la commande'
                              : 'marqué épuisé pour les clients'
                          }.`,
                          nextState ? 'success' : 'info'
                        );
                      }}
                      className={`px-gutter-md py-2.5 rounded-md text-body-sm font-headline font-extrabold transition flex items-center gap-gutter-sm cursor-pointer border shadow-xs min-h-[44px] ${
                        product.available
                          ? 'bg-light-primary-container text-light-primary border-light-outline dark:bg-dark-surface-container-low dark:text-dark-primary dark:border-dark-outline hover:bg-light-primary-container/80'
                          : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 hover:bg-rose-100'
                      }`}
                      title="Cliquez pour changer la disponibilité en direct"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          product.available ? 'bg-light-primary' : 'bg-rose-600'
                        }`}
                      />
                      <span>{product.available ? 'En stock (Actif)' : 'Rupture de stock'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="w-11 h-11 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:border-partner flex items-center justify-center transition cursor-pointer"
                      title="Modifier prix ou détails"
                    >
                      <span className="material-symbols-outlined text-title-md" aria-hidden="true">edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmProduct(product)}
                      className="w-11 h-11 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 flex items-center justify-center transition cursor-pointer"
                      title="Supprimer du catalogue"
                    >
                      <span className="material-symbols-outlined text-title-md" aria-hidden="true">delete</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: PARTAGE & BANNIÈRES */}
      {activeTab === 'partage' && (
        <div className="space-y-gutter-md">
          <div className="p-gutter-md sm:p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-md shadow-xs">
            <div className="flex items-center gap-gutter-sm">
              <span className="material-symbols-outlined text-title-lg text-partner dark:text-accent" aria-hidden="true">share</span>
              <h2 className="font-headline font-black text-body-md text-light-on-surface dark:text-dark-on-surface">
                Partager votre vitrine ({partner.name})
              </h2>
            </div>
            <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Partagez votre boutique avec vos clients à Conakry par lien direct, WhatsApp ou affichez votre QR Code au comptoir.
            </p>

            <div className="flex items-center gap-gutter-sm">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 min-w-0 px-gutter-md py-2.5 text-body-sm font-mono rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface min-h-[42px]"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  showToast(
                    'Lien copié !',
                    'Le lien de votre boutique a été copié dans le presse-papier.',
                    'success'
                  );
                }}
                className="px-gutter-md py-2.5 rounded-md bg-partner hover:opacity-90 text-on-partner font-bold text-body-sm transition flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[42px]"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">content_copy</span>
                <span>Copier</span>
              </button>
            </div>

            <a
              href={`https://wa.me/?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-gutter-md rounded-md bg-light-on-surface dark:bg-dark-on-surface hover:opacity-90 text-light-surface dark:text-dark-surface font-bold text-body-sm flex items-center justify-center gap-gutter-sm transition shadow-xs min-h-[44px]"
            >
              <span>Partager sur WhatsApp</span>
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">open_in_new</span>
            </a>
          </div>

          <div className="p-gutter-md sm:p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline space-y-gutter-md shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-sm">
                <span className="material-symbols-outlined text-title-lg text-partner dark:text-accent" aria-hidden="true">auto_awesome</span>
                <h2 className="font-headline font-black text-body-md text-light-on-surface dark:text-dark-on-surface">
                  Bannière Promo Générée Automatiquement
                </h2>
              </div>
              <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-full bg-light-primary-container/70 dark:bg-dark-surface-container-low text-partner dark:text-accent border border-light-outline dark:border-dark-outline">
                Format Story / Réseaux
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface p-gutter-lg sm:p-gutter-xl border border-light-outline dark:border-dark-outline shadow-xs space-y-gutter-md">
              <div className="flex items-center justify-between gap-gutter-sm">
                <div className="flex items-center gap-gutter-sm min-w-0">
                  <div className="w-10 h-10 rounded-md overflow-hidden border border-light-outline dark:border-dark-outline shrink-0">
                    <img
                      src={partner.logoImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-label-sm uppercase font-bold text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      Sur Soneya Delivery
                    </span>
                    <h3 className="font-headline font-black text-title-md text-light-on-surface dark:text-dark-on-surface leading-tight truncate">
                      {partner.name}
                    </h3>
                  </div>
                </div>
                <div className="px-gutter-sm py-1 rounded-md bg-partner text-on-partner font-bold text-label-sm shrink-0">
                  CONAKRY
                </div>
              </div>

              <div className="space-y-gutter-xs">
                <div className="text-label-md font-bold uppercase tracking-wider text-partner dark:text-accent">
                  Offre Spéciale Soneya Pro
                </div>
                <div className="font-headline font-black text-headline-md sm:text-headline-lg text-light-on-surface dark:text-dark-on-surface">
                  -20% de Réduction Immédiate
                </div>
                <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Avec le code promo{' '}
                  <strong className="text-partner dark:text-accent underline font-mono">
                    SONEYA20
                  </strong>{' '}
                  sur tout le catalogue.
                </p>
              </div>

              <div className="pt-gutter-md flex items-center justify-between border-t border-light-outline dark:border-dark-outline">
                <div className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant space-y-0.5">
                  <div>Livraison express en 25 min</div>
                  <div>Paiement Orange Money & MTN MoMo</div>
                </div>
                <div className="w-12 h-12 bg-light-surface-container-low dark:bg-dark-surface p-gutter-xs rounded-md flex items-center justify-center text-light-on-surface dark:text-dark-on-surface border border-light-outline dark:border-dark-outline shrink-0">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">qr_code_2</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                showToast(
                  'Bannière Prête',
                  'L image a été générée au format haute définition pour WhatsApp et Facebook.',
                  'success'
                );
              }}
              className="w-full py-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline hover:border-partner text-light-on-surface dark:text-dark-on-surface font-bold text-body-sm transition flex items-center justify-center gap-gutter-sm cursor-pointer min-h-[44px]"
            >
              <span className="material-symbols-outlined text-title-md text-partner dark:text-accent" aria-hidden="true">download</span>
              <span>Télécharger la bannière pour les réseaux sociaux</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES GHT */}
      {activeTab === 'services' && (
        <div className="space-y-gutter-md">
          <div className="p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface space-y-gutter-sm shadow-xs">
            <div className="flex items-center gap-gutter-sm">
              <span className="material-symbols-outlined text-title-lg text-partner dark:text-accent" aria-hidden="true">photo_camera</span>
              <h2 className="font-headline font-black text-title-md text-light-on-surface dark:text-dark-on-surface">
                Service "Soneya s'occupe de tout"
              </h2>
            </div>
            <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant leading-relaxed">
              Vous n'avez pas le temps de photographier vos plats ou saisir vos articles ? Notre équipe dédiée se déplace chez vous à Conakry pour tout numériser en 24h.
            </p>
            <div className="text-label-md text-light-primary dark:text-dark-primary font-semibold pt-gutter-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-title-md shrink-0" aria-hidden="true">check_circle</span>
              <span>
                Crée des emplois qualifiés de photographes et agents de saisie pour la jeunesse guinéenne.
              </span>
            </div>
          </div>

          <div className="space-y-gutter-md">
            {[
              {
                key: 'tout' as const,
                tag: 'Pack Clé en Main',
                title: 'Shooting Photos HD & Saisie Complète du Catalogue',
                desc: "1 photographe pro + 1 agent de saisie sur place à Conakry. Jusqu'à 40 produits photographiés et rédigés.",
                price: 250000,
                period: 'Paiement unique',
                cta: 'Commander le pack (250 000 GNF via Orange Money / MoMo)',
              },
              {
                key: 'promo' as const,
                tag: 'Visibilité Maximale',
                title: "Mise en avant Sponsorisée sur l'Accueil Soneya",
                desc: "Bannière en tête de l'application Soneya Delivery et notification push aux clients du quartier.",
                price: 100000,
                period: 'Par semaine',
                cta: 'Souscrire pour 7 jours (100 000 GNF)',
              },
              {
                key: 'pro' as const,
                tag: 'Abonnement Entreprise',
                title: 'Soneya Pro & Support Prioritaire 24/7',
                desc: 'Rapports financiers hebdomadaires, motards dédiés aux heures de pointe et commission allégée.',
                price: 180000,
                period: 'Par mois',
                cta: 'Activer Soneya Pro (180 000 GNF / mois)',
              },
            ].map((pack) => (
              <div
                key={pack.key}
                className="p-gutter-md sm:p-gutter-lg rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs space-y-gutter-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-gutter-sm">
                  <div>
                    <span className="text-label-sm font-black uppercase text-partner dark:text-accent">
                      {pack.tag}
                    </span>
                    <h3 className="font-headline font-black text-body-md text-light-on-surface dark:text-dark-on-surface">
                      {pack.title}
                    </h3>
                    <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-0.5">
                      {pack.desc}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="font-mono font-black text-title-md text-partner dark:text-accent">
                      {formatGnf(pack.price)}
                    </div>
                    <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      {pack.period}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => subscribePartnerService(partner.id, pack.key)}
                  className="w-full py-gutter-md rounded-md bg-partner hover:opacity-90 text-on-partner font-bold text-body-sm transition shadow-xs cursor-pointer min-h-[44px]"
                >
                  {pack.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Product */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter-sm sm:p-gutter-md bg-black/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-light-surface-container-low dark:bg-dark-surface rounded-xl p-gutter-lg max-w-md w-full border border-light-outline dark:border-dark-outline shadow-2xl space-y-gutter-md max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-gutter-sm border-b border-light-outline dark:border-dark-outline">
              <div className="flex items-center gap-gutter-sm">
                <span className="material-symbols-outlined text-title-lg text-partner dark:text-accent" aria-hidden="true">storefront</span>
                <h3 className="font-headline font-extrabold text-title-md text-light-on-surface dark:text-dark-on-surface">
                  {editingProduct ? 'Modifier l’article' : 'Ajouter un nouvel article'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-2 rounded-full text-light-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">close</span>
              </button>
            </div>

            <div className="p-gutter-md rounded-md bg-light-primary-container/60 dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-sm min-w-0">
                <span className="material-symbols-outlined text-title-md text-partner dark:text-accent shrink-0" aria-hidden="true">auto_awesome</span>
                <div className="min-w-0">
                  <div className="font-headline font-bold text-body-sm text-light-on-surface dark:text-dark-on-surface">
                    Assistant IA Soneya (Bêta)
                  </div>
                  <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Suggère catégorie, description et prix en GNF
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAIAssist}
                disabled={isGeneratingAI}
                className="px-gutter-md py-2 rounded-md bg-partner hover:opacity-90 text-on-partner font-bold text-label-md transition shadow-xs flex items-center gap-gutter-xs shrink-0 cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-title-md"
                  aria-hidden="true"
                  style={isGeneratingAI ? { animation: 'spin 1s linear infinite' } : undefined}
                >
                  {isGeneratingAI ? 'progress_activity' : 'auto_awesome'}
                </span>
                <span>{isGeneratingAI ? 'Analyse...' : 'Générer'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-gutter-md text-body-sm">
              <div>
                <label className="block font-bold text-light-on-surface dark:text-dark-on-surface mb-gutter-xs">
                  Nom du produit ou plat *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Poulet Yassa, Jus de Gingembre, Paracétamol..."
                  className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface border border-light-outline dark:border-dark-outline focus:outline-none focus:ring-2 focus:ring-partner text-body-sm font-semibold min-h-[42px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
                <div>
                  <label className="block font-bold text-light-on-surface dark:text-dark-on-surface mb-gutter-xs">
                    Prix (GNF) *
                  </label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="35000"
                    className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface border border-light-outline dark:border-dark-outline focus:outline-none focus:ring-2 focus:ring-partner text-body-sm font-bold min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-light-on-surface dark:text-dark-on-surface mb-gutter-xs">
                    Rubrique / Catégorie
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Ex: Grillades, Boissons"
                    className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface border border-light-outline dark:border-dark-outline focus:outline-none focus:ring-2 focus:ring-partner text-body-sm min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-light-on-surface dark:text-dark-on-surface mb-gutter-xs">
                  Description détaillée
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ingrédients, portions, accompagnements inclus..."
                  className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface border border-light-outline dark:border-dark-outline focus:outline-none focus:ring-2 focus:ring-partner text-body-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-light-on-surface dark:text-dark-on-surface mb-gutter-xs">
                  Photo de l'article (URL Web ou catalogue)
                </label>
                <div className="flex gap-gutter-sm items-center">
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 min-w-0 px-gutter-md py-2 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface border border-light-outline dark:border-dark-outline focus:outline-none focus:ring-2 focus:ring-partner text-body-sm min-h-[42px]"
                  />
                  {formImage && (
                    <img
                      src={formImage}
                      alt="Prévisualisation"
                      className="w-10 h-10 rounded-md object-cover ring-1 ring-light-outline shrink-0"
                    />
                  )}
                </div>
              </div>

              <div className="pt-gutter-sm flex items-center justify-end gap-gutter-sm border-t border-light-outline dark:border-dark-outline">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-gutter-md py-2.5 rounded-md text-light-on-surface-variant dark:text-dark-on-surface-variant font-bold hover:bg-light-primary-container/60 dark:hover:bg-dark-surface-container-low transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-gutter-lg py-2.5 rounded-md bg-partner hover:opacity-90 text-on-partner font-bold transition shadow-xs cursor-pointer min-h-[42px]"
                >
                  {editingProduct ? 'Enregistrer' : 'Mettre en vente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP REJECT ORDER MODAL (Replaces window.prompt) */}
      {rejectOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter-md bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-xl bg-light-surface-container-low dark:bg-dark-surface p-gutter-lg space-y-gutter-md border border-light-outline dark:border-dark-outline shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-headline font-extrabold text-title-md text-rose-600 dark:text-rose-400 flex items-center gap-gutter-sm">
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">error</span>
                <span>Motif du refus</span>
              </h4>
              <button
                onClick={() => setRejectOrderId(null)}
                className="p-1.5 rounded-full text-light-on-surface-variant hover:text-light-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">close</span>
              </button>
            </div>
            <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Indiquez le motif du refus qui sera notifié au client :
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-gutter-md text-body-sm rounded-md border border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface-container-low text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-partner"
              placeholder="Ex: Ingrédient en rupture, Rush cuisine..."
            />
            <div className="flex items-center justify-end gap-gutter-sm">
              <button
                type="button"
                onClick={() => setRejectOrderId(null)}
                className="px-gutter-md py-2.5 rounded-md border border-light-outline dark:border-dark-outline text-body-sm font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectOrder}
                className="px-gutter-md py-2.5 rounded-md bg-rose-600 hover:bg-rose-700 text-light-surface text-body-sm font-bold cursor-pointer"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP DELETE PRODUCT CONFIRMATION (Replaces window.confirm) */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter-md bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-xl bg-light-surface-container-low dark:bg-dark-surface p-gutter-lg space-y-gutter-md border border-light-outline dark:border-dark-outline shadow-2xl">
            <h4 className="font-headline font-extrabold text-title-md text-light-on-surface dark:text-dark-on-surface">
              Supprimer cet article ?
            </h4>
            <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Voulez-vous vraiment retirer «{' '}
              <strong>{deleteConfirmProduct.name}</strong> » du catalogue ?
            </p>
            <div className="flex items-center justify-end gap-gutter-sm">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-gutter-md py-2.5 rounded-md border border-light-outline dark:border-dark-outline text-body-sm font-semibold text-light-on-surface-variant dark:text-dark-on-surface-variant cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePartnerProduct(partner.id, deleteConfirmProduct.id);
                  showToast(
                    'Article supprimé',
                    `${deleteConfirmProduct.name} a été retiré du catalogue.`,
                    'info'
                  );
                  setDeleteConfirmProduct(null);
                }}
                className="px-gutter-md py-2.5 rounded-md bg-rose-600 hover:bg-rose-700 text-light-surface text-body-sm font-bold cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
