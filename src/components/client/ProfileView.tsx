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
  Download,
  AlertTriangle,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { SavedAddress } from '../../types';
import { SettingsView } from '../common/SettingsView';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUser,
    logout,
    setIsAuthModalOpen,
    orders,
    setSelectedInvoiceOrder,
    loyaltyPoints,
    setIsPrivacyModalOpen,
    showToast,
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'profile' | 'orders' | 'addresses' | 'payments' | 'data' | 'contact' | 'settings' | 'faq' | null
  >(null);

  const [nameInput, setNameInput] = useState(user?.fullName || 'Amadou Diallo');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '622 78 90 12');
  const [emailInput, setEmailInput] = useState(user?.email || 'amadou.diallo@gmail.com');

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Domicile');
  const [newAddress, setNewAddress] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  // Conformité Loi L/2016/037/AN (Guinée) - Export des données
  const handleExportData = () => {
    const exportData = {
      profil: user,
      commandes: orders,
      adresses: user?.addresses || [],
      dateExport: new Date().toISOString(),
      reglementation: 'Loi L/2016/037/AN de la République de Guinée relative à la cybersécurité et aux données personnelles',
      plateforme: 'Soneya Delivery Conakry (Guinée Hub Technologie)',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soneya_mes_donnees_${user?.phone || 'conakry'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Export réussi', 'Le fichier de vos données personnelles a été téléchargé', 'success');
  };

  const handleDeleteAccount = () => {
    logout();
    setShowDeleteConfirm(false);
    showToast('Compte supprimé', 'Toutes vos données locales ont été effacées définitivement', 'info');
  };

  const menuRows = [
    {
      id: 'profile' as const,
      label: 'Mon Profil',
      subtitle: user?.fullName || 'Informations personnelles',
      icon: <User className="w-5 h-5 text-[#1E3A8A]" />,
    },
    {
      id: 'orders' as const,
      label: 'Mes Commandes',
      subtitle: `${orders.length} commande${orders.length > 1 ? 's' : ''} passée${orders.length > 1 ? 's' : ''}`,
      icon: <ShoppingBag className="w-5 h-5 text-[#1E3A8A]" />,
    },
    {
      id: 'addresses' as const,
      label: 'Adresses de livraison',
      subtitle: `${user?.addresses?.length || 1} adresse enregistrée`,
      icon: <MapPin className="w-5 h-5 text-[#1E3A8A]" />,
    },
    {
      id: 'payments' as const,
      label: 'Moyens de paiement',
      subtitle: 'Orange Money & MTN MoMo Guinée',
      icon: <CreditCard className="w-5 h-5 text-[#1E3A8A]" />,
    },
    {
      id: 'data' as const,
      label: 'Mes Données & Confidentialité',
      subtitle: 'Conformité Loi L/2016/037/AN · Export & Droits',
      icon: <ShieldCheck className="w-5 h-5 text-[#1E3A8A]" />,
    },
    {
      id: 'contact' as const,
      label: 'Contactez-nous',
      subtitle: 'Assistance client Conakry 24/7',
      icon: <PhoneCall className="w-5 h-5 text-[#1E3A8A]" />,
    },
    {
      id: 'settings' as const,
      label: 'Paramètres & Notifications',
      subtitle: 'SMS, alertes WhatsApp & PWA',
      icon: <Settings className="w-5 h-5 text-[#1E3A8A]" />,
    },
    {
      id: 'faq' as const,
      label: 'Aide & FAQ',
      subtitle: 'Questions fréquentes sur la livraison',
      icon: <HelpCircle className="w-5 h-5 text-[#1E3A8A]" />,
    },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-32 space-y-6 text-[#0F172A] m-reveal">
      {/* User Header Profile Block */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-headline font-black text-3xl shadow-md border-4 border-white">
            {user ? user.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          {user && (
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#1E3A8A] border-2 border-white flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          )}
        </div>

        <div>
          <h1 className="font-headline font-extrabold text-xl text-[#0F172A]">
            {user ? user.fullName : 'Client Conakry (Invité)'}
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            {user?.email || (user ? `+224 ${user.phone}` : 'Connexion par numéro +224')}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCE3F4] text-[#1E3A8A] border border-[#E2E8F0]">
              Client Vérifié Conakry
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F8FAFC] text-[#1E3A8A] border border-[#E2E8F0] flex items-center gap-1">
              <Award className="w-3 h-3 text-[#F4B028]" />
              <span>{loyaltyPoints} pts</span>
            </span>
          </div>
        </div>

        {!user && (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-xs font-bold transition shadow-xs cursor-pointer min-h-[44px]"
          >
            Se connecter / Créer un compte
          </button>
        )}
      </div>

      {/* Menu Rows List */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs divide-y divide-[#E2E8F0] overflow-hidden">
        {menuRows.map((item) => {
          const isSelected = activeSection === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setActiveSection(isSelected ? null : item.id)}
                className={`w-full p-4 flex items-center justify-between text-left transition cursor-pointer hover:bg-[#F8FAFC] min-h-[60px] ${
                  isSelected ? 'bg-[#F8FAFC]' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#DCE3F4] flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-headline font-bold text-xs text-[#0F172A] truncate">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 text-[#64748B] transition-transform shrink-0 ${
                    isSelected ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {isSelected && (
                <div className="p-4 bg-[#FFFFFF] border-t border-[#E2E8F0] m-reveal">
                  {item.id === 'profile' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748B]">
                            Nom &amp; Prénom
                          </label>
                          <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="w-full mt-1 p-2.5 text-xs rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] min-h-[42px] focus:outline-none focus:border-[#1E3A8A]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#64748B]">
                            Numéro Mobile (+224)
                          </label>
                          <input
                            type="text"
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value)}
                            className="w-full mt-1 p-2.5 text-xs rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] min-h-[42px] focus:outline-none focus:border-[#1E3A8A]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#64748B]">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full mt-1 p-2.5 text-xs rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] min-h-[42px] focus:outline-none focus:border-[#1E3A8A]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={handleSaveProfile}
                          className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-xs font-bold transition cursor-pointer min-h-[42px]"
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </div>
                  )}

                  {item.id === 'orders' && (
                    <div className="space-y-2">
                      {orders.length === 0 ? (
                        <p className="text-xs text-[#64748B] text-center py-4">
                          Aucune commande passée pour l'instant.
                        </p>
                      ) : (
                        orders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-[#0F172A] truncate">
                                {ord.partnerName}
                              </div>
                              <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
                                #{ord.trackingNumber} ·{' '}
                                {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-xs font-bold text-[#1E3A8A] mt-1">
                                {formatGnf(ord.totalGnf)}
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedInvoiceOrder(ord)}
                              className="px-3 py-2 rounded-lg border border-[#E2E8F0] hover:border-[#1E3A8A] text-xs font-semibold text-[#1E3A8A] flex items-center gap-1 transition cursor-pointer shrink-0 min-h-[38px]"
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
                        <span className="text-[11px] font-bold text-[#0F172A]">
                          Adresses enregistrées à Conakry
                        </span>
                        <button
                          onClick={() => setIsAddingAddress(!isAddingAddress)}
                          className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter</span>
                        </button>
                      </div>

                      {isAddingAddress && (
                        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                          <input
                            type="text"
                            placeholder="Nom du lieu (Maison, Bureau...)"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="w-full p-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A]"
                          />
                          <input
                            type="text"
                            placeholder="Adresse ou quartier (Kipé, Kaloum...)"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="w-full p-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A]"
                          />
                          <input
                            type="text"
                            placeholder="Point de repère (ex: Portail bleu face pharmacie)"
                            value={newLandmark}
                            onChange={(e) => setNewLandmark(e.target.value)}
                            className="w-full p-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A]"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setIsAddingAddress(false)}
                              className="px-3 py-1.5 text-xs text-[#64748B] cursor-pointer"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={handleAddAddress}
                              className="px-4 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold cursor-pointer"
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
                            className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-start justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="font-bold text-[#0F172A]">
                                {addr.label}
                              </div>
                              <div className="text-[#64748B] mt-0.5">
                                {addr.address}
                              </div>
                              {addr.landmark && (
                                <div className="text-[11px] text-[#64748B] italic mt-0.5">
                                  Repère : {addr.landmark}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-[#64748B] hover:text-rose-600 p-1.5 cursor-pointer"
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
                      <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          OM
                        </div>
                        <div className="flex-1 text-xs min-w-0">
                          <div className="font-bold text-[#0F172A]">
                            Orange Money Guinée
                          </div>
                          <div className="text-[10px] text-[#64748B]">
                            Paiement instantané via code #144#
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DCE3F4] text-[#1E3A8A] border border-[#E2E8F0]">
                          Activé
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F4B028] text-[#0F172A] font-bold text-xs flex items-center justify-center shrink-0">
                          MTN
                        </div>
                        <div className="flex-1 text-xs min-w-0">
                          <div className="font-bold text-[#0F172A]">
                            MTN MoMo Guinée
                          </div>
                          <div className="text-[10px] text-[#64748B]">
                            Paiement direct via code *440#
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DCE3F4] text-[#1E3A8A] border border-[#E2E8F0]">
                          Activé
                        </span>
                      </div>
                    </div>
                  )}

                  {/* MES DONNÉES & CONFIDENTIALITÉ - CONFORMITÉ LOI GUINÉENNE L/2016/037/AN */}
                  {item.id === 'data' && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                        <div className="font-headline font-bold text-[#1E3A8A] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Vos droits selon la Loi L/2016/037/AN (Guinée)</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-relaxed">
                          Vos données personnelles (numéro de téléphone, localisation lors de la livraison, historique des commandes) sont strictement protégées et traitées conformément aux lois de la République de Guinée.
                        </p>
                      </div>

                      {/* Export Button */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                        <div>
                          <div className="font-bold text-[#0F172A]">Télécharger une copie de mes données</div>
                          <div className="text-[10px] text-[#64748B]">Fichier structuré JSON contenant vos profils, commandes et adresses</div>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportData}
                          className="px-3 py-2 rounded-lg bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-1 hover:bg-[#1E3A8A]/90 transition cursor-pointer shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Exporter</span>
                        </button>
                      </div>

                      {/* Review Legal Docs */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0]">
                        <div>
                          <div className="font-bold text-[#0F172A]">Conditions &amp; Confidentialité</div>
                          <div className="text-[10px] text-[#64748B]">Conditions Générales v1.0 acceptées lors du premier lancement</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsPrivacyModalOpen(true)}
                          className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-[#1E3A8A] font-bold text-xs hover:bg-[#F8FAFC] transition cursor-pointer shrink-0"
                        >
                          Consulter
                        </button>
                      </div>

                      {/* Delete Account */}
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                        <div className="font-bold text-rose-800 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Suppression de mon compte et de mes données</span>
                        </div>
                        <p className="text-[11px] text-rose-700 leading-relaxed">
                          Conformément à l'article 32 de la Loi L/2016/037/AN, vous avez le droit de demander l'effacement immédiat de toutes vos données enregistrées sur cette application.
                        </p>
                        {showDeleteConfirm ? (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={handleDeleteAccount}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
                            >
                              Confirmer la suppression
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowDeleteConfirm(false)}
                              className="px-3 py-1.5 text-xs text-[#64748B] cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-100 transition cursor-pointer"
                          >
                            Supprimer mon compte définitivement
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {item.id === 'contact' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                        <div className="font-bold text-[#0F172A]">
                          Centre d'assistance Soneya Conakry
                        </div>
                        <div className="text-[#64748B]">
                          Ligne directe : +224 622 00 00 00 / +224 620 00 00 00
                        </div>
                        <div className="text-[#64748B]">
                          Email officiel : contact@guineehubtechnologie.com
                        </div>
                        <div className="text-[10px] text-[#64748B] pt-1">
                          Nos équipes de dispatching basées à Kipé et Kaloum sont disponibles 7j/7 de 7h à 23h.
                        </div>
                      </div>
                    </div>
                  )}

                  {item.id === 'settings' && (
                    <div className="pt-2">
                      <SettingsView />
                    </div>
                  )}

                  {item.id === 'faq' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                        <div className="font-bold text-[#0F172A]">
                          Comment fonctionne le code secret de remise ?
                        </div>
                        <div className="text-[#64748B] text-[11px] leading-relaxed">
                          À chaque commande, un code PIN secret de 4 chiffres est généré. Donnez-le au motard uniquement lorsque vous avez vérifié votre colis en mains propres.
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                        <div className="font-bold text-[#0F172A]">
                          Quels sont les frais de livraison ?
                        </div>
                        <div className="text-[#64748B] text-[11px] leading-relaxed">
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

      {/* Legal & Privacy Policy Link */}
      <div className="flex items-center justify-between px-2 text-xs">
        <button
          onClick={() => setIsPrivacyModalOpen(true)}
          className="text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5 transition cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <span>Politique de confidentialité &amp; CGU (v1.0)</span>
        </button>
      </div>

      {/* Log Out Button */}
      {user && (
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3.5 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs min-h-[46px]"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Déconnexion</span>
          </button>
        </div>
      )}

      {/* Footer Branding Guinée Hub Technologie */}
      <div className="flex flex-col items-center justify-center gap-1.5 pt-4">
        <div className="text-[10px] text-center text-[#64748B]">
          Développé et opéré par <strong className="text-[#1E3A8A]">Guinée Hub Technologie</strong> · Conakry, Guinée
        </div>
      </div>
    </div>
  );
};
