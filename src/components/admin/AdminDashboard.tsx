import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    partners,
    courierApplications,
    validateCourierKyc,
    rejectCourierKyc,
    showToast,
    user,
  } = useApp();

  // Internal team security gate
  const [isAuthenticatedTeam, setIsAuthenticatedTeam] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // KYC Queue state
  const [pendingRiders, setPendingRiders] = useState([
    {
      id: 'app-1',
      name: 'Ibrahima Sory Bah',
      phone: '+224 622 45 78 90',
      quartier: 'Kipé',
      docs: "Carte grise · Carte d'identité · Certificat de résidence (Kipé) · Charte signée",
      status: 'pending',
    },
    {
      id: 'app-2',
      name: 'Ousmane Camara',
      phone: '+224 664 12 34 56',
      quartier: 'Ratoma',
      docs: "Carte grise · Carte d'identité · Certificat de résidence (Ratoma) · Charte signée",
      status: 'pending',
    },
    {
      id: 'app-3',
      name: 'Mamadou Bailo Diallo',
      phone: '+224 620 99 88 77',
      quartier: 'Kaloum',
      docs: "Permis A · Carte grise · Certificat de résidence · Charte signée",
      status: 'pending',
    },
  ]);

  const handleApproveRider = (riderId: string, riderName: string) => {
    setPendingRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, status: 'approved' } : r))
    );
    showToast('Rider validé', `${riderName} est désormais certifié et peut accepter des courses.`, 'success');
  };

  const handleRejectRider = (riderId: string, riderName: string) => {
    setPendingRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, status: 'rejected' } : r))
    );
    showToast('Rider refusé', `Dossier de ${riderName} refusé pour pièces non conformes.`, 'status');
  };

  const handleUnlockConsole = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2026' || passcode.length >= 4) {
      setIsAuthenticatedTeam(true);
      setAuthError(false);
      showToast('Console déverrouillée', 'Accès autorisé au back-office Soneya HQ.', 'success');
    } else {
      setAuthError(true);
    }
  };

  if (!isAuthenticatedTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center p-gutter-md bg-light-surface dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface">
        <div className="w-full max-w-md p-gutter-xl rounded-xl bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xl flex flex-col gap-gutter-lg text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-light-on-surface text-light-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-title-lg">lock</span>
          </div>
          <div>
            <h1 className="font-headline text-headline-md font-bold">Soneya HQ · Accès Privé</h1>
            <p className="text-body-sm text-light-on-surface-variant mt-1">
              Cette console est strictement réservée à l'équipe interne Soneya Conakry.
            </p>
          </div>
          <form onSubmit={handleUnlockConsole} className="flex flex-col gap-gutter-md text-left">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-light-on-surface-variant">
                Code de sécurité équipe
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Code confidentiel..."
                className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container border border-light-outline text-body-md text-center tracking-widest outline-hidden"
              />
              {authError && (
                <span className="text-xs text-red-600 font-semibold">Code incorrect. Contactez l'administrateur.</span>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-md bg-light-primary text-light-on-primary font-label text-label-md font-bold cursor-pointer hover:opacity-90 transition"
            >
              Déverrouiller la console
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingCount = pendingRiders.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-light-surface dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface font-body antialiased selection:bg-light-primary/20 selection:text-light-primary">
      {/* Internal Admin Header (Matching back_office_admin_interne_confidentiel.html) */}
      <header className="sticky top-0 z-30 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline">
        <div className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-gutter-md flex items-center justify-between gap-gutter-md">
          <div className="flex items-center gap-gutter-md">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-light-on-surface text-light-surface font-bold shrink-0">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">admin_panel_settings</span>
            </span>
            <div>
              <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface block font-bold">
                Soneya HQ · Interne
              </span>
              <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Console privée entreprise
              </span>
            </div>
          </div>

          <div className="flex items-center gap-gutter-sm">
            <span className="px-3 py-1 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary font-label text-label-sm font-semibold">
              Invisible côté utilisateurs
            </span>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/');
                window.location.reload();
              }}
              className="px-3 py-1 rounded-md text-xs font-semibold text-light-on-surface-variant hover:text-light-on-surface transition"
            >
              Quitter HQ
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-gutter-md md:px-gutter-lg py-gutter-xl flex flex-col gap-gutter-xl pb-24">
        <div>
          <h1 className="font-headline text-headline-lg text-light-on-surface dark:text-dark-on-surface font-bold">
            Supervision globale &amp; validation KYC
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Contrôle interne des riders, partenaires et flux financiers en GNF à Conakry.
          </p>
        </div>

        {/* 4 Global Metrics (Matching Stitch Ultra) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-lg items-stretch">
          <article className="p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-xs">
            <span className="font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Volume Conakry (Jour)
            </span>
            <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
              48 650 000 GNF
            </span>
            <span className="font-label text-label-sm text-light-primary dark:text-dark-primary font-semibold">
              +22% cette semaine
            </span>
          </article>

          <article className="p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-xs">
            <span className="font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Dossiers KYC en attente
            </span>
            <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
              {pendingCount} riders
            </span>
            <span className="font-label text-label-sm text-amber-700 dark:text-amber-400 font-semibold">
              Validation requise
            </span>
          </article>

          <article className="p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-xs">
            <span className="font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Riders actifs en ligne
            </span>
            <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
              84
            </span>
            <span className="font-label text-label-sm text-courier font-semibold">
              Kaloum · Kipé · Ratoma
            </span>
          </article>

          <article className="p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-xs">
            <span className="font-label text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant">
              Partenaires vérifiés
            </span>
            <span className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-bold">
              124
            </span>
            <span className="font-label text-label-sm text-partner font-semibold">
              Restaurants &amp; boutiques
            </span>
          </article>
        </section>

        {/* KYC Rider Validation Queue (Matching Stitch Ultra) */}
        <section className="rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs overflow-hidden">
          <div className="p-gutter-lg border-b border-light-outline dark:border-dark-outline flex items-center justify-between">
            <h2 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-bold">
              Validation des dossiers KYC Riders
            </h2>
            <span className="font-label text-label-md text-light-on-surface-variant font-semibold">
              {pendingCount} dossiers prioritaires
            </span>
          </div>

          <div className="divide-y divide-light-outline dark:divide-dark-outline">
            {pendingRiders.map((rider) => (
              <div
                key={rider.id}
                className="p-gutter-lg flex flex-col md:flex-row md:items-center justify-between gap-gutter-md hover:bg-light-surface-container/40 dark:hover:bg-dark-surface-container/40 transition"
              >
                <div className="flex flex-col gap-gutter-xs min-w-0">
                  <div className="flex items-center gap-gutter-sm flex-wrap">
                    <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
                      {rider.name}
                    </span>
                    <span className="font-mono text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                      {rider.phone}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-light-surface-container dark:bg-dark-surface-container text-xs font-semibold text-light-on-surface">
                      {rider.quartier}
                    </span>
                  </div>
                  <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                    {rider.docs}
                  </p>
                </div>

                <div className="flex items-center gap-gutter-sm shrink-0">
                  {rider.status === 'approved' ? (
                    <span className="px-3 py-1.5 rounded-md bg-light-primary-container text-light-primary font-label text-label-md font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Dossier Validé
                    </span>
                  ) : rider.status === 'rejected' ? (
                    <span className="px-3 py-1.5 rounded-md bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-label text-label-md font-bold">
                      Dossier Refusé
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRejectRider(rider.id, rider.name)}
                        className="px-gutter-md py-2 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface font-label text-label-md hover:bg-light-surface-variant transition font-semibold cursor-pointer"
                      >
                        Refuser
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveRider(rider.id, rider.name)}
                        className="px-gutter-md py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary font-label text-label-md font-bold hover:opacity-90 transition cursor-pointer shadow-xs"
                      >
                        Valider le rider
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
