import React from 'react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    space,
    activeTab,
    setActiveTab,
    cartCount,
    setSelectedPartnerId,
  } = useApp();

  // BottomNav is tailored for the Client space mobile & tablet experience
  if (space !== 'client') return null;

  const handleTabClick = (tab: 'home' | 'orders' | 'cart' | 'profile') => {
    setSelectedPartnerId(null);
    setActiveTab(tab);
  };

  const navItems: {
    id: 'home' | 'orders' | 'cart' | 'profile';
    label: string;
    icon: string;
    badge?: number;
  }[] = [
    {
      id: 'home',
      label: 'Accueil',
      icon: 'home',
    },
    {
      id: 'orders',
      label: 'Commandes',
      icon: 'receipt_long',
    },
    {
      id: 'cart',
      label: 'Panier',
      icon: 'shopping_bag',
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: 'person',
    },
  ];

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-0 inset-x-0 z-30 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-t border-light-outline dark:border-dark-outline px-gutter-md sm:px-gutter-lg py-gutter-sm flex items-center justify-around shadow-lg lg:hidden"
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all duration-state-change cursor-pointer relative ${
              isActive
                ? 'text-light-primary dark:text-dark-primary font-bold'
                : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface'
            }`}
          >
            <div className="relative">
              <span
                className="material-symbols-outlined text-title-lg"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-light-primary dark:bg-dark-primary text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-dark-surface-container-low">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="font-label text-label-sm">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
