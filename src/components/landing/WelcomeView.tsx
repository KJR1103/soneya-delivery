import React from 'react';
import { ShoppingBag, Bike, Store, ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomeViewProps {
  onSelectSpace: (space: 'client' | 'courier' | 'partner') => void;
  onOpenAuth: () => void;
  onOpenConsent: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onSelectSpace,
  onOpenAuth,
  onOpenConsent,
}) => {
  return (
    <main className="welcome" aria-label="Bienvenue sur Soneya Delivery Conakry">
      {/* Official Soneya Icon Badge with Map Pin & Red Highlight */}
      <div className="brand-badge" role="img" aria-label="Soneya Delivery Conakry">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24 4C15.163 4 8 11.163 8 20C8 30.8 22.4 43.2 23.016 43.725C23.3 43.968 23.65 44.095 24 44.095C24.35 44.095 24.7 43.968 24.984 43.725C25.6 43.2 40 30.8 40 20C40 11.163 32.837 4 24 4Z"
            fill="white"
          />
          <circle cx="24" cy="20" r="10.5" fill="#1E3A8A" />
          <text
            x="24"
            y="24.5"
            textAnchor="middle"
            fill="white"
            fontSize="13"
            fontFamily="Manrope, sans-serif"
            fontWeight="800"
          >
            S
          </text>
          <circle cx="24" cy="41" r="2.2" fill="#D8432F" />
        </svg>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] text-xs font-bold mb-1">
        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
        <span>Conakry · Service en direct</span>
      </div>

      <h1>Bienvenue sur Soneya</h1>

      <p className="subtitle">
        Repas gourmands, courses du quotidien, pharmacie et livraison de colis express.
        Tout Conakry livré avec élégance.
      </p>

      {/* Three Spaces Cards */}
      <div className="spaces-grid">
        <button
          type="button"
          onClick={() => onSelectSpace('client')}
          className="space-card group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5 text-[#1E3A8A]" />
          </div>
          <span className="text-xs font-bold text-[#0F172A] font-headline">Client</span>
          <span className="text-[10px] text-[#64748B]">Commander</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSpace('courier')}
          className="space-card group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bike className="w-5 h-5 text-[#1E3A8A]" />
          </div>
          <span className="text-xs font-bold text-[#0F172A] font-headline">Livreur</span>
          <span className="text-[10px] text-[#64748B]">Missions</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSpace('partner')}
          className="space-card group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Store className="w-5 h-5 text-[#1E3A8A]" />
          </div>
          <span className="text-xs font-bold text-[#0F172A] font-headline">Commerce</span>
          <span className="text-[10px] text-[#64748B]">Partenaire</span>
        </button>
      </div>

      {/* Main Bottom CTAs */}
      <div className="cta-group">
        <button
          type="button"
          className="btn-primary"
          onClick={onOpenAuth}
        >
          <span>Se connecter / S'inscrire (+224)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onSelectSpace('client')}
        >
          <span>Découvrir le catalogue</span>
        </button>
      </div>
    </main>
  );
};
