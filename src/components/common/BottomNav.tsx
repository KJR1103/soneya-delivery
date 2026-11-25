import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Store, Search, Heart, User, ShoppingBag, MapPin } from 'lucide-react';

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

  const handleTabClick = (tab: 'home' | 'partners' | 'search' | 'favorites' | 'profile') => {
    setSelectedPartnerId(null);
    setActiveTab(tab);
  };

  const navItems = [
    {
      id: 'home' as const,
      label: 'Accueil',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'partners' as const,
      label: 'Partenaires',
      icon: <Store className="w-5 h-5" />,
    },
    {
      id: 'search' as const,
      label: 'Recherche',
      icon: <Search className="w-5 h-5" />,
    },
    {
      id: 'favorites' as const,
      label: 'Favoris',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      id: 'profile' as const,
      label: 'Profil',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-2 sm:px-4 pb-safe pt-1 pointer-events-none lg:hidden">
      <div className="max-w-lg mx-auto w-full pointer-events-auto mb-1.5 sm:mb-2">
        <div className="bg-white/95 dark:bg-[#0B1E15]/95 backdrop-blur-lg border border-[#E2ECE7] dark:border-emerald-900/60 rounded-2xl shadow-xl px-1.5 sm:px-3 py-1.5 flex items-center justify-between gap-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'text-[#0B7A4B] dark:text-[#10B981] font-bold bg-emerald-50/70 dark:bg-emerald-950/40'
                    : 'text-[#2F4F42] dark:text-emerald-200/70 hover:text-[#0B7A4B] dark:hover:text-white'
                }`}
              >
                <div className="relative shrink-0">
                  {item.icon}
                </div>
                <span className="text-[10px] tracking-tight truncate max-w-full">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0.5 w-4 h-0.5 rounded-full bg-[#0B7A4B] dark:bg-[#10B981]" />
                )}
              </button>
            );
          })}

          {/* Cart quick access icon with badge if items present */}
          {cartCount > 0 && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all relative min-h-[44px] cursor-pointer ${
                activeTab === 'orders'
                  ? 'text-[#0B7A4B] dark:text-[#10B981] font-bold bg-emerald-50/70 dark:bg-emerald-950/40'
                  : 'text-[#0B2B1E] dark:text-emerald-100'
              }`}
              title="Voir mon panier"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#0B7A4B] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0B1E15]">
                  {cartCount}
                </span>
              </div>
              <span className="text-[10px] tracking-tight truncate max-w-full">Panier</span>
            </button>
          )}

          {/* Ongoing live delivery order tracking shortcut */}
          {activeOrder && activeOrder.status !== 'delivered' && cartCount === 0 && (
            <button
              onClick={() => setActiveTab('orders')}
              className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-[#0B7A4B] dark:text-[#10B981] font-bold relative min-h-[44px] cursor-pointer"
              title="Suivi de livraison en direct"
            >
              <div className="relative">
                <MapPin className="w-5 h-5 text-[#0B7A4B] dark:text-[#10B981]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B1E15] animate-pulse" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-full">Suivi</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
