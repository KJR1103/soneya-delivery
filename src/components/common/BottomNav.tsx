import React from 'react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    space,
    activeTab,
    setActiveTab,
    cartCount,
    activeOrder,
    setSelectedPartnerId,
  } = useApp();

  // BottomNav is tailored for the Client space mobile & tablet experience
  if (space !== 'client') return null;

  const handleTabClick = (tab: 'home' | 'partners' | 'search' | 'favorites' | 'profile' | 'orders') => {
    setSelectedPartnerId(null);
    setActiveTab(tab);
  };

  // stitch_ultra: 4-item bottom nav (Accueil, Commandes, Panier, Profil)
  // Panier carries the cart badge; an ongoing delivery promotes Panier into a live Suivi indicator.
  const navItems: Array<{
    id: 'home' | 'orders' | 'profile';
    label: string;
    symbol: string;
    onClick: () => void;
  }> = [
    {
      id: 'home',
      label: 'Accueil',
      symbol: 'home',
      onClick: () => handleTabClick('home'),
    },
    {
      id: 'orders',
      label: 'Commandes',
      symbol: 'receipt_long',
      onClick: () => handleTabClick('orders'),
    },
    {
      id: 'profile',
      label: 'Profil',
      symbol: 'person',
      onClick: () => handleTabClick('profile'),
    },
  ];

  const hasLiveOrder = !!activeOrder && activeOrder.status !== 'delivered';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none lg:hidden">
      <div className="bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-t border-light-outline dark:border-dark-outline">
        <div className="max-w-lg mx-auto w-full px-gutter-md pt-gutter-xs pb-safe flex items-stretch justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-gutter-xs px-gutter-xs transition-all cursor-pointer min-h-[48px] ${
                  isActive
                    ? 'text-light-primary dark:text-dark-primary'
                    : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className="material-symbols-outlined text-title-lg"
                  aria-hidden="true"
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.symbol}
                </span>
                <span className="font-label text-label-sm tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Panier — always present, carries cart badge and/or live delivery pulse */}
          <button
            onClick={() => handleTabClick('orders')}
            className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-gutter-xs px-gutter-xs transition-all relative min-h-[48px] cursor-pointer ${
              activeTab === 'orders'
                ? 'text-light-primary dark:text-dark-primary'
                : 'text-light-on-surface-variant dark:text-dark-on-surface-variant'
            }`}
            title={hasLiveOrder ? 'Suivi de livraison en direct' : 'Voir mon panier'}
          >
            <div className="relative">
              <span
                className="material-symbols-outlined text-title-lg"
                aria-hidden="true"
                style={
                  activeTab === 'orders'
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {hasLiveOrder ? 'location_on' : 'shopping_bag'}
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary text-label-sm font-bold flex items-center justify-center ring-2 ring-light-surface-container-low dark:ring-dark-surface-container-low">
                  {cartCount}
                </span>
              )}
              {hasLiveOrder && cartCount === 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-light-primary dark:bg-dark-primary ring-2 ring-light-surface-container-low dark:ring-dark-surface-container-low animate-pulse" />
              )}
            </div>
            <span className="font-label text-label-sm tracking-tight truncate max-w-full">
              {hasLiveOrder ? 'Suivi' : 'Panier'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
