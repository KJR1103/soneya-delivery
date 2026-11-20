import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { user, updateUser, showToast, space } = useApp();

  const [pushOrders, setPushOrders] = useState(true);
  const [pushPromos, setPushPromos] = useState(true);
  const [smsReceipts, setSmsReceipts] = useState(true);
  const [favPayment, setFavPayment] = useState<'orange_money' | 'momo' | 'cash'>('orange_money');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    showToast('Paramètres enregistrés', 'Vos préférences de notifications et alertes ont été mises à jour.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const roleLabels = {
    client: 'Client Soneya',
    courier: 'Rider Soneya Conakry',
    partner: 'Partenaire Business Soneya',
    admin: 'Équipe Interne Soneya HQ',
  };

  return (
    <div className="max-w-xl mx-auto px-gutter-md py-gutter-lg flex flex-col gap-gutter-lg pb-24 text-light-on-surface dark:text-dark-on-surface">
      {/* Header (Matching param_tres_notifications.html) */}
      <header className="sticky top-0 z-20 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline -mx-gutter-md px-gutter-md py-gutter-md flex items-center justify-between">
        <div>
          <h1 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface font-bold">
            Paramètres du compte
          </h1>
          <p className="text-xs text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Profil actif : {roleLabels[space] || 'Utilisateur'}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary font-label text-label-sm font-semibold">
          Vérifié
        </span>
      </header>

      <form onSubmit={handleSave} className="flex flex-col gap-gutter-lg">
        {/* Identity & Linked Accounts */}
        <section className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-md">
          <div className="flex items-center gap-gutter-md">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary font-headline text-headline-md font-bold shrink-0">
              {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'MD'}
            </span>
            <div className="min-w-0">
              <h2 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-bold truncate">
                {user?.fullName || 'Mamadou Diallo'}
              </h2>
              <p className="font-mono text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                +224 {user?.phone || '622 10 20 30'} · Kipé
              </p>
            </div>
          </div>
          <div className="pt-gutter-sm border-t border-light-outline dark:border-dark-outline flex items-center justify-between">
            <span className="font-body text-body-md text-light-on-surface dark:text-dark-on-surface">
              Compte Gmail / Apple lié
            </span>
            <span className="font-label text-label-sm text-light-primary dark:text-dark-primary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span>
              Connecté
            </span>
          </div>
        </section>

        {/* Notifications & Alerts Preferences (Matching param_tres_notifications.html) */}
        <section className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-md">
          <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
            Notifications &amp; Alertes
          </h2>

          <label className="flex items-center justify-between gap-gutter-md cursor-pointer select-none">
            <div>
              <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">
                Suivi commandes en direct
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Alertes push à chaque étape (préparation, motard en route, arrivée)
              </p>
            </div>
            <input
              type="checkbox"
              checked={pushOrders}
              onChange={(e) => setPushOrders(e.target.checked)}
              className="w-5 h-5 rounded border-light-outline text-light-primary focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-gutter-md cursor-pointer pt-gutter-sm border-t border-light-outline dark:border-dark-outline select-none">
            <div>
              <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">
                Remises &amp; codes promo
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Offres exclusives des enseignes vérifiées à Kipé et Conakry
              </p>
            </div>
            <input
              type="checkbox"
              checked={pushPromos}
              onChange={(e) => setPushPromos(e.target.checked)}
              className="w-5 h-5 rounded border-light-outline text-light-primary focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-gutter-md cursor-pointer pt-gutter-sm border-t border-light-outline dark:border-dark-outline select-none">
            <div>
              <p className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold">
                Confirmations par SMS
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Reçus Orange Money &amp; MoMo envoyés directement sur votre mobile
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsReceipts}
              onChange={(e) => setSmsReceipts(e.target.checked)}
              className="w-5 h-5 rounded border-light-outline text-light-primary focus:ring-0 cursor-pointer"
            />
          </label>
        </section>

        {/* Payment & Security Preferences */}
        <section className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-sm">
          <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-bold">
            Paiement &amp; Préférences
          </h2>

          <div className="flex items-center justify-between py-1.5">
            <span className="font-body text-body-md text-light-on-surface dark:text-dark-on-surface">
              Mode de paiement favori
            </span>
            <select
              value={favPayment}
              onChange={(e) => setFavPayment(e.target.value as any)}
              className="px-3 py-1.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-label text-label-md text-light-primary dark:text-dark-primary font-bold outline-hidden"
            >
              <option value="orange_money">Orange Money (GNF)</option>
              <option value="momo">MTN MoMo (GNF)</option>
              <option value="cash">Paiement à la livraison (Espèces GNF)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-1.5 border-t border-light-outline dark:border-dark-outline">
            <span className="font-body text-body-md text-light-on-surface dark:text-dark-on-surface">
              Langue de l'application
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="px-3 py-1.5 rounded-md bg-light-surface-container dark:bg-dark-surface-container border border-light-outline dark:border-dark-outline font-label text-label-md text-light-on-surface-variant outline-hidden"
            >
              <option value="fr">Français (Guinée)</option>
              <option value="en">English</option>
            </select>
          </div>
        </section>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3.5 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-lg hover:opacity-90 active:scale-98 transition-all shadow-sm font-bold cursor-pointer"
        >
          <span className="material-symbols-outlined text-title-md">check</span>
          <span>{saved ? 'Paramètres enregistrés !' : 'Enregistrer les paramètres'}</span>
        </button>
      </form>
    </div>
  );
};
