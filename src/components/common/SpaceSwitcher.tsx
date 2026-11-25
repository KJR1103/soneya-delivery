import React from 'react';
import { useApp } from '../../context/AppContext';
import { SpaceType } from '../../types';
import { ShoppingBag, Bike, Store, ShieldCheck, Home } from 'lucide-react';

export const SpaceSwitcher: React.FC = () => {
  const { space, setSpace, user, setShowLandingPortal } = useApp();

  // If user is logged in with a non-admin role, they ONLY see their dedicated space (Role-Based Access)
  if (user && user.role !== 'admin') {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => setShowLandingPortal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-emerald-950/40 text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition border border-[#E2ECE7] dark:border-emerald-800 cursor-pointer"
          title="Retourner à la page d'accueil commune"
        >
          <Home className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
          <span>Portail Soneya</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#0B2B1E] text-white">
          {user.role === 'client' && <ShoppingBag className="w-3.5 h-3.5" />}
          {user.role === 'partner' && <Store className="w-3.5 h-3.5" />}
          {user.role === 'courier' && <Bike className="w-3.5 h-3.5" />}
          <span className="capitalize">Espace {user.role === 'client' ? 'Client' : user.role === 'partner' ? 'Commerçant' : 'Livreur'}</span>
        </div>
      </div>
    );
  }

  // Admin or Guest (Demo mode)
  const spaces: { id: SpaceType; label: string; short: string; icon: React.ReactNode }[] = [
    {
      id: 'client',
      label: 'Espace Client',
      short: 'Client',
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
    },
    {
      id: 'partner',
      label: 'Espace Partenaire',
      short: 'Partenaire',
      icon: <Store className="w-3.5 h-3.5" />,
    },
    {
      id: 'courier',
      label: 'Espace Livreur',
      short: 'Livreur',
      icon: <Bike className="w-3.5 h-3.5" />,
    },
    {
      id: 'admin',
      label: 'Espace Admin',
      short: 'Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end min-w-0">
      <button
        onClick={() => setShowLandingPortal(true)}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-emerald-950/40 text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition shrink-0 border border-[#E2ECE7] dark:border-emerald-800 cursor-pointer"
        title="Page d'accueil commune Soneya"
      >
        <Home className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
        <span className="hidden sm:inline">Portail</span>
      </button>

      <div className="flex items-center bg-white dark:bg-emerald-950/40 p-0.5 rounded-xl border border-[#E2ECE7] dark:border-emerald-800 overflow-x-auto no-scrollbar min-w-0">
        {spaces.map((s) => {
          const isActive = space === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSpace(s.id)}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all whitespace-nowrap min-h-[32px] cursor-pointer ${
                isActive
                  ? 'bg-[#0B7A4B] text-white shadow-xs font-bold'
                  : 'text-[#2F4F42] dark:text-emerald-200/80 hover:text-[#0B2B1E] dark:hover:text-white'
              }`}
            >
              {s.icon}
              <span>{s.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
