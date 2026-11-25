import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf, formatTime } from '../../utils/formatters';
import {
  Receipt,
  Download,
  Navigation,
  Tag,
  Copy,
  Clock,
  CheckCircle2,
  Bike,
  Sparkles,
} from 'lucide-react';

interface OrdersAndReceiptsViewProps {
  onOpenLiveTracking: () => void;
}

export const OrdersAndReceiptsView: React.FC<OrdersAndReceiptsViewProps> = ({ onOpenLiveTracking }) => {
  const {
    orders,
    activeOrder,
    setSelectedInvoiceOrder,
    setSelectedPartnerId,
    partners,
    showToast,
  } = useApp();

  const handleDownloadReceipt = (order: typeof orders[0]) => {
    setSelectedInvoiceOrder(order);
    showToast('Reçu généré', `Génération du reçu officiel ${order.trackingNumber || '#SNY-8419'}`, 'success');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Code promo copié', `${code} copié dans le presse-papier (-20% sur votre commande).`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-5 pb-28 text-[#0F172A] m-reveal">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-[#E2E8F0] -mx-4 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-headline font-extrabold text-xl text-[#0F172A]">
            Commandes &amp; Reçus
          </h1>
          <p className="text-xs text-[#64748B]">
            Historique, factures en GNF et remises actives à Conakry
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#DCE3F4] text-[#1E3A8A] text-xs font-bold shrink-0">
          2 remises actives
        </span>
      </header>

      {/* Active Order Live Banner if any */}
      {activeOrder && activeOrder.status !== 'delivered' && (
        <section className="p-4 rounded-2xl bg-[#DCE3F4]/60 border-2 border-[#1E3A8A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs m-pulse">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1E3A8A] text-white shrink-0">
              <Bike className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#0F172A]">
                  {activeOrder.trackingNumber || '#SNY-8420'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#1E3A8A] text-white text-[10px] font-bold uppercase">
                  En livraison
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                {activeOrder.partnerName} → {activeOrder.clientQuartier || activeOrder.clientAddress} · Arrivée estimée dans 5 min
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLiveTracking}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#1E3A8A]/90 transition cursor-pointer shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>Suivre sur GPS</span>
          </button>
        </section>
      )}

      {/* Active Discounts */}
      <section className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A] block">
            Remise fidélité Conakry
          </span>
          <p className="font-headline font-bold text-base text-[#0F172A] mt-0.5">
            Code <span className="font-mono text-[#D8432F]">SONEYA20</span> (-20%)
          </p>
          <p className="text-xs text-[#64748B]">
            Valable jusqu'à 40 000 GNF de réduction sur vos repas et courses
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleCopyCode('SONEYA20')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] text-xs font-bold hover:bg-[#DCE3F4] transition cursor-pointer shrink-0"
        >
          <Copy className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <span>Copier</span>
        </button>
      </section>

      {/* Downloadable Digital Receipts Section */}
      <section className="flex flex-col gap-3">
        <h2 className="font-headline font-bold text-lg text-[#0F172A]">
          Dernières factures &amp; Reçus numériques
        </h2>

        {/* Featured Sample Receipt */}
        <article className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-[#64748B] font-semibold">
                Reçu #SNY-8419
              </span>
              <h3 className="font-headline font-bold text-base text-[#0F172A] mt-0.5">
                Chez Fanta · Kipé
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#DCE3F4] text-[#1E3A8A] text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Livré</span>
            </span>
          </div>

          <div className="border-y border-[#E2E8F0] py-2.5 flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#0F172A]">1× Maffé Tiga Authentique</span>
              <span className="font-mono font-bold text-[#0F172A]">45 000 GNF</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#0F172A]">1× Riz Gras Capitaine</span>
              <span className="font-mono font-bold text-[#0F172A]">55 000 GNF</span>
            </div>
            <div className="flex items-center justify-between text-[#1E3A8A] font-semibold">
              <span>Remise SONEYA20 (-20%)</span>
              <span className="font-mono">-20 000 GNF</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <span className="text-[11px] text-[#64748B] block">
                Payé via Orange Money · Conakry
              </span>
              <span className="font-headline font-black text-xl text-[#1E3A8A]">
                80 000 GNF
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const sampleOrder = orders[0] || {
                  id: 'sny-8419',
                  trackingNumber: '#SNY-8419',
                  partnerName: 'Chez Fanta',
                  deliveryQuartierName: 'Kipé',
                  totalGnf: 80000,
                  itemsSubtotalGnf: 100000,
                  deliveryFeeGnf: 0,
                  discountGnf: 20000,
                  status: 'delivered',
                  paymentMethod: 'orange_money',
                  createdAt: new Date().toISOString(),
                  items: [
                    { productId: 'p1', name: 'Maffé Tiga Authentique', priceGnf: 45000, quantity: 1 },
                    { productId: 'p2', name: 'Riz Gras Capitaine', priceGnf: 55000, quantity: 1 },
                  ],
                };
                setSelectedInvoiceOrder(sampleOrder as any);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#1E3A8A]/90 transition cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger reçu</span>
            </button>
          </div>
        </article>

        {/* Existing Actual User Orders in State */}
        {orders.map((ord) => (
          <article
            key={ord.id}
            className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex flex-col gap-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-[#64748B]">
                  {ord.trackingNumber || `#SNY-${ord.id.slice(-4)}`}
                </span>
                <h4 className="font-headline font-bold text-sm text-[#0F172A]">
                  {ord.partnerName}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F8FAFC] text-[#1E3A8A]">
                {ord.status === 'delivered' ? 'Livré' : ord.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span>{ord.items.length} article(s) · {formatTime(ord.createdAt)}</span>
              <span className="font-headline font-bold text-sm text-[#0F172A]">
                {formatGnf(ord.totalGnf)}
              </span>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex justify-end">
              <button
                type="button"
                onClick={() => handleDownloadReceipt(ord)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A8A] hover:underline cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Télécharger le reçu PDF</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Nearby Suggestions in Kipé */}
      <section className="flex flex-col gap-3 pt-2">
        <h2 className="font-headline font-bold text-lg text-[#0F172A]">
          Suggestions proches à Kipé
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {partners.slice(0, 2).map((partner) => (
            <article
              key={partner.id}
              onClick={() => setSelectedPartnerId(partner.id)}
              className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center gap-3 hover:shadow-sm transition cursor-pointer"
            >
              <img
                src={partner.logoImage || partner.coverImage}
                alt={partner.name}
                className="w-16 h-16 object-cover rounded-xl shrink-0 bg-[#DCE3F4]"
              />
              <div className="flex flex-col gap-0.5 min-w-0">
                <h3 className="font-headline font-bold text-sm text-[#0F172A] truncate">
                  {partner.name}
                </h3>
                <p className="text-xs text-[#64748B] truncate">
                  {partner.categoryLabel}
                </p>
                <span className="font-mono text-xs text-[#1E3A8A] font-bold mt-0.5">
                  À 900 m · {partner.deliveryTimeMin || 25} min
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
