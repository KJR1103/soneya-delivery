import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatGnf, formatTime } from '../../utils/formatters';
import { ConakryMap } from './ConakryMap';
import { sound } from '../../utils/audio';
import {
  Bike,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Send,
  X,
  Play,
  RotateCcw,
  Navigation,
  Star,
  Check,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface LiveTrackingViewProps {
  orderId?: string | null;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({ orderId }) => {
  const { orders, activeOrder, updateOrderStatus, setActiveTab } = useApp();

  const currentOrder: Order | null = orderId
    ? orders.find((o) => o.id === orderId) || activeOrder
    : activeOrder;

  const [isCalling, setIsCalling] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'client' | 'courier'; text: string; time: string }[]
  >([
    {
      sender: 'courier',
      text: 'Salam ! Je suis en route pour récupérer votre commande chez le partenaire.',
      time: '12:35',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(true);

  useEffect(() => {
    if (isCalling) {
      sound.playPhoneRing();
      const interval = setInterval(() => {
        sound.playPhoneRing();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isCalling]);

  useEffect(() => {
    if (!isAutoSimulating || !currentOrder) return;
    if (currentOrder.status === 'delivered') {
      setIsAutoSimulating(false);
      return;
    }

    const orderCycle: OrderStatus[] = [
      'submitted',
      'preparing',
      'ready',
      'delivering',
      'delivered',
    ];
    const currentIndex = orderCycle.indexOf(currentOrder.status);

    const timer = setTimeout(() => {
      if (currentIndex < orderCycle.length - 1) {
        updateOrderStatus(currentOrder.id, orderCycle[currentIndex + 1]);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isAutoSimulating, currentOrder, updateOrderStatus]);

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50/70 dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center justify-center text-[#0B7A4B] dark:text-[#FFB81F]">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-bold text-lg text-[#0B2B1E] dark:text-white">
          Aucune commande en cours
        </h2>
        <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80">
          Vos commandes actives apparaîtront ici avec leur géolocalisation en direct.
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-5 py-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold transition shadow-sm cursor-pointer min-h-[44px]"
        >
          Commander maintenant
        </button>
      </div>
    );
  }

  const steps: { key: string; title: string; subtitle: string; stageOrder: number }[] = [
    {
      key: 'valide',
      title: 'Validé',
      subtitle: 'Paiement confirmé via Orange Money / MoMo',
      stageOrder: 0,
    },
    {
      key: 'preparation',
      title: 'En préparation',
      subtitle: 'Le commerçant emballe votre commande',
      stageOrder: 1,
    },
    {
      key: 'livraison',
      title: 'En livraison',
      subtitle: 'Le motard roule vers votre adresse',
      stageOrder: 2,
    },
    {
      key: 'arrive',
      title: 'Arrivé',
      subtitle: 'Remise en mains propres avec code secret',
      stageOrder: 3,
    },
  ];

  const get4StepIndex = (status: OrderStatus) => {
    if (status === 'submitted') return 0;
    if (status === 'preparing' || status === 'ready') return 1;
    if (status === 'delivering') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  const currentStepIndex = get4StepIndex(currentOrder.status);

  const handleNextStage = () => {
    const sequence: OrderStatus[] = ['submitted', 'preparing', 'delivering', 'delivered'];
    const curIdx =
      currentOrder.status === 'ready' ? 1 : sequence.indexOf(currentOrder.status);
    if (curIdx < sequence.length - 1) {
      updateOrderStatus(currentOrder.id, sequence[curIdx + 1]);
      sound.playStatusPing();
    }
  };

  const handleResetStage = () => {
    updateOrderStatus(currentOrder.id, 'submitted', 'Simulation réinitialisée');
    sound.playPop();
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const time = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const userText = inputMessage.trim();
    setChatMessages((prev) => [...prev, { sender: 'client', text: userText, time }]);
    setInputMessage('');

    setTimeout(() => {
      const replies = [
        'Bien reçu ! Je fais au plus vite, la circulation est fluide sur l Axe.',
        'Parfait, je vous appelle dès que j arrive devant la porte.',
        'Merci, commande bien au chaud dans le caisson isotherme Soneya !',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'courier',
          text: randomReply,
          time: new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      sound.playStatusPing();
    }, 1200);
  };

  const remainingKm =
    currentOrder.status === 'delivering'
      ? Math.max(0.4, Number((currentOrder.deliveryDistanceKm * 0.4).toFixed(1)))
      : currentOrder.status === 'delivered'
      ? 0
      : currentOrder.deliveryDistanceKm;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 pb-32 space-y-3.5">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono text-[#5C7A6E] dark:text-emerald-300/70 uppercase">
            N° {currentOrder.trackingNumber}
          </span>
          <h1 className="font-heading font-extrabold text-xl text-[#0B2B1E] dark:text-white">
            Suivi GPS en direct
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {currentOrder.status === 'delivered' ? (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-[#1E3B2D] font-bold text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Livrée & Validée
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50/70 dark:bg-[#10231B] text-[#0B2B1E] dark:text-emerald-100 border border-[#D4E9DD] dark:border-[#1E3B2D] font-bold text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0B7A4B] dark:bg-[#FFB81F] animate-pulse" />
              <span>
                {steps[currentStepIndex].title} (~{currentOrder.estimatedDeliveryMinutes} min)
              </span>
            </span>
          )}
        </div>
      </div>

      {/* CARTE PLEIN ÉCRAN */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-sm">
        <div className="h-[250px] sm:h-[360px] lg:h-[400px]">
          <ConakryMap
            partnerLat={currentOrder.partnerLat}
            partnerLng={currentOrder.partnerLng}
            partnerName={currentOrder.partnerName}
            clientLat={currentOrder.clientLat}
            clientLng={currentOrder.clientLng}
            clientAddress={currentOrder.clientQuartier}
            courier={currentOrder.courier}
            orderStatus={currentOrder.status}
          />
        </div>

        {currentOrder.status === 'delivering' && (
          <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 p-3 rounded-xl bg-white/95 dark:bg-[#0C1913]/95 backdrop-blur-md border border-[#D4E9DD] dark:border-[#1E3B2D] shadow-lg flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span className="font-bold text-[#0B2B1E] dark:text-white">
                Motard à {remainingKm} km
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
              Arrivée : ~{Math.max(3, Math.round(remainingKm * 3))} min
            </span>
          </div>
        )}
      </div>

      {/* CIRCULAR COUNTDOWN TIMER */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs flex flex-col items-center text-center space-y-3">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-[#E2ECE7] dark:stroke-[#1E3B2D]"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-[#0B7A4B] dark:stroke-[#FFB81F] transition-all duration-700 ease-out"
              strokeWidth="6"
              strokeDasharray={251}
              strokeDashoffset={
                currentOrder.status === 'delivered'
                  ? 0
                  : currentOrder.status === 'delivering'
                  ? 251 * 0.35
                  : currentOrder.status === 'ready'
                  ? 251 * 0.55
                  : currentOrder.status === 'preparing'
                  ? 251 * 0.75
                  : 251 * 0.9
              }
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white leading-none">
              {currentOrder.status === 'delivered'
                ? '0'
                : currentOrder.status === 'delivering'
                ? Math.max(3, Math.round(remainingKm * 3))
                : currentOrder.estimatedDeliveryMinutes || 25}
            </span>
            <span className="text-[10px] font-bold text-[#5C7A6E] dark:text-emerald-300/70 uppercase tracking-wider mt-0.5">
              min
            </span>
            <span className="text-[9px] text-[#5C7A6E] dark:text-emerald-200/70">
              {currentOrder.status === 'delivered' ? 'Livré' : 'estimation'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-heading font-black text-base text-[#0B2B1E] dark:text-white">
            {currentOrder.partnerName}
          </h3>
          <p className="text-xs text-[#2F4F42] dark:text-emerald-200/80 mt-0.5">
            {currentOrder.status === 'delivered'
              ? 'Votre commande a été remise en mains propres avec succès !'
              : currentOrder.status === 'delivering'
              ? 'Votre motard roule vers votre adresse à Conakry'
              : 'Votre commande est en préparation chez le partenaire'}
          </p>
        </div>
      </div>

      {/* BOTTOM SHEET DYNAMIQUE */}
      <div className="rounded-3xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-lg p-4 sm:p-5 space-y-4">
        <button
          onClick={() => setIsBottomSheetExpanded(!isBottomSheetExpanded)}
          className="w-full flex flex-col items-center py-1.5 cursor-pointer select-none group text-[#5C7A6E] hover:text-[#0B2B1E] dark:text-emerald-200/80 dark:hover:text-white transition"
        >
          <div className="w-12 h-1.5 rounded-full bg-[#D4E9DD] dark:bg-[#1E3B2D] group-hover:bg-[#0B7A4B] dark:group-hover:bg-[#FFB81F] transition mb-1.5" />
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <span>
              {isBottomSheetExpanded
                ? 'Réduire le panneau'
                : 'Déplier le suivi détaillé & code secret'}
            </span>
            {isBottomSheetExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </div>
        </button>

        {/* 4 STEPS */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-heading font-black text-[#0B2B1E] dark:text-white uppercase tracking-wider text-[11px]">
              Progression de commande (4 étapes)
            </span>
            <span className="text-[11px] font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
              Étape {currentStepIndex + 1} sur 4
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 sm:gap-2 items-start">
            {steps.map((st, i) => {
              const isPast =
                i < currentStepIndex || currentOrder.status === 'delivered';
              const isNow =
                i === currentStepIndex && currentOrder.status !== 'delivered';

              return (
                <div
                  key={st.key}
                  className="flex flex-col items-center text-center space-y-1.5"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPast
                        ? 'bg-[#0B7A4B] text-white shadow-xs'
                        : isNow
                        ? 'bg-[#0B7A4B] text-white ring-4 ring-[#0B7A4B]/25 animate-pulse'
                        : 'bg-white dark:bg-[#10231B] text-[#5C7A6E] dark:text-emerald-300/60 border border-[#D4E9DD] dark:border-[#1E3B2D]'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : i + 1}
                  </div>
                  <span
                    className={`text-[10px] leading-tight font-heading ${
                      isNow
                        ? 'font-black text-[#0B7A4B] dark:text-[#FFB81F]'
                        : isPast
                        ? 'font-bold text-[#0B2B1E] dark:text-emerald-100'
                        : 'text-[#5C7A6E] dark:text-emerald-300/60'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CODE SECRET DE LIVRAISON */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white space-y-2.5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2B1E] dark:text-white">
                Code Secret de Livraison
              </span>
            </div>
            {currentOrder.isCodeValidated || currentOrder.status === 'delivered' ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-[#0C1913] text-[#0B7A4B] dark:text-emerald-300 border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Remise validée</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50/70 dark:bg-[#0C1913] text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D]">
                À dicter au motard
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-emerald-50/40 dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D]">
            <div>
              <div className="text-[10px] text-[#2F4F42] dark:text-emerald-300 font-medium">
                Code à 4 chiffres :
              </div>
              <div className="font-mono font-black text-2xl sm:text-3xl tracking-[0.25em] sm:tracking-[0.3em] text-[#0B2B1E] dark:text-white mt-0.5">
                {currentOrder.deliveryCode || '8492'}
              </div>
            </div>
            <div className="sm:text-right sm:max-w-[190px] text-[11px] text-[#2F4F42] dark:text-emerald-200/80 leading-relaxed">
              Donnez ce code au livreur uniquement une fois vos articles reçus.
            </div>
          </div>
        </div>

        {/* CONTENU ÉTENDU DU BOTTOM SHEET */}
        {isBottomSheetExpanded && (
          <div className="space-y-4 pt-1 animate-in fade-in">
            {currentOrder.courier && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C7A6E] dark:text-emerald-300/70">
                    Votre motard Soneya
                  </span>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50/70 dark:bg-[#0C1913] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B7A4B] dark:text-emerald-300 text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Identité vérifiée par Soneya</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={currentOrder.courier.avatar}
                        alt={currentOrder.courier.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#D4E9DD] dark:ring-[#1E3B2D]"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0B7A4B] border-2 border-white dark:border-[#0C1913] flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-heading font-extrabold text-sm text-[#0B2B1E] dark:text-white truncate">
                          {currentOrder.courier.name}
                        </h3>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50/70 dark:bg-[#0C1913] text-[#0B2B1E] dark:text-emerald-100 border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#FFB81F] text-[#FFB81F]" />
                          <span>{currentOrder.courier.rating}</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75 flex items-center gap-1 mt-0.5 truncate">
                        <Bike className="w-3 h-3 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                        <span className="truncate">
                          {currentOrder.courier.vehicle} ({currentOrder.courier.plateNumber})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsCalling(true)}
                      className="w-11 h-11 rounded-xl bg-white dark:bg-[#0C1913] text-[#0B7A4B] dark:text-[#FFB81F] hover:bg-emerald-50 dark:hover:bg-[#193B2C] flex items-center justify-center transition border border-[#D4E9DD] dark:border-[#1E3B2D] cursor-pointer shadow-xs"
                      title="Appeler le coursier"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="w-11 h-11 rounded-xl bg-white dark:bg-[#0C1913] text-[#0B7A4B] dark:text-[#FFB81F] hover:bg-emerald-50 dark:hover:bg-[#193B2C] flex items-center justify-center transition border border-[#D4E9DD] dark:border-[#1E3B2D] cursor-pointer shadow-xs"
                      title="Envoyer un message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Simulation controls */}
            <div className="p-3 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] flex flex-wrap items-center justify-between gap-2 shadow-xs">
              <div className="text-[11px] font-semibold text-[#0B2B1E] dark:text-emerald-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0B7A4B] dark:bg-[#FFB81F]" />
                <span>Simulateur d'étapes :</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsAutoSimulating(!isAutoSimulating)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border min-h-[36px] ${
                    isAutoSimulating
                      ? 'bg-[#0B7A4B] text-white border-[#0B7A4B]'
                      : 'bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-emerald-100 border-[#D4E9DD] dark:border-[#1E3B2D] hover:border-[#0B7A4B]'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>{isAutoSimulating ? 'Pause' : 'Auto-play'}</span>
                </button>

                {currentOrder.status !== 'delivered' ? (
                  <button
                    onClick={handleNextStage}
                    className="px-3 py-1.5 rounded-lg bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer min-h-[36px]"
                  >
                    <span>Étape suivante</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={handleResetStage}
                    className="px-3 py-1.5 rounded-lg bg-[#0B2B1E] hover:bg-[#081C13] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer min-h-[36px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Recommencer</span>
                  </button>
                )}
              </div>
            </div>

            {/* Destination & Landmark Recap */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1.5 text-xs shadow-xs">
              <div className="font-bold text-[#0B2B1E] dark:text-white">
                Adresse de livraison
              </div>
              <div className="text-[#2F4F42] dark:text-emerald-200/80">
                {currentOrder.clientAddress} ({currentOrder.clientQuartier})
              </div>
              {currentOrder.deliveryLandmark && (
                <div className="p-2.5 rounded-xl bg-emerald-50/40 dark:bg-[#0C1913] text-[11px] text-[#0B2B1E] dark:text-emerald-100 border border-[#E2ECE7] dark:border-[#1E3B2D]">
                  <strong>Repère :</strong> {currentOrder.deliveryLandmark}
                </div>
              )}
            </div>

            {/* Order Summary Recap */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B2B1E] dark:text-white">
                  Détails des articles
                </span>
                <span className="text-[#5C7A6E] dark:text-emerald-300/70">
                  {formatTime(currentOrder.createdAt)}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#2F4F42] dark:text-emerald-100/90">
                {currentOrder.items.map((i) => (
                  <div
                    key={i.product.id}
                    className="flex justify-between py-1.5 border-b border-[#E2ECE7] dark:border-[#1E3B2D]"
                  >
                    <span>
                      {i.quantity}x {i.product.name}
                    </span>
                    <span className="font-semibold text-[#0B2B1E] dark:text-white">
                      {formatGnf(i.product.priceGnf * i.quantity)}
                    </span>
                  </div>
                ))}

                <div className="pt-2 flex justify-between font-bold text-sm text-[#0B2B1E] dark:text-white">
                  <span>Total payé</span>
                  <span className="text-[#0B7A4B] dark:text-[#FFB81F]">
                    {formatGnf(currentOrder.totalGnf)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Simulator Modal */}
      {isCalling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-in fade-in">
          <div className="w-full max-w-xs max-h-[90dvh] overflow-y-auto rounded-3xl bg-[#081C13] p-6 text-center text-white space-y-5 border border-[#1E3B2D] shadow-2xl">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-[#0B7A4B]/50 animate-pulse">
              <img
                src={currentOrder.courier?.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg">
                {currentOrder.courier?.name}
              </h3>
              <p className="text-xs text-emerald-200/75 mt-0.5">
                {currentOrder.courier?.phone}
              </p>
              <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Appel téléphonique en cours...</span>
              </div>
            </div>
            <button
              onClick={() => setIsCalling(false)}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition cursor-pointer min-h-[46px]"
            >
              Raccrocher
            </button>
          </div>
        </div>
      )}

      {/* In-app Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md h-[82dvh] max-h-[90dvh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentOrder.courier?.avatar}
                  alt=""
                  className="w-9 h-9 rounded-xl object-cover"
                />
                <div>
                  <div className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white">
                    {currentOrder.courier?.name}
                  </div>
                  <div className="text-[11px] text-[#0B7A4B] dark:text-emerald-400 font-semibold">
                    En ligne
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-full text-[#5C7A6E] hover:text-[#0B2B1E] dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2.5 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex gap-2 overflow-x-auto no-scrollbar">
              {[
                'Je suis devant la porte',
                'Montez au 1er étage',
                'Appelez-moi à l arrivée',
                'Merci !',
              ].map((txt) => (
                <button
                  key={txt}
                  onClick={() => {
                    const time = new Date().toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    setChatMessages((prev) => [
                      ...prev,
                      { sender: 'client', text: txt, time },
                    ]);
                  }}
                  className="px-3 py-1.5 text-xs rounded-full bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 whitespace-nowrap hover:bg-[#0B7A4B] hover:text-white hover:border-[#0B7A4B] transition cursor-pointer"
                >
                  {txt}
                </button>
              ))}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'client' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[78%] p-3 rounded-2xl text-xs ${
                      msg.sender === 'client'
                        ? 'bg-[#0B7A4B] text-white rounded-br-xs'
                        : 'bg-emerald-50/70 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white border border-[#E2ECE7] dark:border-[#1E3B2D] rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center gap-2">
              <input
                type="text"
                placeholder="Écrire un message au livreur..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:border-[#0B7A4B] text-[#0B2B1E] dark:text-white placeholder:text-[#5C7A6E] min-h-[42px]"
              />
              <button
                onClick={handleSendMessage}
                className="w-11 h-11 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
