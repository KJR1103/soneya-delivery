import React from 'react';
import { useApp } from '../../context/AppContext';
import { SpaceType } from '../../types';

export const SpaceSwitcher: React.FC = () => {
  const { space, setSpace, user, setShowLandingPortal } = useApp();

  const goToPortal = () => {
    window.history.pushState({}, '', '/');
    setShowLandingPortal(true);
  };

  const goToSpace = (target: SpaceType) => {
    const paths: Record<SpaceType, string> = {
      client: '/client',
      courier: '/livreur',
      partner: '/partenaire',
      admin: '/admin',
    };
    window.history.pushState({}, '', paths[target]);
    setSpace(target);
  };

  // The 3 public spaces (Admin is strictly internal and never exposed to public users)
  const publicSpaces: { id: SpaceType; label: string; icon: string; color: string }[] = [
    {
      id: 'client',
      label: 'Client',
      icon: 'shopping_bag',
      color: 'bg-light-primary text-light-on-primary',
    },
    {
      id: 'courier',
      label: 'Rider',
      icon: 'two_wheeler',
      color: 'bg-courier text-on-courier',
    },
    {
      id: 'partner',
      label: 'Business',
      icon: 'storefront',
      color: 'bg-partner text-on-partner',
    },
  ];

  // If currently in Admin space (or user is explicitly admin), include Admin badge
  const isInternalAdmin = space === 'admin' || user?.role === 'admin';

  return (
    <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end min-w-0">
      <button
        onClick={goToPortal}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface hover:bg-light-surface-variant transition border border-light-outline dark:border-dark-outline cursor-pointer shrink-0"
        title="Page d'accueil Soneya"
      >
        <span className="material-symbols-outlined text-[16px] text-light-primary dark:text-dark-primary">home</span>
        <span className="hidden sm:inline">Portail</span>
      </button>

      <div className="flex items-center bg-light-surface-container dark:bg-dark-surface-container p-0.5 rounded-full border border-light-outline dark:border-dark-outline min-w-0">
        {publicSpaces.map((s) => {
          const isActive = space === s.id;
          return (
            <button
              key={s.id}
              onClick={() => goToSpace(s.id)}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap min-h-[30px] cursor-pointer ${
                isActive
                  ? `${s.color} shadow-xs font-bold`
                  : 'text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          );
        })}

        {isInternalAdmin && (
          <button
            onClick={() => goToSpace('admin')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap min-h-[30px] cursor-pointer ${
              space === 'admin'
                ? 'bg-neutral-800 text-white shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
            title="Console Admin Sécurisée"
          >
            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
            <span className="text-[11px]">HQ</span>
          </button>
        )}
      </div>
    </div>
  );
};
