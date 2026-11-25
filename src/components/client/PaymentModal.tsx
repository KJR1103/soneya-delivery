import React, { useState } from 'react';
import { PaymentMethod } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { ShieldCheck, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto m-reveal">
      <div className="w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-2xl bg-[#FFFFFF] shadow-2xl border border-[#E2E8F0] my-auto text-[#0F172A]">
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FFFFFF] sticky top-0 z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#DCE3F4] text-[#1E3A8A] flex items-center justify-center font-bold border border-[#E2E8F0] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-headline font-extrabold text-sm text-[#0F172A] truncate">
                Paiement 100% Mobile Money
              </h3>
              <p className="text-[11px] text-[#64748B] truncate">
                Guinée Hub Technologie · Soneya Delivery
              </p>
            </div>
          </div>
          {step === 'input' && (
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-9 h-9 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] flex items-center justify-center shrink-0 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Amount banner */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] text-center border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#64748B]">Total net à régler</div>
            <div className="font-headline font-black text-2xl text-[#1E3A8A] mt-0.5">
              {formatGnf(totalGnf)}
            </div>
            <div className="text-[10px] text-[#64748B] mt-1">
              Paiement sans espèces · 100% sécurisé et traçable en GNF
            </div>
          </div>

          {step === 'input' && (
            <div className="space-y-4">
              {paymentMethod === 'orange_money' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                    <div className="w-5 h-5 rounded-md bg-orange-600 text-white flex items-center justify-center font-black text-[9px]">
                      OM
                    </div>
                    <span>Orange Money Guinée (#144#)</span>
                  </div>
                  <label className="text-xs font-semibold text-[#0F172A] block">
                    Numéro de compte Orange Money
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A8A]">
                      +224
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="622 XX XX XX"
                      className="w-full pl-14 pr-4 py-3 text-sm font-semibold rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Une notification USSD <strong>#144#</strong> apparaîtra sur votre téléphone pour valider avec votre code secret personnel Orange Money.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-yellow-600">
                    <div className="w-5 h-5 rounded-md bg-[#F4B028] text-[#0F172A] flex items-center justify-center font-black text-[9px]">
                      MTN
                    </div>
                    <span>MTN Mobile Money Guinée (*440#)</span>
                  </div>
                  <label className="text-xs font-semibold text-[#0F172A] block">
                    Numéro de compte MTN MoMo
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1E3A8A]">
                      +224
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="662 XX XX XX"
                      className="w-full pl-14 pr-4 py-3 text-sm font-semibold rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Un message Push apparaîtra instantanément sur votre terminal MTN pour approuver la transaction.
                  </p>
                </div>
              )}

              {/* Zero Cash Zero Card Guarantee Note */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#64748B] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#0F172A]">Garantie sécurité Soneya :</strong> Les motards ne transportent aucune espèce. Tous les débits sont sécurisés via l'agrégateur Mobile Money officiel.
                </span>
              </div>

              {/* Primary action CTA: Corail #D8432F */}
              <button
                onClick={handleConfirm}
                className="w-full min-h-[46px] py-3.5 rounded-xl bg-[#D8432F] hover:bg-[#D8432F]/90 text-white font-headline font-bold text-sm shadow-xs transition cursor-pointer active:scale-98"
              >
                Payer {formatGnf(totalGnf)}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#1E3A8A] animate-spin" />
              <div className="font-headline font-bold text-base text-[#0F172A]">
                {paymentMethod === 'orange_money'
                  ? 'Connexion à Orange Money Guinée...'
                  : 'Connexion au serveur MTN MoMo...'}
              </div>

              {ussdPrompt && (
                <div className="p-3.5 bg-[#0F172A] text-white rounded-xl font-mono text-xs w-full text-left border border-[#E2E8F0] animate-in zoom-in-95 space-y-1">
                  <div className="font-bold text-[#F4B028]">
                    {paymentMethod === 'orange_money' ? 'Session USSD Orange Money (#144#) :' : 'Notification Push MTN MoMo :'}
                  </div>
                  <div className="text-white">Débit Soneya Delivery : {formatGnf(totalGnf)}</div>
                  <div className="text-[#DCE3F4] text-[10px]">Réf transaction : {transactionId}</div>
                  <div className="text-emerald-400 text-[11px] mt-1 font-semibold flex items-center gap-1">
                    <span>Code PIN validé avec succès</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-[#1E3A8A]" />
              <div className="font-headline font-black text-lg text-[#0F172A]">
                Paiement Mobile Money Confirmé !
              </div>
              <p className="text-xs text-[#64748B]">
                Reçu généré ({transactionId}). La commande a été transmise au commerçant.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
