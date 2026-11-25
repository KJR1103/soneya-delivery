import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf, formatTime } from '../../utils/formatters';
import { Product } from '../../types';
import {
  Store,
  CheckCircle2,
  Clock,
  Package,
  Plus,
  Edit2,
  Trash2,
  X,
  Sparkles,
  QrCode,
  Share2,
  Camera,
  Download,
  Copy,
  ExternalLink,
  Check,
  Loader2,
  Star,
  Volume2,
  VolumeX,
  Search,
  AlertCircle,
} from 'lucide-react';
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
    <div className="max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 py-4 pb-32 space-y-4">
      {/* Partner Header & Store Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-50/60 dark:bg-[#10231B] ring-2 ring-[#D4E9DD] dark:ring-[#1E3B2D] shrink-0">
              <img
                src={partner.logoImage}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading font-black text-base text-[#0B2B1E] dark:text-white truncate">
                  {partner.name}
                </h1>
                {partner.isFirstMonthExempt && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
                    1er mois 0% com.
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/75 truncate">
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
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border min-h-[42px] shrink-0 ${
              isOpen
                ? 'bg-[#0B7A4B] text-white border-[#0B7A4B] hover:bg-[#08613B]'
                : 'bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-100 border-[#D4E9DD] dark:border-[#1E3B2D]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen ? 'bg-white animate-pulse' : 'bg-[#5C7A6E]'
              }`}
            />
            <span>{isOpen ? 'Ouvert aux commandes' : 'Fermé'}</span>
          </button>
        </div>

        {/* Change partner selector */}
        <div className="pt-2.5 border-t border-[#E2ECE7] dark:border-[#1E3B2D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-[#5C7A6E] dark:text-emerald-200/75">
            Sélectionner votre établissement :
          </span>
          <select
            value={selectedPartnerId}
            onChange={(e) => setSelectedPartnerId(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white text-xs font-bold border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:border-[#0B7A4B] min-h-[40px]"
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
      <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-4 gap-1.5 bg-white dark:bg-[#0C1913] p-1 rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-center">
        <button
          onClick={() => setActiveTab('commandes')}
          className={`shrink-0 px-3 sm:px-2 py-2.5 text-[11px] font-bold rounded-xl transition cursor-pointer min-h-[42px] ${
            activeTab === 'commandes'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
          }`}
        >
          Commandes ({partnerOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('catalogue')}
          className={`shrink-0 px-3 sm:px-2 py-2.5 text-[11px] font-bold rounded-xl transition cursor-pointer min-h-[42px] ${
            activeTab === 'catalogue'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
          }`}
        >
          Catalogue ({partner.products.length})
        </button>
        <button
          onClick={() => setActiveTab('partage')}
          className={`shrink-0 px-3 sm:px-2 py-2.5 text-[11px] font-bold rounded-xl transition cursor-pointer min-h-[42px] ${
            activeTab === 'partage'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
          }`}
        >
          Partage & QR
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`shrink-0 px-3 sm:px-2 py-2.5 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer min-h-[42px] ${
            activeTab === 'services'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E] dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#FFB81F]" />
          <span>Services GHT</span>
        </button>
      </div>

      {/* TAB 1: COMMANDES KANBAN */}
      {activeTab === 'commandes' && (
        <div className="space-y-4">
          {/* Revenue metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs">
              <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75">
                Net commerçant encaissé
              </div>
              <div className="font-heading font-black text-lg sm:text-xl text-[#0B7A4B] dark:text-[#FFB81F] mt-1">
                {formatGnf(totalRevenueGnf)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs">
              <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75">
                Nouvelles à traiter
              </div>
              <div className="font-heading font-black text-lg sm:text-xl text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1.5">
                <span>{partnerOrders.filter((o) => o.status === 'submitted').length}</span>
                {partnerOrders.filter((o) => o.status === 'submitted').length > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs">
              <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75">
                En préparation
              </div>
              <div className="font-heading font-black text-lg sm:text-xl text-amber-600 dark:text-[#FFB81F] mt-1">
                {partnerOrders.filter((o) => o.status === 'preparing').length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs">
              <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75">
                Note moyenne clients
              </div>
              <div className="font-heading font-black text-lg sm:text-xl text-[#0B2B1E] dark:text-white mt-1 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#FFB81F] text-[#FFB81F]" />
                <span>{partner.rating} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Flash Alert Banner */}
          {partnerOrders.filter((o) => o.status === 'submitted').length > 0 && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0C1913] border-2 border-rose-500/80 shadow-md flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping shrink-0" />
                <div className="min-w-0">
                  <div className="font-heading font-black text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Flash : {partnerOrders.filter((o) => o.status === 'submitted').length}{' '}
                    Nouvelle(s) commande(s) reçue(s) !
                  </div>
                  <div className="text-[11px] text-[#2F4F42] dark:text-emerald-100/80">
                    Cliquez sur « Accepter » pour lancer la préparation sans tarder.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setAudioAlertEnabled(!audioAlertEnabled);
                  if (!audioAlertEnabled) sound.playAlert();
                }}
                className="p-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 hover:border-[#0B7A4B] transition shrink-0 cursor-pointer"
                title="Activer/Désactiver signal sonore"
              >
                {audioAlertEnabled ? (
                  <Volume2 className="w-4 h-4 text-rose-600" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

          {/* Kanban Mobile Switcher */}
          <div className="grid grid-cols-4 gap-1.5 bg-white dark:bg-[#0C1913] p-1 rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-center lg:hidden">
            <button
              onClick={() => setMobileKanbanCol('nouvelles')}
              className={`py-2 text-[10px] font-bold rounded-xl transition cursor-pointer flex flex-col items-center gap-0.5 min-h-[44px] justify-center ${
                mobileKanbanCol === 'nouvelles'
                  ? 'bg-[#0B7A4B] text-white shadow-xs'
                  : 'text-[#2F4F42] dark:text-emerald-200'
              }`}
            >
              <span className="flex items-center gap-1">
                <span>Nouvelles</span>
                {partnerOrders.filter((o) => o.status === 'submitted').length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </span>
              <span className="text-[9px] opacity-80">
                ({partnerOrders.filter((o) => o.status === 'submitted').length})
              </span>
            </button>

            <button
              onClick={() => setMobileKanbanCol('preparation')}
              className={`py-2 text-[10px] font-bold rounded-xl transition cursor-pointer flex flex-col items-center gap-0.5 min-h-[44px] justify-center ${
                mobileKanbanCol === 'preparation'
                  ? 'bg-[#0B7A4B] text-white shadow-xs'
                  : 'text-[#2F4F42] dark:text-emerald-200'
              }`}
            >
              <span>En cours</span>
              <span className="text-[9px] opacity-80">
                ({partnerOrders.filter((o) => o.status === 'preparing').length})
              </span>
            </button>

            <button
              onClick={() => setMobileKanbanCol('pretes')}
              className={`py-2 text-[10px] font-bold rounded-xl transition cursor-pointer flex flex-col items-center gap-0.5 min-h-[44px] justify-center ${
                mobileKanbanCol === 'pretes'
                  ? 'bg-[#0B7A4B] text-white shadow-xs'
                  : 'text-[#2F4F42] dark:text-emerald-200'
              }`}
            >
              <span>Prêtes</span>
              <span className="text-[9px] opacity-80">
                ({partnerOrders.filter((o) => o.status === 'ready').length})
              </span>
            </button>

            <button
              onClick={() => setMobileKanbanCol('terminees')}
              className={`py-2 text-[10px] font-bold rounded-xl transition cursor-pointer flex flex-col items-center gap-0.5 min-h-[44px] justify-center ${
                mobileKanbanCol === 'terminees'
                  ? 'bg-[#0B7A4B] text-white shadow-xs'
                  : 'text-[#2F4F42] dark:text-emerald-200'
              }`}
            >
              <span>Livrées</span>
              <span className="text-[9px] opacity-80">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
            {/* COL 1: NOUVELLES */}
            <div
              className={`space-y-3 ${
                mobileKanbanCol !== 'nouvelles' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0C1913] border-2 border-rose-500/50 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span className="font-heading font-black text-xs uppercase tracking-wider text-[#0B2B1E] dark:text-white">
                    1. Nouvelles
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-extrabold text-xs">
                  {partnerOrders.filter((o) => o.status === 'submitted').length}
                </span>
              </div>

              {partnerOrders.filter((o) => o.status === 'submitted').length > 0 ? (
                partnerOrders
                  .filter((o) => o.status === 'submitted')
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border-2 border-rose-500/60 space-y-3 shadow-md animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                          #{order.trackingNumber}
                        </span>
                        <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">
                          {formatTime(order.createdAt)}
                        </span>
                      </div>

                      <div>
                        <div className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white">
                          {order.clientName}
                        </div>
                        <div className="text-xs text-[#5C7A6E] dark:text-emerald-200/75">
                          {order.clientQuartier}
                        </div>
                        {order.deliveryLandmark && (
                          <div className="text-[11px] text-[#2F4F42] dark:text-emerald-200 mt-0.5 font-medium">
                            Repère : {order.deliveryLandmark}
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/40 dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between font-medium gap-2">
                            <span className="text-[#0B2B1E] dark:text-white">
                              {it.quantity}x {it.product.name}
                            </span>
                            <span className="text-[#5C7A6E] dark:text-emerald-200/75 shrink-0">
                              {formatGnf(it.product.priceGnf * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-[#5C7A6E] dark:text-emerald-200/75">
                          Net restaurant
                        </span>
                        <span className="font-heading font-black text-sm text-[#0B7A4B] dark:text-[#FFB81F]">
                          {formatGnf(order.partnerPayoutGnf || order.itemsSubtotalGnf * 0.88)}
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
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
                          className="w-full py-3.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] cursor-pointer min-h-[48px]"
                        >
                          <Check className="w-5 h-5 stroke-[3]" />
                          <span>Accepter</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectOrderId(order.id);
                            setRejectReason('Ingrédient en rupture / Rush cuisine');
                          }}
                          className="w-full py-2.5 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#10231B] text-[#2F4F42] dark:text-emerald-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 font-heading font-bold text-xs transition cursor-pointer text-center min-h-[42px]"
                        >
                          Refuser avec motif
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center bg-white dark:bg-[#0C1913] rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs text-[#5C7A6E] dark:text-emerald-200/70">
                  Aucune nouvelle commande en attente.
                </div>
              )}
            </div>

            {/* COL 2: EN PRÉPARATION */}
            <div
              className={`space-y-3 ${
                mobileKanbanCol !== 'preparation' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-heading font-black text-xs uppercase tracking-wider text-[#0B2B1E] dark:text-white">
                    2. En Préparation
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
                  {partnerOrders.filter((o) => o.status === 'preparing').length}
                </span>
              </div>

              {partnerOrders.filter((o) => o.status === 'preparing').length > 0 ? (
                partnerOrders
                  .filter((o) => o.status === 'preparing')
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-amber-300 dark:border-amber-700/60 space-y-3 shadow-xs animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#5C7A6E] dark:text-emerald-200/70">
                          #{order.trackingNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Au fourneau / Comptoir
                        </span>
                      </div>

                      <div>
                        <div className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white">
                          {order.clientName}
                        </div>
                        <div className="text-xs text-[#5C7A6E] dark:text-emerald-200/75">
                          {order.clientQuartier}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/40 dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between font-medium gap-2">
                            <span className="text-[#0B2B1E] dark:text-white">
                              {it.quantity}x {it.product.name}
                            </span>
                            <span className="text-[#5C7A6E] dark:text-emerald-200/75 shrink-0">
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
                        className="w-full py-4 rounded-xl bg-[#0B2B1E] hover:bg-[#081C13] text-white font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99] cursor-pointer min-h-[48px]"
                      >
                        <Package className="w-5 h-5" />
                        <span>Marquer « Prête »</span>
                      </button>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center bg-white dark:bg-[#0C1913] rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs text-[#5C7A6E] dark:text-emerald-200/70">
                  Aucune commande en préparation.
                </div>
              )}
            </div>

            {/* COL 3: PRÊTES */}
            <div
              className={`space-y-3 ${
                mobileKanbanCol !== 'pretes' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B7A4B]" />
                  <span className="font-heading font-black text-xs uppercase tracking-wider text-[#0B2B1E] dark:text-white">
                    3. Prêtes (Coursier)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-[#1E3B2D] font-extrabold text-xs">
                  {partnerOrders.filter((o) => o.status === 'ready').length}
                </span>
              </div>

              {partnerOrders.filter((o) => o.status === 'ready').length > 0 ? (
                partnerOrders
                  .filter((o) => o.status === 'ready')
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#5C7A6E] dark:text-emerald-200/75">
                          #{order.trackingNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                          Emballée
                        </span>
                      </div>

                      <div>
                        <div className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white">
                          {order.clientName}
                        </div>
                        <div className="text-xs text-[#5C7A6E] dark:text-emerald-200/75">
                          {order.clientQuartier}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/40 dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#0B2B1E] dark:text-white">
                          <span>Coursier Soneya :</span>
                          <span>{order.courier?.name || 'Mamadou S.'}</span>
                        </div>
                        <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75 flex items-center justify-between gap-2">
                          <span>Véhicule : {order.courier?.vehicle || 'Moto TVS Star'}</span>
                          <span className="font-mono">
                            {order.courier?.phone || '622 45 89 12'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Motard en route vers votre boutique</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center bg-white dark:bg-[#0C1913] rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs text-[#5C7A6E] dark:text-emerald-200/70">
                  Aucune commande en attente de coursier.
                </div>
              )}
            </div>

            {/* COL 4: LIVRÉES */}
            <div
              className={`space-y-3 ${
                mobileKanbanCol !== 'terminees' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="font-heading font-black text-xs uppercase tracking-wider text-[#0B2B1E] dark:text-white">
                    4. Livrées
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-[#1E3B2D] font-extrabold text-xs">
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
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-2 text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#5C7A6E] dark:text-emerald-200/75">
                          #{order.trackingNumber}
                        </span>
                        <span className="font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
                          {formatGnf(order.partnerPayoutGnf || order.itemsSubtotalGnf * 0.88)}
                        </span>
                      </div>
                      <div className="font-bold text-[#0B2B1E] dark:text-white">
                        {order.clientName} ({order.clientQuartier})
                      </div>
                      <div className="flex items-center gap-1.5 text-[#0B7A4B] dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Validée par code secret ({order.deliveryCode})</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center bg-white dark:bg-[#0C1913] rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs text-[#5C7A6E] dark:text-emerald-200/70">
                  Les commandes finalisées apparaîtront ici.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-black text-base text-[#0B2B1E] dark:text-white">
                Gestion du Catalogue & Disponibilités ({partner.products.length})
              </h2>
              <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/75">
                Basculez un produit en « Rupture de stock » en un seul clic pendant le rush
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un article</span>
            </button>
          </div>

          {/* Search & Stock Filters */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C7A6E]" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Rechercher un plat, médicament, article..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs font-medium text-[#0B2B1E] dark:text-white placeholder:text-[#5C7A6E] focus:outline-none focus:border-[#0B7A4B] min-h-[44px]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white dark:bg-[#0C1913] p-1 rounded-xl border border-[#E2ECE7] dark:border-[#1E3B2D]">
              <button
                onClick={() => setCatalogStockFilter('all')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  catalogStockFilter === 'all'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E]'
                }`}
              >
                Tous ({partner.products.length})
              </button>
              <button
                onClick={() => setCatalogStockFilter('in_stock')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  catalogStockFilter === 'in_stock'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E]'
                }`}
              >
                En stock ({partner.products.filter((p) => p.available).length})
              </button>
              <button
                onClick={() => setCatalogStockFilter('out_of_stock')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  catalogStockFilter === 'out_of_stock'
                    ? 'bg-[#0B7A4B] text-white shadow-xs'
                    : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E]'
                }`}
              >
                Ruptures ({partner.products.filter((p) => !p.available).length})
              </button>
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid gap-3">
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
                  className={`p-4 rounded-2xl bg-white dark:bg-[#0C1913] border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                    !product.available
                      ? 'border-rose-300 dark:border-rose-900/50 bg-rose-50/30'
                      : 'border-[#E2ECE7] dark:border-[#1E3B2D]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E2ECE7] dark:border-[#1E3B2D]"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white truncate">
                          {product.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-200 border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0 font-medium">
                          {product.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#0B7A4B] dark:text-[#FFB81F] font-bold mt-0.5">
                        {formatGnf(product.priceGnf)}
                      </div>
                      <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75 truncate max-w-md">
                        {product.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2ECE7] dark:border-[#1E3B2D]">
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
                      className={`px-4 py-2.5 rounded-xl text-xs font-heading font-extrabold transition flex items-center gap-2 cursor-pointer border shadow-xs min-h-[44px] ${
                        product.available
                          ? 'bg-emerald-50 text-[#0B7A4B] border-[#D4E9DD] dark:bg-[#10231B] dark:text-emerald-300 dark:border-[#1E3B2D] hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 hover:bg-rose-100'
                      }`}
                      title="Cliquez pour changer la disponibilité en direct"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          product.available ? 'bg-[#0B7A4B]' : 'bg-rose-600'
                        }`}
                      />
                      <span>{product.available ? 'En stock (Actif)' : 'Rupture de stock'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="w-11 h-11 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 hover:border-[#0B7A4B] flex items-center justify-center transition cursor-pointer"
                      title="Modifier prix ou détails"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmProduct(product)}
                      className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 flex items-center justify-center transition cursor-pointer"
                      title="Supprimer du catalogue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: PARTAGE & BANNIÈRES */}
      {activeTab === 'partage' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <h2 className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                Partager votre vitrine ({partner.name})
              </h2>
            </div>
            <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80">
              Partagez votre boutique avec vos clients à Conakry par lien direct, WhatsApp ou affichez votre QR Code au comptoir.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 min-w-0 px-3 py-2.5 text-xs font-mono rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white min-h-[42px]"
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
                className="px-3.5 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[42px]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </button>
            </div>

            <a
              href={`https://wa.me/?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#0B2B1E] hover:bg-[#081C13] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs min-h-[44px]"
            >
              <span>Partager sur WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3.5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <h2 className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                  Bannière Promo Générée Automatiquement
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D]">
                Format Story / Réseaux
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white p-5 sm:p-6 border border-[#D4E9DD] dark:border-[#1E3B2D] shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
                    <img
                      src={partner.logoImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#5C7A6E] dark:text-emerald-300/70">
                      Sur Soneya Delivery
                    </span>
                    <h3 className="font-heading font-black text-base text-[#0B2B1E] dark:text-white leading-tight truncate">
                      {partner.name}
                    </h3>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-[#0B7A4B] text-white font-bold text-[10px] shrink-0">
                  CONAKRY
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0B7A4B] dark:text-[#FFB81F]">
                  Offre Spéciale Soneya Pro
                </div>
                <div className="font-heading font-black text-xl sm:text-2xl text-[#0B2B1E] dark:text-white">
                  -20% de Réduction Immédiate
                </div>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80">
                  Avec le code promo{' '}
                  <strong className="text-[#0B7A4B] dark:text-[#FFB81F] underline font-mono">
                    SONEYA20
                  </strong>{' '}
                  sur tout le catalogue.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#E2ECE7] dark:border-[#1E3B2D]">
                <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75 space-y-0.5">
                  <div>Livraison express en 25 min</div>
                  <div>Paiement Orange Money & MTN MoMo</div>
                </div>
                <div className="w-12 h-12 bg-white dark:bg-[#0C1913] p-1 rounded-xl flex items-center justify-center text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
                  <QrCode className="w-10 h-10" />
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
              className="w-full py-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] hover:border-[#0B7A4B] text-[#0B2B1E] dark:text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Download className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span>Télécharger la bannière pour les réseaux sociaux</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES GHT */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <h2 className="font-heading font-black text-base text-[#0B2B1E] dark:text-white">
                Service "Soneya s'occupe de tout"
              </h2>
            </div>
            <p className="text-xs text-[#2F4F42] dark:text-emerald-100/80 leading-relaxed">
              Vous n'avez pas le temps de photographier vos plats ou saisir vos articles ? Notre équipe dédiée se déplace chez vous à Conakry pour tout numériser en 24h.
            </p>
            <div className="text-[11px] text-[#0B7A4B] dark:text-emerald-300 font-semibold pt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                Crée des emplois qualifiés de photographes et agents de saisie pour la jeunesse guinéenne.
              </span>
            </div>
          </div>

          <div className="space-y-3">
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
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#0B7A4B] dark:text-[#FFB81F]">
                      {pack.tag}
                    </span>
                    <h3 className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                      {pack.title}
                    </h3>
                    <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80 mt-0.5">
                      {pack.desc}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="font-heading font-black text-base text-[#0B7A4B] dark:text-[#FFB81F]">
                      {formatGnf(pack.price)}
                    </div>
                    <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">
                      {pack.period}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => subscribePartnerService(partner.id, pack.key)}
                  className="w-full py-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs transition shadow-xs cursor-pointer min-h-[44px]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#0C1913] rounded-2xl p-5 max-w-md w-full border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2ECE7] dark:border-[#1E3B2D]">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <h3 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white">
                  {editingProduct ? 'Modifier l’article' : 'Ajouter un nouvel article'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-2 rounded-full text-[#5C7A6E] hover:text-[#0B2B1E] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                <div className="min-w-0">
                  <div className="font-heading font-bold text-xs text-[#0B2B1E] dark:text-white">
                    Assistant IA Soneya (Bêta)
                  </div>
                  <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/75">
                    Suggère catégorie, description et prix en GNF
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAIAssist}
                disabled={isGeneratingAI}
                className="px-3 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-[11px] transition shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {isGeneratingAI ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-white" />
                )}
                <span>{isGeneratingAI ? 'Analyse...' : 'Générer'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#0B2B1E] dark:text-emerald-100 mb-1">
                  Nom du produit ou plat *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Poulet Yassa, Jus de Gingembre, Paracétamol..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:ring-2 focus:ring-[#0B7A4B] text-xs font-semibold min-h-[42px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0B2B1E] dark:text-emerald-100 mb-1">
                    Prix (GNF) *
                  </label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="35000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:ring-2 focus:ring-[#0B7A4B] text-xs font-bold min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B2B1E] dark:text-emerald-100 mb-1">
                    Rubrique / Catégorie
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Ex: Grillades, Boissons"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:ring-2 focus:ring-[#0B7A4B] text-xs min-h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B2B1E] dark:text-emerald-100 mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ingrédients, portions, accompagnements inclus..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:ring-2 focus:ring-[#0B7A4B] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B2B1E] dark:text-emerald-100 mb-1">
                  Photo de l'article (URL Web ou catalogue)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 min-w-0 px-3.5 py-2 rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:ring-2 focus:ring-[#0B7A4B] text-xs min-h-[42px]"
                  />
                  {formImage && (
                    <img
                      src={formImage}
                      alt="Prévisualisation"
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#D4E9DD] shrink-0"
                    />
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-[#5C7A6E] dark:text-emerald-200 font-bold hover:bg-emerald-50/60 dark:hover:bg-[#10231B] transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold transition shadow-xs cursor-pointer min-h-[42px]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0C1913] p-5 space-y-4 border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-extrabold text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>Motif du refus</span>
              </h4>
              <button
                onClick={() => setRejectOrderId(null)}
                className="p-1.5 rounded-full text-[#5C7A6E] hover:text-[#0B2B1E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80">
              Indiquez le motif du refus qui sera notifié au client :
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B7A4B]"
              placeholder="Ex: Ingrédient en rupture, Rush cuisine..."
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectOrderId(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs font-semibold text-[#2F4F42] dark:text-emerald-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectOrder}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP DELETE PRODUCT CONFIRMATION (Replaces window.confirm) */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0C1913] p-5 space-y-4 border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl">
            <h4 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white">
              Supprimer cet article ?
            </h4>
            <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80">
              Voulez-vous vraiment retirer «{' '}
              <strong>{deleteConfirmProduct.name}</strong> » du catalogue ?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2.5 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs font-semibold text-[#2F4F42] dark:text-emerald-100 cursor-pointer"
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
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
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
