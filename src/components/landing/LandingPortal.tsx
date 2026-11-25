import React from 'react';
import { useApp } from '../../context/AppContext';
import { WelcomeView } from './WelcomeView';
import {
  ShoppingBag,
  Bike,
  Store,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  Phone,
} from 'lucide-react';

export const LandingPortal: React.FC = () => {
  const { setSpace, setShowLandingPortal, setIsAuthModalOpen, setIsPrivacyModalOpen } = useApp();

  const enter = (space: 'client' | 'partner' | 'courier') => {
    const paths = { client: '/client', courier: '/livreur', partner: '/partenaire' };
    window.history.pushState({}, '', paths[space]);
    setSpace(space);
    setShowLandingPortal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-body antialiased">
      {/* Top Editorial Navigation */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <a
            href="#top"
            className="flex items-center gap-2 shrink-0 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/images/soneya-icon.png"
              alt="Soneya Icon"
              className="w-10 h-10 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-headline font-black text-xl text-[#1E3A8A] leading-tight">Soneya</span>
              <span className="text-[10px] text-[#64748B] font-semibold">Conakry · Guinée</span>
            </div>
          </a>

          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-6 text-xs font-bold">
            <a href="#welcome" className="text-[#0F172A] hover:text-[#1E3A8A] transition-colors">
              Accueil
            </a>
            <a href="#espaces" className="text-[#64748B] hover:text-[#1E3A8A] transition-colors">
              Les 3 Espaces
            </a>
            <a href="#services" className="text-[#64748B] hover:text-[#1E3A8A] transition-colors">
              Services
            </a>
            <a href="#paiement" className="text-[#64748B] hover:text-[#1E3A8A] transition-colors">
              Orange Money &amp; MoMo
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:inline-flex items-center text-xs font-bold text-[#0F172A] hover:text-[#1E3A8A] transition-colors cursor-pointer px-3 py-1.5"
            >
              Connexion (+224)
            </button>
            <button
              type="button"
              onClick={() => enter('client')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D8432F] text-white font-headline text-xs font-bold hover:bg-[#D8432F]/90 active:scale-95 transition shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Commander</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Clean Luminous Hero Section (No clunky floating plates or wobbling orbs) */}
        <section id="welcome" className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] py-8 sm:py-12 border-b border-[#E2E8F0]">
          <WelcomeView
            onSelectSpace={(sp) => enter(sp)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenConsent={() => setIsPrivacyModalOpen(true)}
          />
        </section>

        {/* 3-Role Public Ecosystem Section (Strictly Client, Livreur, Business — Admin is Private) */}
        <section id="espaces" className="bg-[#FFFFFF] border-b border-[#E2E8F0] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                Écosystème Soneya Conakry
              </span>
              <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
                Choisissez votre espace dédié
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                L'application publique s'organise autour de 3 profils indépendants. Choisissez le vôtre pour accéder à votre interface sur-mesure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* 1. Client Space */}
              <div
                onClick={() => enter('client')}
                className="h-full flex flex-col justify-between gap-5 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1E3A8A] hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#1E3A8A] transition-transform group-hover:scale-105">
                      <ShoppingBag className="w-6 h-6" />
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#64748B] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-headline text-lg font-bold text-[#0F172A]">
                    Espace Client
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Commandez plats guinéens authentiques, courses Prima Center, médicaments d'urgence et colis express avec remises en GNF, reçus téléchargeables et suivi GPS en direct.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    Commander à Conakry
                  </span>
                  <span className="text-[10px] text-[#64748B]">Kipé, Kaloum, Lambanyi...</span>
                </div>
              </div>

              {/* 2. Courier / Rider Space */}
              <div
                onClick={() => enter('courier')}
                className="h-full flex flex-col justify-between gap-5 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1E3A8A] hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#1E3A8A] transition-transform group-hover:scale-105">
                      <Bike className="w-6 h-6" />
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#64748B] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-headline text-lg font-bold text-[#0F172A]">
                    Espace Livreur / Rider
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Dépôt KYC certifié (carte grise, CNI, certificat de résidence), charte de sécurité signée sur écran, missions repas et Colis Express, validation par code secret à 4 chiffres et gains GNF.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    Rejoindre la flotte
                  </span>
                  <span className="text-[10px] text-[#64748B]">KYC officiel +224</span>
                </div>
              </div>

              {/* 3. Business / Partner Space */}
              <div
                onClick={() => enter('partner')}
                className="h-full flex flex-col justify-between gap-5 p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1E3A8A] hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#1E3A8A] transition-transform group-hover:scale-105">
                      <Store className="w-6 h-6" />
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#64748B] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-headline text-lg font-bold text-[#0F172A]">
                    Espace Business
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Tableau de bord commerçant, consultation des commandes en direct, sélection du Plat du Jour ⭐, inventaire des ventes par jour, semaine, mois et année, finances et export comptable.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    Ouvrir mon espace pro
                  </span>
                  <span className="text-[10px] text-[#64748B]">Pilotage &amp; Plats du jour</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Money Payment Section */}
        <section id="paiement" className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                Règlement instantané en Francs Guinéens
              </span>
              <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
                Orange Money &amp; MTN MoMo en toute fluidité.
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Validez votre panier en toute sérénité. Recevez instantanément votre reçu numérique certifié avec numéro de suivi #SNY et montant exact en GNF, sans espèces ni monnaie à rendre.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="px-5 py-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-center min-w-[140px]">
                <span className="font-headline text-base text-orange-600 block font-bold">Orange Money</span>
                <span className="font-mono text-xs text-[#64748B]">Code #144#</span>
              </div>
              <div className="px-5 py-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-center min-w-[140px]">
                <span className="font-headline text-base text-yellow-600 block font-bold">MTN MoMo</span>
                <span className="font-mono text-xs text-[#64748B]">Code *440#</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Strictly public: No admin links or padlocks) */}
      <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#64748B]">
            © 2026 Soneya Delivery Conakry. Développé par Guinée Hub Technologie (GHT).
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B]">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-[#1E3A8A] cursor-pointer"
            >
              Politique de confidentialité (Loi L/2016/037/AN)
            </button>
            <span>·</span>
            <span>Support : +224 622 00 00 00</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
