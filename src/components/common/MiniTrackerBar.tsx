import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bike, ChevronRight } from 'lucide-react';

export const MiniTrackerBar: React.FC = () => {
  const { space, activeOrder, activeTab, setActiveTab, setSelectedPartnerId } = useApp();

  // Only show in Client space if there is an active ongoing order and user is not currently on the tracking tab
  if (space !== 'client' || !activeOrder || activeOrder.status === 'delivered') {
    return null;
  }

  // If already looking at orders/tracking tab, don't show the duplicate mini-bar
  if (activeTab === 'orders') {
    return null;
  }

  const handleOpenTracking = () => {
    setSelectedPartnerId(null);
    setActiveTab('orders');
  };

  const statusLabels: Record<string, string> = {
    submitted: 'Commande transmise',
    preparing: 'En cuisine',
    ready: 'Prise en charge',
    delivering: 'En livraison sur l Axe',
    delivered: 'Livrée',
    cancelled: 'Annulée / Refusée',
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-3 right-3 z-30 max-w-lg mx-auto animate-in slide-in-from-bottom duration-300">
      <button
        onClick={handleOpenTracking}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#0B1E15] text-[#0B2B1E] dark:text-white shadow-lg border border-[#E2ECE7] dark:border-emerald-800 hover:border-[#0B7A4B] hover:scale-[1.01] transition active:scale-[0.99] group text-left cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center shrink-0 border border-[#D4E9DD] dark:border-emerald-800">
            <Bike className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#0B7A4B] ring-2 ring-white dark:ring-[#0B1E15]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B7A4B] dark:text-[#FFB81F]">
                {statusLabels[activeOrder.status]}
              </span>
              <span className="text-[10px] text-[#2F4F42] dark:text-emerald-300">· ~{activeOrder.estimatedDeliveryMinutes} min</span>
            </div>
            <div className="font-heading font-extrabold text-xs text-[#0B2B1E] dark:text-white truncate">
              {activeOrder.partnerName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pl-2 text-xs font-semibold text-[#0B7A4B] dark:text-[#FFB81F] shrink-0">
          <span className="hidden sm:inline">Suivre</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
        </div>
      </button>
    </div>
  );
};
