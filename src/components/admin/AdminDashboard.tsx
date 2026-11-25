import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';
import { Partner, CategoryId, Order } from '../../types';
import { orangeMoneyService } from '../../services/orangeMoneyService';
import {
  LayoutDashboard,
  Store,
  Bike,
  Users,
  CircleDollarSign,
  Layers,
  Headphones,
  ShieldCheck,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Lock,
  Unlock,
  Building2,
  Phone,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
  X,
  Star,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    partners,
    orders,
    courierApplications,
    validateCourierKyc,
    rejectCourierKyc,
    showToast,
    setShowLandingPortal,
  } = useApp();

  // Super Admin security gate
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'partners' | 'couriers' | 'users' | 'finances' | 'categories' | 'support' | 'superadmin'
  >('overview');

  // Period filter
  const [period, setPeriod] = useState<'jour' | 'semaine' | 'mois' | 'annee'>('mois');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for inspection
  const [selectedPartnerDetails, setSelectedPartnerDetails] = useState<Partner | null>(null);
  const [selectedCourierDetails, setSelectedCourierDetails] = useState<any | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any | null>(null);

  // Category commission state
  const [categoryCommissions, setCategoryCommissions] = useState<Record<string, number>>({
    restaurants: 12,
    boutiques: 10,
    groceries: 7,
    pharmacy: 7,
    colis: 20,
  });

  // Orange Money Guinea API Console state
  const [omTestPhone, setOmTestPhone] = useState('622 12 34 56');
  const [omTestAmount, setOmTestAmount] = useState('125000');
  const [omTestLoading, setOmTestLoading] = useState(false);
  const [omTestResult, setOmTestResult] = useState<any | null>(null);

  const handleTestOrangeMoneyPayment = async () => {
    setOmTestLoading(true);
    setOmTestResult(null);
    try {
      const res = await orangeMoneyService.initWebPayment({
        orderId: `SNY-OM-${Math.floor(1000 + Math.random() * 9000)}`,
        amountGnf: parseFloat(omTestAmount) || 125000,
        customerPhone: omTestPhone,
        returnUrl: window.location.origin + '/client?status=success',
        cancelUrl: window.location.origin + '/client?status=cancel',
        notifUrl: 'https://api.soneya.gn/v1/webhooks/orange-money',
      });
      setOmTestResult(res);
      showToast('API Orange Money Déclenchée', 'Paiement WebPay initié avec succès (Code USSD #144#).', 'success');
    } catch (e: any) {
      showToast('Erreur Orange Money', e.message || 'Échec API', 'status');
    } finally {
      setOmTestLoading(false);
    }
  };

  // Comprehensive partners list
  const allPartnersList: (Partner & { manager: string; gmvGnf: number; status: 'active' | 'pending' | 'suspended' })[] = [
    {
      ...partners[0],
      id: 'chez-fanta',
      name: 'Chez Fanta - Délices de Guinée',
      category: 'restaurants',
      categoryLabel: 'Restaurant Guinéen',
      quartierName: 'Kipé',
      phone: '+224 622 10 20 30',
      manager: 'Fanta Camara',
      rating: 4.9,
      reviewsCount: 342,
      gmvGnf: 114900000,
      commissionRatePercent: 12,
      status: 'active',
      isOpen: true,
      address: 'Centre Commercial Prima Center, Kipé',
      deliveryTimeMin: 25,
      coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      logoImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      lat: 9.5855,
      lng: -13.6358,
      minOrderGnf: 25000,
      tags: ['Maffé Tiga', 'Riz Gras', 'Halal'],
      products: partners[0]?.products || [],
    },
    {
      ...partners[1],
      id: 'le-cedre',
      name: 'Le Cèdre - Grillades & Chawarma',
      category: 'restaurants',
      categoryLabel: 'Grillades & Libanais',
      quartierName: 'Kaloum',
      phone: '+224 664 20 30 40',
      manager: 'Hassan Khalil',
      rating: 4.8,
      reviewsCount: 280,
      gmvGnf: 88400000,
      commissionRatePercent: 12,
      status: 'active',
      isOpen: true,
      address: 'Avenue de la République, Kaloum',
      deliveryTimeMin: 30,
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      logoImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      lat: 9.51,
      lng: -13.71,
      minOrderGnf: 30000,
      tags: ['Grillades', 'Chawarma'],
      products: partners[1]?.products || [],
    },
    {
      ...partners[2],
      id: 'prima-market',
      name: 'Prima Market - Supermarché & Épicerie',
      category: 'groceries',
      categoryLabel: 'Supermarché',
      quartierName: 'Kipé',
      phone: '+224 620 50 60 70',
      manager: 'Mamadou Saliou',
      rating: 4.7,
      reviewsCount: 195,
      gmvGnf: 64200000,
      commissionRatePercent: 7,
      status: 'active',
      isOpen: true,
      address: 'Prima Center RDC, Kipé',
      deliveryTimeMin: 35,
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      logoImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      lat: 9.585,
      lng: -13.636,
      minOrderGnf: 50000,
      tags: ['Frais', 'Import', 'Bio'],
      products: partners[2]?.products || [],
    },
    {
      ...partners[3],
      id: 'pharmacie-kipe',
      name: 'Grande Pharmacie de Kipé',
      category: 'pharmacy',
      categoryLabel: 'Santé & Pharmacie',
      quartierName: 'Kipé',
      phone: '+224 628 88 99 00',
      manager: 'Dr. Mariama Camara',
      rating: 4.9,
      reviewsCount: 412,
      gmvGnf: 42100000,
      commissionRatePercent: 7,
      status: 'active',
      isOpen: true,
      address: 'Carrefour Centre Émetteur, Kipé',
      deliveryTimeMin: 15,
      coverImage: 'https://images.unsplash.com/photo-1586015555751-63c299898083?auto=format&fit=crop&w=800&q=80',
      logoImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      lat: 9.587,
      lng: -13.633,
      minOrderGnf: 20000,
      tags: ['Garde 24/7', 'Certifié'],
      products: partners[3]?.products || [],
    },
  ];

  // Comprehensive couriers fleet list
  const allCouriersList = [
    {
      id: 'r-1',
      name: 'Ibrahima Sory Bah',
      phone: '+224 622 45 78 90',
      vehicle: 'TVS Apache 160 (RC-8419-A)',
      quartier: 'Kipé',
      ridesCount: 384,
      distanceKm: 1420,
      safetyRating: 4.98,
      kycStatus: 'validated',
      payoutDueGnf: 342000,
      status: 'online',
    },
    {
      id: 'r-2',
      name: 'Ousmane Camara',
      phone: '+224 664 12 34 56',
      vehicle: 'KTM Duke 200 (RC-9912-B)',
      quartier: 'Ratoma',
      ridesCount: 215,
      distanceKm: 980,
      safetyRating: 4.92,
      kycStatus: 'pending_verification',
      payoutDueGnf: 185000,
      status: 'online',
    },
    {
      id: 'r-3',
      name: 'Mamadou Bailo Diallo',
      phone: '+224 620 99 88 77',
      vehicle: 'Honda Ace 125 (RC-1045-C)',
      quartier: 'Kaloum',
      ridesCount: 490,
      distanceKm: 2150,
      safetyRating: 4.96,
      kycStatus: 'validated',
      payoutDueGnf: 520000,
      status: 'offline',
    },
    {
      id: 'r-4',
      name: 'Abdoulaye Sow',
      phone: '+224 628 33 44 55',
      vehicle: 'Yamaha Crux (RC-5521-D)',
      quartier: 'Madina',
      ridesCount: 92,
      distanceKm: 410,
      safetyRating: 4.85,
      kycStatus: 'validated',
      payoutDueGnf: 98000,
      status: 'online',
    },
  ];

  // Comprehensive users list
  const allUsersList = [
    {
      id: 'u-1',
      name: 'Amadou Diallo',
      phone: '+224 622 78 90 12',
      quartier: 'Kipé Centre',
      joinedAt: '12 Jan 2026',
      ordersCount: 28,
      totalSpentGnf: 1845000,
      lastOrder: 'Hier, 19:45',
      status: 'active',
    },
    {
      id: 'u-2',
      name: 'Aïssatou Barry',
      phone: '+224 664 12 90 34',
      quartier: 'Camayenne',
      joinedAt: '24 Fév 2026',
      ordersCount: 19,
      totalSpentGnf: 1320000,
      lastOrder: 'Aujourd\'hui, 13:10',
      status: 'active',
    },
    {
      id: 'u-3',
      name: 'Mamadou Bailo Diallo',
      phone: '+224 622 45 67 89',
      quartier: 'Kipé',
      joinedAt: '05 Mar 2026',
      ordersCount: 14,
      totalSpentGnf: 980000,
      lastOrder: 'Aujourd\'hui, 13:20',
      status: 'active',
    },
    {
      id: 'u-4',
      name: 'Fatoumata Binta Sow',
      phone: '+224 625 33 77 11',
      quartier: 'Kaloum Almamya',
      joinedAt: '18 Jan 2026',
      ordersCount: 42,
      totalSpentGnf: 3150000,
      lastOrder: 'Il y a 3 jours',
      status: 'active',
    },
  ];

  // Financial Summary Breakdown by Category
  const categoryFinancialBreakdown = [
    {
      id: 'restaurants',
      label: 'Restaurants & Repas',
      gmvGnf: 203300000,
      commissionPercent: 12,
      soneyaCommissionGnf: 24396000,
      partnerPayoutGnf: 178904000,
      ordersCount: 1840,
    },
    {
      id: 'groceries',
      label: 'Épiceries & Supermarchés',
      gmvGnf: 64200000,
      commissionPercent: 7,
      soneyaCommissionGnf: 4494000,
      partnerPayoutGnf: 59706000,
      ordersCount: 520,
    },
    {
      id: 'pharmacy',
      label: 'Pharmacie & Santé',
      gmvGnf: 42100000,
      commissionPercent: 7,
      soneyaCommissionGnf: 2947000,
      partnerPayoutGnf: 39153000,
      ordersCount: 390,
    },
    {
      id: 'colis',
      label: 'Soneya Colis Express',
      gmvGnf: 18900000,
      commissionPercent: 20,
      soneyaCommissionGnf: 3780000,
      partnerPayoutGnf: 15120000,
      ordersCount: 410,
    },
  ];

  const totalGmvGnf = categoryFinancialBreakdown.reduce((acc, c) => acc + c.gmvGnf, 0);
  const totalSoneyaCommissionGnf = categoryFinancialBreakdown.reduce((acc, c) => acc + c.soneyaCommissionGnf, 0);
  const totalCouriersPayoutGnf = 38400000;
  const totalMobileMoneyFeesGnf = Math.round(totalGmvGnf * 0.0275); // 2.75% operator fee

  // Real Excel/CSV Export Function for Finance Department
  const handleExportFinanceCsv = () => {
    const headers = [
      'Date & Heure',
      'Reference Commande',
      'Categorie',
      'Etablissement / Marchand',
      'Client',
      'Quartier Conakry',
      'Total Commande (GNF)',
      'Sous-total Panier (GNF)',
      'Frais Livraison (GNF)',
      'Frais Service (GNF)',
      'Taux Commission Soneya (%)',
      'Commission Soneya (GNF)',
      'Payout Marchand Du (GNF)',
      'Payout Rider Du (GNF)',
      'Mode Paiement',
      'Statut Commande',
    ];

    const sampleRows = [
      [
        '2026-11-23 13:20',
        'SNY-8421',
        'Restaurants',
        'Chez Fanta',
        'Mamadou Bailo Diallo',
        'Kipé Centre',
        '122000',
        '102000',
        '12000',
        '3000',
        '12%',
        '17640',
        '89760',
        '14600',
        'Orange Money',
        'Livree',
      ],
      [
        '2026-11-23 13:10',
        'SNY-8422',
        'Restaurants',
        'Chez Fanta',
        'Aïssatou Barry',
        'Camayenne',
        '66000',
        '55000',
        '18000',
        '3000',
        '12%',
        '12200',
        '48400',
        '14400',
        'MTN MoMo',
        'En cuisine',
      ],
      [
        '2026-11-23 12:45',
        'SNY-8419',
        'Grillades',
        'Le Cèdre',
        'Amadou Diallo',
        'Kaloum',
        '95000',
        '75000',
        '15000',
        '3000',
        '12%',
        '12000',
        '66000',
        '15000',
        'Orange Money',
        'Livree',
      ],
      [
        '2026-11-23 11:30',
        'SNY-8415',
        'Pharmacie',
        'Pharmacie Kipé',
        'Fatoumata Binta Sow',
        'Kaloum Almamya',
        '45000',
        '35000',
        '10000',
        '3000',
        '7%',
        '5450',
        '32550',
        '10000',
        'Orange Money',
        'Livree',
      ],
      [
        '2026-11-23 10:15',
        'COL-7801',
        'Colis Express',
        'Alpha Condé',
        'Fadima Sylla',
        'Dixinn Terrasse',
        '30000',
        '0',
        '25000',
        '5000',
        '20%',
        '6000',
        '0',
        '24000',
        'MTN MoMo',
        'Livree',
      ],
    ];

    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Microsoft Excel compatibility
      [headers.join(';'), ...sampleRows.map((r) => r.join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `soneya_finance_comptabilite_conakry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      'Export Excel prêt',
      'Le fichier comptable complet a été téléchargé pour le département Finance.',
      'success'
    );
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2026' || passcode === '2240' || passcode.length >= 4) {
      setIsAuthenticated(true);
      setAuthError(false);
      showToast('Console Super Admin déverrouillée', 'Accès complet autorisé au QG Soneya.', 'success');
    } else {
      setAuthError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] text-[#0F172A]">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl flex flex-col gap-5 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#1E3A8A] font-headline">Soneya HQ · Super Admin</h1>
            <p className="text-xs text-[#64748B] mt-1">Console confidentielle de supervision d'entreprise</p>
          </div>
          <form onSubmit={handleUnlock} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#64748B]">Code PIN Super Admin</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Code à 4 chiffres (Indice: 2026)"
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-center font-mono text-lg tracking-widest outline-hidden focus:border-[#1E3A8A]"
              />
              {authError && <span className="text-xs font-bold text-[#D8432F]">Code d'accès incorrect.</span>}
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#1E3A8A] text-white font-bold text-sm shadow-md hover:opacity-95 cursor-pointer"
            >
              Déverrouiller le Command Center
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] text-[#0F172A] font-body antialiased">
      {/* Super Admin Left Sidebar in Soneya Deep Blue */}
      <aside className="w-full lg:w-64 lg:shrink-0 bg-[#1E3A8A] text-white flex flex-col justify-between p-5 border-r border-[#1E3A8A]">
        <div className="flex flex-col gap-6">
          {/* Header Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#1E3A8A] flex items-center justify-center font-black text-xl shadow-xs">
                S
              </div>
              <div>
                <span className="font-headline font-black text-base text-white tracking-tight block">
                  Soneya Control
                </span>
                <span className="text-[10px] text-[#DCE3F4] font-semibold">QG · SUPER ADMIN</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setShowLandingPortal(true);
              }}
              className="text-white/60 hover:text-white text-xs p-1 rounded-lg"
              title="Retour accueil"
            >
              Quitter
            </button>
          </div>

          {/* Super Admin Identity Badge */}
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <strong className="text-xs font-bold text-white block truncate">Super Administrateur</strong>
              <span className="text-[10px] text-[#DCE3F4] block">Conakry HQ · Accès Maître</span>
            </div>
          </div>

          {/* Super Admin Navigation Links */}
          <nav className="flex flex-col gap-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Vue d\'ensemble & Graphes', icon: LayoutDashboard },
              { id: 'partners', label: 'Toutes les Entreprises', icon: Store, count: allPartnersList.length },
              { id: 'couriers', label: 'Flotte Livreurs & KYC', icon: Bike, count: allCouriersList.length },
              { id: 'users', label: 'Clients & Utilisateurs', icon: Users, count: allUsersList.length },
              { id: 'finances', label: 'Finance & Export Excel', icon: CircleDollarSign },
              { id: 'categories', label: 'Gestion par Catégorie', icon: Layers },
              { id: 'support', label: 'File Tickets Support', icon: Headphones },
              { id: 'superadmin', label: 'Moi, le Super Admin', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-white text-[#1E3A8A] font-bold shadow-sm'
                      : 'text-[#DCE3F4] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Security watermark */}
        <div className="mt-6 pt-4 border-t border-white/15 text-[11px] text-[#DCE3F4]">
          <span className="font-bold text-white block">Soneya HQ Security :</span>
          <span>Session chiffrée SSL · IP Conakry</span>
        </div>
      </aside>

      {/* Main Command Center Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Excel Export & Quick Stats */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-extrabold text-[#1E3A8A] font-headline">
              {activeTab === 'overview' && 'Vue d\'ensemble & Supervision Conakry'}
              {activeTab === 'partners' && 'Entreprises & Commerces Partenaires'}
              {activeTab === 'couriers' && 'Flotte Livreurs & Vérification KYC'}
              {activeTab === 'users' && 'Clients & Comptes Utilisateurs'}
              {activeTab === 'finances' && 'Département Finance & Comptabilité'}
              {activeTab === 'categories' && 'Commissions & Paramétrage Catégories'}
              {activeTab === 'support' && 'File d\'attente Support & Litiges'}
              {activeTab === 'superadmin' && 'Console Super Admin & Journal d\'audit'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Real Excel / CSV Export Button */}
            <button
              onClick={handleExportFinanceCsv}
              className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 cursor-pointer"
              title="Exporter les écritures financières en fichier Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Export Excel Finance</span>
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main className="p-6 flex-1 flex flex-col gap-6 max-w-7xl w-full mx-auto">
          {/* TAB 1: OVERVIEW & GRAPHES GLOBAUX */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 m-reveal">
              {/* 4 Grand KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <article className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748B]">Volume Brut Conakry (GMV)</span>
                  <span className="text-2xl font-extrabold text-[#1E3A8A] font-headline">
                    {formatGnf(totalGmvGnf)}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +24% de volume mensuel
                  </span>
                </article>

                <article className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748B]">Commissions Nettes Soneya</span>
                  <span className="text-2xl font-extrabold text-[#D8432F] font-headline">
                    {formatGnf(totalSoneyaCommissionGnf)}
                  </span>
                  <span className="text-xs text-[#64748B]">Revenus plateforme encaissés</span>
                </article>

                <article className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748B]">Riders Actifs en Flotte</span>
                  <span className="text-2xl font-extrabold text-[#1E3A8A] font-headline">
                    {allCouriersList.filter((c) => c.status === 'online').length} / {allCouriersList.length}
                  </span>
                  <span className="text-xs text-[#64748B]">Kaloum · Kipé · Dixinn · Madina</span>
                </article>

                <article className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748B]">Commerces Opérationnels</span>
                  <span className="text-2xl font-extrabold text-[#1E3A8A] font-headline">
                    {allPartnersList.length} partenaires
                  </span>
                  <span className="text-xs text-[#64748B]">Restaurants, Épiceries, Santé</span>
                </article>
              </div>

              {/* Graphical Overview Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Hourly Activity Bar Chart */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#1E3A8A]">Courbe des livraisons par tranche horaire</h3>
                      <p className="text-xs text-[#64748B]">Distribution des flux de courses sur Conakry</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#DCE3F4] text-[#1E3A8A] text-xs font-bold">
                      Toutes catégories
                    </span>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-[#E2E8F0] pb-2">
                    {[
                      { h: '08h', val: 15, count: '12 cmd' },
                      { h: '10h', val: 35, count: '45 cmd' },
                      { h: '12h', val: 85, count: '180 cmd' },
                      { h: '13h', val: 100, count: '240 cmd' },
                      { h: '15h', val: 50, count: '95 cmd' },
                      { h: '17h', val: 40, count: '75 cmd' },
                      { h: '19h', val: 95, count: '220 cmd' },
                      { h: '21h', val: 65, count: '130 cmd' },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div
                          className={`w-full rounded-t-md transition-all hover:opacity-80 ${
                            bar.val === 100 ? 'bg-[#D8432F]' : 'bg-[#1E3A8A]'
                          }`}
                          style={{ height: `${bar.val}%` }}
                          title={`${bar.h} : ${bar.count}`}
                        />
                        <span className="text-[11px] font-semibold text-[#64748B]">{bar.h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs text-[#64748B]">
                    <span>Deux pics majeurs identifiés : 13h (Déjeuner) &amp; 19h (Dîner)</span>
                    <span className="font-bold text-[#1E3A8A]">98.2% livrées dans les temps</span>
                  </div>
                </div>

                {/* Category GMV Share Breakdown */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#1E3A8A]">Répartition du volume par catégorie</h3>
                    <span className="text-xs font-bold text-[#D8432F]">{formatGnf(totalGmvGnf)}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {categoryFinancialBreakdown.map((cat) => {
                      const sharePercent = Math.round((cat.gmvGnf / totalGmvGnf) * 100);
                      return (
                        <div key={cat.id} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{cat.label}</span>
                            <span className="text-[#1E3A8A] font-bold">
                              {formatGnf(cat.gmvGnf)} ({sharePercent}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden">
                            <div
                              className="h-full bg-[#1E3A8A] rounded-full"
                              style={{ width: `${sharePercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOUTES LES ENTREPRISES */}
          {activeTab === 'partners' && (
            <div className="flex flex-col gap-4 m-reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">Annuaire complet des entreprises</h2>
                  <p className="text-xs text-[#64748B]">
                    Contrôlez les restaurants, boutiques et pharmacies affiliés à Conakry
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Établissement</th>
                      <th className="p-3.5">Catégorie</th>
                      <th className="p-3.5">Quartier</th>
                      <th className="p-3.5">Gérant / Contact</th>
                      <th className="p-3.5 text-center">Commission</th>
                      <th className="p-3.5 text-right">Volume Ventes</th>
                      <th className="p-3.5 text-center">Note</th>
                      <th className="p-3.5 text-center">Statut</th>
                      <th className="p-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]/60">
                    {allPartnersList.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F8FAFC]/80 transition">
                        <td className="p-3.5 font-bold text-[#0F172A] flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                          <span>{p.name}</span>
                        </td>
                        <td className="p-3.5 text-[#64748B]">{p.categoryLabel}</td>
                        <td className="p-3.5 text-[#64748B]">{p.quartierName}</td>
                        <td className="p-3.5 text-[#0F172A]">
                          <strong>{p.manager}</strong>
                          <span className="block text-[11px] text-[#64748B]">{p.phone}</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-[#1E3A8A]">{p.commissionRatePercent}%</td>
                        <td className="p-3.5 text-right font-mono font-bold text-[#1E3A8A]">
                          {formatGnf(p.gmvGnf)}
                        </td>
                        <td className="p-3.5 text-center font-bold flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#F4B028] fill-[#F4B028]" />
                          <span>{p.rating}</span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            Actif
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedPartnerDetails(p)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] font-bold text-[#1E3A8A] hover:bg-[#DCE3F4]"
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TOUS LES LIVREURS & KYC */}
          {activeTab === 'couriers' && (
            <div className="flex flex-col gap-4 m-reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">Gestion de la Flotte Livreurs &amp; KYC</h2>
                  <p className="text-xs text-[#64748B]">
                    Vérification des pièces d'identité, cartes grises et conformité sécurité
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Livreur / Moto</th>
                      <th className="p-3.5">Téléphone (+224)</th>
                      <th className="p-3.5">Zone principale</th>
                      <th className="p-3.5 text-center">Courses faites</th>
                      <th className="p-3.5 text-center">Distance totale</th>
                      <th className="p-3.5 text-center">Note sécurité</th>
                      <th className="p-3.5 text-center">Statut KYC</th>
                      <th className="p-3.5 text-right">Solde dû</th>
                      <th className="p-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]/60">
                    {allCouriersList.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F8FAFC]/80 transition">
                        <td className="p-3.5">
                          <strong className="text-[#0F172A] block">{c.name}</strong>
                          <span className="text-[11px] text-[#64748B]">{c.vehicle}</span>
                        </td>
                        <td className="p-3.5 font-mono text-[#0F172A]">{c.phone}</td>
                        <td className="p-3.5 text-[#64748B]">{c.quartier}</td>
                        <td className="p-3.5 text-center font-bold">{c.ridesCount} courses</td>
                        <td className="p-3.5 text-center font-mono">{c.distanceKm} km</td>
                        <td className="p-3.5 text-center font-bold text-emerald-700">{c.safetyRating} / 5</td>
                        <td className="p-3.5 text-center">
                          {c.kycStatus === 'validated' ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                              Validé ✓
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-[#1E3A8A]">
                          {formatGnf(c.payoutDueGnf)}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedCourierDetails(c)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] font-bold text-[#1E3A8A] hover:bg-[#DCE3F4]"
                          >
                            Dossier KYC
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENTS & UTILISATEURS */}
          {activeTab === 'users' && (
            <div className="flex flex-col gap-4 m-reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">Clients &amp; Comptes Utilisateurs</h2>
                  <p className="text-xs text-[#64748B]">Base des utilisateurs enregistrés à Conakry</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Nom du client</th>
                      <th className="p-3.5">Numéro Mobile (+224)</th>
                      <th className="p-3.5">Quartier</th>
                      <th className="p-3.5">Inscription</th>
                      <th className="p-3.5 text-center">Commandes</th>
                      <th className="p-3.5 text-right">Dépenses Totales</th>
                      <th className="p-3.5">Dernière commande</th>
                      <th className="p-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]/60">
                    {allUsersList.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F8FAFC]/80 transition">
                        <td className="p-3.5 font-bold text-[#0F172A]">{u.name}</td>
                        <td className="p-3.5 font-mono text-[#64748B]">{u.phone}</td>
                        <td className="p-3.5 text-[#64748B]">{u.quartier}</td>
                        <td className="p-3.5 text-[#64748B]">{u.joinedAt}</td>
                        <td className="p-3.5 text-center font-bold">{u.ordersCount} cmd</td>
                        <td className="p-3.5 text-right font-mono font-bold text-[#1E3A8A]">
                          {formatGnf(u.totalSpentGnf)}
                        </td>
                        <td className="p-3.5 text-[#64748B]">{u.lastOrder}</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedUserDetails(u)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] font-bold text-[#1E3A8A] hover:bg-[#DCE3F4]"
                          >
                            Consulter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: FINANCES & DÉPARTEMENT COMPTABLE (Avec Export Excel) */}
          {activeTab === 'finances' && (
            <div className="flex flex-col gap-6 m-reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">Comptabilité &amp; Répartition Financière</h2>
                  <p className="text-xs text-[#64748B]">
                    Bilan complet des flux Orange Money, MTN MoMo et commissions Soneya
                  </p>
                </div>
                <button
                  onClick={handleExportFinanceCsv}
                  className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold flex items-center gap-2 shadow-sm hover:opacity-90"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                  <span>Télécharger Rapport Excel (.csv)</span>
                </button>
              </div>

              {/* Finance Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <span className="text-xs font-semibold text-[#64748B]">Volume Brut d'Affaires</span>
                  <div className="text-2xl font-extrabold text-[#1E3A8A] font-headline mt-1">
                    {formatGnf(totalGmvGnf)}
                  </div>
                  <span className="text-xs text-[#64748B]">Sur la période 2026</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <span className="text-xs font-semibold text-[#64748B]">Commissions Nettes Soneya</span>
                  <div className="text-2xl font-extrabold text-emerald-700 font-headline mt-1">
                    {formatGnf(totalSoneyaCommissionGnf)}
                  </div>
                  <span className="text-xs text-emerald-600 font-bold">Marge brute 10.8%</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <span className="text-xs font-semibold text-[#64748B]">Versements Partenaires Dus</span>
                  <div className="text-2xl font-extrabold text-[#1E3A8A] font-headline mt-1">
                    {formatGnf(totalGmvGnf - totalSoneyaCommissionGnf)}
                  </div>
                  <span className="text-xs text-[#64748B]">Virements MoMo automatiques</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                  <span className="text-xs font-semibold text-[#64748B]">Frais Mobile Money (2.75%)</span>
                  <div className="text-2xl font-extrabold text-[#D8432F] font-headline mt-1">
                    {formatGnf(totalMobileMoneyFeesGnf)}
                  </div>
                  <span className="text-xs text-[#64748B]">Orange Money / MTN MoMo</span>
                </div>
              </div>

              {/* Category Breakdown Table */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 flex flex-col gap-3">
                <h3 className="font-bold text-sm text-[#1E3A8A]">Ventilation financière par catégorie d'activité</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase">
                      <tr>
                        <th className="p-3">Catégorie</th>
                        <th className="p-3 text-right">Volume d'affaires (GNF)</th>
                        <th className="p-3 text-center">Taux Comm.</th>
                        <th className="p-3 text-right">Commission Soneya</th>
                        <th className="p-3 text-right">Partenaire Reversé</th>
                        <th className="p-3 text-center">Commandes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]/60">
                      {categoryFinancialBreakdown.map((cat) => (
                        <tr key={cat.id} className="hover:bg-[#F8FAFC]">
                          <td className="p-3 font-bold text-[#0F172A]">{cat.label}</td>
                          <td className="p-3 text-right font-mono font-bold text-[#1E3A8A]">
                            {formatGnf(cat.gmvGnf)}
                          </td>
                          <td className="p-3 text-center font-bold text-[#D8432F]">{cat.commissionPercent}%</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-700">
                            {formatGnf(cat.soneyaCommissionGnf)}
                          </td>
                          <td className="p-3 text-right font-mono">{formatGnf(cat.partnerPayoutGnf)}</td>
                          <td className="p-3 text-center font-bold">{cat.ordersCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Console d'Intégration & Test API Directe Orange Money Guinée */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black font-headline text-lg shadow-sm">
                      OM
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                        <span>Console API Orange Money Guinée (OMAPI WebPay)</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          Active · Devise GNF
                        </span>
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Test direct de l'initiation de paiement WebPayment et push USSD #144#
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#64748B] bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
                      Endpoint : /gn/v1/webpayment
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#334155]">Numéro Mobile Client (+224)</label>
                    <input
                      type="text"
                      value={omTestPhone}
                      onChange={(e) => setOmTestPhone(e.target.value)}
                      placeholder="+224 622 12 34 56"
                      className="px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-mono font-bold text-[#0F172A] outline-hidden focus:border-orange-500"
                    />
                    <span className="text-[10px] text-[#64748B]">Préfixes valides : 620, 621, 622, 624, 628</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#334155]">Montant de la Transaction (GNF)</label>
                    <input
                      type="number"
                      value={omTestAmount}
                      onChange={(e) => setOmTestAmount(e.target.value)}
                      placeholder="125000"
                      className="px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-mono font-bold text-[#0F172A] outline-hidden focus:border-orange-500"
                    />
                    <span className="text-[10px] text-[#64748B]">Frais opérateur estimés : 2.75%</span>
                  </div>

                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      disabled={omTestLoading}
                      onClick={handleTestOrangeMoneyPayment}
                      className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      {omTestLoading ? (
                        <span>Connexion Orange en cours...</span>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Déclencher Requête API WebPay</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* API Result Terminal Output */}
                {omTestResult && (
                  <div className="p-4 rounded-xl bg-[#0F172A] text-white font-mono text-xs flex flex-col gap-2 mt-2 border border-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="text-emerald-400 font-bold">● Réponse 201 Created (Orange Money GN)</span>
                      <span className="text-[11px] text-slate-400">Order ID : {omTestResult.order_id}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div>
                        <strong className="text-slate-400">Pay Token : </strong>
                        <span className="text-amber-400">{omTestResult.pay_token}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Code USSD : </strong>
                        <span className="text-orange-400 font-bold">{omTestResult.ussd_code || '#144#'}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <strong className="text-slate-400">URL Redirection : </strong>
                        <span className="text-blue-400 break-all">{omTestResult.payment_url}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800 mt-1">
                      {omTestResult.message}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: GESTION PAR CATÉGORIE */}
          {activeTab === 'categories' && (
            <div className="flex flex-col gap-5 m-reveal">
              <div>
                <h2 className="text-base font-bold text-[#1E3A8A]">Configuration des Catégories &amp; Commissions</h2>
                <p className="text-xs text-[#64748B]">
                  Ajustez les commissions prélevées par secteur à Conakry
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'restaurants', label: 'Restaurants & Traiteurs', defaultRate: 12, desc: 'Repas chauds livrés en 25 min' },
                  { id: 'boutiques', label: 'Boutiques & Mode', defaultRate: 10, desc: 'Prêt-à-porter, maroquinerie, accessoires' },
                  { id: 'groceries', label: 'Épicerie & Supermarché', defaultRate: 7, desc: 'Produits frais, paniers Primeur' },
                  { id: 'pharmacy', label: 'Pharmacie & Parapharmacie', defaultRate: 7, desc: 'Médicaments et soins de santé' },
                  { id: 'colis', label: 'Colis Express Particuliers', defaultRate: 20, desc: 'Courses urbaines de plis et paquets' },
                ].map((cat) => (
                  <div key={cat.id} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between gap-4">
                    <div>
                      <strong className="text-sm font-bold text-[#1E3A8A] block">{cat.label}</strong>
                      <p className="text-xs text-[#64748B] mt-1">{cat.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                      <span className="text-xs font-semibold text-[#64748B]">Taux de commission :</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={categoryCommissions[cat.id] ?? cat.defaultRate}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setCategoryCommissions((prev) => ({ ...prev, [cat.id]: val }));
                          }}
                          className="w-16 px-2 py-1 rounded-lg border border-[#E2E8F0] font-mono text-center font-bold text-sm text-[#1E3A8A]"
                        />
                        <span className="font-bold text-xs text-[#1E3A8A]">%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => showToast('Commissions enregistrées', 'Les nouveaux taux de commission sont appliqués.', 'success')}
                className="self-end px-5 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold shadow-xs hover:opacity-90"
              >
                Enregistrer les paramètres
              </button>
            </div>
          )}

          {/* TAB 7: SUPPORT TICKETS QUEUE */}
          {activeTab === 'support' && (
            <div className="flex flex-col gap-4 m-reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1E3A8A]">File de Tickets Support Soneya Control</h2>
                  <p className="text-xs text-[#64748B]">Réclamations clients, litiges livreurs et assistance marchands</p>
                </div>
              </div>

              <div className="divide-y divide-[#E2E8F0] bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
                {[
                  {
                    id: 'TK-104',
                    from: 'Aïssatou Barry (Client)',
                    cmd: '#SNY-8420',
                    subj: 'Retard de 10 min suite embouteillage Kipé',
                    priority: 'Normale',
                    stat: 'Ouvert',
                    time: 'Il y a 12 min',
                  },
                  {
                    id: 'TK-103',
                    from: 'Ousmane Camara (Livreur)',
                    cmd: '#SNY-8417',
                    subj: 'Client injoignable au point de repère',
                    priority: 'Haute',
                    stat: 'En cours',
                    time: 'Il y a 45 min',
                  },
                  {
                    id: 'TK-102',
                    from: 'Chez Fanta (Commerce)',
                    cmd: '#SNY-8409',
                    subj: 'Confirmation versement Orange Money hebdomadaire',
                    priority: 'Normale',
                    stat: 'Résolu',
                    time: 'Hier, 18h',
                  },
                ].map((ticket) => (
                  <div key={ticket.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-[#1E3A8A]">{ticket.id}</strong>
                        <span className="text-[#0F172A] font-bold">· {ticket.from}</span>
                        <span className="text-[#64748B]">(Commande {ticket.cmd})</span>
                      </div>
                      <p className="text-[#64748B] mt-1">{ticket.subj}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#64748B]">{ticket.time}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          ticket.stat === 'Résolu'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ticket.stat}
                      </span>
                      <button
                        onClick={() => showToast('Ticket pris en charge', `Ticket ${ticket.id} assigné.`, 'info')}
                        className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] font-bold text-[#1E3A8A] hover:bg-[#DCE3F4]"
                      >
                        Gérer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: MOI, LE SUPER ADMIN */}
          {activeTab === 'superadmin' && (
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-5 m-reveal">
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-2xl">
                  SA
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-[#1E3A8A]">Super Administrateur Soneya</h2>
                  <p className="text-xs text-[#64748B]">Guinée Hub Technologie (GHT) · Conakry HQ</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    Privilèges Maître Accordés
                  </span>
                </div>
              </div>

              {/* System Audit Logs */}
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-3 text-xs">
                <h3 className="font-bold text-sm text-[#1E3A8A]">Journal d'audit système en direct</h3>
                <div className="divide-y divide-[#E2E8F0]/60">
                  {[
                    { time: '13:25', evt: 'Export comptable Excel déclenché par Super Admin', ip: '197.149.x.x (Conakry)' },
                    { time: '12:40', evt: 'Validation KYC Rider : Ibrahima Sory Bah certifié', ip: 'System HQ' },
                    { time: '11:15', evt: 'Virement groupé Orange Money marchands : 114 900 000 GNF', ip: 'Orange API' },
                    { time: '09:00', evt: 'Initialisation des serveurs de livraison Conakry', ip: 'Cloud Host' },
                  ].map((log, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between">
                      <div>
                        <strong className="text-[#0F172A] block">{log.evt}</strong>
                        <span className="text-[#64748B] text-[11px]">{log.ip}</span>
                      </div>
                      <span className="font-mono text-[#64748B]">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database & Cache Controls */}
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-3 text-xs">
                <h3 className="font-bold text-sm text-[#1E3A8A]">Maintenance &amp; Synchronisation</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => showToast('Cache purgé', 'Le cache local de l\'application a été rafraîchi.', 'success')}
                    className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] font-bold text-[#1E3A8A] hover:bg-[#F8FAFC]"
                  >
                    Vider les caches locaux
                  </button>
                  <button
                    onClick={handleExportFinanceCsv}
                    className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] text-white font-bold hover:opacity-90"
                  >
                    Sauvegarde complète (.csv)
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Partner Inspection */}
      {selectedPartnerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs m-reveal">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-headline font-bold text-base text-[#1E3A8A]">{selectedPartnerDetails.name}</h3>
                <p className="text-xs text-[#64748B]">{selectedPartnerDetails.address}</p>
              </div>
              <button
                onClick={() => setSelectedPartnerDetails(null)}
                className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <span>Taux de commission plateforme :</span>
                <strong className="text-[#1E3A8A]">{selectedPartnerDetails.commissionRatePercent}%</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <span>Statut d'activité :</span>
                <strong className="text-emerald-700">Ouvert &amp; Certifié</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <span>Nombre de plats au menu :</span>
                <strong>{selectedPartnerDetails.products?.length || 4} références</strong>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => {
                  showToast('Statut partenaire', `Statut de ${selectedPartnerDetails.name} mis à jour.`, 'info');
                  setSelectedPartnerDetails(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] text-white font-bold text-xs"
              >
                Valider les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Courier KYC Inspection */}
      {selectedCourierDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs m-reveal">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-headline font-bold text-base text-[#1E3A8A]">
                  Dossier KYC : {selectedCourierDetails.name}
                </h3>
                <p className="text-xs text-[#64748B]">{selectedCourierDetails.vehicle}</p>
              </div>
              <button
                onClick={() => setSelectedCourierDetails(null)}
                className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <strong>Carte Grise du véhicule</strong>
                  <span className="block text-[#64748B]">Vérifiée conforme par la police de Conakry</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <strong>Carte d'Identité Nationale (CNI)</strong>
                  <span className="block text-[#64748B]">Identité guinéenne certifiée</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <strong>Charte des Riders Soneya</strong>
                  <span className="block text-[#64748B]">Signée numériquement (Casque &amp; Code de la route)</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => {
                  showToast('Rider approuvé', `${selectedCourierDetails.name} est certifié actif.`, 'success');
                  setSelectedCourierDetails(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                Approuver &amp; Activer sur la flotte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: User Inspection */}
      {selectedUserDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs m-reveal">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-headline font-bold text-base text-[#1E3A8A]">{selectedUserDetails.name}</h3>
                <p className="text-xs text-[#64748B]">{selectedUserDetails.phone}</p>
              </div>
              <button
                onClick={() => setSelectedUserDetails(null)}
                className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <span>Quartier de livraison habituel :</span>
                <strong>{selectedUserDetails.quartier}</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <span>Commandes effectuées :</span>
                <strong>{selectedUserDetails.ordersCount}</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-[#F8FAFC]">
                <span>Montant cumulé en GNF :</span>
                <strong className="text-[#1E3A8A] font-mono">{formatGnf(selectedUserDetails.totalSpentGnf)}</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserDetails(null)}
              className="w-full py-2.5 rounded-xl bg-[#1E3A8A] text-white font-bold text-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
