import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NeighborhoodModal } from '../client/NeighborhoodModal';
import { SpaceSwitcher } from './SpaceSwitcher';
import { PWAInstallButton } from './PWAInstallButton';
import { DemoWalkthroughModal } from './DemoWalkthroughModal';
import { MapPin, Moon, Sun, ShoppingBag, ChevronDown, Volume2, VolumeX, User, Home, Search, Heart, Sparkles, Store } from 'lucide-react';

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
  } = useApp();

  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0B1E15] border-b border-[#E2ECE7] dark:border-emerald-900/50 pt-safe transition-colors shadow-xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2.5">
          {/* Top row */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            {/* Brand with official GHT logo */}
            <div
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer min-w-0 shrink-0"
              onClick={() => setShowLandingPortal(true)}
              title="Retourner à la page d'accueil commune Soneya"
            >
              <img
                src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
                alt="Guinée Hub Technologie Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl bg-white border border-[#E2ECE7] dark:border-emerald-800 p-1 shadow-xs shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-sm sm:text-base tracking-tight text-[#0B2B1E] dark:text-white">
                    Soneya
                  </span>
                  <span className="font-heading font-bold text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-emerald-800">
                    GHT
                  </span>
                </div>
                <div className="hidden xs:block sm:block text-[10px] font-medium text-[#2F4F42] dark:text-emerald-300/80 truncate -mt-0.5 max-w-[140px] sm:max-w-none">
                  Conakry commande · Soneya livre
                </div>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 shrink-0">
              <button
                onClick={() => setShowLandingPortal(true)}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-emerald-950/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 text-[#0B2B1E] dark:text-emerald-100 text-xs font-semibold transition border border-[#E2ECE7] dark:border-emerald-800 cursor-pointer"
              >
                <span>Accueil Portail</span>
              </button>

              {/* Mode Démonstration Automatisée (Test 118 500 GNF) */}
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold transition shadow-xs cursor-pointer min-h-[34px]"
                title="Lancer le test de contrôle complet (118 500 GNF)"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white shrink-0" />
                <span className="hidden sm:inline">Mode Démo</span>
              </button>

              <div className="hidden sm:block">
                <PWAInstallButton compact />
              </div>

              {/* Sound toggle button */}
              <button
                onClick={toggleSound}
                aria-label="Activer ou couper le son"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-white dark:bg-emerald-950/40 text-[#0B2B1E] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition border border-[#E2ECE7] dark:border-emerald-800 cursor-pointer"
                title={soundEnabled ? 'Sons actifs' : 'Sons coupés'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0B7A4B] dark:text-emerald-300" /> : <VolumeX className="w-4 h-4 text-[#2F4F42]" />}
              </button>

              {/* Dark mode button */}
              <button
                onClick={toggleDarkMode}
                aria-label="Basculer le mode sombre"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-white dark:bg-emerald-950/40 text-[#0B2B1E] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition border border-[#E2ECE7] dark:border-emerald-800 cursor-pointer"
              >
                {darkMode ? <Sun className="w-4 h-4 text-[#FFB81F]" /> : <Moon className="w-4 h-4 text-[#0B2B1E]" />}
              </button>

              {/* User Account / Login button */}
              <button
                onClick={() => {
                  if (user) {
                    setActiveTab('profile');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-emerald-950/40 text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition text-xs font-semibold border border-[#E2ECE7] dark:border-emerald-800 min-h-[34px] cursor-pointer"
                title={user ? user.fullName : 'Se connecter'}
              >
                <User className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                <span className="hidden md:inline max-w-[80px] truncate">
                  {user ? user.fullName.split(' ')[0] : 'Connexion'}
                </span>
              </button>

              {/* Desktop Nav Links (for PC, Mac, iPad Pro) */}
              {space === 'client' && (
                <div className="hidden lg:flex items-center gap-1 border-r border-[#E2ECE7] dark:border-emerald-800 pr-2 mr-1">
                  <button
                    onClick={() => setActiveTab('home')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'home'
                        ? 'bg-[#0B7A4B] text-white shadow-xs'
                        : 'text-[#0B2B1E] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Accueil</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('partners')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'partners'
                        ? 'bg-[#0B7A4B] text-white shadow-xs'
                        : 'text-[#0B2B1E] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Partenaires</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('search')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'search'
                        ? 'bg-[#0B7A4B] text-white shadow-xs'
                        : 'text-[#0B2B1E] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Recherche</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'favorites'
                        ? 'bg-[#0B7A4B] text-white shadow-xs'
                        : 'text-[#0B2B1E] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Favoris</span>
                  </button>
                </div>
              )}

              {/* Cart quick access (client mode) */}
              {space === 'client' && (
                <button
                  onClick={() => setActiveTab('orders')}
                  className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-emerald-950/40 text-[#0B2B1E] dark:text-emerald-100 font-semibold text-xs hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition border border-[#E2ECE7] dark:border-emerald-800 min-h-[34px] cursor-pointer"
                  title="Voir mon panier et mes commandes"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                  <span className="hidden sm:inline">Panier</span>
                  {cartCount > 0 && (
                    <span className="min-w-4 h-4 px-1 rounded-full bg-[#0B7A4B] text-white text-[10px] font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Bottom row: Location selector & Space switcher */}
          <div className="mt-2 pt-2 border-t border-[#E2ECE7] dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
            {/* Location Pill */}
            <button
              onClick={() => setIsNeighborhoodOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[#0B2B1E] dark:text-emerald-100 hover:text-[#0B7A4B] transition w-full sm:w-auto min-w-0 py-1 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-[#0B7A4B] dark:text-[#FFB81F] shrink-0 border border-[#D4E9DD] dark:border-emerald-800">
                <MapPin className="w-3 h-3" />
              </div>
              <span className="text-[11px] text-[#2F4F42] dark:text-emerald-300/80 shrink-0">Livrer à :</span>
              <span className="font-bold truncate text-[#0B2B1E] dark:text-white">
                {location.isGPS ? 'Position GPS exacte' : location.quartier.name}
              </span>
              <ChevronDown className="w-3 h-3 text-[#0B7A4B] shrink-0" />
            </button>

            {/* 4 Spaces Switcher (Client / Livreur / Marchand / Admin) */}
            <div className="w-full sm:w-auto overflow-x-auto no-scrollbar flex items-center justify-start sm:justify-end min-w-0">
              <SpaceSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Neighborhood selection modal */}
      <NeighborhoodModal
        isOpen={isNeighborhoodOpen}
        onClose={() => setIsNeighborhoodOpen(false)}
      />

      {/* Mode Démonstration Automatisée */}
      <DemoWalkthroughModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  );
};
