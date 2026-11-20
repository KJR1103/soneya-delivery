import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CONAKRY_QUARTIERS } from '../../utils/geo';
import { calculateDistanceKm, calculateDeliveryFeeGnf } from '../../utils/geo';
import { formatGnf } from '../../utils/formatters';
import {
  Package,
  X,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Lock,
  Clock,
  Bike,
  FileText,
  ShoppingBag,
} from 'lucide-react';

interface ExpressParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpressParcelModal: React.FC<ExpressParcelModalProps> = ({ isOpen, onClose }) => {
  const { soundEnabled } = useApp();

  const [senderQuartierId, setSenderQuartierId] = useState(CONAKRY_QUARTIERS[0].id);
  const [recipientQuartierId, setRecipientQuartierId] = useState(CONAKRY_QUARTIERS[2].id);
  const [senderPhone, setSenderPhone] = useState('+224 622 ');
  const [recipientPhone, setRecipientPhone] = useState('+224 664 ');
  const [parcelType, setParcelType] = useState<'document' | 'light' | 'box'>('document');
  const [description, setDescription] = useState('Dossier urgent / Plis fermé');
  const [operator, setOperator] = useState<'orange' | 'mtn'>('orange');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [generatedCode, setGeneratedCode] = useState('4892');

  if (!isOpen) return null;

  const senderQ = CONAKRY_QUARTIERS.find(q => q.id === senderQuartierId) || CONAKRY_QUARTIERS[0];
  const recipientQ = CONAKRY_QUARTIERS.find(q => q.id === recipientQuartierId) || CONAKRY_QUARTIERS[2];

  const distanceKm = calculateDistanceKm(senderQ.lat, senderQ.lng, recipientQ.lat, recipientQ.lng);
  const feeInfo = calculateDeliveryFeeGnf(distanceKm);
  const totalCostGnf = feeInfo.feeGnf + 3000; // fee + service

  const handleConfirmOrder = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(randomCode);
    setStep('success');
  };

  const handleReset = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B2B1E]/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90dvh] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#0C1913] border-b border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0B7A4B] dark:text-[#FFB81F] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center justify-center font-bold shadow-xs shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-extrabold text-base sm:text-lg truncate">
                Soneya Colis Express Conakry
              </h3>
              <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70 truncate">
                Course moto immédiate · Preuve par code secret à 4 chiffres
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#2F4F42] dark:text-emerald-200/70 hover:bg-emerald-50 flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {step === 'form' ? (
            <>
              {/* Value proposition pill */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs text-[#2F4F42] dark:text-emerald-100/85 flex items-center gap-2.5 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
                <span>
                  <strong className="text-[#0B2B1E] dark:text-white">Tarif transparent :</strong> calculé au kilomètre GPS exact ({formatGnf(feeInfo.feeGnf)}) et remise uniquement contre code à 4 chiffres.
                </span>
              </div>

              {/* Point de départ et Destination */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B2B1E] dark:text-emerald-100 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B7A4B]" />
                    <span>Lieu de ramassage (Expéditeur)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={senderQuartierId}
                      onChange={(e) => setSenderQuartierId(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs font-semibold text-[#0B2B1E] dark:text-white"
                    >
                      {CONAKRY_QUARTIERS.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.name} ({q.commune})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="Tél. expéditeur (+224)"
                      className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs text-[#0B2B1E] dark:text-white placeholder-[#5C7A6E]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B2B1E] dark:text-emerald-100 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FFB81F]" />
                    <span>Lieu de livraison (Destinataire)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={recipientQuartierId}
                      onChange={(e) => setRecipientQuartierId(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs font-semibold text-[#0B2B1E] dark:text-white"
                    >
                      {CONAKRY_QUARTIERS.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.name} ({q.commune})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="Tél. destinataire (+224)"
                      className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs text-[#0B2B1E] dark:text-white placeholder-[#5C7A6E]"
                    />
                  </div>
                </div>
              </div>

              {/* Type de colis */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0B2B1E] dark:text-emerald-100">
                  Type de paquet
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setParcelType('document');
                      setDescription('Documents confidentiels / Plis administratifs');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      parcelType === 'document'
                        ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0B7A4B] dark:text-white font-bold'
                        : 'border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Documents</span>
                    </div>
                    <div className="text-[10px] opacity-75">Enveloppe, clés</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setParcelType('light');
                      setDescription('Petit colis (< 5 kg)');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      parcelType === 'light'
                        ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0B7A4B] dark:text-white font-bold'
                        : 'border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Package className="w-3.5 h-3.5" />
                      <span>Colis Léger</span>
                    </div>
                    <div className="text-[10px] opacity-75">Moins de 5 kg</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setParcelType('box');
                      setDescription('Colis moyen (5 à 15 kg)');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      parcelType === 'box'
                        ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0B7A4B] dark:text-white font-bold'
                        : 'border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Paquet Moyen</span>
                    </div>
                    <div className="text-[10px] opacity-75">Carton, sacs</div>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0B2B1E] dark:text-emerald-100">
                  Précisions pour le motard Soneya
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex : Remettre à l'accueil, demander M. Sylla..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-xs text-[#0B2B1E] dark:text-white placeholder-[#5C7A6E] focus:outline-none focus:border-[#0B7A4B]"
                />
              </div>

              {/* Mode de règlement 100% Mobile Money */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0B2B1E] dark:text-emerald-100">
                  Règlement Mobile Money
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOperator('orange')}
                    className={`min-h-[44px] p-2.5 rounded-xl border flex items-center gap-2 transition cursor-pointer ${
                      operator === 'orange'
                        ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0B7A4B] dark:text-white font-bold'
                        : 'border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-200/70'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      OM
                    </div>
                    <span className="text-xs">Orange Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOperator('mtn')}
                    className={`min-h-[44px] p-2.5 rounded-xl border flex items-center gap-2 transition cursor-pointer ${
                      operator === 'mtn'
                        ? 'border-[#0B7A4B] bg-emerald-50/70 dark:bg-emerald-950/40 text-[#0B7A4B] dark:text-white font-bold'
                        : 'border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-200/70'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-[#FFB81F] text-[#0B2B1E] flex items-center justify-center text-[10px] font-bold shrink-0">
                      MTN
                    </div>
                    <span className="text-xs">MTN MoMo</span>
                  </button>
                </div>
              </div>

              {/* Résumé du calcul officiel Soneya */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] space-y-1.5 text-xs shadow-xs">
                <div className="flex justify-between gap-2 text-[#2F4F42] dark:text-emerald-200/70">
                  <span>Distance calculée GPS :</span>
                  <span className="font-semibold text-[#0B2B1E] dark:text-white text-right">
                    {distanceKm} km (Haversine × 1.3 Conakry)
                  </span>
                </div>
                <div className="flex justify-between gap-2 text-[#2F4F42] dark:text-emerald-200/70">
                  <span>Frais de course livreur (80% pour lui) :</span>
                  <span className="font-semibold text-[#0B2B1E] dark:text-white">
                    {formatGnf(feeInfo.feeGnf)}
                  </span>
                </div>
                <div className="flex justify-between gap-2 text-[#2F4F42] dark:text-emerald-200/70">
                  <span>Frais de service Soneya :</span>
                  <span className="font-semibold text-[#0B2B1E] dark:text-white">
                    3 000 GNF
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D] flex justify-between font-bold text-sm text-[#0B2B1E] dark:text-white">
                  <span>Total à régler :</span>
                  <span className="text-[#0B7A4B] dark:text-[#FFB81F]">
                    {formatGnf(totalCostGnf)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full min-h-[48px] py-3 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Bike className="w-4 h-4 shrink-0" />
                <span>Confirmer la course express ({formatGnf(totalCostGnf)})</span>
              </button>
            </>
          ) : (
            /* Success confirmation */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0B7A4B] dark:text-emerald-400 flex items-center justify-center mx-auto border border-[#D4E9DD] dark:border-[#1E3B2D] shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-heading font-black text-lg text-[#0B2B1E] dark:text-white">
                  Course Express Assignée !
                </h4>
                <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70 mt-1 max-w-sm mx-auto">
                  Le motard certifié Soneya le plus proche de {senderQ.name} a été alerté et se met en route.
                </p>
              </div>

              {/* Secret code card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#10231B] text-[#0B2B1E] dark:text-white max-w-xs mx-auto space-y-1 shadow-xs border border-[#D4E9DD] dark:border-[#1E3B2D]">
                <div className="text-[11px] uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70 font-bold flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#FFB81F]" />
                  <span>Code secret de remise</span>
                </div>
                <div className="font-mono text-3xl font-black tracking-widest text-[#0B7A4B] dark:text-[#FFB81F]">
                  {generatedCode}
                </div>
                <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/60">
                  À transmettre au destinataire ({recipientPhone}) pour valider la réception.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] text-xs text-[#2F4F42] dark:text-emerald-100 text-left space-y-1 border border-[#D4E9DD] dark:border-[#1E3B2D]">
                <div><strong className="text-[#0B2B1E] dark:text-white">Livreur :</strong> Mamadou Bah (TVS Apache 150cc · CNI vérifiée)</div>
                <div><strong className="text-[#0B2B1E] dark:text-white">Trajet :</strong> {senderQ.name} → {recipientQ.name} ({distanceKm} km)</div>
                <div><strong className="text-[#0B2B1E] dark:text-white">Règlement :</strong> {formatGnf(totalCostGnf)} via {operator === 'orange' ? 'Orange Money' : 'MTN MoMo'}</div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-bold text-xs transition cursor-pointer"
              >
                Retour à l'accueil Soneya
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
