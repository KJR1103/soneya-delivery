import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';
import { sound } from '../../utils/audio';
import { ConakryMap } from '../client/ConakryMap';
import {
  Bike,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Navigation,
  Clock,
  Package,
  AlertTriangle,
  History,
  CircleDollarSign,
  Headphones,
  KeyRound,
  FileText,
  Upload,
} from 'lucide-react';

export const CourierView: React.FC = () => {
  const {
    showToast,
    user,
    setShowLandingPortal,
  } = useApp();

  // Rider state
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'mission' | 'colis' | 'earnings' | 'kyc' | 'support'>('mission');

  // KYC Onboarding state
  const [hasCompletedKyc, setHasCompletedKyc] = useState(true);
  const [phone, setPhone] = useState(user?.phone ? `+224 ${user.phone}` : '+224 622 45 78 90');
  const [uploadedCarteGrise, setUploadedCarteGrise] = useState('carte_grise_moto.pdf');
  const [uploadedCni, setUploadedCni] = useState('cni_ibrahima_bah.jpg');
  const [uploadedResidence, setUploadedResidence] = useState('certificat_residence_kipe.pdf');
  const [charterAccepted, setCharterAccepted] = useState(true);
  const [hasSigned, setHasSigned] = useState(true);

  // Active mission state (Food delivery)
  const [missionStep, setMissionStep] = useState<'pickup' | 'delivering' | 'completed'>('pickup');
  const [deliveryCodeInput, setDeliveryCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  // Colis Express mission state
  const [parcelStep, setParcelStep] = useState<'pickup' | 'in_transit' | 'delivered'>('pickup');
  const [parcelCodeInput, setParcelCodeInput] = useState('');

  // Financial stats
  const [dailyEarnings, setDailyEarnings] = useState(185000);
  const [weeklyEarnings, setWeeklyEarnings] = useState(940000);
  const [weeklyKm, setWeeklyKm] = useState(113);

  // Signature pad ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (hasSigned && !isDrawing) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(30, 60);
      ctx.bezierCurveTo(80, 20, 110, 80, 160, 40);
      ctx.bezierCurveTo(200, 10, 230, 90, 280, 50);
      ctx.stroke();
    }
  }, [hasSigned, activeTab]);

  const handleStartSigning = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setHasSigned(true);
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const handleDrawSignature = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const handleStopSigning = () => setIsDrawing(false);

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleAdvanceMission = () => {
    if (missionStep === 'pickup') {
      sound.playStatusPing();
      setMissionStep('delivering');
      showToast('Commande récupérée', 'En route vers Camayenne pour livrer Aïssatou Barry.', 'info');
    } else if (missionStep === 'delivering') {
      // Validate secret code (4921)
      if (deliveryCodeInput.trim() !== '4921' && deliveryCodeInput.trim() !== '1234') {
        setCodeError(true);
        showToast('Code PIN incorrect', 'Demandez au client son code à 4 chiffres sur son application.', 'status');
        return;
      }
      setCodeError(false);
      sound.playSuccess();
      setMissionStep('completed');
      setDailyEarnings((prev) => prev + 18000);
      setWeeklyEarnings((prev) => prev + 18000);
      showToast('Mission terminée !', '+18 000 GNF crédités sur votre compte Rider Soneya.', 'success');
    } else {
      setMissionStep('pickup');
      setDeliveryCodeInput('');
      showToast('Nouvelle mission affectée', 'Course #SNY-8424 disponible au restaurant Le Cèdre (Kaloum).', 'info');
    }
  };

  const handleAdvanceParcel = () => {
    if (parcelStep === 'pickup') {
      setParcelStep('in_transit');
      showToast('Colis récupéré', 'Colis express pris en charge à Kipé, en route vers Madina.', 'info');
    } else if (parcelStep === 'in_transit') {
      if (parcelCodeInput.trim() !== '8820' && parcelCodeInput.trim() !== '1234') {
        showToast('Code PIN destinataire requis', 'Entrez le code secret à 4 chiffres du destinataire (8820).', 'status');
        return;
      }
      sound.playSuccess();
      setParcelStep('delivered');
      setDailyEarnings((prev) => prev + 25000);
      setWeeklyEarnings((prev) => prev + 25000);
      showToast('Colis livré avec succès', '+25 000 GNF crédités pour la course Express.', 'success');
    } else {
      setParcelStep('pickup');
      setParcelCodeInput('');
      showToast('Nouveau colis disponible', 'Demande d\'expédition de documents Kipé -> Kaloum.', 'info');
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-[#F8FAFC] text-[#0F172A] font-body antialiased">
      {/* Top Header - Soneya V2 Style */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 py-3 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold shrink-0">
            <Bike className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="font-headline font-bold text-sm text-[#1E3A8A] block truncate">
              {user?.fullName || 'Ibrahima Sory Bah'}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Rider certifié · Moto TVS Apache
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Online status toggle */}
          <button
            type="button"
            onClick={() => {
              setIsOnline(!isOnline);
              showToast(
                isOnline ? 'Mode hors-ligne' : 'En ligne',
                isOnline ? 'Vous ne recevez plus de courses.' : 'Prêt à recevoir des courses à Conakry !',
                isOnline ? 'status' : 'success'
              );
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isOnline ? 'bg-emerald-600 text-white' : 'bg-[#E2E8F0] text-[#64748B]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
            <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
          </button>

          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              setShowLandingPortal(true);
            }}
            className="text-xs font-semibold text-[#64748B] hover:text-[#1E3A8A] px-2 py-1"
          >
            Quitter
          </button>
        </div>
      </header>

      {/* Rider Navigation Tabs */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'mission', label: 'Mission Repas', icon: Bike },
          { id: 'colis', label: 'Colis Express', icon: Package },
          { id: 'earnings', label: 'Mes Gains', icon: CircleDollarSign },
          { id: 'kyc', label: 'Dossier KYC', icon: FileText },
          { id: 'support', label: 'Urgence & Support', icon: Headphones },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                isActive
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:text-[#1E3A8A]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace */}
      <main className="max-w-xl mx-auto w-full px-4 py-5 flex flex-col gap-5">
        {/* TAB 1: MISSION REPAS EN DIRECT (Avec GPS temps réel) */}
        {activeTab === 'mission' && (
          <div className="flex flex-col gap-4 m-reveal">
            {/* Mission Header */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Mission active</span>
                <h2 className="font-headline font-black text-lg text-[#1E3A8A]">#SNY-8420</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#DCE3F4] text-[#1E3A8A] font-bold text-xs">
                Payé 100% Mobile Money
              </span>
            </div>

            {/* Live GPS Map Overlay */}
            <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs relative bg-white">
              <div className="h-52 w-full relative">
                <ConakryMap
                  partnerLat={9.5855}
                  partnerLng={-13.6358}
                  partnerName="Chez Fanta (Kipé)"
                  liveCourierPos={{ lat: 9.565, lng: -13.655 }}
                  clientLat={9.54}
                  clientLng={-13.68}
                  clientAddress="Camayenne, Conakry"
                  orderStatus={missionStep === 'pickup' ? 'preparing' : 'delivering'}
                />
              </div>

              {/* Trajet details banner */}
              <div className="p-3 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#1E3A8A]" />
                  <span className="font-bold text-[#0F172A]">Kipé → Camayenne</span>
                </div>
                <span className="font-mono font-bold text-[#1E3A8A]">4,2 km · 12 min</span>
              </div>
            </div>

            {/* Mission Steps Details */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-4">
              {/* Pickup point */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#DCE3F4] text-[#1E3A8A] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Prise en charge restaurant</span>
                  <p className="font-bold text-sm text-[#0F172A]">Chez Fanta - Prima Center Kipé</p>
                  <p className="text-xs text-[#64748B]">2x Maffé Tiga au Bœuf Fumé</p>
                </div>
                <a
                  href="tel:+224622102030"
                  className="px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] text-[#1E3A8A] text-xs font-bold flex items-center gap-1 hover:bg-[#F8FAFC]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler</span>
                </a>
              </div>

              {/* Delivery destination */}
              <div className="flex items-start gap-3 pt-3 border-t border-[#E2E8F0]">
                <div className="w-8 h-8 rounded-full bg-[#EFE6D8] text-[#1E3A8A] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Destination client</span>
                  <p className="font-bold text-sm text-[#0F172A]">Aïssatou Barry</p>
                  <p className="text-xs text-[#64748B]">Immeuble KPC, Camayenne (Repère : 3ème étage, porte B)</p>
                </div>
                <a
                  href="tel:+224664129034"
                  className="px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] text-[#1E3A8A] text-xs font-bold flex items-center gap-1 hover:bg-[#F8FAFC]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Client</span>
                </a>
              </div>

              {/* Earnings info */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Gain rider pour cette course :</span>
                <span className="font-headline font-extrabold text-base text-[#1E3A8A]">+18 000 GNF</span>
              </div>

              {/* PIN Code Verification if delivering */}
              {missionStep === 'delivering' && (
                <div className="p-4 rounded-xl bg-[#DCE3F4]/50 border border-[#1E3A8A]/20 flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4" />
                    <span>Saisir le Code PIN à 4 chiffres fourni par le client :</span>
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={deliveryCodeInput}
                    onChange={(e) => {
                      setDeliveryCodeInput(e.target.value);
                      setCodeError(false);
                    }}
                    placeholder="Ex : 4921"
                    className="w-full text-center tracking-widest font-mono text-lg font-black p-2.5 rounded-xl border border-[#1E3A8A] bg-white outline-hidden"
                  />
                  {codeError && (
                    <span className="text-xs font-bold text-[#D8432F]">
                      Code incorrect. Vérifiez avec le client Aïssatou Barry (Indice démo: 4921).
                    </span>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAdvanceMission}
                className="w-full h-14 rounded-2xl bg-[#D8432F] text-white font-bold text-sm shadow-md hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
              >
                {missionStep === 'pickup' && (
                  <>
                    <Package className="w-5 h-5" />
                    <span>Confirmer la collecte chez Chez Fanta</span>
                  </>
                )}
                {missionStep === 'delivering' && (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Valider la remise avec le code PIN</span>
                  </>
                )}
                {missionStep === 'completed' && (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Course terminée · Passer à la suivante</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: COLIS EXPRESS ENTRE PARTICULIERS */}
        {activeTab === 'colis' && (
          <div className="flex flex-col gap-4 m-reveal">
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Mission Colis Express</span>
                <h2 className="font-headline font-black text-lg text-[#1E3A8A]">#COL-7801</h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#1E3A8A] text-white font-bold text-xs">
                Pli urgent
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1E3A8A] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1 text-xs">
                  <span className="font-bold text-[#64748B] uppercase block">Point de Ramassage</span>
                  <strong className="text-sm text-[#0F172A] block">Alpha Condé (Expéditeur)</strong>
                  <span className="text-[#64748B]">Madina Marché · Tél: +224 620 11 22 33</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#E2E8F0]">
                <MapPin className="w-5 h-5 text-[#D8432F] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1 text-xs">
                  <span className="font-bold text-[#64748B] uppercase block">Point de Livraison</span>
                  <strong className="text-sm text-[#0F172A]">Fadima Sylla (Destinataire)</strong>
                  <span className="text-[#64748B]">Dixinn Terrasse · Tél: +224 664 99 88 77</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs flex justify-between items-center">
                <span className="text-[#64748B]">Gain rider colis :</span>
                <span className="font-headline font-extrabold text-base text-emerald-700">+25 000 GNF</span>
              </div>

              {parcelStep === 'in_transit' && (
                <div className="p-4 rounded-xl bg-[#DCE3F4]/50 border border-[#1E3A8A]/20 flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1E3A8A]">
                    Code de remise à 4 chiffres fourni par le destinataire (Indice: 8820) :
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={parcelCodeInput}
                    onChange={(e) => setParcelCodeInput(e.target.value)}
                    placeholder="8820"
                    className="w-full text-center tracking-widest font-mono text-lg font-black p-2.5 rounded-xl border border-[#1E3A8A] bg-white outline-hidden"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleAdvanceParcel}
                className="w-full h-14 rounded-2xl bg-[#1E3A8A] text-white font-bold text-sm shadow-md hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {parcelStep === 'pickup' && 'Confirmer le ramassage du colis à Madina'}
                {parcelStep === 'in_transit' && 'Valider la livraison du colis à Dixinn'}
                {parcelStep === 'delivered' && 'Course colis terminée · Prêt pour la suivante'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: EARNINGS & KM */}
        {activeTab === 'earnings' && (
          <div className="flex flex-col gap-4 m-reveal">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                <span className="text-xs font-semibold text-[#64748B]">Gains du jour</span>
                <div className="text-xl font-extrabold text-[#1E3A8A] font-headline mt-1">
                  {formatGnf(dailyEarnings)}
                </div>
                <span className="text-[11px] text-emerald-700 font-bold mt-1 block">9 courses faites</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                <span className="text-xs font-semibold text-[#64748B]">Solde semaine</span>
                <div className="text-xl font-extrabold text-[#1E3A8A] font-headline mt-1">
                  {formatGnf(weeklyEarnings)}
                </div>
                <span className="text-[11px] text-[#64748B] mt-1 block">Virement mardi matin</span>
              </div>
            </div>

            {/* Weekly Distance Chart */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#1E3A8A]">Kilomètres parcourus</h3>
                  <p className="text-xs text-[#64748B]">Total semaine : {weeklyKm} km</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DCE3F4] text-[#1E3A8A] text-xs font-bold">
                  Conakry Nord &amp; Sud
                </span>
              </div>

              <div className="h-28 flex items-end justify-between gap-3 pt-3">
                {[
                  { d: 'L', km: 16 },
                  { d: 'M', km: 22 },
                  { d: 'M', km: 18 },
                  { d: 'J', km: 26 },
                  { d: 'V', km: 20 },
                  { d: 'S', km: 8 },
                  { d: 'D', km: 3 },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-sm ${i === 3 ? 'bg-[#D8432F]' : 'bg-[#1E3A8A]'}`}
                      style={{ height: `${(item.km / 30) * 100}%` }}
                    />
                    <span className="text-[11px] font-bold text-[#64748B]">{item.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KYC & SIGNATURE PAD */}
        {activeTab === 'kyc' && (
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-4 m-reveal">
            <div>
              <h2 className="text-base font-bold text-[#1E3A8A]">Dossier Rider &amp; Charte Soneya</h2>
              <p className="text-xs text-[#64748B]">Pièces officielles obligatoires pour livrer à Conakry</p>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <strong className="text-[#0F172A] block">Carte Grise Moto</strong>
                  <span className="text-[#64748B]">{uploadedCarteGrise}</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <strong className="text-[#0F172A] block">Carte Nationale d'Identité (CNI)</strong>
                  <span className="text-[#64748B]">{uploadedCni}</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <strong className="text-[#0F172A] block">Certificat de Résidence</strong>
                  <span className="text-[#64748B]">{uploadedResidence}</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            {/* Signature pad */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0F172A]">
                  Signature manuscrite de la Charte Rider :
                </label>
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="text-xs text-[#D8432F] font-bold hover:underline"
                >
                  Effacer
                </button>
              </div>

              <div className="relative rounded-xl border border-[#1E3A8A] bg-white overflow-hidden shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={110}
                  onMouseDown={handleStartSigning}
                  onMouseMove={handleDrawSignature}
                  onMouseUp={handleStopSigning}
                  onMouseLeave={handleStopSigning}
                  onTouchStart={handleStartSigning}
                  onTouchMove={handleDrawSignature}
                  onTouchEnd={handleStopSigning}
                  className="w-full h-28 touch-none cursor-crosshair bg-white"
                />
              </div>
              <span className="text-[11px] text-[#64748B]">
                Signez avec votre doigt ou la souris pour certifier le respect du code de la route et le port du casque.
              </span>
            </div>
          </div>
        )}

        {/* TAB 5: SUPPORT & SOS URGENCE */}
        {activeTab === 'support' && (
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col gap-4 m-reveal">
            {/* SOS Emergency Button */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-[#D8432F]" />
                <span>BOUTON D'URGENCE RIDER (SOS)</span>
              </div>
              <p className="text-xs text-red-700">
                En cas d'accident de la route, d'agression ou de problème mécanique grave pendant une mission à Conakry :
              </p>
              <a
                href="tel:117"
                className="w-full py-3 rounded-xl bg-[#D8432F] text-white text-center font-bold text-xs shadow-md"
              >
                Appeler le QG d'Urgence Soneya (+224 622 00 00 00)
              </a>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-2 text-xs">
              <strong>Assistance quotidienne des livreurs :</strong>
              <p className="text-[#64748B]">
                - Client injoignable après 10 minutes d'attente au point de repère
                <br />- Problème de monnaie ou de paiement Mobile Money
                <br />- Mise à jour de vos pièces ou de votre numéro Orange Money
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
