import React, { useState } from 'react';
import { MOCK_STORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, ChevronRight } from 'lucide-react';

export const StoriesRow: React.FC = () => {
  const { setSelectedPartnerId } = useApp();
  const [selectedStory, setSelectedStory] = useState<typeof MOCK_STORIES[0] | null>(null);

  const handleOpenPartner = (partnerId?: string) => {
    if (partnerId) {
      setSelectedPartnerId(partnerId);
      setSelectedStory(null);
    }
  };

  return (
    <>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {MOCK_STORIES.map((story) => (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="w-16 h-16 rounded-2xl p-0.5 border-2 border-[#0B7A4B] dark:border-[#FFB81F] group-hover:scale-105 transition-transform shadow-xs">
                <div className="w-full h-full rounded-[12px] overflow-hidden bg-white dark:bg-[#10231B]">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#0B2B1E] dark:text-emerald-100 max-w-[68px] truncate text-center">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B1E]/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-[#0B2B1E] text-white shadow-2xl flex flex-col h-[min(520px,85dvh)] my-auto">
            {/* Story Image */}
            <img
              src={selectedStory.image}
              alt={selectedStory.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {selectedStory.badge}
                </span>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                aria-label="Fermer"
                className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-5 left-5 right-5 space-y-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                {selectedStory.tag}
              </span>
              <h3 className="font-heading font-black text-2xl leading-tight">
                {selectedStory.title}
              </h3>
              <p className="text-xs text-white/85">
                Spécialement préparé pour les gourmands de Conakry chez {selectedStory.partnerName}.
              </p>
              <button
                onClick={() => handleOpenPartner(selectedStory.partnerId)}
                className="w-full min-h-[44px] py-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <span>Commander chez {selectedStory.partnerName}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
