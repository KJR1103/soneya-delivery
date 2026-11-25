import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Receipt, ShoppingBag, User } from 'lucide-react';

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

  const navItems = [
    {
      id: 'home' as const,
      label: 'Accueil',
      icon: Home,
    },
    {
      id: 'orders' as const,
      label: 'Commandes',
      icon: Receipt,
    },
    {
      id: 'cart' as const,
      label: 'Panier',
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: 'profile' as const,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-0 inset-x-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E2E8F0] px-3 py-1.5 flex items-center justify-around shadow-lg lg:hidden"
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer relative min-h-[44px] min-w-[56px] ${
              isActive
                ? 'text-[#1E3A8A] font-bold'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 text-[#1E3A8A]' : 'text-[#64748B]'
                }`}
              />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#D8432F] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
