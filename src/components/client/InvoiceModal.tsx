import React, { useState } from 'react';
import { Order } from '../../types';
import { formatGnf, formatTime } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { X, Printer, Mail, CheckCircle2, Download, FileText, QrCode } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { showToast, user } = useApp();
  const [emailSent, setEmailSent] = useState(false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    const targetEmail = user?.email || 'votre.email@gmail.com';
    showToast('Facture envoyée', `Reçu officiel envoyé à ${targetEmail}`, 'success');
    setTimeout(() => setEmailSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2B1E]/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90dvh] rounded-3xl bg-white dark:bg-[#0C1913] border border-[#E2ECE7] dark:border-[#1E3B2D] shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header toolbar */}
        <div className="p-3.5 sm:p-4 border-b border-[#E2ECE7] dark:border-[#1E3B2D] flex items-center justify-between bg-white dark:bg-[#0C1913] gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-[#0B7A4B] dark:text-[#FFB81F] shrink-0" />
            <span className="font-heading font-extrabold text-xs sm:text-sm text-[#0B2B1E] dark:text-white truncate">
              Facture & Reçu Officiel Soneya
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrint}
              className="w-9 h-9 rounded-xl text-[#2F4F42] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#13291F] flex items-center justify-center transition"
              title="Imprimer ou enregistrer en PDF"
              aria-label="Imprimer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleSendEmail}
              className="w-9 h-9 rounded-xl text-[#2F4F42] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#13291F] flex items-center justify-center transition"
              title="Recevoir par e-mail"
              aria-label="Envoyer par e-mail"
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-9 h-9 rounded-full text-[#2F4F42] hover:text-[#0B2B1E] hover:bg-emerald-50 dark:text-emerald-200/70 dark:hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs text-[#2F4F42] dark:text-emerald-100/85 print:text-black">
          {/* Top Brand & Invoice Number */}
          <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#E2ECE7] dark:border-[#1E3B2D]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0B7A4B] text-white flex items-center justify-center font-black text-sm shrink-0">
                  S
                </div>
                <div>
                  <span className="font-heading font-black text-base text-[#0B2B1E] dark:text-white tracking-tight">
                    SONEYA DELIVERY
                  </span>
                  <p className="text-[10px] text-[#0B7A4B] dark:text-[#FFB81F] font-bold">
                    Conakry commande. Soneya livre.
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-[#5C7A6E] dark:text-emerald-200/60 mt-1">
                Développé par Guinée Hub Technologie (GHT) · Conakry, Guinée
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-mono text-[#5C7A6E] uppercase">Facture N°</span>
              <div className="font-heading font-black text-xs text-[#0B2B1E] dark:text-white">
                FAC-{order.trackingNumber}
              </div>
              <div className="text-[10px] text-[#5C7A6E] mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('fr-FR')} {formatTime(order.createdAt)}
              </div>
              {order.deliveryCode && (
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white font-mono font-black text-[10px] border border-[#D4E9DD] dark:border-[#1E3B2D]">
                  Code : {order.deliveryCode}
                </div>
              )}
            </div>
          </div>

          {/* Client & Merchant Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[11px]">
            <div className="min-w-0">
              <span className="font-bold text-[#5C7A6E] uppercase text-[9px]">Client :</span>
              <div className="font-bold text-[#0B2B1E] dark:text-white mt-0.5 truncate">{order.clientName}</div>
              <div className="text-[#2F4F42] dark:text-emerald-200/70">{order.clientPhone}</div>
              <div className="text-[#2F4F42] dark:text-emerald-200/70 truncate">{order.clientAddress}</div>
              {order.deliveryLandmark && (
                <div className="text-[#2F4F42] dark:text-emerald-100 italic text-[10px] mt-0.5">
                  Repère: {order.deliveryLandmark}
                </div>
              )}
            </div>

            <div className="sm:text-right min-w-0">
              <span className="font-bold text-[#5C7A6E] uppercase text-[9px]">Partenaire / Marchand :</span>
              <div className="font-bold text-[#0B2B1E] dark:text-white mt-0.5 truncate">{order.partnerName}</div>
              <div className="text-[#2F4F42] dark:text-emerald-200/70">{order.partnerPhone}</div>
              <div className="text-[#2F4F42] dark:text-emerald-200/70 truncate">{order.partnerAddress}</div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[10px] text-[#5C7A6E]">
              Désignation des articles
            </div>
            <div className="divide-y divide-[#E2ECE7] dark:divide-[#1E3B2D]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <span className="font-bold text-[#0B2B1E] dark:text-white">
                      {item.quantity}x {item.product.name}
                    </span>
                    {item.selectedOption && (
                      <div className="text-[10px] text-[#5C7A6E]">
                        Option: {item.selectedOption.name}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-[#0B2B1E] dark:text-white shrink-0">
                    {formatGnf(item.product.priceGnf * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="pt-3 border-t border-[#E2ECE7] dark:border-[#1E3B2D] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#2F4F42] dark:text-emerald-200/70">
              <span>Sous-total articles</span>
              <span className="font-semibold text-[#0B2B1E] dark:text-white">
                {formatGnf(order.itemsSubtotalGnf)}
              </span>
            </div>

            <div className="flex justify-between text-[#2F4F42] dark:text-emerald-200/70">
              <span>Frais de livraison GPS ({order.deliveryDistanceKm} km)</span>
              <span className="font-semibold text-[#0B2B1E] dark:text-white">
                {formatGnf(order.deliveryFeeGnf)}
              </span>
            </div>

            <div className="flex justify-between text-[#2F4F42] dark:text-emerald-200/70">
              <span>Frais de service plateforme</span>
              <span className="font-semibold text-[#0B2B1E] dark:text-white">
                {formatGnf(order.serviceFeeGnf || 3000)}
              </span>
            </div>

            {order.tipGnf > 0 && (
              <div className="flex justify-between text-[#2F4F42] dark:text-emerald-200/70">
                <span>Pourboire livreur</span>
                <span className="font-semibold text-[#0B2B1E] dark:text-white">
                  {formatGnf(order.tipGnf)}
                </span>
              </div>
            )}

            {order.discountGnf > 0 && (
              <div className="flex justify-between text-[#0B7A4B] dark:text-emerald-400 font-semibold">
                <span>Remise promotionnelle</span>
                <span>-{formatGnf(order.discountGnf)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D] flex justify-between items-baseline text-sm font-extrabold text-[#0B2B1E] dark:text-white">
              <span>Montant Net Réglé</span>
              <span className="font-heading font-black text-xl text-[#0B7A4B] dark:text-[#FFB81F]">
                {formatGnf(order.totalGnf)}
              </span>
            </div>
          </div>

          {/* Payment & Security Footer */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] flex items-center justify-between text-[11px]">
            <div>
              <span className="font-bold text-[#0B2B1E] dark:text-white">
                Statut : Payé 100% Mobile Money
              </span>
              <div className="text-[#2F4F42] dark:text-emerald-200/70">
                Opérateur : {order.paymentMethod === 'orange_money' ? 'Orange Money Guinée' : 'MTN MoMo Guinée'}
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#0B7A4B] dark:text-emerald-400 shrink-0" />
          </div>

          {order.deliveryCode && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-center text-[10px] text-[#2F4F42] dark:text-emerald-100">
              Code de livraison sécurisé remis au motard : <strong className="font-mono text-xs font-black text-[#0B2B1E] dark:text-white">{order.deliveryCode}</strong> (Preuve de remise 100% sans papier)
            </div>
          )}

          <div className="text-center text-[10px] text-[#5C7A6E] pt-2 border-t border-[#E2ECE7] dark:border-[#1E3B2D]">
            Merci d'avoir commandé sur Soneya Delivery — Guinée Hub Technologie (GHT), Conakry
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleSendEmail}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-[#D4E9DD] dark:border-[#1E3B2D] bg-white dark:bg-[#10231B] text-xs font-bold text-[#0B2B1E] dark:text-white hover:bg-emerald-50 dark:hover:bg-[#13291F] flex items-center justify-center gap-1.5 transition"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{emailSent ? 'Envoyé !' : 'Envoyer par e-mail'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-[#0B7A4B] hover:bg-[#08613B] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger / Imprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
