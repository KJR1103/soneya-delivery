import React, { useState } from 'react';
import { PaymentMethod } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { Smartphone, ShieldCheck, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalGnf: number;
  paymentMethod: PaymentMethod;
  onSuccess: (paymentDetails: { method: PaymentMethod; phone?: string }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  totalGnf,
  paymentMethod,
  onSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(
    paymentMethod === 'orange_money' ? '622 45 67 89' : '662 12 34 56'
  );
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [ussdPrompt, setUssdPrompt] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    setStep('processing');
    const txId = `${paymentMethod === 'orange_money' ? 'OM' : 'MOMO'}-GN-${Date.now().toString().slice(-6)}`;
    setTransactionId(txId);

    if (paymentMethod === 'orange_money') {
      setTimeout(() => {
        setUssdPrompt(true);
      }, 800);
      setTimeout(() => {
        setUssdPrompt(false);
        setStep('success');
        setTimeout(() => {
          onSuccess({ method: paymentMethod, phone: phoneNumber });
        }, 1400);
      }, 2600);
    } else {
      setTimeout(() => {
        setUssdPrompt(true);
      }, 700);
      setTimeout(() => {
        setUssdPrompt(false);
        setStep('success');
        setTimeout(() => {
          onSuccess({ method: paymentMethod, phone: phoneNumber });
        }, 1400);
      }, 2400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B1E]/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0C1913] shadow-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] my-auto">
        {/* Header */}
        <div className="p-4 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between bg-white dark:bg-[#0C1913] sticky top-0 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0B7A4B] dark:text-[#FFB81F] flex items-center justify-center font-bold border border-[#D4E9DD] dark:border-[#1E3B2D] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-extrabold text-sm text-[#0B2B1E] dark:text-white truncate">
                Paiement 100% Mobile Money
              </h3>
              <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/70 truncate">
                Guinée Hub Technologie · Soneya Delivery
              </p>
            </div>
          </div>
          {step === 'input' && (
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-9 h-9 rounded-full text-[#2F4F42] hover:text-[#0B2B1E] hover:bg-emerald-50 dark:text-emerald-200/70 dark:hover:text-white dark:hover:bg-[#13291F] flex items-center justify-center shrink-0 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Amount banner */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#10231B] text-center border border-[#D4E9DD] dark:border-[#1E3B2D]">
            <div className="text-[11px] font-semibold text-[#2F4F42] dark:text-emerald-200/70">Total net à régler</div>
            <div className="font-heading font-black text-2xl text-[#0B2B1E] dark:text-white mt-0.5">
              {formatGnf(totalGnf)}
            </div>
            <div className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/60 mt-1">
              Paiement sans espèces · 100% sécurisé et traçable
            </div>
          </div>

          {step === 'input' && (
            <div className="space-y-4">
              {paymentMethod === 'orange_money' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400">
                    <div className="w-5 h-5 rounded-md bg-orange-600 text-white flex items-center justify-center font-black text-[9px]">
                      OM
                    </div>
                    <span>Orange Money Guinée (#144#)</span>
                  </div>
                  <label className="text-xs font-semibold text-[#2F4F42] dark:text-emerald-100/80 block">
                    Numéro de compte Orange Money
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
                      +224
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="622 XX XX XX"
                      className="w-full pl-14 pr-4 py-3 text-sm font-semibold rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:border-orange-500 dark:text-white"
                    />
                  </div>
                  <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/70 leading-relaxed">
                    Une notification USSD <strong>#144#</strong> apparaîtra sur votre téléphone pour valider avec votre code secret personnel Orange Money.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <div className="w-5 h-5 rounded-md bg-[#FFB81F] text-[#0B2B1E] flex items-center justify-center font-black text-[9px]">
                      MTN
                    </div>
                    <span>MTN Mobile Money Guinée (*440#)</span>
                  </div>
                  <label className="text-xs font-semibold text-[#2F4F42] dark:text-emerald-100/80 block">
                    Numéro de compte MTN MoMo
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0B7A4B] dark:text-[#FFB81F]">
                      +224
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="662 XX XX XX"
                      className="w-full pl-14 pr-4 py-3 text-sm font-semibold rounded-xl bg-white dark:bg-[#10231B] text-[#0B2B1E] border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:border-[#FFB81F] dark:text-white"
                    />
                  </div>
                  <p className="text-[11px] text-[#2F4F42] dark:text-emerald-200/70 leading-relaxed">
                    Un message Push apparaîtra instantanément sur votre terminal MTN pour approuver la transaction.
                  </p>
                </div>
              )}

              {/* Zero Cash Zero Card Guarantee Note */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[11px] text-[#2F4F42] dark:text-emerald-200/80 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#0B2B1E] dark:text-white">Garantie sécurité Soneya :</strong> Les motards ne transportent aucune espèce. Tous les débits sont sécurisés via l'agrégateur Mobile Money officiel.
                </span>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full min-h-[46px] py-3.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white font-heading font-bold text-sm shadow-xs transition cursor-pointer"
              >
                Payer {formatGnf(totalGnf)}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#0B7A4B] dark:text-[#FFB81F] animate-spin" />
              <div className="font-heading font-bold text-base text-[#0B2B1E] dark:text-white">
                {paymentMethod === 'orange_money'
                  ? 'Connexion à Orange Money Guinée...'
                  : 'Connexion au serveur MTN MoMo...'}
              </div>

              {ussdPrompt && (
                <div className="p-3.5 bg-[#0B2B1E] text-white rounded-xl font-mono text-xs w-full text-left border border-[#164734] animate-in zoom-in-95 space-y-1">
                  <div className="font-bold text-[#FFB81F]">
                    {paymentMethod === 'orange_money' ? 'Session USSD Orange Money (#144#) :' : 'Notification Push MTN MoMo :'}
                  </div>
                  <div className="text-white">Débit Soneya Delivery : {formatGnf(totalGnf)}</div>
                  <div className="text-emerald-200/75 text-[10px]">Réf transaction : {transactionId}</div>
                  <div className="text-emerald-300 text-[11px] mt-1 font-semibold flex items-center gap-1">
                    <span>Code PIN validé avec succès</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-[#0B7A4B] dark:text-emerald-400" />
              <div className="font-heading font-black text-lg text-[#0B2B1E] dark:text-white">
                Paiement Mobile Money Confirmé !
              </div>
              <p className="text-xs text-[#2F4F42] dark:text-emerald-200/70">
                Reçu généré ({transactionId}). La commande a été transmise au commerçant.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
