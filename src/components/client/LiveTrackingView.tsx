import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatGnf, formatTime } from '../../utils/formatters';
import { ConakryMap } from './ConakryMap';
import { sound } from '../../utils/audio';

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
      <div className="max-w-md mx-auto px-gutter-md py-16 text-center space-y-gutter-md">
        <div className="w-16 h-16 mx-auto rounded-full bg-light-primary-container dark:bg-dark-primary-container border border-light-outline dark:border-dark-outline flex items-center justify-center text-light-primary dark:text-dark-primary">
          <span className="material-symbols-outlined text-headline-md" aria-hidden="true">schedule</span>
        </div>
        <h2 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface">
          Aucune commande en cours
        </h2>
        <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Vos commandes actives apparaîtront ici avec leur géolocalisation en direct.
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-lg hover:opacity-90 cursor-pointer"
        >
          Commander maintenant
        </button>
      </div>
    );
  }

  const steps: { key: string; title: string; subtitle: string; stageOrder: number; icon: string }[] = [
    { key: 'valide', title: 'Validé', subtitle: 'Paiement confirmé via Orange Money / MoMo', stageOrder: 0, icon: 'check_circle' },
    { key: 'preparation', title: 'En préparation', subtitle: 'Le commerçant emballe votre commande', stageOrder: 1, icon: 'restaurant' },
    { key: 'livraison', title: 'En livraison', subtitle: 'Le motard roule vers votre adresse', stageOrder: 2, icon: 'two_wheeler' },
    { key: 'arrive', title: 'Arrivé', subtitle: 'Remise en mains propres avec code secret', stageOrder: 3, icon: 'home' },
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

  const rider = currentOrder.courier;
  const riderInitials = rider ? rider.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'IS';

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-gutter-lg pb-32">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline px-gutter-md py-gutter-md flex items-center justify-between">
        <button
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface cursor-pointer"
          aria-label="Retour"
        >
          <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_back</span>
        </button>
        <h1 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">
          Suivi commande #{currentOrder.trackingNumber}
        </h1>
        <span className="font-mono text-mono-sm text-light-primary dark:text-dark-primary">
          {currentOrder.status === 'delivered' ? 'Livré' : `~${Math.max(3, Math.round(remainingKm * 3))} min`}
        </span>
      </header>

      {/* Route visual header */}
      <div className="relative h-48 bg-light-primary-container dark:bg-dark-primary-container border-b border-light-outline dark:border-dark-outline flex flex-col items-center justify-center p-gutter-md mx-0">
        <div className="w-full max-w-xs p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-gutter-sm">
            <span className="material-symbols-outlined text-title-lg text-light-primary dark:text-dark-primary" aria-hidden="true">two_wheeler</span>
            <div>
              <p className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface">
                {currentOrder.partnerName} → {currentOrder.clientQuartier}
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                GPS actif · {remainingKm} km
              </p>
            </div>
          </div>
          <span className="font-mono text-mono-sm text-light-primary dark:text-dark-primary">{remainingKm} km</span>
        </div>
      </div>

      {/* Map */}
      <div className="px-gutter-md">
        <div className="relative rounded-lg overflow-hidden border border-light-outline dark:border-dark-outline shadow-sm">
          <div className="h-[250px] sm:h-[320px]">
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
        </div>
      </div>

      {/* Rider card */}
      <section className="px-gutter-md">
        <div className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-sm flex items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-md">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-courier text-on-courier font-headline text-headline-md">
              {riderInitials}
            </span>
            <div>
              <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">
                {rider?.name || 'Ibrahima Sory'}
              </h2>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Rider Soneya · {rider?.rating || 4.9} ★
              </p>
            </div>
          </div>
          <div className="flex items-center gap-gutter-sm">
            <button
              type="button"
              aria-label="Appeler le livreur"
              onClick={() => setIsCalling(!isCalling)}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer ${
                isCalling
                  ? 'bg-error text-on-error'
                  : 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary hover:opacity-90'
              }`}
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">{isCalling ? 'call_end' : 'call'}</span>
            </button>
            <button
              type="button"
              aria-label="Messagerie"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">chat</span>
            </button>
          </div>
        </div>
      </section>

      {/* Chat panel */}
      {isChatOpen && (
        <section className="px-gutter-md animate-fade-in">
          <div className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-sm flex flex-col gap-gutter-sm max-h-64 overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-gutter-md py-gutter-sm rounded-md max-w-[80%] ${
                  msg.sender === 'client'
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface'
                }`}>
                  <p className="font-body text-body-sm">{msg.text}</p>
                  <span className="font-mono text-mono-sm opacity-70 mt-1 block">{msg.time}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-gutter-sm pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Votre message..."
                className="flex-1 px-gutter-md py-2.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-body text-body-md text-light-on-surface dark:text-dark-on-surface focus:border-light-primary focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">send</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="px-gutter-md">
        <div className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-sm flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">Chronologie</h2>
            <span className="font-label text-label-sm text-light-primary dark:text-dark-primary">
              {currentOrder.status === 'delivered' ? 'Livré' : `${Math.max(3, Math.round(remainingKm * 3))} min restantes`}
            </span>
          </div>

          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            return (
              <div
                key={step.key}
                className={`flex items-center justify-between py-gutter-sm ${idx < steps.length - 1 ? 'border-b border-light-outline dark:border-dark-outline' : ''}`}
              >
                <div className="flex items-center gap-gutter-sm">
                  <span
                    className="material-symbols-outlined text-title-lg"
                    style={isDone ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    aria-hidden="true"
                  >
                    {isDone ? 'check_circle' : step.icon}
                  </span>
                  <div>
                    <p className={`font-title text-title-md ${isDone || isActive ? 'text-light-on-surface dark:text-dark-on-surface' : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'}`}>
                      {step.title}
                    </p>
                    <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
                {isDone && (
                  <span className="font-mono text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    {formatTime(currentOrder.timeline[idx]?.timestamp || currentOrder.createdAt)}
                  </span>
                )}
                {isActive && currentOrder.status !== 'delivered' && (
                  <span className="font-mono text-mono-sm text-light-primary dark:text-dark-primary animate-pulse">en cours</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Delivery code & action */}
      {currentOrder.status !== 'delivered' && (
        <section className="px-gutter-md">
          <div className="p-gutter-md rounded-lg bg-light-primary-container dark:bg-dark-primary-container border border-light-outline dark:border-dark-outline flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label text-label-sm text-light-primary dark:text-dark-primary">Code de remise secret</p>
                <p className="font-mono text-mono-md text-light-on-primary-container dark:text-dark-on-primary-container tabular-nums text-2xl tracking-widest">
                  {currentOrder.deliveryCode}
                </p>
              </div>
              <span className="material-symbols-outlined text-headline-lg text-accent" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">lock</span>
            </div>

            <div className="flex items-center gap-gutter-sm">
              <button
                onClick={() => setIsAutoSimulating(!isAutoSimulating)}
                className="inline-flex items-center gap-gutter-xs px-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface font-label text-label-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">{isAutoSimulating ? 'pause' : 'play_arrow'}</span>
                {isAutoSimulating ? 'Pause' : 'Simuler'}
              </button>
              <button
                onClick={handleNextStage}
                className="inline-flex items-center gap-gutter-xs px-gutter-md py-2.5 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md hover:opacity-90 cursor-pointer"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_forward</span>
                Étape suivante
              </button>
            </div>
          </div>
        </section>
      )}

      {currentOrder.status === 'delivered' && (
        <section className="px-gutter-md">
          <div className="p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-sm flex flex-col items-center gap-gutter-md text-center">
            <span className="material-symbols-outlined text-headline-lg text-light-primary dark:text-dark-primary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
            <div>
              <h2 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface">Commande livrée</h2>
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant mt-1">
                Total payé : <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface tabular-nums">{formatGnf(currentOrder.totalGnf)}</span>
              </p>
            </div>
            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-lg hover:opacity-90 cursor-pointer"
            >
              Commander à nouveau
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
