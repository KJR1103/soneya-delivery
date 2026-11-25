import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, Check } from 'lucide-react';

export const LEGAL_VERSION = '1.0';

export interface ConsentRecord {
  terms: true;
  privacy: true;
  marketing: boolean;
  version: string;
  acceptedAt: string;
}

interface ConsentGateProps {
  isOpen: boolean;
  onAccept: (consent: ConsentRecord) => void;
  onClose?: () => void;
}

export const ConsentGate: React.FC<ConsentGateProps> = ({
  isOpen,
  onAccept,
  onClose,
}) => {
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [activeDoc, setActiveDoc] = useState<'terms' | 'privacy' | 'data' | null>(null);

  if (!isOpen) return null;

  const isFormValid = terms && privacy;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onAccept({
      terms: true,
      privacy: true,
      marketing,
      version: LEGAL_VERSION,
      acceptedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm m-reveal">
      <div className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#DCE3F4] text-[#1E3A8A] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#1E3A8A] font-headline">
              Avant de commencer
            </h1>
            <p className="text-xs text-[#64748B]">
              Conformité Loi L/2016/037/AN (Protection des données en Guinée)
            </p>
          </div>
        </div>

        <p className="text-sm text-[#0F172A] leading-relaxed">
          Pour utiliser Soneya Delivery à Conakry en toute sécurité, veuillez lire et accepter nos conditions de service et notre politique de confidentialité.
        </p>

        {/* Document buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveDoc('terms')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
              activeDoc === 'terms'
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                : 'bg-[#F8FAFC] text-[#1E3A8A] border-[#E2E8F0] hover:bg-[#DCE3F4]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Conditions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDoc('privacy')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
              activeDoc === 'privacy'
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                : 'bg-[#F8FAFC] text-[#1E3A8A] border-[#E2E8F0] hover:bg-[#DCE3F4]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Confidentialité</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDoc('data')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
              activeDoc === 'data'
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                : 'bg-[#F8FAFC] text-[#1E3A8A] border-[#E2E8F0] hover:bg-[#DCE3F4]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Vos Données</span>
          </button>
        </div>

        {/* Inline document preview if selected */}
        {activeDoc && (
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] max-h-40 overflow-y-auto leading-relaxed">
            {activeDoc === 'terms' && (
              <div>
                <strong className="text-[#1E3A8A] block mb-1">Conditions Générales d'Utilisation (v1.0)</strong>
                Soneya Delivery met en relation des clients, des livreurs indépendants et des commerçants à Conakry. Les paiements s'effectuent par Mobile Money (Orange Money, MTN MoMo). Les commandes passées engagent le client et le commerçant dès validation.
              </div>
            )}
            {activeDoc === 'privacy' && (
              <div>
                <strong className="text-[#1E3A8A] block mb-1">Politique de Confidentialité (v1.0)</strong>
                Vos données personnelles (numéro de téléphone, adresse et coordonnées GPS lors d'une livraison active) sont exclusivement utilisées pour l'exécution des commandes et ne sont jamais revendues à des tiers.
              </div>
            )}
            {activeDoc === 'data' && (
              <div>
                <strong className="text-[#1E3A8A] block mb-1">Utilisation de vos Données</strong>
                Conformément à la législation guinéenne, vous conservez un droit total d'accès, d'exportation et de suppression de vos données personnelles via votre profil Soneya, section "Mes données".
              </div>
            )}
          </div>
        )}

        {/* Consent Checkboxes */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex items-start gap-2.5 text-xs text-[#0F172A] cursor-pointer">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#1E3A8A] accent-[#1E3A8A]"
            />
            <span>
              J'ai lu et j'accepte les <strong>Conditions Générales d'Utilisation</strong> (v{LEGAL_VERSION})
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-xs text-[#0F172A] cursor-pointer">
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#1E3A8A] accent-[#1E3A8A]"
            />
            <span>
              J'ai lu et j'accepte la <strong>Politique de Confidentialité</strong> et le traitement de mes données de livraison.
            </span>
          </label>

          <label className="flex items-start gap-2.5 text-xs text-[#64748B] cursor-pointer">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#1E3A8A] accent-[#1E3A8A]"
            />
            <span>
              J'accepte de recevoir des offres promotionnelles et codes de réduction Soneya (facultatif).
            </span>
          </label>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full h-13 mt-2 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${
              isFormValid
                ? 'bg-[#D8432F] text-white hover:opacity-95 cursor-pointer active:scale-98'
                : 'bg-[#E2E8F0] text-[#64748B] cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Accepter et continuer sur Soneya</span>
          </button>
        </form>

        <p className="text-[11px] text-center text-[#64748B]">
          Vous pouvez modifier ou retirer vos consentements à tout moment dans Profil &gt; Mes données.
        </p>
      </div>
    </div>
  );
};
