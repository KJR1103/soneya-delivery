import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Bike,
  Store,
  User,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({ isOpen, onClose }) => {
  const {
    setSpace,
    setActiveTab,
    createOrder,
    updateOrderStatus,
    validateOrderWithCode,
    showToast,
    orders,
    partners,
    login,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [createdDemoOrderId, setCreatedDemoOrderId] = useState<string | null>(null);

  // Financial breakdown of the control test
  const basketGnf = 100000;
  const distanceKm = 3.0;
  const deliveryFeeGnf = 15500; // 5000 + 3 * 3500
  const serviceFeeGnf = 3000;
  const clientTotalGnf = 118500; // 100000 + 15500 + 3000
  const restaurantPayoutGnf = 88000; // 100000 - 12%
  const courierPayoutGnf = 12400; // 80% de 15500
  const soneyaEarningsGnf = 18100; // 3100 (20% liv) + 12000 (com) + 3000 (serv)
  const deliveryCode = '8492';

  // Automated progression timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      if (currentStep === 1) {
        // Step 1: Client sends order
        timer = setTimeout(() => {
          executeStep2Manager();
        }, 3200);
      } else if (currentStep === 2) {
        // Step 2: Manager accepts & prepares
        timer = setTimeout(() => {
          executeStep3Courier();
        }, 3200);
      } else if (currentStep === 3) {
        // Step 3: Courier delivers with code
        timer = setTimeout(() => {
          executeStep4Validate();
        }, 3200);
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep]);

  if (!isOpen) return null;

  const handleStartAutoDemo = () => {
    setIsRunning(true);
    executeStep1Client();
  };

  const executeStep1Client = () => {
    setCurrentStep(1);
    login('622 78 90 12', 'Amadou Diallo (Client Démo)', 'client');
    setSpace('client');
    setActiveTab('orders');

    // Create the canonical order
    const chezFanta = partners.find(p => p.id === 'chez-fanta') || partners[0];
    const newOrd = createOrder({
      partnerId: chezFanta.id,
      partnerName: chezFanta.name,
      partnerPhone: chezFanta.phone,
      partnerLat: chezFanta.lat,
      partnerLng: chezFanta.lng,
      partnerAddress: chezFanta.address,
      partnerCategory: 'restaurants',
      clientName: 'Amadou Diallo',
      clientPhone: '+224 622 78 90 12',
      clientAddress: 'Résidence Minière, Dixinn',
      clientQuartier: 'Dixinn Centre',
      clientLat: 9.5480,
      clientLng: -13.6750,
      deliveryLandmark: 'Face ambassade, portail vert',
      items: [
        {
          product: {
            id: 'cf-demo-1',
            name: '2x Maffé Tiga Authentique au Bœuf Fumé',
            description: 'Recette traditionnelle de Kindia',
            priceGnf: 45000,
            image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80',
            category: 'Plats Traditionnels',
            available: true,
          },
          quantity: 2,
          partnerId: chezFanta.id,
          partnerName: chezFanta.name,
        },
        {
          product: {
            id: 'cf-demo-2',
            name: '1x Jus de Bissap Frais Artisanal (50cl)',
            description: 'Infusion de fleurs d hibiscus et menthe',
            priceGnf: 10000,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
            category: 'Boissons Fraîches',
            available: true,
          },
          quantity: 1,
          partnerId: chezFanta.id,
          partnerName: chezFanta.name,
        },
      ],
      itemsSubtotalGnf: basketGnf,
      deliveryDistanceKm: distanceKm,
      deliveryFeeGnf: deliveryFeeGnf,
      serviceFeeGnf: serviceFeeGnf,
      tipGnf: 0,
      discountGnf: 0,
      totalGnf: clientTotalGnf,
      paymentMethod: 'orange_money',
      paymentPhone: '622 78 90 12',
      estimatedDeliveryMinutes: 25,
      deliveryCode: deliveryCode,
    });

    setCreatedDemoOrderId(newOrd.id);
    sound.playSuccess();
    showToast(
      'Étape 1/4 : Commande Client Confirmée',
      `Débit Orange Money de ${formatGnf(clientTotalGnf)}. Code secret client : ${deliveryCode}`,
      'success'
    );
  };

  const executeStep2Manager = () => {
    setCurrentStep(2);
    setSpace('partner');
    sound.playAlert();
    showToast(
      'Étape 2/4 : Espace Manager',
      'Alerte sonore reçue en cuisine Chez Fanta. Commande acceptée et préparée.',
      'info'
    );
    if (createdDemoOrderId) {
      updateOrderStatus(createdDemoOrderId, 'preparing', 'Acceptée et en cuisson');
      setTimeout(() => {
        updateOrderStatus(createdDemoOrderId, 'ready', 'Plats scellés pour le motard');
      }, 1200);
    }
  };

  const executeStep3Courier = () => {
    setCurrentStep(3);
    setSpace('courier');
    sound.playStatusPing();
    showToast(
      'Étape 3/4 : Espace Livreur',
      `Offre de course acceptée. Gain motard : ${formatGnf(courierPayoutGnf)} (80% des 15 500 GNF).`,
      'info'
    );
    if (createdDemoOrderId) {
      updateOrderStatus(createdDemoOrderId, 'delivering', 'Motard en route vers le client');
    }
  };

  const executeStep4Validate = () => {
    setCurrentStep(4);
    setIsRunning(false);
    if (createdDemoOrderId) {
      validateOrderWithCode(createdDemoOrderId, deliveryCode);
    }
    sound.playSuccess();
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#0B7A4B', '#FFB81F', '#0B2B1E', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  };

  const handleResetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setSpace('client');
    setActiveTab('home');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B1E]/75 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between bg-white dark:bg-[#0C1913] gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0B7A4B] text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-black text-sm sm:text-base text-[#0B2B1E] dark:text-white flex flex-wrap items-center gap-2">
                <span className="truncate">Mode Démonstration Complète</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                  Automatisé
                </span>
              </h2>
              <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/70 truncate">
                Déroule seul la commande : Client ➔ Manager ➔ Livreur ➔ Validation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#2F4F42] hover:text-[#0B2B1E] dark:text-emerald-200/70 dark:hover:text-white flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Test de Contrôle Banner (CRITICAL TEST CHECK) */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-[#10231B] border border-[#0B7A4B]/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#0B2B1E] dark:text-[#FFB81F] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0B7A4B] shrink-0" />
                <span>Test de Contrôle Officiel Soneya (3 km)</span>
              </span>
              <span className="font-heading font-black text-sm text-[#0B7A4B] dark:text-emerald-400">
                Total client : {formatGnf(clientTotalGnf)}
              </span>
            </div>

            {/* Exact Math breakdown table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D]">
                <div className="text-[10px] text-[#2F4F42] dark:text-emerald-200/70">Panier (3 km)</div>
                <div className="font-bold text-[#0B2B1E] dark:text-white mt-0.5">100 000 GNF</div>
                <div className="text-[9px] text-[#5C7A6E] dark:text-emerald-200/60">+ 15 500 liv. + 3 000 serv.</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D]">
                <div className="text-[10px] text-[#2F4F42] dark:text-emerald-200/70">Restaurant (88%)</div>
                <div className="font-bold text-[#0B7A4B] dark:text-emerald-400 mt-0.5">88 000 GNF</div>
                <div className="text-[9px] text-[#5C7A6E] dark:text-emerald-200/60">100k - 12% com.</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D]">
                <div className="text-[10px] text-[#2F4F42] dark:text-emerald-200/70">Livreur (80%)</div>
                <div className="font-bold text-[#D98200] dark:text-[#FFB81F] mt-0.5">12 400 GNF</div>
                <div className="text-[9px] text-[#5C7A6E] dark:text-emerald-200/60">80% de 15 500 GNF</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D]">
                <div className="text-[10px] text-[#2F4F42] dark:text-emerald-200/70">Soneya encaisse</div>
                <div className="font-bold text-[#0B2B1E] dark:text-emerald-100 mt-0.5">18 100 GNF</div>
                <div className="text-[9px] text-[#5C7A6E] dark:text-emerald-200/60">3 100 + 12k + 3 000</div>
              </div>
            </div>

            <div className="text-[11px] text-[#2F4F42] dark:text-emerald-200/75 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#D4E9DD] dark:border-[#1E3B2D]">
              <span>Code secret de remise : <strong className="font-mono text-[#0B2B1E] dark:text-white">8492</strong></span>
              <span>Paiement : <strong className="text-[#0B2B1E] dark:text-white">Orange Money (#144#)</strong></span>
            </div>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
              Déroulement des 4 Étapes en direct
            </div>

            <div className="space-y-2">
              {/* Step 1 */}
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                currentStep === 1
                  ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0B2B1E] dark:text-emerald-100 font-bold'
                  : currentStep > 1
                  ? 'border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-emerald-100'
                  : 'border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] opacity-70'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep > 1 ? 'bg-[#0B7A4B] text-white' : 'bg-emerald-50 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D]'
                  }`}>
                    {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#0B2B1E] dark:text-white">1. Espace Client : Paiement & Code 8492</div>
                    <div className="text-[10px] text-[#2F4F42] dark:text-emerald-200/70">118 500 GNF payés via Orange Money · Commande envoyée</div>
                  </div>
                </div>
                {currentStep === 1 && <span className="w-2.5 h-2.5 rounded-full bg-[#0B7A4B] animate-ping shrink-0" />}
              </div>

              {/* Step 2 */}
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                currentStep === 2
                  ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0B2B1E] dark:text-emerald-100 font-bold'
                  : currentStep > 2
                  ? 'border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-emerald-100'
                  : 'border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] opacity-70'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep > 2 ? 'bg-[#0B7A4B] text-white' : 'bg-emerald-50 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D]'
                  }`}>
                    {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#0B2B1E] dark:text-white">2. Espace Manager : Flash Kanban & Cuisine</div>
                    <div className="text-[10px] text-[#2F4F42] dark:text-emerald-200/70">Alerte sonore · « Accepter & Préparer » ➔ « Marquer Prête »</div>
                  </div>
                </div>
                {currentStep === 2 && <span className="w-2.5 h-2.5 rounded-full bg-[#0B7A4B] animate-ping shrink-0" />}
              </div>

              {/* Step 3 */}
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                currentStep === 3
                  ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0B2B1E] dark:text-emerald-100 font-bold'
                  : currentStep > 3
                  ? 'border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-emerald-100'
                  : 'border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] opacity-70'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep > 3 ? 'bg-[#0B7A4B] text-white' : 'bg-emerald-50 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D]'
                  }`}>
                    {currentStep > 3 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#0B2B1E] dark:text-white">3. Espace Livreur : Offre Pop-up 30s & GPS</div>
                    <div className="text-[10px] text-[#2F4F42] dark:text-emerald-200/70">Glisser pour accepter · Trajet 3 km vers le client</div>
                  </div>
                </div>
                {currentStep === 3 && <span className="w-2.5 h-2.5 rounded-full bg-[#0B7A4B] animate-ping shrink-0" />}
              </div>

              {/* Step 4 */}
              <div className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                currentStep === 4
                  ? 'border-[#0B7A4B] bg-emerald-50 dark:bg-emerald-950/50 text-[#0B2B1E] dark:text-emerald-100 font-bold'
                  : 'border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] opacity-70'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep === 4 ? 'bg-[#0B7A4B] text-white' : 'bg-emerald-50 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#D4E9DD] dark:border-[#1E3B2D]'
                  }`}>
                    {currentStep === 4 ? <CheckCircle2 className="w-4 h-4" /> : '4'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[#0B2B1E] dark:text-white">4. Validation par Code à 4 chiffres (8492)</div>
                    <div className="text-[10px] text-[#2F4F42] dark:text-emerald-200/70">12 400 GNF débloqués pour le motard · 88 000 GNF pour le restaurateur</div>
                  </div>
                </div>
                {currentStep === 4 && <CheckCircle2 className="w-4 h-4 text-[#0B7A4B] shrink-0" />}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={handleResetDemo}
            className="min-h-[42px] px-4 py-2.5 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 font-bold text-xs hover:bg-emerald-50 dark:hover:bg-[#13291F] transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {currentStep === 0 ? (
              <button
                onClick={handleStartAutoDemo}
                className="min-h-[44px] px-5 sm:px-6 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-black text-xs shadow-md shadow-[#0B7A4B]/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white shrink-0" />
                <span>Lancer la démonstration</span>
              </button>
            ) : currentStep < 4 ? (
              <button
                onClick={() => {
                  if (currentStep === 1) executeStep2Manager();
                  else if (currentStep === 2) executeStep3Courier();
                  else if (currentStep === 3) executeStep4Validate();
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Étape suivante</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  setSpace('client');
                  setActiveTab('orders');
                }}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#0B2B1E] hover:bg-[#061C14] text-white font-heading font-bold text-xs shadow-md transition cursor-pointer"
              >
                Voir le suivi en direct
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
