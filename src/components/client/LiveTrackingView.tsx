import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { ConakryMap } from './ConakryMap';
import { sound } from '../../utils/audio';

interface LiveTrackingViewProps {
  orderId?: string | null;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({ orderId }) => {
  const { orders, activeOrder, setActiveTab, showToast } = useApp();

  const currentOrder: Order | null = orderId
    ? orders.find((o) => o.id === orderId) || activeOrder
    : activeOrder || orders[0] || null;

  const [isCalling, setIsCalling] = useState(false);

  const handleCallRider = () => {
    setIsCalling(true);
    sound.playPhoneRing();
    showToast('Appel en cours', 'Connexion sécurisée avec le Rider Soneya (Ibrahima Sory)...', 'info');
    setTimeout(() => {
      setIsCalling(false);
    }, 4000);
  };

  return (
    <div className="max-w-xl mx-auto w-full px-gutter-md py-gutter-md flex flex-col gap-gutter-lg pb-24 text-light-on-surface dark:text-dark-on-surface">
      {/* Header (Matching suivi_livraison_gps_client.html) */}
      <header className="sticky top-0 z-30 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline -mx-gutter-md px-gutter-md py-gutter-md flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          aria-label="Retour aux commandes"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-variant transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_back</span>
        </button>

        <h1 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
          Suivi commande {currentOrder?.trackingNumber || '#SNY-8420'}
        </h1>

        <span className="font-mono text-mono-sm text-light-primary dark:text-dark-primary font-bold">
          5 min
        </span>
      </header>

      {/* Route Visual Header with Real Conakry Map overlay (Reference img_0414 Right) */}
      <div className="relative rounded-xl overflow-hidden border border-light-outline dark:border-dark-outline bg-light-primary-container dark:bg-dark-primary-container shadow-xs">
        <div className="h-60 w-full relative">
          <ConakryMap
            partnerLat={9.6012}
            partnerLng={-13.6288}
            partnerName={currentOrder?.partnerName || 'Chez Fanta (Kipé)'}
            liveCourierPos={{ lat: 9.585, lng: -13.65 }}
            clientLat={9.54}
            clientLng={-13.68}
            clientAddress={currentOrder?.clientAddress || 'Camayenne, Conakry'}
            courier={currentOrder?.courier}
            orderStatus={currentOrder?.status || 'delivering'}
          />
        </div>

        {/* Floating Route Info Banner (Matching Stitch Ultra) */}
        <div className="p-gutter-md bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-t border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-sm">
          <div className="flex items-center gap-gutter-sm">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-light-primary-container text-light-primary shrink-0">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">two_wheeler</span>
            </span>
            <div>
              <p className="font-label text-label-md text-light-on-surface dark:text-dark-on-surface font-bold">
                Kipé → Camayenne
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Route Le Prince · GPS actif en direct
              </p>
            </div>
          </div>
          <span className="font-mono text-mono-md text-light-primary dark:text-dark-primary font-bold shrink-0">
            1,4 km
          </span>
        </div>
      </div>

      <main className="flex-1 flex flex-col gap-gutter-lg">
        {/* Rider Card (Matching Stitch Ultra) */}
        <section className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-md">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-courier text-white font-headline text-headline-md font-bold shrink-0">
              IS
            </span>
            <div>
              <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
                Ibrahima Sory
              </h2>
              <p className="font-body text-body-sm text-light-on-surface-variant flex items-center gap-1">
                <span>Rider certifié Soneya</span>
                <span>·</span>
                <span className="font-semibold text-light-on-surface flex items-center">
                  <span className="material-symbols-outlined text-xs text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  4.9
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCallRider}
            aria-label="Appeler le livreur"
            className={`inline-flex items-center justify-center w-11 h-11 rounded-full transition cursor-pointer shadow-xs ${
              isCalling
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-light-primary dark:bg-dark-primary text-light-on-primary hover:opacity-90'
            }`}
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">call</span>
          </button>
        </section>

        {/* Step-by-Step Timeline (Matching Stitch Ultra) */}
        <section className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
              Chronologie de la course
            </h2>
            <span className="font-label text-label-sm text-light-primary dark:text-dark-primary font-bold">
              5 min restantes
            </span>
          </div>

          {/* Step 1: Cuisine */}
          <div className="flex items-center justify-between py-2.5 border-b border-light-outline dark:border-dark-outline">
            <div className="flex items-center gap-gutter-sm">
              <span className="material-symbols-outlined text-title-lg text-light-primary dark:text-dark-primary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                check_circle
              </span>
              <div>
                <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">
                  Cuisine · Chez Fanta
                </p>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  Commande préparée &amp; remise au coursier
                </p>
              </div>
            </div>
            <span className="font-mono text-mono-sm text-light-on-surface-variant font-medium">
              18:02
            </span>
          </div>

          {/* Step 2: En cours de livraison */}
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-gutter-sm">
              <span className="material-symbols-outlined text-title-lg text-courier animate-bounce" aria-hidden="true">
                two_wheeler
              </span>
              <div>
                <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">
                  Livraison en cours
                </p>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  Arrivée prévue à Camayenne
                </p>
              </div>
            </div>
            <span className="font-mono text-mono-sm text-light-primary dark:text-dark-primary font-bold">
              18:15
            </span>
          </div>
        </section>

        {/* Payment Summary */}
        <div className="p-gutter-md rounded-lg bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline flex items-center justify-between">
          <span className="text-xs text-light-on-surface-variant">
            Paiement Orange Money validé
          </span>
          <span className="font-mono text-mono-md font-bold text-light-primary dark:text-dark-primary">
            {formatGnf(currentOrder?.totalGnf || 80000)}
          </span>
        </div>
      </main>
    </div>
  );
};
