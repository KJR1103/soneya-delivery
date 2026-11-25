import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NeighborhoodModal } from '../client/NeighborhoodModal';
import { formatGnf } from '../../utils/formatters';
import {
  MapPin,
  Search,
  Home,
  Receipt,
  User,
  ShoppingBag,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';

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
    setShowLandingPortal,
    searchQuery,
    setSearchQuery,
    setSelectedPartnerId,
  } = useApp();

  const [isNeighborhoodOpen, setIsNeighborhoodOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0] transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Brand + Quartier Chip */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div
              onClick={() => {
                window.history.pushState({}, '', '/');
                setShowLandingPortal(true);
              }}
              className="flex items-center gap-2 cursor-pointer group"
              title="Retour au portail Soneya"
            >
              <img
                src="/images/soneya-icon.png"
                alt="Soneya Icon"
                className="w-9 h-9 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-headline font-black text-lg text-[#1E3A8A] leading-none">
                  Soneya
                </span>
                <span className="text-[10px] text-[#64748B] font-semibold">
                  Conakry
                </span>
              </div>
            </div>

            {/* Quartier Selector Chip */}
            <button
              type="button"
              onClick={() => setIsNeighborhoodOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:border-[#1E3A8A] transition cursor-pointer whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span className="truncate max-w-[90px] sm:max-w-none">{location.quartier?.name || 'Kipé'}</span>
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>
          </div>

          {/* Center: Searchbar for Client */}
          {space === 'client' && (
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md px-3.5 py-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] focus-within:border-[#1E3A8A] focus-within:bg-white transition">
              <Search className="w-4 h-4 text-[#64748B]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Maffé Tiga, Prima Center, pharmacie..."
                className="w-full bg-transparent border-0 p-0 text-xs text-[#0F172A] placeholder:text-[#64748B] outline-none"
              />
            </div>
          )}

          {/* Right: Client Quick Links + Sound / Dark mode */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick exit to Portal */}
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setShowLandingPortal(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-[#F8FAFC] text-[#0F172A] hover:bg-[#DCE3F4] transition border border-[#E2E8F0] cursor-pointer"
              title="Retour à l'accueil Soneya"
            >
              <Home className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Accueil</span>
            </button>

            {/* Client Desktop Navigation */}
            {space === 'client' && (
              <nav aria-label="Navigation client" className="hidden lg:flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPartnerId(null);
                    setActiveTab('orders');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#DCE3F4] text-[#1E3A8A]'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Commandes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPartnerId(null);
                    setActiveTab('profile');
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-[#DCE3F4] text-[#1E3A8A]'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user ? user.fullName.split(' ')[0] : 'Profil'}</span>
                </button>

                {/* Cart Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPartnerId(null);
                    setActiveTab('cart');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold transition hover:bg-[#1E3A8A]/90 active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="font-mono">
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
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#F8FAFC] text-[#0F172A] hover:bg-[#DCE3F4] transition border border-[#E2E8F0] cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#1E3A8A]" /> : <VolumeX className="w-4 h-4 text-[#64748B]" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Thème sombre"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#F8FAFC] text-[#0F172A] hover:bg-[#DCE3F4] transition border border-[#E2E8F0] cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#F4B028]" /> : <Moon className="w-4 h-4 text-[#1E3A8A]" />}
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
