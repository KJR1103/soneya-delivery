import React from 'react';
import { useApp } from '../../context/AppContext';

export const LandingPortal: React.FC = () => {
  const {
    setSpace,
    setShowLandingPortal,
    setIsAuthModalOpen,
    login,
  } = useApp();

  const handleEnterSpace = (targetSpace: 'client' | 'partner' | 'courier' | 'admin') => {
    setShowLandingPortal(false);
    setSpace(targetSpace);
  };

  const handleQuickDemoLogin = (role: 'client' | 'partner' | 'courier' | 'admin') => {
    if (role === 'client') {
      login('622 78 90 12', 'Amadou Diallo', 'client');
    } else if (role === 'partner') {
      login('620 10 20 30', 'Chez Fanta (Commerçant)', 'partner', 'chez-fanta');
    } else if (role === 'courier') {
      login('622 45 89 12', 'Mamadou Sow (Motard)', 'courier', undefined, 'c-1');
    } else if (role === 'admin') {
      login('622 00 00 00', 'René Kaba Tolno (GHT Fondateur)', 'admin');
    }
    setShowLandingPortal(false);
  };

  return (
    <div className="min-h-screen bg-light-surface dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface flex flex-col font-body antialiased overflow-x-hidden">
      {/* Top Editorial Navigation */}
      <header className="sticky top-0 z-30 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline">
        <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-gutter-md flex items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-sm shrink-0">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">two_wheeler</span>
            </span>
            <div className="flex flex-col">
              <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface whitespace-nowrap">Soneya</span>
              <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant whitespace-nowrap">Conakry</span>
            </div>
          </div>

          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-gutter-lg">
            <button onClick={() => document.getElementById('espaces')?.scrollIntoView({ behavior: 'smooth' })} className="font-label text-label-lg text-light-on-surface dark:text-dark-on-surface hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-state-change">
              Espaces
            </button>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="font-label text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-state-change">
              Services
            </button>
            <button onClick={() => document.getElementById('paiement')?.scrollIntoView({ behavior: 'smooth' })} className="font-label text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-state-change">
              Mobile Money
            </button>
          </nav>

          <div className="flex items-center gap-gutter-md shrink-0">
            <button onClick={() => setIsAuthModalOpen(true)} className="hidden sm:inline-flex items-center font-label text-label-md text-light-on-surface dark:text-dark-on-surface hover:text-light-primary transition-colors duration-state-change">
              Connexion
            </button>
            <button onClick={() => handleEnterSpace('client')} type="button" className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-2.5 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md transition-colors duration-state-change ease-state-change hover:opacity-90 whitespace-nowrap">
              Commander
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Split Section */}
        <section className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-gutter-xl md:py-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center">
            <div className="lg:col-span-6 flex flex-col gap-gutter-lg">
              <div className="inline-flex items-center gap-gutter-xs self-start px-gutter-md py-1.5 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-on-primary-container dark:text-dark-on-primary-container">
                <span className="material-symbols-outlined text-label-md text-accent" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">verified</span>
                <span className="font-label text-label-md">Plateforme n°1 à Conakry · GNF</span>
              </div>

              <h1 className="font-display text-display-lg-mobile md:text-display-lg text-light-on-surface dark:text-dark-on-surface text-balance leading-tight">
                Tout Conakry livré avec précision et élégance.
              </h1>

              <p className="font-body text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant max-w-prose text-pretty">
                Restaurants guinéens, courses Prima Center, pharmacies de garde et colis express de Kaloum à Lambanyi. Réglez instantanément via Orange Money, MTN MoMo ou à la livraison.
              </p>

              <div className="flex flex-wrap items-center gap-gutter-md">
                <button onClick={() => handleEnterSpace('client')} type="button" className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-lg transition-colors duration-state-change ease-state-change hover:opacity-90">
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">shopping_bag</span>
                  Commander maintenant
                </button>

                <button onClick={() => handleEnterSpace('partner')} type="button" className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-on-primary-container dark:text-dark-on-primary-container border border-light-outline dark:border-dark-outline font-label text-label-lg transition-colors duration-state-change ease-state-change hover:bg-light-surface-variant">
                  Devenir partenaire
                </button>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-gutter-md pt-gutter-md border-t border-light-outline dark:border-dark-outline">
                <div className="flex flex-col gap-gutter-xs">
                  <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums">25 min</span>
                  <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Livraison moyenne</span>
                </div>
                <div className="flex flex-col gap-gutter-xs">
                  <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums">120+</span>
                  <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Enseignes vérifiées</span>
                </div>
                <div className="flex flex-col gap-gutter-xs">
                  <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums">5 zones</span>
                  <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Kaloum à Ratoma</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-xl overflow-hidden border border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface-container-low shadow-sm">
                <img src="/assets/aistudio/3c2f1a0b9066ca7b77fce6116e13e1bc__1__6a6dc086.jpg" alt="Plats gastronomiques guinéens prêts pour la livraison Soneya à Conakry" className="w-full h-80 md:h-96 object-cover" />
                <div className="p-gutter-lg bg-light-surface-container-low dark:bg-dark-surface-container-low flex items-center justify-between gap-gutter-md">
                  <div className="flex items-center gap-gutter-md">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary shrink-0">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">payments</span>
                    </span>
                    <div>
                      <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">Orange Money & MoMo</p>
                      <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Code <span className="font-mono text-mono-sm text-light-primary dark:text-dark-primary">SONEYA20</span> · -20%</p>
                    </div>
                  </div>
                  <span className="font-mono text-mono-md tabular-nums text-light-primary dark:text-dark-primary shrink-0">GNF</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Role Public Ecosystem Switcher */}
        <section id="espaces" className="bg-light-surface-container dark:bg-dark-surface-container border-y border-light-outline dark:border-dark-outline py-section">
          <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg flex flex-col gap-gutter-xl">
            <div className="flex flex-col gap-gutter-xs">
              <h2 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">Choisissez votre espace Soneya</h2>
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">Sélectionnez votre profil pour créer votre compte et accéder à votre interface dédiée.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg items-stretch">
              {/* Client Space */}
              <button onClick={() => handleEnterSpace('client')} className="h-full flex flex-col justify-between gap-gutter-md p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline transition-colors duration-state-change ease-state-change hover:border-light-primary dark:hover:border-dark-primary text-left">
                <div className="flex flex-col gap-gutter-md">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">shopping_bag</span>
                    </span>
                    <span className="material-symbols-outlined text-title-lg text-light-on-surface-variant" aria-hidden="true">arrow_forward</span>
                  </div>
                  <h3 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface">Espace Client</h3>
                  <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">Commandez plats, courses et pharmacie avec remises, reçus PDF et suivi GPS.</p>
                </div>
                <span className="font-label text-label-md text-light-primary dark:text-dark-primary">Créer un compte client</span>
              </button>

              {/* Courier / Rider Space */}
              <button onClick={() => handleEnterSpace('courier')} className="h-full flex flex-col justify-between gap-gutter-md p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline transition-colors duration-state-change ease-state-change hover:border-courier text-left">
                <div className="flex flex-col gap-gutter-md">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-light-surface-container dark:bg-dark-surface-container text-courier">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">two_wheeler</span>
                    </span>
                    <span className="material-symbols-outlined text-title-lg text-light-on-surface-variant" aria-hidden="true">arrow_forward</span>
                  </div>
                  <h3 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface">Espace Livreur / Rider</h3>
                  <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">Recevez des courses géolocalisées à Conakry et suivez vos gains en GNF.</p>
                </div>
                <span className="font-label text-label-md text-courier">Rejoindre la flotte</span>
              </button>

              {/* Business / Partner Space */}
              <button onClick={() => handleEnterSpace('partner')} className="h-full flex flex-col justify-between gap-gutter-md p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline transition-colors duration-state-change ease-state-change hover:border-partner text-left">
                <div className="flex flex-col gap-gutter-md">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-light-surface-container dark:bg-dark-surface-container text-partner">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">storefront</span>
                    </span>
                    <span className="material-symbols-outlined text-title-lg text-light-on-surface-variant" aria-hidden="true">arrow_forward</span>
                  </div>
                  <h3 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface">Espace Business</h3>
                  <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">Tableau de bord complet, inventaire des ventes par jour, semaine, mois et année.</p>
                </div>
                <span className="font-label text-label-md text-partner">Ouvrir mon espace pro</span>
              </button>
            </div>

            {/* Admin access — discreet */}
            <div className="flex justify-center pt-gutter-md">
              <button onClick={() => handleEnterSpace('admin')} className="inline-flex items-center gap-gutter-xs px-gutter-md py-2 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary transition-colors duration-state-change">
                <span className="material-symbols-outlined text-label-md" aria-hidden="true">shield</span>
                Console interne
              </button>
            </div>
          </div>
        </section>

        {/* Soneya Visual Identity Showcase */}
        <section id="services" className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-section flex flex-col gap-gutter-xl">
          <div className="flex flex-col gap-gutter-xs">
            <h2 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">L'excellence locale au quotidien</h2>
            <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">Des tables guinéennes aux pharmacies de garde, chaque partenaire est sélectionné avec soin.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-lg">
            <article className="rounded-lg overflow-hidden bg-light-surface-container-low border border-light-outline shadow-sm">
              <img src="/assets/aistudio/3c2f1a0b9066ca7b77fce6116e13e1bc__1__6a6dc086.jpg" alt="Restaurants guinéens" className="w-full h-48 object-cover" />
              <div className="p-gutter-md">
                <h3 className="font-title text-title-md text-light-on-surface">Gastronomie</h3>
                <p className="font-body text-body-sm text-light-on-surface-variant">Maffé Tiga, Riz Gras & Grillades</p>
              </div>
            </article>
            <article className="rounded-lg overflow-hidden bg-light-surface-container-low border border-light-outline shadow-sm">
              <img src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png" alt="Courses et supermarchés" className="w-full h-48 object-cover" />
              <div className="p-gutter-md">
                <h3 className="font-title text-title-md text-light-on-surface">Courses fraîches</h3>
                <p className="font-body text-body-sm text-light-on-surface-variant">Prima Center & marchés locaux</p>
              </div>
            </article>
            <article className="rounded-lg overflow-hidden bg-light-surface-container-low border border-light-outline shadow-sm">
              <img src="/assets/aistudio/3c2f1a0b9066ca7b77fce6116e13e1bc__1__6a6dc086.jpg" alt="Pharmacies de garde" className="w-full h-48 object-cover" />
              <div className="p-gutter-md">
                <h3 className="font-title text-title-md text-light-on-surface">Santé 24h/24</h3>
                <p className="font-body text-body-sm text-light-on-surface-variant">Pharmacies de garde à Conakry</p>
              </div>
            </article>
            <article className="rounded-lg overflow-hidden bg-light-surface-container-low border border-light-outline shadow-sm">
              <img src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png" alt="Livraison express moto" className="w-full h-48 object-cover" />
              <div className="p-gutter-md">
                <h3 className="font-title text-title-md text-light-on-surface">Riders certifiés</h3>
                <p className="font-body text-body-sm text-light-on-surface-variant">Dossier KYC vérifié & suivi GPS</p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="bg-light-surface-container-low dark:bg-dark-surface-container-low border-t border-light-outline dark:border-dark-outline py-gutter-lg">
        <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg flex flex-col sm:flex-row items-center justify-between gap-gutter-md">
          <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
            © 2026 Soneya Delivery Conakry. Tous droits réservés.
          </p>
          <div className="flex items-center gap-gutter-lg">
            <button className="font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary transition-colors">
              Confidentialité
            </button>
            <button className="font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary transition-colors">
              Support +224 622 00 00 00
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
