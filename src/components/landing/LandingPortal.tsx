import React from 'react';
import { useApp } from '../../context/AppContext';

export const LandingPortal: React.FC = () => {
  const { setSpace, setShowLandingPortal, setIsAuthModalOpen } = useApp();

  const enter = (space: 'client' | 'partner' | 'courier') => {
    const paths = { client: '/client', courier: '/livreur', partner: '/partenaire' };
    window.history.pushState({}, '', paths[space]);
    setSpace(space);
    setShowLandingPortal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-surface dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface font-body antialiased selection:bg-light-primary/20 selection:text-light-primary">
      {/* Top Editorial Navigation */}
      <header className="sticky top-0 z-30 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline">
        <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-gutter-md flex items-center justify-between gap-gutter-md">
          <a
            href="#top"
            className="flex items-center gap-gutter-sm shrink-0 group cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary shadow-xs transition-transform duration-state-change group-hover:scale-105">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">two_wheeler</span>
            </span>
            <div className="flex flex-col">
              <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface whitespace-nowrap font-bold">Soneya</span>
              <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant whitespace-nowrap">Conakry · Guinée</span>
            </div>
          </a>

          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-gutter-lg">
            <a
              href="#espaces"
              className="font-label text-label-lg text-light-on-surface dark:text-dark-on-surface hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-state-change"
            >
              Espaces
            </a>
            <a
              href="#services"
              className="font-label text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-state-change"
            >
              Services
            </a>
            <a
              href="#paiement"
              className="font-label text-label-lg text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-state-change"
            >
              Mobile Money
            </a>
          </nav>

          <div className="flex items-center gap-gutter-md shrink-0">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:inline-flex items-center font-label text-label-md text-light-on-surface dark:text-dark-on-surface hover:text-light-primary transition-colors duration-state-change cursor-pointer px-2 py-1"
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => enter('client')}
              className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-2.5 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md transition-all duration-state-change ease-state-change hover:opacity-90 active:scale-95 whitespace-nowrap shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">shopping_bag</span>
              <span>Commander</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Split Section */}
        <section className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-gutter-xl md:py-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center">
            <div className="lg:col-span-6 flex flex-col gap-gutter-lg">
              <div className="inline-flex items-center gap-gutter-xs self-start px-gutter-md py-1.5 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-on-primary-container dark:text-dark-on-primary-container border border-light-outline/50">
                <span className="material-symbols-outlined text-label-md text-accent" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                  verified
                </span>
                <span className="font-label text-label-md font-semibold">Plateforme n°1 à Conakry · GNF</span>
              </div>

              <h1 className="font-display text-display-lg-mobile md:text-display-lg text-light-on-surface dark:text-dark-on-surface text-balance leading-tight">
                Tout Conakry livré avec précision et élégance.
              </h1>

              <p className="font-body text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant max-w-prose text-pretty">
                Restaurants guinéens, courses Prima Center, pharmacies de garde et colis express de Kaloum à Lambanyi. Réglez instantanément via Orange Money, MTN MoMo ou à la livraison en GNF.
              </p>

              <div className="flex flex-wrap items-center gap-gutter-md">
                <button
                  type="button"
                  onClick={() => enter('client')}
                  className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-lg transition-all duration-state-change ease-state-change hover:opacity-90 active:scale-95 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">shopping_bag</span>
                  <span>Commander maintenant</span>
                </button>

                <button
                  type="button"
                  onClick={() => enter('partner')}
                  className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-on-primary-container dark:text-dark-on-primary-container border border-light-outline dark:border-dark-outline font-label text-label-lg transition-all duration-state-change ease-state-change hover:bg-light-surface-variant active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-title-md text-partner" aria-hidden="true">storefront</span>
                  <span>Devenir partenaire</span>
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
                <img
                  src="https://lh3.googleusercontent.com/aida/ALJJyrDOVbyCG7iDk1IqvVsS3i9m3bqn_yDySv4ygE4Mo59SXzlDAQpJv_kquFGVRLcdpgs51hz7PdjG6t_2FS44qtBZQ9GRAscCnB0AC9XRcptw9UB4jijVXD_FtOn3n0yHcUzqeOeNFzla-4169GT5FD7wsqef3RfIjjFeuN7_Fbt3ysP5UgrVyL_rG0sALBcukd4SY3nKwn6DiesytRju-ZF6u6ENcATvEXWeqWntTnUc77gni6-34Kc4yDoCpFJLKg"
                  alt="Plats gastronomiques guinéens prêts pour la livraison Soneya à Conakry"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="p-gutter-lg bg-light-surface-container-low dark:bg-dark-surface-container-low flex items-center justify-between gap-gutter-md">
                  <div className="flex items-center gap-gutter-md">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary shrink-0">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">payments</span>
                    </span>
                    <div>
                      <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">Orange Money &amp; MoMo</p>
                      <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                        Code <span className="font-mono text-mono-sm text-light-primary dark:text-dark-primary font-bold">SONEYA20</span> · -20%
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-mono-md tabular-nums text-light-primary dark:text-dark-primary shrink-0 font-bold">
                    GNF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Role Public Ecosystem Switcher (Admin is strictly internal & invisible) */}
        <section id="espaces" className="bg-light-surface-container dark:bg-dark-surface-container border-y border-light-outline dark:border-dark-outline py-section">
          <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg flex flex-col gap-gutter-xl">
            <div className="flex flex-col gap-gutter-xs">
              <h2 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
                Choisissez votre espace Soneya
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                L'application publique s'organise autour de 3 profils dédiés. Sélectionnez le vôtre pour accéder à votre interface sur-mesure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg items-stretch">
              {/* 1. Client Space */}
              <div
                onClick={() => enter('client')}
                className="h-full flex flex-col justify-between gap-gutter-md p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline transition-all duration-state-change ease-state-change hover:border-light-primary dark:hover:border-dark-primary hover:shadow-md cursor-pointer group"
              >
                <div className="flex flex-col gap-gutter-md">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary transition-transform duration-state-change group-hover:scale-105">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">shopping_bag</span>
                    </span>
                    <span className="material-symbols-outlined text-title-lg text-light-on-surface-variant group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      arrow_forward
                    </span>
                  </div>
                  <h3 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-semibold">
                    Espace Client
                  </h3>
                  <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Commandez plats guinéens, courses et pharmacie avec remises en GNF, reçus téléchargeables et suivi GPS en direct.
                  </p>
                </div>
                <div className="pt-gutter-sm border-t border-light-outline/50 flex items-center justify-between">
                  <span className="font-label text-label-md text-light-primary dark:text-dark-primary font-semibold">
                    Commander à Conakry
                  </span>
                  <span className="text-xs text-light-on-surface-variant">Kipé, Kaloum...</span>
                </div>
              </div>

              {/* 2. Courier / Rider Space */}
              <div
                onClick={() => enter('courier')}
                className="h-full flex flex-col justify-between gap-gutter-md p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline transition-all duration-state-change ease-state-change hover:border-courier hover:shadow-md cursor-pointer group"
              >
                <div className="flex flex-col gap-gutter-md">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-blue-50 dark:bg-blue-950/40 text-courier transition-transform duration-state-change group-hover:scale-105">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">two_wheeler</span>
                    </span>
                    <span className="material-symbols-outlined text-title-lg text-light-on-surface-variant group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      arrow_forward
                    </span>
                  </div>
                  <h3 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-semibold">
                    Espace Livreur / Rider
                  </h3>
                  <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Dépôt KYC officiel (carte grise, CNI, certificat de résidence), charte signée, missions géolocalisées et gains GNF hebdomadaires.
                  </p>
                </div>
                <div className="pt-gutter-sm border-t border-light-outline/50 flex items-center justify-between">
                  <span className="font-label text-label-md text-courier font-semibold">
                    Rejoindre la flotte
                  </span>
                  <span className="text-xs text-light-on-surface-variant">KYC +224 validé</span>
                </div>
              </div>

              {/* 3. Business / Partner Space */}
              <div
                onClick={() => enter('partner')}
                className="h-full flex flex-col justify-between gap-gutter-md p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline transition-all duration-state-change ease-state-change hover:border-partner hover:shadow-md cursor-pointer group"
              >
                <div className="flex flex-col gap-gutter-md">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-amber-50 dark:bg-amber-950/40 text-partner transition-transform duration-state-change group-hover:scale-105">
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">storefront</span>
                    </span>
                    <span className="material-symbols-outlined text-title-lg text-light-on-surface-variant group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      arrow_forward
                    </span>
                  </div>
                  <h3 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-semibold">
                    Espace Business
                  </h3>
                  <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    Barre latérale dédiée, inventaire des ventes par jour, semaine, mois et année, commandes en direct, photos et codes promo.
                  </p>
                </div>
                <div className="pt-gutter-sm border-t border-light-outline/50 flex items-center justify-between">
                  <span className="font-label text-label-md text-partner font-semibold">
                    Ouvrir mon espace pro
                  </span>
                  <span className="text-xs text-light-on-surface-variant">Pilotage & inventaire</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Soneya Visual Identity Showcase */}
        <section id="services" className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-section flex flex-col gap-gutter-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter-md">
            <div className="flex flex-col gap-gutter-xs">
              <h2 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface">
                L'excellence locale au quotidien
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Des tables guinéennes aux pharmacies de garde, chaque partenaire est sélectionné avec rigueur.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-lg">
            <article className="rounded-lg overflow-hidden bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs hover:shadow-md transition-shadow">
              <img
                src="https://lh3.googleusercontent.com/aida/ALJJyrDnokUuTLr-3l9vcS9ozchfhDN6Gj60eXrukGqR5Z-mzNSA3zDJTByndiDA7Q5ybD-i0wVlO-C4KMgwyD2LeZ9ETsDBfdBVGKKBImsgY2iV307XeXfk5CKow6YE1e8lP9f_TL2rlDWJUrTKucnFtqvrbv74fofuwi8qZF0G4_WShgtoHWlNnjuI2gmDWrlNhXOs1Mqp9pQc_101o2dWHw4HKsuoBx2EUIgy3Achl8tJmasKg8vdEcJF"
                alt="Restaurants guinéens"
                className="w-full h-48 object-cover"
              />
              <div className="p-gutter-md">
                <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">Gastronomie</h3>
                <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Maffé Tiga, Riz Gras &amp; Grillades</p>
              </div>
            </article>

            <article className="rounded-lg overflow-hidden bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs hover:shadow-md transition-shadow">
              <img
                src="https://lh3.googleusercontent.com/aida/ALJJyrBhaCNh70uK0jc5u-kBXh9XIB0WRHuiRvTLb5rUPUncyNKFZ-pjQnT46aFY3S2S-f3OfErBNhre8KjMDYFCYa-hhYp4G73OjRlaqm81gUmvewYLjmDZQbmlhbk3wfvmQQORfuX_j3ygS_fRXo6nSEPfMAmR34_5Qnr0xL_qRTJO_bONI_Kc4Z1idqNkRu6EBoIw0Ob_clI9oY6vD_fcCfp7XrgKdaEy2wR0R0CAAL4WcOtvmfoQMKKnBr3Y-w"
                alt="Courses et supermarchés"
                className="w-full h-48 object-cover"
              />
              <div className="p-gutter-md">
                <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">Courses fraîches</h3>
                <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Prima Center &amp; supermarchés</p>
              </div>
            </article>

            <article className="rounded-lg overflow-hidden bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs hover:shadow-md transition-shadow">
              <img
                src="https://lh3.googleusercontent.com/aida/ALJJyrBFyhXQ7v5iIkmiNDuukstEd_SYcsyu4vE7P6dFoAXJ2MhHC6LtSi5cxwOvibTgF1anB_wjl82Zt-3z2xXkjRbKC3yOe0Nkl65axVjSd7a42qYok9a0NRVWpNBTAFO_Qq_rruef3ZJuOm_ld_cbWPKjulS2wrnNIRiOHmph9JXhpF7yp2L9fTB8log1VVg7L8aEEf8LTalW3MQOq9Lf5I7lzLrDLgG6dqseLCqtngYv9_gKI-LFVd4WqgM"
                alt="Pharmacies de garde"
                className="w-full h-48 object-cover"
              />
              <div className="p-gutter-md">
                <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">Santé 24h/24</h3>
                <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Pharmacies de garde à Conakry</p>
              </div>
            </article>

            <article className="rounded-lg overflow-hidden bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs hover:shadow-md transition-shadow">
              <img
                src="https://lh3.googleusercontent.com/aida/ALJJyrBugztqVmO4Fz5qSws9vIZ8GVKtXjhxOCsPIFPM8T0nm2nIKDkl0j1k86SE-kQhzcJC7eDcp_iIyoheky0QC20s3gSZcnFmSAspTvZRIo46vQcWJJf35PZodbMLOS6siFCeW8bSith4PQHPGHDovNIyI-lp-spdZElxpSpgeBspTxlKuJ9l2VFZqzGqkzKo1K5mjffFltmCWdlJUGbgQeNBj4E19-Wzkm728e_TG7xTKEQipjulLotS7H1DmAg"
                alt="Livraison express moto"
                className="w-full h-48 object-cover"
              />
              <div className="p-gutter-md">
                <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">Riders certifiés</h3>
                <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Dossier KYC vérifié &amp; suivi GPS</p>
              </div>
            </article>
          </div>
        </section>

        {/* Mobile Money Payment Section */}
        <section id="paiement" className="bg-light-primary-container dark:bg-dark-primary-container border-t border-light-outline dark:border-dark-outline py-gutter-xl">
          <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg flex flex-col md:flex-row items-center justify-between gap-gutter-xl">
            <div className="flex flex-col gap-gutter-sm max-w-xl">
              <span className="font-label text-label-sm text-light-primary dark:text-dark-primary font-bold uppercase tracking-wider">
                Règlement instantané en Francs Guinéens
              </span>
              <h2 className="font-headline text-headline-lg text-light-on-primary-container dark:text-dark-on-primary-container">
                Orange Money &amp; MTN MoMo sans friction.
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Validez votre panier en toute sérénité. Recevez instantanément votre reçu numérique détaillé avec numéro de suivi #SNY et montant exact en GNF.
              </p>
            </div>
            <div className="flex items-center gap-gutter-md shrink-0">
              <div className="px-5 py-3 rounded-lg bg-white dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline shadow-xs text-center">
                <span className="font-headline text-headline-md text-orange-600 block font-bold">Orange Money</span>
                <span className="font-mono text-mono-sm text-light-on-surface-variant">USSD *144#</span>
              </div>
              <div className="px-5 py-3 rounded-lg bg-white dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline shadow-xs text-center">
                <span className="font-headline text-headline-md text-yellow-600 block font-bold">MTN MoMo</span>
                <span className="font-mono text-mono-sm text-light-on-surface-variant">USSD *223#</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Discreet Internal Admin Lock */}
      <footer className="bg-light-surface-container-low dark:bg-dark-surface-container-low border-t border-light-outline dark:border-dark-outline py-gutter-lg">
        <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg flex flex-col sm:flex-row items-center justify-between gap-gutter-md">
          <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
            © 2026 Soneya Delivery Conakry. Développé par Guinée Hub Technologie (GHT).
          </p>
          <div className="flex items-center gap-gutter-lg">
            <span className="font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Support : +224 622 00 00 00
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
