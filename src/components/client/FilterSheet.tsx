import React from 'react';
import { useApp } from '../../context/AppContext';
import { SortOption } from '../../types';
import { SlidersHorizontal, X, Check, MapPin, Star, Zap, DollarSign } from 'lucide-react';

export const FilterSheet: React.FC = () => {
  const {
    isFilterModalOpen,
    setIsFilterModalOpen,
    sortOption,
    setSortOption,
    selectedCategory,
    setSelectedCategory,
  } = useApp();

  if (!isFilterModalOpen) return null;

  const sortOptions: { id: SortOption; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'distance',
      label: 'Distance la plus proche',
      icon: <MapPin className="w-4 h-4 text-[#0B7A4B]" />,
      desc: 'Trié par kilométrage direct depuis votre quartier',
    },
    {
      id: 'rating',
      label: 'Meilleure note client',
      icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500" />,
      desc: 'Les partenaires les mieux notés de Conakry',
    },
    {
      id: 'speed',
      label: 'Livraison la plus rapide',
      icon: <Zap className="w-4 h-4 text-[#0B7A4B]" />,
      desc: 'Temps de préparation et trajet minimum',
    },
    {
      id: 'fee',
      label: 'Frais de livraison réduits',
      icon: <DollarSign className="w-4 h-4 text-emerald-500" />,
      desc: 'Frais minimaux en GNF',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0B2B1E]/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl overflow-hidden max-h-[85dvh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0B7A4B]" />
            <h3 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white">
              Trier & Filtrer les partenaires
            </h3>
          </div>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full text-[#2F4F42] hover:text-[#0B2B1E] hover:bg-emerald-50 dark:text-emerald-200/70 dark:hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
              Ordre de tri
            </label>
            <div className="space-y-1.5">
              {sortOptions.map((opt) => {
                const isSelected = sortOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortOption(opt.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer min-h-[48px] ${
                      isSelected
                        ? 'border-[#0B7A4B] bg-emerald-50/60 dark:bg-emerald-950/30 text-[#0B7A4B] dark:text-emerald-400 font-bold'
                        : 'border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50/50 dark:hover:bg-[#13291F]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0">{opt.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs">{opt.label}</div>
                        <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/60">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#0B7A4B] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913]">
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="w-full min-h-[46px] py-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>
  );
};
