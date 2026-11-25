import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';
import { SavedAddress } from '../../types';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUser,
    logout,
    setIsAuthModalOpen,
    orders,
    setSelectedInvoiceOrder,
    loyaltyPoints,
    setSpace,
    setIsPrivacyModalOpen,
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'profile' | 'orders' | 'addresses' | 'payments' | 'contact' | 'settings' | 'faq' | null
  >(null);

  const [nameInput, setNameInput] = useState(user?.fullName || 'Amadou Diallo');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '622 78 90 12');
  const [emailInput, setEmailInput] = useState(user?.email || 'amadou.diallo@gmail.com');

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Domicile');
  const [newAddress, setNewAddress] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  // Notification toggles (param_tres_notifications template)
  const [notifOrderUpdates, setNotifOrderUpdates] = useState(true);
  const [notifPromos, setNotifPromos] = useState(true);
  const [notifWhatsApp, setNotifWhatsApp] = useState(false);

  const handleSaveProfile = () => {
    updateUser({
      fullName: nameInput,
      phone: phoneInput,
      email: emailInput,
    });
    setActiveSection(null);
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    const addr: SavedAddress = {
      id: `addr_${Date.now()}`,
      label: newLabel,
      quartierId: 'kipe',
      quartierName: 'Kipé',
      address: newAddress,
      landmark: newLandmark,
    };
    const updated = [...(user?.addresses || []), addr];
    updateUser({ addresses: updated });
    setIsAddingAddress(false);
    setNewAddress('');
    setNewLandmark('');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = (user?.addresses || []).filter((a) => a.id !== id);
    updateUser({ addresses: updated });
  };

  const menuRows = [
    {
      id: 'profile' as const,
      label: 'Mon Profil',
      subtitle: user?.fullName || 'Informations personnelles',
      icon: 'person',
    },
    {
      id: 'orders' as const,
      label: 'Mes Commandes',
      subtitle: `${orders.length} commande${orders.length > 1 ? 's' : ''} passée${orders.length > 1 ? 's' : ''}`,
      icon: 'shopping_bag',
    },
    {
      id: 'addresses' as const,
      label: 'Adresses de livraison',
      subtitle: `${user?.addresses?.length || 1} adresse enregistrée`,
      icon: 'location_on',
    },
    {
      id: 'payments' as const,
      label: 'Moyens de paiement',
      subtitle: 'Orange Money & MTN MoMo Guinée',
      icon: 'credit_card',
    },
    {
      id: 'contact' as const,
      label: 'Contactez-nous',
      subtitle: 'Assistance client Conakry 24/7',
      icon: 'call',
    },
    {
      id: 'settings' as const,
      label: 'Paramètres & Notifications',
      subtitle: 'SMS, alertes WhatsApp & PWA',
      icon: 'settings',
    },
    {
      id: 'faq' as const,
      label: 'Aide & FAQ',
      subtitle: 'Questions fréquentes sur la livraison',
      icon: 'help',
    },
  ];

  return (
    <div className="max-w-xl mx-auto px-gutter-sm sm:px-gutter-md py-gutter-lg pb-32 space-y-gutter-lg animate-in fade-in">
      {/* User Header Profile Block */}
      <div className="flex flex-col items-center text-center space-y-gutter-md pt-gutter-sm">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-light-primary text-light-on-primary flex items-center justify-center font-headline font-black text-headline-md shadow-md border-4 border-light-surface-container-low dark:border-dark-surface-container-low">
            {user ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          {user && (
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-light-on-surface dark:bg-dark-on-surface border-2 border-light-surface-container-low dark:border-dark-surface flex items-center justify-center text-light-surface-container-low dark:text-dark-surface">
              <span className="material-symbols-outlined text-title-sm" aria-hidden="true">check</span>
            </span>
          )}
        </div>

        <div>
          <h1 className="font-headline font-black text-headline-sm text-light-on-surface dark:text-dark-on-surface">
            {user ? user.fullName : 'Client Conakry (Invité)'}
          </h1>
          <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-0.5">
            {user?.email || (user ? `+224 ${user.phone}` : 'Connexion par numéro +224')}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-full bg-light-primary-container/70 dark:bg-dark-surface-container-low text-light-primary dark:text-dark-primary border border-light-outline dark:border-dark-outline">
              {user?.role === 'admin'
                ? 'Super Admin (GHT)'
                : user?.role === 'partner'
                ? 'Partenaire Commerçant'
                : user?.role === 'courier'
                ? 'Livreur Motard'
                : 'Client Vérifié Conakry'}
            </span>
            <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-accent border border-amber-200 dark:border-amber-800 flex items-center gap-gutter-xs">
              <span className="material-symbols-outlined text-title-sm" aria-hidden="true">workspace_premium</span>
              <span>{loyaltyPoints} pts</span>
            </span>
          </div>
        </div>

        {!user && (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-gutter-lg py-2.5 rounded-md bg-light-primary hover:opacity-90 text-light-on-primary text-body-sm font-bold transition shadow-xs cursor-pointer min-h-[44px]"
          >
            Se connecter / Créer un compte
          </button>
        )}
      </div>

      {/* Menu Rows List - Clean settings list with sections */}
      <div className="rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs divide-y divide-light-outline dark:divide-dark-outline overflow-hidden">
        {menuRows.map((item) => {
          const isSelected = activeSection === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setActiveSection(isSelected ? null : item.id)}
                className={`w-full p-gutter-md flex items-center justify-between text-left transition cursor-pointer hover:bg-light-surface-container/60 dark:hover:bg-dark-surface-container-low min-h-[60px] ${
                  isSelected ? 'bg-light-surface-container dark:bg-dark-surface-container-low' : ''
                }`}
              >
                <div className="flex items-center gap-gutter-md min-w-0">
                  <div className="w-9 h-9 rounded-md bg-light-primary-container/70 dark:bg-dark-surface-container-low flex items-center justify-center shrink-0 border border-light-outline dark:border-dark-outline">
                    <span className="material-symbols-outlined text-title-md text-light-primary dark:text-dark-primary" aria-hidden="true">{item.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-headline font-bold text-body-sm text-light-on-surface dark:text-dark-on-surface truncate">
                      {item.label}
                    </div>
                    <div className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant mt-0.5 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <span
                  className={`material-symbols-outlined text-title-md text-light-on-surface-variant transition-transform shrink-0 ${
                    isSelected ? 'rotate-90' : ''
                  }`}
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </button>

              {isSelected && (
                <div className="p-gutter-md bg-light-surface dark:bg-dark-surface border-t border-light-outline dark:border-dark-outline animate-in fade-in">
                  {item.id === 'profile' && (
                    <div className="space-y-gutter-md">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
                        <div>
                          <label className="text-label-sm font-bold uppercase text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            Nom & Prénom
                          </label>
                          <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full mt-gutter-xs p-2.5 text-body-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface min-h-[42px] focus:outline-none focus:border-light-primary"
                          />
                        </div>
                        <div>
                          <label className="text-label-sm font-bold uppercase text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            Numéro Mobile (+224)
                          </label>
                          <input
                            type="text"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="w-full mt-gutter-xs p-2.5 text-body-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface min-h-[42px] focus:outline-none focus:border-light-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-label-sm font-bold uppercase text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full mt-gutter-xs p-2.5 text-body-sm rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface min-h-[42px] focus:outline-none focus:border-light-primary"
                        />
                      </div>
                      <div className="flex justify-end gap-gutter-sm pt-gutter-xs">
                        <button
                          onClick={handleSaveProfile}
                          className="px-gutter-md py-2.5 rounded-md bg-light-primary hover:opacity-90 text-light-on-primary text-body-sm font-bold transition cursor-pointer min-h-[42px]"
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </div>
                  )}

                  {item.id === 'orders' && (
                    <div className="space-y-gutter-sm">
                      {orders.length === 0 ? (
                        <p className="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant text-center py-gutter-md">
                          Aucune commande passée pour l'instant.
                        </p>
                      ) : (
                        orders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-md text-body-sm"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-light-on-surface dark:text-dark-on-surface truncate">
                                {ord.partnerName}
                              </div>
                              <div className="text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant font-mono mt-0.5">
                                #{ord.trackingNumber} ·{' '}
                                {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-body-sm font-mono font-bold text-light-primary dark:text-dark-primary mt-gutter-xs">
                                {formatGnf(ord.totalGnf)}
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedInvoiceOrder(ord)}
                              className="px-gutter-md py-2 rounded-md border border-light-outline dark:border-dark-outline hover:border-light-primary text-body-sm font-semibold text-light-primary dark:text-dark-primary flex items-center gap-gutter-xs transition cursor-pointer shrink-0 min-h-[38px]"
                            >
                              <span className="material-symbols-outlined text-title-sm" aria-hidden="true">description</span>
                              <span>Facture</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {item.id === 'addresses' && (
                    <div className="space-y-gutter-md">
                      <div className="flex items-center justify-between">
                        <span className="text-label-md font-bold text-light-on-surface dark:text-dark-on-surface">
                          Adresses enregistrées à Conakry
                        </span>
                        <button
                          onClick={() => setIsAddingAddress(!isAddingAddress)}
                          className="text-body-sm font-bold text-light-primary dark:text-dark-primary flex items-center gap-gutter-xs hover:underline cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-title-sm" aria-hidden="true">add</span>
                          <span>Ajouter</span>
                        </button>
                      </div>

                      {isAddingAddress && (
                        <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline space-y-gutter-sm">
                          <input
                            type="text"
                            placeholder="Nom du lieu (Maison, Bureau...)"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="w-full p-2.5 text-body-sm rounded-md border border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-light-primary"
                          />
                          <input
                            type="text"
                            placeholder="Adresse ou quartier (Kipé, Kaloum...)"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="w-full p-2.5 text-body-sm rounded-md border border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-light-primary"
                          />
                          <input
                            type="text"
                            placeholder="Point de repère (ex: Portail bleu face pharmacie)"
                            value={newLandmark}
                            onChange={(e) => setNewLandmark(e.target.value)}
                            className="w-full p-2.5 text-body-sm rounded-md border border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface text-light-on-surface dark:text-dark-on-surface focus:outline-none focus:border-light-primary"
                          />
                          <div className="flex justify-end gap-gutter-sm">
                            <button
                              onClick={() => setIsAddingAddress(false)}
                              className="px-gutter-md py-1.5 text-body-sm text-light-on-surface-variant cursor-pointer"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={handleAddAddress}
                              className="px-gutter-md py-1.5 rounded-md bg-light-primary text-light-on-primary text-body-sm font-bold cursor-pointer"
                            >
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-gutter-sm">
                        {(user?.addresses || []).map((addr) => (
                          <div
                            key={addr.id}
                            className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-start justify-between gap-gutter-md text-body-sm"
                          >
                            <div>
                              <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                                {addr.label}
                              </div>
                              <div className="text-light-on-surface-variant dark:text-dark-on-surface-variant mt-0.5">
                                {addr.address}
                              </div>
                              {addr.landmark && (
                                <div className="text-label-md text-light-on-surface-variant dark:text-dark-on-surface-variant italic mt-0.5">
                                  Repère : {addr.landmark}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-light-on-surface-variant hover:text-rose-600 p-1.5 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-title-sm" aria-hidden="true">delete</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.id === 'payments' && (
                    <div className="space-y-gutter-sm">
                      {/* Payment methods: Orange Money, MTN MoMo */}
                      <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center gap-gutter-md">
                        <div className="w-8 h-8 rounded-md bg-orange-600 text-light-surface font-bold text-label-sm flex items-center justify-center shrink-0">
                          OM
                        </div>
                        <div className="flex-1 text-body-sm min-w-0">
                          <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                            Orange Money Guinée
                          </div>
                          <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            Paiement instantané via code #144#
                          </div>
                        </div>
                        <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-md bg-light-primary-container text-light-primary border border-light-outline dark:bg-dark-surface-container-low dark:text-dark-primary dark:border-dark-outline">
                          Activé
                        </span>
                      </div>

                      <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center gap-gutter-md">
                        <div className="w-8 h-8 rounded-md bg-accent text-light-on-surface font-bold text-label-sm flex items-center justify-center shrink-0">
                          MTN
                        </div>
                        <div className="flex-1 text-body-sm min-w-0">
                          <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                            MTN MoMo Guinée
                          </div>
                          <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            Paiement direct via code *440#
                          </div>
                        </div>
                        <span className="text-label-sm font-bold px-gutter-sm py-0.5 rounded-md bg-light-primary-container text-light-primary border border-light-outline dark:bg-dark-surface-container-low dark:text-dark-primary dark:border-dark-outline">
                          Activé
                        </span>
                      </div>
                    </div>
                  )}

                  {item.id === 'contact' && (
                    <div className="space-y-gutter-sm text-body-sm">
                      <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline space-y-gutter-xs">
                        <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                          Centre d'assistance Soneya
                        </div>
                        <div className="text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          Téléphone : +224 622 00 00 00 / +224 620 00 00 00
                        </div>
                        <div className="text-light-on-surface-variant dark:text-dark-on-surface-variant">
                          Email : contact@guineehubtechnologie.com
                        </div>
                        <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant pt-gutter-xs">
                          Nos équipes de dispatching basées à Kipé et Kaloum sont disponibles 7j/7 de 7h à 23h.
                        </div>
                      </div>
                    </div>
                  )}

                  {item.id === 'settings' && (
                    <div className="space-y-gutter-md text-body-sm">
                      {/* Toggle switches for notifications - param_tres_notifications template */}
                      <div className="flex items-center justify-between gap-gutter-sm">
                        <div>
                          <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                            Alertes SMS de suivi
                          </div>
                          <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            Mises à jour motard même sans connexion internet
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            updateUser({ smsNotifications: !user?.smsNotifications })
                          }
                          className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer shrink-0 ${
                            user?.smsNotifications
                              ? 'bg-light-primary'
                              : 'bg-light-outline dark:bg-dark-outline'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-light-surface-container-low transition-transform shadow-xs ${
                              user?.smsNotifications ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-gutter-sm pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
                        <div>
                          <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                            Reçu par e-mail automatique
                          </div>
                          <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            Facture PDF envoyée après livraison
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            updateUser({ emailReceipts: !user?.emailReceipts })
                          }
                          className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer shrink-0 ${
                            user?.emailReceipts
                              ? 'bg-light-primary'
                              : 'bg-light-outline dark:bg-dark-outline'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-light-surface-container-low transition-transform shadow-xs ${
                              user?.emailReceipts ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-gutter-sm pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
                        <div>
                          <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                            Notifications de promotions
                          </div>
                          <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            Offres spéciales et codes promo Soneya
                          </div>
                        </div>
                        <button
                          onClick={() => setNotifPromos(!notifPromos)}
                          className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer shrink-0 ${
                            notifPromos
                              ? 'bg-light-primary'
                              : 'bg-light-outline dark:bg-dark-outline'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-light-surface-container-low transition-transform shadow-xs ${
                              notifPromos ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-gutter-sm pt-gutter-sm border-t border-light-outline dark:border-dark-outline">
                        <div>
                          <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                            Alertes WhatsApp
                          </div>
                          <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                            Suivi de commande via WhatsApp Business
                          </div>
                        </div>
                        <button
                          onClick={() => setNotifWhatsApp(!notifWhatsApp)}
                          className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer shrink-0 ${
                            notifWhatsApp
                              ? 'bg-light-primary'
                              : 'bg-light-outline dark:bg-dark-outline'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-light-surface-container-low transition-transform shadow-xs ${
                              notifWhatsApp ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {item.id === 'faq' && (
                    <div className="space-y-gutter-sm text-body-sm">
                      <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline space-y-gutter-xs">
                        <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                          Comment fonctionne le code de livraison ?
                        </div>
                        <div className="text-light-on-surface-variant dark:text-dark-on-surface-variant text-label-md leading-relaxed">
                          À chaque commande, un code secret de 4 chiffres est généré. Donnez-le au motard uniquement lorsque vous avez vérifié votre colis.
                        </div>
                      </div>
                      <div className="p-gutter-md rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline space-y-gutter-xs">
                        <div className="font-bold text-light-on-surface dark:text-dark-on-surface">
                          Quels sont les frais de livraison ?
                        </div>
                        <div className="text-light-on-surface-variant dark:text-dark-on-surface-variant text-label-md leading-relaxed">
                          Les frais sont calculés automatiquement par GPS : 5 000 GNF de base + 3 500 GNF par kilomètre réel à Conakry.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Professional Access */}
      <div className="p-gutter-md rounded-xl bg-light-surface-container-low dark:bg-dark-surface border border-light-outline dark:border-dark-outline shadow-xs space-y-gutter-sm">
        <div className="text-label-sm font-bold uppercase tracking-wider text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Espaces Professionnels
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-gutter-sm">
          <button
            onClick={() => setSpace('partner')}
            className="p-gutter-md rounded-md border border-light-outline dark:border-dark-outline hover:border-partner text-left flex items-center gap-gutter-sm transition cursor-pointer min-h-[54px]"
          >
            <span className="material-symbols-outlined text-title-md text-partner dark:text-accent shrink-0" aria-hidden="true">storefront</span>
            <div>
              <div className="font-headline font-bold text-body-sm text-light-on-surface dark:text-dark-on-surface">
                Commerçant
              </div>
              <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Gérer mon magasin
              </div>
            </div>
          </button>
          <button
            onClick={() => setSpace('courier')}
            className="p-gutter-md rounded-md border border-light-outline dark:border-dark-outline hover:border-courier text-left flex items-center gap-gutter-sm transition cursor-pointer min-h-[54px]"
          >
            <span className="material-symbols-outlined text-title-md text-courier shrink-0" aria-hidden="true">two_wheeler</span>
            <div>
              <div className="font-headline font-bold text-body-sm text-light-on-surface dark:text-dark-on-surface">
                Livreur Motard
              </div>
              <div className="text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Courses en direct
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Privacy policy link */}
      <div className="flex items-center justify-between px-gutter-sm text-body-sm">
        <button
          onClick={() => setIsPrivacyModalOpen(true)}
          className="text-light-on-surface-variant hover:text-light-on-surface dark:text-dark-on-surface-variant dark:hover:text-dark-on-surface flex items-center gap-1.5 transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-title-sm text-light-primary dark:text-dark-primary" aria-hidden="true">shield</span>
          <span>Politique de confidentialité & CGU</span>
        </button>
      </div>

      {/* Log Out Button */}
      {user && (
        <div className="pt-gutter-sm">
          <button
            onClick={logout}
            className="w-full py-3.5 rounded-md border border-rose-200 dark:border-rose-900/60 bg-light-surface-container-low dark:bg-dark-surface text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-headline font-bold text-body-sm flex items-center justify-center gap-gutter-sm transition cursor-pointer shadow-xs min-h-[46px]"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">logout</span>
            <span>Déconnexion</span>
          </button>
        </div>
      )}

      {/* Footer Branding Guinée Hub Technologie */}
      <div className="flex flex-col items-center justify-center gap-1.5 pt-gutter-md">
        <img
          src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
          alt="Guinée Hub Technologie"
          className="h-9 w-auto object-contain"
        />
        <div className="text-label-sm text-center text-light-on-surface-variant dark:text-dark-on-surface-variant">
          Développé et opéré par{' '}
          <strong className="text-light-on-surface dark:text-dark-on-surface">
            Guinée Hub Technologie
          </strong>{' '}
          · Conakry, Guinée
        </div>
      </div>
    </div>
  );
};
