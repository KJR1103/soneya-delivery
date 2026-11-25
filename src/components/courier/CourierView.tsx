import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';
import { ConakryMap } from '../client/ConakryMap';
import { DocumentSpecimenViewer } from './DocumentSpecimenViewer';
import { sound } from '../../utils/audio';
import {
  Bike,
  Power,
  Navigation,
  CheckCircle2,
  MapPin,
  Store,
  Clock,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Upload,
  Lock,
  AlertTriangle,
  AlertCircle,
  Eye,
  FileEdit,
  UserCheck,
  Check,
  ExternalLink,
  Volume2,
  Sparkles,
} from 'lucide-react';

interface MissionOffer {
  id: string;
  payoutGnf: number;
  distanceKm: number;
  pickup: string;
  dropoff: string;
  partnerType: string;
  specialInstruction?: string;
  itemsSummary: string;
}

export const CourierView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    validateOrderWithCode,
    currentCourierId,
    setCurrentCourierId,
    currentCourierApplication,
    setIsCourierOnboardingModalOpen,
    showToast,
  } = useApp();

  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'mission' | 'available' | 'earnings' | 'security'
  >('mission');
  const [deliveryCodeInput, setDeliveryCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [inspectDocType, setInspectDocType] = useState<
    'cni' | 'carte_grise' | 'certificat_residence' | 'selfie' | 'charter' | null
  >(null);

  const [activeOffer, setActiveOffer] = useState<MissionOffer | null>(null);
  const [offerCountdown, setOfferCountdown] = useState(30);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isLiveGpsSharing, setIsLiveGpsSharing] = useState(false);
  const [liveCourierPos, setLiveCourierPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!isLiveGpsSharing || !navigator.geolocation) {
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLiveCourierPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setIsLiveGpsSharing(false);
        showToast(
          'GPS indisponible',
          'Activez la localisation de votre téléphone pour partager votre position en direct.',
          'status'
        );
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isLiveGpsSharing, showToast]);

  useEffect(() => {
    if (!activeOffer) return;
    const interval = setInterval(() => {
      setOfferCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveOffer(null);
          showToast(
            'Offre expirée',
            'La course a été transmise au motard suivant.',
            'info'
          );
          return 0;
        }
        sound.playCountdownBeep();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeOffer, showToast]);

  const currentApp = currentCourierApplication;
  const kycStatus = currentApp ? currentApp.status : 'incomplete';
  const isValidated = kycStatus === 'validated';
  const actualIsOnline = isValidated ? isOnline : false;
  const activeOrder = orders.find((o) => o.status !== 'delivered') || orders[0] || null;

  const handleTriggerDemoOffer = () => {
    setOfferCountdown(30);
    setSlideProgress(0);
    setActiveOffer({
      id: `offer-${Date.now()}`,
      payoutGnf: 24500,
      distanceKm: 3.8,
      pickup: 'Chez Fanta (Almamya, Kaloum)',
      dropoff: 'Résidence Minière (Dixinn)',
      partnerType: 'Restaurant',
      specialInstruction: 'Code porte 24B8 · Ne pas klaxonner',
      itemsSummary: '2x Poulet Yassa + 1x Jus Bissap',
    });
    sound.playAlert();
  };

  const [availableMissions, setAvailableMissions] = useState([
    {
      id: 'mis-1',
      restaurant: 'Le Cèdre Restaurant',
      restaurantQuartier: 'Kaloum / Almamya',
      destination: 'Résidence Minière, Dixinn',
      distanceKm: 3.8,
      payoutGnf: 18500,
      prepReady: true,
      itemsSummary: '2 Chawarmas Poulet + 1 Frites',
    },
    {
      id: 'mis-2',
      restaurant: 'Supermarché Prima Center',
      restaurantQuartier: 'Kipé',
      destination: 'Lambanyi Centre Commercial',
      distanceKm: 4.2,
      payoutGnf: 19500,
      prepReady: false,
      itemsSummary: 'Pack Eau Coyah + Épicerie',
    },
  ]);

  const handleToggleOnline = () => {
    if (!isValidated) {
      showToast(
        'Accès verrouillé',
        'Votre dossier doit être validé par l administrateur Soneya avant de pouvoir passer en ligne.',
        'status'
      );
      return;
    }
    setIsOnline(!isOnline);
  };

  const handleAdvanceMission = () => {
    if (!activeOrder || !isValidated) return;
    if (activeOrder.status === 'submitted') {
      updateOrderStatus(activeOrder.id, 'preparing', 'Prise en charge par le coursier');
    } else if (activeOrder.status === 'preparing') {
      updateOrderStatus(activeOrder.id, 'ready', 'Colis récupéré au restaurant');
    } else if (activeOrder.status === 'ready') {
      updateOrderStatus(activeOrder.id, 'delivering', 'Le motard roule vers le client');
    } else if (activeOrder.status === 'delivering') {
      updateOrderStatus(activeOrder.id, 'delivered', 'Livré avec confirmation');
    }
  };

  const handleAcceptMission = (id: string) => {
    if (!isValidated) {
      showToast(
        'Action impossible',
        'Validation administrative obligatoire pour accepter des courses.',
        'status'
      );
      return;
    }
    setAvailableMissions((prev) => prev.filter((m) => m.id !== id));
    setActiveTab('mission');
    showToast('Course acceptée', 'Rendez-vous au point de retrait indiqué.', 'success');
  };

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    if (!deliveryCodeInput.trim() || deliveryCodeInput.trim().length !== 4) {
      setCodeError('Veuillez saisir un code à 4 chiffres.');
      return;
    }

    const res = validateOrderWithCode(activeOrder.id, deliveryCodeInput.trim());
    if (res.success) {
      setCodeError(null);
      setDeliveryCodeInput('');
    } else {
      setCodeError(res.message);
    }
  };

  const renderKycStatusBadge = () => {
    switch (kycStatus) {
      case 'validated':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-emerald-700/50 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B7A4B]" />
            <span>Validé par Soneya Admin</span>
          </span>
        );
      case 'pending_verification':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 flex items-center gap-1 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>En cours de vérification</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700/50 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Refusé (avec motif)</span>
          </span>
        );
      case 'suspended':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Suspendu</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50/70 dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-200 border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center gap-1">
            <FileEdit className="w-3.5 h-3.5 text-[#0B7A4B]" />
            <span>Dossier Incomplet</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-6 py-4 pb-32 space-y-4">
      {/* Interactive Profile Tester Switcher */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-2 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#0B2B1E] dark:text-white flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
            <span>Tester les différents statuts de livreur :</span>
          </span>
          <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">
            Simulation d'arbitrage
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {[
            { id: 'c-1', name: 'Mamadou Sow', label: 'Validé' },
            { id: 'c-2', name: 'Alpha O. Barry', label: 'En vérification' },
            { id: 'c-3', name: 'Ibrahima Camara', label: 'Refusé' },
            { id: 'c-4', name: 'Sékouba Touré', label: 'Suspendu' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCurrentCourierId(c.id)}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold transition truncate text-left flex flex-col cursor-pointer border min-h-[44px] ${
                currentCourierId === c.id
                  ? 'bg-[#0B7A4B] text-white border-[#0B7A4B] shadow-xs'
                  : 'bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-100 border-[#D4E9DD] dark:border-[#1E3B2D] hover:border-[#0B7A4B]'
              }`}
            >
              <span className="truncate w-full">{c.name}</span>
              <span className="text-[9px] font-normal opacity-90">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rider Header & Online Toggle */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#0B2B1E] text-white flex items-center justify-center font-bold shadow-xs overflow-hidden">
              {currentApp?.documents.selfiePhotoUrl ? (
                <img
                  src={currentApp.documents.selfiePhotoUrl}
                  alt={currentApp.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Bike className="w-6 h-6" />
              )}
            </div>
            {isValidated && (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0B7A4B] border-2 border-white dark:border-[#0C1913] flex items-center justify-center text-white"
                title="Certifié Soneya"
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white truncate">
                {currentApp ? currentApp.fullName : 'Nouveau Motard'}
              </h1>
              {renderKycStatusBadge()}
            </div>
            <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/75 mt-0.5 truncate">
              {currentApp?.documents.vehicleBrandModel || 'Moto non renseignée'} · Plaque{' '}
              {currentApp?.documents.plateNumber || 'N/A'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleOnline}
          disabled={!isValidated}
          title={!isValidated ? 'Validation requise pour passer en ligne' : undefined}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border min-h-[42px] shrink-0 ${
            !isValidated
              ? 'bg-white dark:bg-[#10231B] text-[#5C7A6E] dark:text-emerald-300/40 cursor-not-allowed opacity-60 border-[#E2ECE7] dark:border-[#1E3B2D]'
              : actualIsOnline
              ? 'bg-[#0B7A4B] text-white border-[#0B7A4B] hover:bg-[#08613B]'
              : 'bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-100 border-[#D4E9DD] dark:border-[#1E3B2D] hover:border-[#0B7A4B]'
          }`}
        >
          {!isValidated ? <Lock className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
          <span>{!isValidated ? 'Verrouillé' : actualIsOnline ? 'En ligne' : 'Hors ligne'}</span>
        </button>
      </div>

      {/* Prominent KYC Notification Banner if not Validated */}
      {!isValidated && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] space-y-3 shadow-xs text-[#0B2B1E] dark:text-white">
          <div className="flex items-start gap-2.5">
            {kycStatus === 'pending_verification' && (
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            {kycStatus === 'rejected' && (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            {kycStatus === 'suspended' && (
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            )}
            {kycStatus === 'incomplete' && (
              <FileEdit className="w-5 h-5 text-[#0B7A4B] shrink-0 mt-0.5" />
            )}

            <div className="space-y-1">
              <h2 className="font-heading font-extrabold text-sm">
                {kycStatus === 'pending_verification' &&
                  "Dossier en cours d'examen par l'équipe Soneya"}
                {kycStatus === 'rejected' && "Dossier refusé par l'administrateur"}
                {kycStatus === 'suspended' && 'Compte motard temporairement suspendu'}
                {kycStatus === 'incomplete' && 'Inscription livreur sécurisée requise'}
              </h2>

              <p className="text-xs leading-relaxed text-[#2F4F42] dark:text-emerald-200/80">
                {kycStatus === 'pending_verification' && (
                  <>
                    Vos pièces justificatives (CNI biométrique, carte grise, selfie et charte signée) sont en cours d'audit de conformité. Délai moyen habituel :{' '}
                    <strong>moins de 2 heures</strong> à Conakry.
                  </>
                )}
                {kycStatus === 'rejected' && (
                  <>
                    <strong>Motif du refus :</strong>{' '}
                    {currentApp?.rejectionReason || 'Documents incomplets ou illisibles.'}
                  </>
                )}
                {kycStatus === 'suspended' && (
                  <>
                    <strong>Motif de la suspension :</strong>{' '}
                    {currentApp?.suspensionReason ||
                      'Manquement aux consignes de sécurité de la Charte Soneya.'}
                  </>
                )}
                {kycStatus === 'incomplete' && (
                  <>
                    Pour garantir la sécurité des commerçants et des clients de Conakry, un livreur ne peut recevoir aucune course tant que son dossier légal n'est pas vérifié.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D]">
            {(kycStatus === 'incomplete' || kycStatus === 'rejected') && (
              <button
                onClick={() => setIsCourierOnboardingModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer min-h-[40px]"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {kycStatus === 'rejected'
                    ? 'Corriger et renvoyer mon dossier'
                    : 'Fournir mes pièces (5 étapes)'}
                </span>
              </button>
            )}

            {currentApp && (
              <button
                onClick={() => {
                  setActiveTab('security');
                  setInspectDocType('cni');
                }}
                className="px-3 py-2 rounded-xl bg-white dark:bg-[#10231B] hover:border-[#0B7A4B] text-[#0B2B1E] dark:text-emerald-100 text-xs font-semibold transition flex items-center gap-1 border border-[#D4E9DD] dark:border-[#1E3B2D] cursor-pointer min-h-[40px]"
              >
                <Eye className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <span>Voir mon dossier soumis</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar sm:grid sm:grid-cols-4 gap-1.5 bg-white dark:bg-[#0C1913] p-1 rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-center">
        <button
          onClick={() => setActiveTab('mission')}
          className={`shrink-0 px-3 sm:px-1 py-2.5 text-[11px] font-bold rounded-xl transition cursor-pointer min-h-[42px] ${
            activeTab === 'mission'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E]'
          }`}
        >
          Mission
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`shrink-0 px-3 sm:px-1 py-2.5 text-[11px] font-bold rounded-xl transition relative cursor-pointer min-h-[42px] ${
            activeTab === 'available'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E]'
          }`}
        >
          Dispos
          {isValidated && availableMissions.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-[#0B7A4B] text-[9px] font-black">
              {availableMissions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`shrink-0 px-3 sm:px-1 py-2.5 text-[11px] font-bold rounded-xl transition cursor-pointer min-h-[42px] ${
            activeTab === 'earnings'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E]'
          }`}
        >
          Gains MoMo
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`shrink-0 px-3 sm:px-1 py-2.5 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer min-h-[42px] ${
            activeTab === 'security'
              ? 'bg-[#0B7A4B] text-white shadow-xs'
              : 'text-[#2F4F42] dark:text-emerald-200 hover:text-[#0B2B1E]'
          }`}
        >
          <ShieldAlert className="w-3 h-3 text-[#FFB81F]" />
          <span>Sécurité KYC</span>
        </button>
      </div>

      {/* TAB 1: MISSION EN COURS */}
      {activeTab === 'mission' && (
        <div className="space-y-4">
          {!isValidated ? (
            <div className="p-8 text-center bg-white dark:bg-[#0C1913] rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3 shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50/70 dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center justify-center text-[#0B7A4B] dark:text-[#FFB81F]">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-extrabold text-base text-[#0B2B1E] dark:text-white">
                Missions verrouillées
              </h3>
              <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80 max-w-sm mx-auto leading-relaxed">
                Ce motard ne peut recevoir aucune course tant que son dossier (CNI recto/verso, carte grise, selfie et charte) n'a pas été validé par l'administrateur Soneya.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsCourierOnboardingModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold shadow-xs cursor-pointer transition min-h-[44px]"
                >
                  Ouvrir le formulaire de conformité
                </button>
              </div>
            </div>
          ) : activeOrder ? (
            <>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
                  <span className="text-xs font-bold text-[#0B2B1E] dark:text-white">
                    Mode Livreur Pro :
                  </span>
                </div>
                <button
                  onClick={handleTriggerDemoOffer}
                  className="px-3.5 py-2 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-extrabold text-[11px] transition shadow-xs cursor-pointer flex items-center gap-1.5 min-h-[40px]"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Tester Pop-up d'Offre (30s)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://www.google.com/maps/dir/?api=1${liveCourierPos ? `&origin=${liveCourierPos.lat},${liveCourierPos.lng}` : ''}&destination=${activeOrder.clientLat},${activeOrder.clientLng}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white font-heading font-bold text-xs flex items-center justify-center gap-2 hover:border-[#0B7A4B] transition shadow-xs min-h-[46px]"
                >
                  <Navigation className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#5C7A6E]" />
                </a>
                <a
                  href={`https://waze.com/ul?ll=${activeOrder.clientLat},${activeOrder.clientLng}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl bg-[#0B2B1E] hover:bg-[#081C13] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs min-h-[46px]"
                >
                  <Navigation className="w-4 h-4 text-[#FFB81F]" />
                  <span>Lancer Waze</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border-2 border-[#0B7A4B] dark:border-[#1E3B2D] shadow-xs space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Instructions Spécifiques de Course</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#5C7A6E] dark:text-emerald-300/70">
                    #Détails-Cruciaux
                  </span>
                </div>
                <div className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                  {activeOrder.deliveryLandmark
                    ? `Repère client : ${activeOrder.deliveryLandmark}`
                    : 'Code porte 24B8 · Sonner à l’interphone ou appeler le client dès arrivée'}
                </div>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80">
                  {activeOrder.partnerName.toLowerCase().includes('pharmacie')
                    ? "Important santé : Demander l'ordonnance originale au client avant la remise des médicaments."
                    : "Emballage isotherme : s'assurer que le colis reste bien calé sur le porte-bagages moto."}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#0B2B1E] dark:text-white flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                    <span>Mode Navigation GPS en direct (Conakry)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isLiveGpsSharing;
                        setIsLiveGpsSharing(next);
                        if (!next) setLiveCourierPos(null);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                        isLiveGpsSharing
                          ? 'bg-[#0B7A4B] text-white border-[#0B7A4B]'
                          : 'bg-white dark:bg-[#10231B] text-[#0B7A4B] dark:text-[#FFB81F] border-[#D4E9DD] dark:border-[#1E3B2D]'
                      }`}
                    >
                      {isLiveGpsSharing ? 'GPS direct actif' : 'Activer mon GPS'}
                    </button>
                    <span className="text-[#0B7A4B] dark:text-[#FFB81F] font-bold">
                      Statut : {activeOrder.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="h-[280px] sm:h-[420px] lg:h-[460px] rounded-2xl overflow-hidden border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs">
                  <ConakryMap
                    partnerLat={activeOrder.partnerLat}
                    partnerLng={activeOrder.partnerLng}
                    partnerName={activeOrder.partnerName}
                    clientLat={activeOrder.clientLat}
                    clientLng={activeOrder.clientLng}
                    clientAddress={activeOrder.clientAddress}
                    courier={activeOrder.courier}
                    orderStatus={activeOrder.status}
                    liveCourierPos={liveCourierPos}
                  />
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3.5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#5C7A6E] dark:text-emerald-300/70">
                    Commande #{activeOrder.trackingNumber}
                  </span>
                  <span className="text-sm font-extrabold text-[#0B7A4B] dark:text-[#FFB81F]">
                    Gain coursier (80%) : {formatGnf(activeOrder.courierPayoutGnf)}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-start gap-3">
                    <Store className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#0B2B1E] dark:text-white">
                        Collecte : {activeOrder.partnerName}
                      </div>
                      <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75">
                        {activeOrder.partnerAddress} · Tél: {activeOrder.partnerPhone}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#0B2B1E] dark:text-white">
                        Livraison : {activeOrder.clientName}
                      </div>
                      <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75">
                        {activeOrder.clientAddress} ({activeOrder.clientQuartier})
                      </div>
                      {activeOrder.deliveryLandmark && (
                        <div className="mt-1 text-[11px] text-[#0B2B1E] dark:text-emerald-100 font-semibold">
                          Repère : {activeOrder.deliveryLandmark}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white space-y-2.5 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Code secret de remise à 4 chiffres</span>
                    </div>
                    {activeOrder.isCodeValidated ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[#0C1913] text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Remise validée</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">
                        Exigé pour débloquer vos gains
                      </span>
                    )}
                  </div>

                  {!activeOrder.isCodeValidated ? (
                    <form onSubmit={handleValidateCode} className="space-y-2">
                      <div className="flex flex-col xs:flex-row gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={deliveryCodeInput}
                          onChange={(e) =>
                            setDeliveryCodeInput(e.target.value.replace(/\D/g, ''))
                          }
                          placeholder="Code secret (ex: 8492)"
                          className="flex-1 px-3 py-2.5 text-sm font-mono tracking-widest text-center rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white placeholder-[#5C7A6E] focus:outline-none focus:border-[#0B7A4B] min-h-[44px]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs transition cursor-pointer min-h-[44px]"
                        >
                          Valider la remise
                        </button>
                      </div>
                      {codeError && (
                        <div className="text-[11px] text-rose-600 font-medium">
                          {codeError}
                        </div>
                      )}
                      <p className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">
                        Preuve de remise sécurisée : demandez au client le code secret affiché sur son écran.
                      </p>
                    </form>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs text-[#0B2B1E] dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0B7A4B] dark:text-emerald-400 shrink-0" />
                      <span>
                        Livraison clôturée avec succès. Virement de{' '}
                        {formatGnf(activeOrder.courierPayoutGnf)} vers votre compte Mobile Money.
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAdvanceMission}
                  className="w-full py-4 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-black text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition cursor-pointer min-h-[52px]"
                >
                  {activeOrder.status === 'submitted' && 'Prendre en charge la commande'}
                  {activeOrder.status === 'preparing' && 'Confirmer le retrait du colis'}
                  {activeOrder.status === 'ready' && 'Partir en livraison vers le client'}
                  {activeOrder.status === 'delivering' && 'Clôturer la livraison'}
                  {activeOrder.status === 'delivered' && 'Course terminée'}
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-[#0C1913] rounded-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] text-xs text-[#5C7A6E] dark:text-emerald-200/70 shadow-xs">
              Aucune mission en cours. Consultez l'onglet "Dispos" pour accepter une nouvelle course à Conakry.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COURSES DISPONIBLES */}
      {activeTab === 'available' && (
        <div className="space-y-3">
          {!isValidated ? (
            <div className="p-8 text-center bg-white dark:bg-[#0C1913] rounded-3xl border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-extrabold text-sm text-[#0B2B1E] dark:text-white">
                Accès restreint aux motards validés
              </h3>
              <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/75 max-w-sm mx-auto">
                Les courses de Conakry sont réservées aux motards ayant fourni leur CNI biométrique, carte grise, certificat de résidence et charte signée.
              </p>
            </div>
          ) : (
            availableMissions.map((mission) => (
              <div
                key={mission.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-[#0B2B1E] dark:text-white">
                      {mission.restaurant}
                    </h3>
                    <div className="text-xs text-[#5C7A6E] dark:text-emerald-200/75">
                      {mission.restaurantQuartier}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-heading font-black text-base text-[#0B7A4B] dark:text-[#FFB81F]">
                      {formatGnf(mission.payoutGnf)}
                    </div>
                    <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70">
                      {mission.distanceKm} km
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#2F4F42] dark:text-emerald-100 p-2.5 rounded-xl bg-emerald-50/40 dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <span className="font-semibold text-[#5C7A6E] dark:text-emerald-300/70">
                    Destination :{' '}
                  </span>
                  <span>{mission.destination}</span>
                </div>

                <button
                  onClick={() => handleAcceptMission(mission.id)}
                  className="w-full py-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs shadow-xs transition cursor-pointer min-h-[44px]"
                >
                  Accepter la mission
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: GAINS MOBILE MONEY */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white space-y-4 shadow-xs">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#5C7A6E] dark:text-emerald-300/70">
                Gains cumulés (80% livraison + 100% pourboires)
              </div>
              <div className="font-heading font-black text-3xl text-[#0B7A4B] dark:text-[#FFB81F] mt-1">
                {formatGnf(215000)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E2ECE7] dark:border-[#1E3B2D] text-xs">
              <div>
                <div className="text-[#5C7A6E] dark:text-emerald-300/70 text-[11px]">
                  Courses
                </div>
                <div className="font-bold text-base text-[#0B2B1E] dark:text-white">
                  9 livrées
                </div>
              </div>
              <div>
                <div className="text-[#5C7A6E] dark:text-emerald-300/70 text-[11px]">
                  Pourboires
                </div>
                <div className="font-bold text-base text-[#0B2B1E] dark:text-white">
                  {formatGnf(35000)}
                </div>
              </div>
              <div>
                <div className="text-[#5C7A6E] dark:text-emerald-300/70 text-[11px]">
                  Distance
                </div>
                <div className="font-bold text-base text-[#0B2B1E] dark:text-white">
                  32 km
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-2.5 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-[#5C7A6E] dark:text-emerald-300/70">
              Paiement direct Mobile Money
            </div>
            <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80">
              Compte associé :{' '}
              <strong>
                {currentApp?.documents.momoProvider === 'orange_money'
                  ? 'Orange Money'
                  : 'MTN MoMo'}{' '}
                ({currentApp?.documents.momoNumber || '622 45 89 12'})
              </strong>
              .
            </p>
            <button
              onClick={() =>
                showToast(
                  'Virement Mobile Money',
                  'Virement instantané de 215 000 GNF envoyé vers votre numéro.',
                  'success'
                )
              }
              className="w-full py-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs transition shadow-xs cursor-pointer min-h-[44px]"
            >
              Transférer mes gains vers mon compte Mobile Money
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SÉCURITÉ KYC */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#0B2B1E] dark:text-white">
                  Soneya Shield Certifié
                </span>
              </div>
              {renderKycStatusBadge()}
            </div>

            <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80 leading-relaxed">
              {isValidated
                ? "Votre profil motard est certifié par la direction Soneya Guinée. Vos pièces d'identité, votre moto et votre casier sont vérifiés."
                : "Votre dossier n'est pas encore validé. Consultez vos documents et vérifiez les remarques de l'administrateur."}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D] text-xs">
              <div>
                <span className="text-[#5C7A6E] dark:text-emerald-300/70 text-[10px]">
                  Identifiant Motard
                </span>
                <div className="font-mono font-bold text-[#0B2B1E] dark:text-white">
                  RDR-224-{currentApp?.courierId || 'GHT'}
                </div>
              </div>
              <div>
                <span className="text-[#5C7A6E] dark:text-emerald-300/70 text-[10px]">
                  Statut Sécurité
                </span>
                <div className="font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
                  {isValidated ? '99.4% Conforme' : 'Validation requise'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading font-extrabold text-sm text-[#0B2B1E] dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <span>Pièces du dossier fournies (Conakry)</span>
              </h3>
              <button
                onClick={() => setIsCourierOnboardingModalOpen(true)}
                className="text-[11px] font-bold text-[#0B7A4B] dark:text-[#FFB81F] hover:underline cursor-pointer shrink-0"
              >
                Mettre à jour
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                {
                  key: 'cni' as const,
                  title: "Carte Nationale d'Identité (Recto/Verso)",
                  sub: `N° ${currentApp?.documents.cniNumber || 'Non renseigné'}`,
                  badge: isValidated ? 'Validé' : 'Fourni',
                },
                {
                  key: 'carte_grise' as const,
                  title: 'Carte Grise de la Moto',
                  sub: `${currentApp?.documents.vehicleBrandModel || ''} · Plaque ${
                    currentApp?.documents.plateNumber || ''
                  }`,
                  badge: isValidated ? 'En règle' : 'Fourni',
                },
                {
                  key: 'certificat_residence' as const,
                  title: 'Certificat de Résidence',
                  sub: `Commune de ${currentApp?.quartier || 'Conakry'}`,
                  badge: isValidated ? 'Conforme' : 'Fourni',
                },
                {
                  key: 'charter' as const,
                  title: 'Charte du Livreur & Signature',
                  sub: '7 engagements cochés · Signature horodatée',
                  badge: 'Signée',
                },
              ].map((doc) => (
                <React.Fragment key={doc.key}>
                  <div className="p-3 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-[#0B2B1E] dark:text-white truncate">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75 truncate">
                        {doc.sub}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {currentApp && (
                        <button
                          onClick={() =>
                            setInspectDocType(inspectDocType === doc.key ? null : doc.key)
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 text-[10px] font-semibold hover:border-[#0B7A4B] cursor-pointer"
                        >
                          {inspectDocType === doc.key ? 'Fermer' : 'Inspecter'}
                        </button>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[#0C1913] text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                        {doc.badge}
                      </span>
                    </div>
                  </div>
                  {inspectDocType === doc.key && currentApp && (
                    <DocumentSpecimenViewer
                      application={currentApp}
                      documentType={doc.key}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ÉCRAN D'OFFRE POP-UP 30S */}
      {activeOffer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in">
          <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0C1913] border-2 border-[#0B7A4B] dark:border-[#1E3B2D] shadow-2xl p-5 sm:p-6 text-[#0B2B1E] dark:text-white space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2ECE7] dark:border-[#1E3B2D] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <span className="font-heading font-black text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Nouvelle Course Détectée
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono font-black text-xs border border-rose-200 dark:border-rose-900">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{offerCountdown}s</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5C7A6E] dark:text-emerald-300/70">
                  Gain Net Motard (80% + pourboires)
                </div>
                <div className="font-heading font-black text-3xl sm:text-4xl text-[#0B7A4B] dark:text-[#FFB81F] mt-1">
                  {formatGnf(activeOffer.payoutGnf)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C7A6E] dark:text-emerald-300/70">
                    Distance Totale
                  </div>
                  <div className="font-heading font-black text-xl sm:text-2xl text-[#0B2B1E] dark:text-white mt-0.5">
                    {activeOffer.distanceKm} km
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C7A6E] dark:text-emerald-300/70">
                    Temps estimé
                  </div>
                  <div className="font-heading font-black text-xl sm:text-2xl text-[#0B2B1E] dark:text-white mt-0.5">
                    ~18 min
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <Store className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 uppercase font-bold">
                      Collecte :
                    </span>
                    <div className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                      {activeOffer.pickup}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <MapPin className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 uppercase font-bold">
                      Livraison :
                    </span>
                    <div className="font-heading font-black text-sm text-[#0B2B1E] dark:text-white">
                      {activeOffer.dropoff}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="relative w-full h-16 bg-[#0B2B1E] rounded-2xl p-1.5 flex items-center select-none overflow-hidden border border-[#1E3B2D] shadow-lg">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-[#0B7A4B] transition-all"
                  style={{ width: `${Math.max(15, slideProgress)}%` }}
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-heading font-black text-xs uppercase tracking-wider text-white">
                    {slideProgress > 75
                      ? 'Relâcher pour valider'
                      : 'Glisser pour accepter ➔'}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slideProgress}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSlideProgress(val);
                    if (val >= 85) {
                      sound.playSuccess();
                      showToast(
                        'Mission acceptée !',
                        `Itinéraire vers ${activeOffer.pickup} lancé.`,
                        'success'
                      );
                      setActiveOffer(null);
                      setSlideProgress(0);
                      setActiveTab('mission');
                    }
                  }}
                  onMouseUp={() => {
                    if (slideProgress < 85) setSlideProgress(0);
                  }}
                  onTouchEnd={() => {
                    if (slideProgress < 85) setSlideProgress(0);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                <div
                  className="absolute z-10 w-12 h-12 rounded-xl bg-white text-[#0B7A4B] flex items-center justify-center font-bold shadow-md transition-all pointer-events-none"
                  style={{
                    left: `calc(${slideProgress}% - ${(slideProgress / 100) * 56}px + 6px)`,
                  }}
                >
                  <Bike className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  onClick={() => {
                    sound.playSuccess();
                    showToast(
                      'Mission acceptée !',
                      `Itinéraire vers ${activeOffer.pickup} lancé.`,
                      'success'
                    );
                    setActiveOffer(null);
                    setActiveTab('mission');
                  }}
                  className="text-[#0B7A4B] dark:text-[#FFB81F] hover:underline font-bold cursor-pointer py-1.5"
                >
                  Ou toucher ici pour accepter
                </button>
                <button
                  onClick={() => {
                    setActiveOffer(null);
                    showToast('Offre refusée', 'La course a été déclinée.', 'info');
                  }}
                  className="text-rose-600 hover:text-rose-700 font-bold cursor-pointer py-1.5"
                >
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
