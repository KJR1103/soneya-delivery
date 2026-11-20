import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, Bike, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toast, dismissToast, setActiveTab } = useApp();

  if (!toast) return null;

  const isStatus = toast.type === 'status';

  return (
    <div className="fixed top-3 left-3 right-3 z-50 max-w-sm mx-auto animate-in slide-in-from-top duration-300">
      <div
        onClick={() => {
          if (isStatus) {
            setActiveTab('orders');
          }
          dismissToast();
        }}
        className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0B2B1E] text-white shadow-xl border border-[#0B7A4B]/60 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-xl bg-[#0B7A4B] text-white flex items-center justify-center shrink-0">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : toast.type === 'status' ? (
            <Bike className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-heading font-extrabold text-xs text-white flex items-center gap-1.5">
            <span className="truncate">{toast.title}</span>
            {isStatus && (
              <span className="text-[10px] bg-[#FFB81F] text-[#0B2B1E] font-black px-1.5 py-0.2 rounded-md shrink-0">
                LIVE
              </span>
            )}
          </div>
          {toast.message && (
            <div className="text-[11px] text-emerald-100/90 truncate mt-0.5">
              {toast.message}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissToast();
          }}
          className="p-1 rounded-full text-emerald-200 hover:text-white shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
