import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X, FileText, Lock, Building2, Phone, Mail, MapPin, CheckCircle2, Scale } from 'lucide-react';

export const PrivacyPolicyModal: React.FC = () => {
  const { isPrivacyModalOpen, setIsPrivacyModalOpen } = useApp();

  if (!isPrivacyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B1E]/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90dvh] rounded-3xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between shrink-0 bg-white dark:bg-[#0C1913] gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0B7A4B] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-extrabold text-sm sm:text-base text-[#0B2B1E] dark:text-white truncate">
                Politique de Confidentialité & Mentions Légales
              </h2>
              <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70 truncate">
                Soneya Delivery · Développé par Guinée Hub Technologie
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPrivacyModalOpen(false)}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full text-[#2F4F42] hover:text-[#0B2B1E] dark:text-emerald-200/70 dark:hover:text-white hover:bg-emerald-50 dark:hover:bg-[#13291F] flex items-center justify-center transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs text-[#2F4F42] dark:text-emerald-100/85 leading-relaxed">
          {/* Identity Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 font-heading font-extrabold text-sm text-[#0B7A4B] dark:text-[#FFB81F]">
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Éditeur & Développeur Officiel</span>
            </div>
            <p className="text-[#0B2B1E] dark:text-emerald-100">
              L'application mobile et plateforme web <strong>Soneya Delivery</strong> est conçue, développée, hébergée et opérée en exclusivité par l'entreprise de solutions technologiques :
            </p>
            <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] font-medium space-y-1 text-[11px] text-[#0B2B1E] dark:text-white border border-emerald-100 dark:border-[#1E3B2D]">
              <div className="font-heading font-extrabold text-xs text-[#0B7A4B] dark:text-[#FFB81F]">
                GUINÉE HUB TECHNOLOGIE
              </div>
              <div className="flex items-center gap-1.5 text-[#2F4F42] dark:text-emerald-200/70">
                <MapPin className="w-3.5 h-3.5 text-[#0B7A4B] shrink-0" />
                <span>Siège social : Conakry, République de Guinée</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#2F4F42] dark:text-emerald-200/70 break-all">
                <Mail className="w-3.5 h-3.5 text-[#0B7A4B] shrink-0" />
                <span>Email légal : contact@guineehubtechnologie.com</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#2F4F42] dark:text-emerald-200/70">
                <Phone className="w-3.5 h-3.5 text-[#0B7A4B] shrink-0" />
                <span>Support & Partenariats : +224 622 78 90 00 / +224 664 00 00 00</span>
              </div>
            </div>
          </div>

          {/* Section 1: Conformité Lois Guinéennes */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span>1. Cadre Légal & Réglementaire en République de Guinée</span>
            </h3>
            <p>
              Guinée Hub Technologie s'engage au strict respect de la <strong>Loi L/2016/037/AN</strong> relative à la cybersécurité et la protection des données à caractère personnel en République de Guinée, ainsi qu'aux directives de l'<strong>ARPT</strong> (Autorité de Régulation des Postes et Télécommunications).
            </p>
          </div>

          {/* Section 2: Données Collectées */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span>2. Données collectées et finalités</span>
            </h3>
            <p>Pour assurer la bonne exécution des commandes à Conakry, nous recueillons uniquement les informations nécessaires :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Clients :</strong> Nom, numéro de téléphone guinéen (+224), commune, quartier et points de repère de livraison.</li>
              <li><strong>Géolocalisation & Google Maps Platform :</strong> Utilisée uniquement avec votre consentement explicite (révocable dans les réglages du navigateur) pour rechercher votre adresse, calculer la distance exacte et suivre la livraison en direct. L'utilisation des cartes, de la recherche d'adresses et des itinéraires est soumise aux{' '}
                <a href="https://maps.google.com/help/terms_maps/" target="_blank" rel="noopener noreferrer" className="underline text-[#0B7A4B] dark:text-[#FFB81F] font-semibold">
                  Conditions supplémentaires d'utilisation de Google Maps
                </a>{' '}
                et aux{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[#0B7A4B] dark:text-[#FFB81F] font-semibold">
                  Règles de confidentialité Google
                </a>.
              </li>
              <li><strong>Commerçants & Partenaires :</strong> Nom de l'établissement, statut commercial, coordonnées du gérant, carte et prix des articles en GNF.</li>
              <li><strong>Livreurs :</strong> Permis de conduire moto, pièce d'identité biométrique, plaque d'immatriculation et historique de courses.</li>
            </ul>
          </div>

          {/* Section 3: Sécurité des Paiements */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span>3. Sécurité des Paiements Mobile Money</span>
            </h3>
            <p>
              Les règlements via <strong>Orange Money Guinée</strong> et <strong>MTN Mobile Money</strong> s'effectuent par protocoles chiffrés directs.
            </p>
            <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0B7A4B] shrink-0" />
              <span className="text-[11px] font-semibold text-[#0B2B1E] dark:text-emerald-100">
                Soneya Delivery et Guinée Hub Technologie n'ont jamais accès à votre code secret Orange Money ou PIN MTN MoMo.
              </span>
            </div>
          </div>

          {/* Section 4: Non-vente des données */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F]" />
              <span>4. Engagement de Confidentialité</span>
            </h3>
            <p>
              Vos informations personnelles ne sont <strong>ni vendues, ni louées, ni cédées</strong> à des tiers à des fins publicitaires. Elles ne sont partagées qu'avec le livreur assigné à votre commande pour assurer le dépôt du colis.
            </p>
          </div>

          {/* Section 5: Droits de l'Utilisateur */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#0B2B1E] dark:text-white">
              5. Droits d'Accès et de Rectification
            </h3>
            <p>
              Conformément à la réglementation guinéenne, tout utilisateur peut à tout moment demander l'accès, la rectification ou la suppression définitive de son compte et de ses données en écrivant à : <code className="text-[#0B7A4B] dark:text-[#FFB81F] font-bold">support@guineehubtechnologie.com</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/70">
            Dernière mise à jour : 2026 · Guinée Hub Tech
          </span>
          <button
            onClick={() => setIsPrivacyModalOpen(false)}
            className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-semibold text-xs shadow-xs transition"
          >
            J'ai compris & J'accepte
          </button>
        </div>
      </div>
    </div>
  );
};
