import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf } from '../../utils/formatters';
import {
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  PhoneCall,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
  Plus,
  Trash2,
  FileText,
  Award,
  Store,
  Bike,
  Check,
} from 'lucide-react';
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
      icon: <User className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
    },
    {
      id: 'orders' as const,
      label: 'Mes Commandes',
      subtitle: `${orders.length} commande${orders.length > 1 ? 's' : ''} passée${orders.length > 1 ? 's' : ''}`,
      icon: <ShoppingBag className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
    },
    {
      id: 'addresses' as const,
      label: 'Adresses de livraison',
      subtitle: `${user?.addresses?.length || 1} adresse enregistrée`,
      icon: <MapPin className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
    },
    {
      id: 'payments' as const,
      label: 'Moyens de paiement',
      subtitle: 'Orange Money & MTN MoMo Guinée',
      icon: <CreditCard className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
    },
    {
      id: 'contact' as const,
      label: 'Contactez-nous',
      subtitle: 'Assistance client Conakry 24/7',
      icon: <PhoneCall className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
    },
    {
      id: 'settings' as const,
      label: 'Paramètres & Notifications',
      subtitle: 'SMS, alertes WhatsApp & PWA',
      icon: <Settings className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
    },
    {
      id: 'faq' as const,
      label: 'Aide & FAQ',
      subtitle: 'Questions fréquentes sur la livraison',
      icon: <HelpCircle className="w-5 h-5 text-[#0B7A4B] dark:text-[#FFB81F]" />,
    },
  ];

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-6 pb-32 space-y-6 animate-in fade-in">
      {/* User Header Profile Block */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#0B7A4B] text-white flex items-center justify-center font-heading font-black text-3xl shadow-md border-4 border-white dark:border-[#1E3B2D]">
            {user ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          {user && (
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0B2B1E] border-2 border-white dark:border-[#0C1913] flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          )}
        </div>

        <div>
          <h1 className="font-heading font-black text-xl text-[#0B2B1E] dark:text-white">
            {user ? user.fullName : 'Client Conakry (Invité)'}
          </h1>
          <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/75 mt-0.5">
            {user?.email || (user ? `+224 ${user.phone}` : 'Connexion par numéro +224')}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50/70 dark:bg-[#10231B] text-[#0B7A4B] dark:text-emerald-200 border border-[#D4E9DD] dark:border-[#1E3B2D]">
              {user?.role === 'admin'
                ? 'Super Admin (GHT)'
                : user?.role === 'partner'
                ? 'Partenaire Commerçant'
                : user?.role === 'courier'
                ? 'Livreur Motard'
                : 'Client Vérifié Conakry'}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-[#FFB81F] border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>{loyaltyPoints} pts</span>
            </span>
          </div>
        </div>

        {!user && (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold transition shadow-xs cursor-pointer min-h-[44px]"
          >
            Se connecter / Créer un compte
          </button>
        )}
      </div>

      {/* Menu Rows List */}
      <div className="rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs divide-y divide-[#E2ECE7] dark:divide-[#1E3B2D] overflow-hidden">
        {menuRows.map((item) => {
          const isSelected = activeSection === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setActiveSection(isSelected ? null : item.id)}
                className={`w-full p-4 flex items-center justify-between text-left transition cursor-pointer hover:bg-emerald-50/40 dark:hover:bg-[#10231B] min-h-[60px] ${
                  isSelected ? 'bg-emerald-50/60 dark:bg-[#10231B]' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50/70 dark:bg-[#10231B] flex items-center justify-center shrink-0 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading font-bold text-xs text-[#0B2B1E] dark:text-white truncate">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-200/75 mt-0.5 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 text-[#5C7A6E] transition-transform shrink-0 ${
                    isSelected ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {isSelected && (
                <div className="p-4 bg-white dark:bg-[#08120D] border-t border-[#E2ECE7] dark:border-[#1E3B2D] animate-in fade-in">
                  {item.id === 'profile' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#5C7A6E] dark:text-emerald-300/70">
                            Nom & Prénom
                          </label>
                          <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full mt-1 p-2.5 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white min-h-[42px]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#5C7A6E] dark:text-emerald-300/70">
                            Numéro Mobile (+224)
                          </label>
                          <input
                            type="text"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="w-full mt-1 p-2.5 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white min-h-[42px]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#5C7A6E] dark:text-emerald-300/70">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full mt-1 p-2.5 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white min-h-[42px]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold transition cursor-pointer min-h-[42px]"
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </div>
                  )}

                  {item.id === 'orders' && (
                    <div className="space-y-2">
                      {orders.length === 0 ? (
                        <p className="text-xs text-[#5C7A6E] dark:text-emerald-200/70 text-center py-4">
                          Aucune commande passée pour l'instant.
                        </p>
                      ) : (
                        orders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-[#0B2B1E] dark:text-white truncate">
                                {ord.partnerName}
                              </div>
                              <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 font-mono mt-0.5">
                                #{ord.trackingNumber} ·{' '}
                                {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-xs font-bold text-[#0B7A4B] dark:text-[#FFB81F] mt-1">
                                {formatGnf(ord.totalGnf)}
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedInvoiceOrder(ord)}
                              className="px-3 py-2 rounded-lg border border-[#D4E9DD] dark:border-[#1E3B2D] hover:border-[#0B7A4B] text-xs font-semibold text-[#0B7A4B] dark:text-[#FFB81F] flex items-center gap-1 transition cursor-pointer shrink-0 min-h-[38px]"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Facture</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {item.id === 'addresses' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#0B2B1E] dark:text-emerald-100">
                          Adresses enregistrées à Conakry
                        </span>
                        <button
                          onClick={() => setIsAddingAddress(!isAddingAddress)}
                          className="text-xs font-bold text-[#0B7A4B] dark:text-[#FFB81F] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter</span>
                        </button>
                      </div>

                      {isAddingAddress && (
                        <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] space-y-2">
                          <input
                            type="text"
                            placeholder="Nom du lieu (Maison, Bureau...)"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="w-full p-2.5 text-xs rounded-lg border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Adresse ou quartier (Kipé, Kaloum...)"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="w-full p-2.5 text-xs rounded-lg border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Point de repère (ex: Portail bleu face pharmacie)"
                            value={newLandmark}
                            onChange={(e) => setNewLandmark(e.target.value)}
                            className="w-full p-2.5 text-xs rounded-lg border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] text-[#0B2B1E] dark:text-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setIsAddingAddress(false)}
                              className="px-3 py-1.5 text-xs text-[#5C7A6E] cursor-pointer"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={handleAddAddress}
                              className="px-4 py-1.5 rounded-lg bg-[#0B7A4B] text-white text-xs font-bold cursor-pointer"
                            >
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        {(user?.addresses || []).map((addr) => (
                          <div
                            key={addr.id}
                            className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-start justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="font-bold text-[#0B2B1E] dark:text-white">
                                {addr.label}
                              </div>
                              <div className="text-[#2F4F42] dark:text-emerald-200/80 mt-0.5">
                                {addr.address}
                              </div>
                              {addr.landmark && (
                                <div className="text-[11px] text-[#5C7A6E] dark:text-emerald-300/70 italic mt-0.5">
                                  Repère : {addr.landmark}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-[#5C7A6E] hover:text-rose-600 p-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.id === 'payments' && (
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          OM
                        </div>
                        <div className="flex-1 text-xs min-w-0">
                          <div className="font-bold text-[#0B2B1E] dark:text-white">
                            Orange Money Guinée
                          </div>
                          <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">
                            Paiement instantané via code #144#
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#0B7A4B] border border-[#D4E9DD] dark:bg-[#0C1913] dark:text-emerald-300 dark:border-[#1E3B2D]">
                          Activé
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FFB81F] text-[#0B2B1E] font-bold text-xs flex items-center justify-center shrink-0">
                          MTN
                        </div>
                        <div className="flex-1 text-xs min-w-0">
                          <div className="font-bold text-[#0B2B1E] dark:text-white">
                            MTN MoMo Guinée
                          </div>
                          <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70">
                            Paiement direct via code *440#
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#0B7A4B] border border-[#D4E9DD] dark:bg-[#0C1913] dark:text-emerald-300 dark:border-[#1E3B2D]">
                          Activé
                        </span>
                      </div>
                    </div>
                  )}

                  {item.id === 'contact' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1">
                        <div className="font-bold text-[#0B2B1E] dark:text-white">
                          Centre d'assistance Soneya
                        </div>
                        <div className="text-[#2F4F42] dark:text-emerald-200/80">
                          Téléphone : +224 622 00 00 00 / +224 620 00 00 00
                        </div>
                        <div className="text-[#2F4F42] dark:text-emerald-200/80">
                          Email : contact@guineehubtechnologie.com
                        </div>
                        <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-300/70 pt-1">
                          Nos équipes de dispatching basées à Kipé et Kaloum sont disponibles 7j/7 de 7h à 23h.
                        </div>
                      </div>
                    </div>
                  )}

                  {item.id === 'settings' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-[#0B2B1E] dark:text-white">
                            Alertes SMS de suivi
                          </div>
                          <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">
                            Mises à jour motard même sans connexion internet
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            updateUser({ smsNotifications: !user?.smsNotifications })
                          }
                          className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer shrink-0 ${
                            user?.smsNotifications
                              ? 'bg-[#0B7A4B]'
                              : 'bg-[#D4E9DD] dark:bg-[#1E3B2D]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                              user?.smsNotifications ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D]">
                        <div>
                          <div className="font-bold text-[#0B2B1E] dark:text-white">
                            Reçu par e-mail automatique
                          </div>
                          <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">
                            Facture PDF envoyée après livraison
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            updateUser({ emailReceipts: !user?.emailReceipts })
                          }
                          className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 cursor-pointer shrink-0 ${
                            user?.emailReceipts
                              ? 'bg-[#0B7A4B]'
                              : 'bg-[#D4E9DD] dark:bg-[#1E3B2D]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                              user?.emailReceipts ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {item.id === 'faq' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1">
                        <div className="font-bold text-[#0B2B1E] dark:text-white">
                          Comment fonctionne le code de livraison ?
                        </div>
                        <div className="text-[#2F4F42] dark:text-emerald-200/80 text-[11px] leading-relaxed">
                          À chaque commande, un code secret de 4 chiffres est généré. Donnez-le au motard uniquement lorsque vous avez vérifié votre colis.
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1">
                        <div className="font-bold text-[#0B2B1E] dark:text-white">
                          Quels sont les frais de livraison ?
                        </div>
                        <div className="text-[#2F4F42] dark:text-emerald-200/80 text-[11px] leading-relaxed">
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
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-xs space-y-2.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C7A6E] dark:text-emerald-300/70">
          Espaces Professionnels
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
          <button
            onClick={() => setSpace('partner')}
            className="p-3 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] hover:border-[#0B7A4B] text-left flex items-center gap-2.5 transition cursor-pointer min-h-[54px]"
          >
            <Store className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
            <div>
              <div className="font-heading font-bold text-xs text-[#0B2B1E] dark:text-white">
                Commerçant
              </div>
              <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">
                Gérer mon magasin
              </div>
            </div>
          </button>
          <button
            onClick={() => setSpace('courier')}
            className="p-3 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] hover:border-[#0B7A4B] text-left flex items-center gap-2.5 transition cursor-pointer min-h-[54px]"
          >
            <Bike className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
            <div>
              <div className="font-heading font-bold text-xs text-[#0B2B1E] dark:text-white">
                Livreur Motard
              </div>
              <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">
                Courses en direct
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Legal & Privacy Policy */}
      <div className="flex items-center justify-between px-2 text-xs">
        <button
          onClick={() => setIsPrivacyModalOpen(true)}
          className="text-[#5C7A6E] hover:text-[#0B2B1E] dark:text-emerald-200/70 dark:hover:text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
          <span>Politique de confidentialité & CGU</span>
        </button>
      </div>

      {/* Log Out Button */}
      {user && (
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-[#0C1913] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-heading font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs min-h-[46px]"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Déconnexion</span>
          </button>
        </div>
      )}

      {/* Footer Branding Guinée Hub Technologie */}
      <div className="flex flex-col items-center justify-center gap-1.5 pt-4">
        <img
          src="/assets/aistudio/B7697457-7CD5-4A3A-A3C7-3322C1459814_4b7ffeec.png"
          alt="Guinée Hub Technologie"
          className="h-9 w-auto object-contain"
        />
        <div className="text-[10px] text-center text-[#5C7A6E] dark:text-emerald-200/70">
          Développé et opéré par{' '}
          <strong className="text-[#0B2B1E] dark:text-white">
            Guinée Hub Technologie
          </strong>{' '}
          · Conakry, Guinée
        </div>
      </div>
    </div>
  );
};
