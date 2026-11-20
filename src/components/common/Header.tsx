import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NeighborhoodModal } from '../client/NeighborhoodModal';
import { formatGnf } from '../../utils/formatters';

export const Header: React.FC = () => {
  const {
    space,
    activeTab,
    location,
    darkMode,
    toggleDarkMode,
    cartCount,
    cartSubtotalGnf,
    setActiveTab,
    soundEnabled,
    toggleSound,
    user,
    setIsAuthModalOpen,
    setShowLandingPortal,
    searchQuery,
    setSearchQuery,
    setSelectedPartnerId,
  } = useApp();

  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-gutter-sm sm:py-gutter-md flex items-center justify-between gap-gutter-md">
          {/* Left: Brand + Quartier Chip */}
          <div className="flex items-center gap-gutter-sm sm:gap-gutter-md shrink-0">
            <div
              onClick={() => {
                window.history.pushState({}, '', '/');
                setShowLandingPortal(true);
              }}
              className="flex items-center gap-gutter-sm cursor-pointer group"
              title="Retour au portail Soneya"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-xs transition-transform duration-state-change group-hover:scale-105">
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">two_wheeler</span>
              </span>
              <div className="flex flex-col">
                <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold leading-none">
                  Soneya
                </span>
                <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  Conakry
                </span>
              </div>
            </div>

            {/* Quartier Selector Chip (Matching Stitch Ultra) */}
            <button
              type="button"
              onClick={() => setIsNeighborhoodOpen(true)}
              className="inline-flex items-center gap-gutter-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface font-label text-label-sm sm:text-label-md transition-colors hover:border-light-primary cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm sm:text-title-md text-light-primary dark:text-dark-primary" aria-hidden="true">
                location_on
              </span>
              <span className="truncate max-w-[80px] sm:max-w-none">{location.quartier?.name || 'Kipé'}</span>
              <span className="material-symbols-outlined text-xs sm:text-sm">expand_more</span>
            </button>
          </div>

          {/* Center: Searchbar for Client (Matching searchbar-standard) */}
          {space === 'client' && (
            <div className="hidden md:flex items-center gap-gutter-sm flex-1 max-w-md px-gutter-md py-2 rounded-full bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline focus-within:border-light-primary">
              <span className="material-symbols-outlined text-title-md text-light-on-surface-variant" aria-hidden="true">
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Maffé Tiga, Prima Center, pharmacie..."
                className="w-full bg-transparent border-0 p-0 font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant outline-hidden"
              />
            </div>
          )}

          {/* Right: Client Quick Links + Audio/Dark mode */}
          <div className="flex items-center gap-gutter-sm sm:gap-gutter-md shrink-0">
            {/* Quick exit to Portal */}
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setShowLandingPortal(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-variant transition border border-light-outline dark:border-dark-outline cursor-pointer"
              title="Retour à l'accueil Soneya"
            >
              <span className="material-symbols-outlined text-sm text-light-primary dark:text-dark-primary">home</span>
              <span>Accueil</span>
            </button>

            {/* Client Desktop Navigation */}
            {space === 'client' && (
              <nav aria-label="Navigation client" className="hidden lg:flex items-center gap-gutter-md shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPartnerId(null);
                    setActiveTab('orders');
                  }}
                  className={`inline-flex items-center gap-gutter-xs font-label text-label-md cursor-pointer transition ${
                    activeTab === 'orders'
                      ? 'text-light-primary dark:text-dark-primary font-bold'
                      : 'text-light-on-surface-variant hover:text-light-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">receipt_long</span>
                  <span>Commandes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPartnerId(null);
                    setActiveTab('profile');
                  }}
                  className={`inline-flex items-center gap-gutter-xs font-label text-label-md cursor-pointer transition ${
                    activeTab === 'profile'
                      ? 'text-light-primary dark:text-dark-primary font-bold'
                      : 'text-light-on-surface-variant hover:text-light-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">person</span>
                  <span>{user ? user.fullName.split(' ')[0] : 'Profil'}</span>
                </button>

                {/* Cart Button (Matching Stitch Ultra button-with-icon) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPartnerId(null);
                    setActiveTab('cart');
                  }}
                  className="inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-2.5 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md transition hover:opacity-90 active:scale-98 cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">shopping_bag</span>
                  <span className="tabular-nums font-bold">
                    {cartCount > 0 ? formatGnf(cartSubtotalGnf) : '0 GNF'}
                  </span>
                </button>
              </nav>
            )}

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              aria-label="Son"
              title={soundEnabled ? 'Sons actifs' : 'Sons coupés'}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-variant transition border border-light-outline dark:border-dark-outline cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Thème sombre"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-variant transition border border-light-outline dark:border-dark-outline cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Neighborhood selection modal */}
      <NeighborhoodModal
        isOpen={isNeighborhoodOpen}
        onClose={() => setIsNeighborhoodOpen(false)}
      />
    </>
  );
};
