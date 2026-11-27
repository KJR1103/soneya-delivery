import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NeighborhoodModal } from '../client/NeighborhoodModal';
import { SpaceSwitcher } from './SpaceSwitcher';
import { PWAInstallButton } from './PWAInstallButton';
import { DemoWalkthroughModal } from './DemoWalkthroughModal';

export const Header: React.FC = () => {
  const {
    space,
    activeTab,
    location,
    darkMode,
    toggleDarkMode,
    cartCount,
    setActiveTab,
    soundEnabled,
    toggleSound,
    user,
    setIsAuthModalOpen,
    setShowLandingPortal,
    searchQuery,
    setSearchQuery,
    cart,
  } = useApp();

  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.priceGnf * item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline pt-safe transition-colors">
        <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-gutter-md flex items-center justify-between gap-gutter-md">
          {/* Brand */}
          <div className="flex items-center gap-gutter-md shrink-0">
            <button
              onClick={() => setShowLandingPortal(true)}
              className="flex items-center gap-gutter-sm"
              title="Retourner au portail Soneya"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary">
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">two_wheeler</span>
              </span>
              <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface whitespace-nowrap hidden sm:inline">Soneya</span>
            </button>

            {/* Location chip */}
            <button
              onClick={() => setIsNeighborhoodOpen(true)}
              className="inline-flex items-center gap-gutter-xs px-3 py-1.5 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface font-label text-label-md transition-colors duration-state-change ease-state-change hover:border-light-primary whitespace-nowrap cursor-pointer"
            >
              <span className="material-symbols-outlined text-title-md text-light-primary dark:text-dark-primary" aria-hidden="true">location_on</span>
              <span>{location.isGPS ? 'GPS Conakry' : location.quartier.name}</span>
            </button>
          </div>

          {/* Search bar — desktop */}
          <form
            role="search"
            className="hidden md:flex items-center gap-gutter-sm flex-1 max-w-md px-gutter-md py-2 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline focus-within:border-light-primary transition-colors"
            onSubmit={(e) => e.preventDefault()}
          >
            <span className="material-symbols-outlined text-title-lg text-light-on-surface-variant dark:text-dark-on-surface-variant" aria-hidden="true">search</span>
            <input
              type="search"
              aria-label="Rechercher un plat, restaurant ou pharmacie"
              placeholder="Maffé Tiga, Prima Center, pharmacie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 p-0 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant dark:placeholder:text-dark-on-surface-variant focus:ring-0 focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-light-on-surface-variant hover:text-light-on-surface cursor-pointer">
                <span className="material-symbols-outlined text-label-md" aria-hidden="true">close</span>
              </button>
            )}
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-gutter-md shrink-0">
            {/* Desktop nav links */}
            {space === 'client' && (
              <nav className="hidden lg:flex items-center gap-gutter-xs">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`inline-flex items-center gap-gutter-xs px-gutter-sm py-1.5 rounded-md font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-light-primary text-light-on-primary'
                      : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">home</span>
                  <span>Accueil</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`inline-flex items-center gap-gutter-xs px-gutter-sm py-1.5 rounded-md font-label text-label-md transition-colors duration-state-change cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-light-primary text-light-on-primary'
                      : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">receipt_long</span>
                  <span>Commandes</span>
                </button>
              </nav>
            )}

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              aria-label="Activer ou couper le son"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:border-light-primary transition-colors cursor-pointer"
              title={soundEnabled ? 'Sons actifs' : 'Sons coupés'}
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">{soundEnabled ? 'volume_up' : 'volume_off'}</span>
            </button>

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              aria-label="Basculer le mode sombre"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface hover:border-light-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* User */}
            <button
              onClick={() => {
                if (user) {
                  setActiveTab('profile');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="hidden lg:inline-flex items-center gap-gutter-xs font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary transition-colors cursor-pointer"
              title={user ? user.fullName : 'Se connecter'}
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">person</span>
              <span className="max-w-[80px] truncate">{user ? user.fullName.split(' ')[0] : 'Connexion'}</span>
            </button>

            {/* Demo mode */}
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-gutter-xs px-gutter-md py-1.5 rounded-full bg-accent text-on-accent font-label text-label-sm transition-colors hover:opacity-90 cursor-pointer"
              title="Lancer le test de contrôle complet"
            >
              <span className="material-symbols-outlined text-label-md" aria-hidden="true">auto_awesome</span>
              <span>Démo</span>
            </button>

            <div className="hidden sm:block">
              <PWAInstallButton compact />
            </div>

            {/* Cart button */}
            {space === 'client' && (
              <button
                onClick={() => setActiveTab('orders')}
                className="inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-2.5 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md transition-colors duration-state-change ease-state-change hover:opacity-90 whitespace-nowrap cursor-pointer"
                title="Voir mon panier"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">shopping_bag</span>
                <span className="font-mono text-mono-sm tabular-nums hidden sm:inline">{cartTotal > 0 ? `${(cartTotal / 1000).toFixed(0)} 000 GNF` : 'Panier'}</span>
                {cartCount > 0 && (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-on-accent text-accent text-label-sm font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden px-gutter-md pb-gutter-sm">
          <form
            role="search"
            className="flex items-center gap-gutter-sm w-full px-gutter-md py-2 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline"
            onSubmit={(e) => e.preventDefault()}
          >
            <span className="material-symbols-outlined text-title-md text-light-on-surface-variant dark:text-dark-on-surface-variant" aria-hidden="true">search</span>
            <input
              type="search"
              placeholder="Maffé Tiga, Prima Center, pharmacie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 p-0 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant focus:ring-0 focus:outline-none"
            />
          </form>
        </div>

        {/* Space switcher row */}
        <div className="px-gutter-md md:px-gutter-lg pb-gutter-sm flex items-center justify-between gap-gutter-md">
          <div className="overflow-x-auto no-scrollbar">
            <SpaceSwitcher />
          </div>
        </div>
      </header>

      <NeighborhoodModal
        isOpen={isNeighborhoodOpen}
        onClose={() => setIsNeighborhoodOpen(false)}
      />

      <DemoWalkthroughModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  );
};
