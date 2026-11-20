import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatGnf, formatTime } from '../../utils/formatters';

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
    showToast('Reçu généré', `Téléchargement du reçu officiel ${order.trackingNumber || '#SNY-8419'}`, 'success');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Code promo copié', `${code} copié dans le presse-papier (-20% sur votre commande).`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-gutter-md py-gutter-md flex flex-col gap-gutter-lg pb-24 text-light-on-surface dark:text-dark-on-surface">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-light-surface-container-low/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md border-b border-light-outline dark:border-dark-outline -mx-gutter-md px-gutter-md py-gutter-md flex items-center justify-between">
        <div>
          <h1 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface font-bold">
            Commandes &amp; Reçus
          </h1>
          <p className="text-xs text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Historique, factures en GNF et remises actives à Conakry
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary font-label text-label-md font-semibold shrink-0">
          2 remises actives
        </span>
      </header>

      {/* Active Order Live Banner if any */}
      {activeOrder && activeOrder.status !== 'delivered' && (
        <section className="p-gutter-md rounded-lg bg-blue-50 dark:bg-blue-950/40 border-2 border-courier flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md shadow-xs animate-in fade-in">
          <div className="flex items-center gap-gutter-md">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-courier text-white shrink-0">
              <span className="material-symbols-outlined text-title-lg">two_wheeler</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-mono-md font-bold text-light-on-surface dark:text-dark-on-surface">
                  {activeOrder.trackingNumber || '#SNY-8420'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-courier text-white text-[11px] font-bold uppercase">
                  En livraison
                </span>
              </div>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant mt-0.5">
                {activeOrder.partnerName} → {activeOrder.clientQuartier || activeOrder.clientAddress} · Arrivée estimée dans 5 min
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLiveTracking}
            className="inline-flex items-center justify-center gap-1.5 px-gutter-md py-2.5 rounded-md bg-courier text-white font-label text-label-md font-semibold hover:opacity-90 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">navigation</span>
            <span>Suivre sur GPS</span>
          </button>
        </section>
      )}

      {/* Active Discounts (Matching commandes_re_us_remises.html) */}
      <section className="p-gutter-md rounded-lg bg-light-primary-container dark:bg-dark-primary-container border border-light-outline dark:border-dark-outline flex items-center justify-between gap-gutter-md">
        <div>
          <span className="font-label text-label-sm text-light-primary dark:text-dark-primary font-bold uppercase tracking-wider block">
            Remise fidélité Conakry
          </span>
          <p className="font-title text-title-md text-light-on-primary-container dark:text-dark-on-primary-container font-bold mt-0.5">
            Code <span className="font-mono">SONEYA20</span> (-20%)
          </p>
          <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
            Valable jusqu'à 40 000 GNF de réduction sur vos repas et courses
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleCopyCode('SONEYA20')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-dark-surface-container text-light-on-surface border border-light-outline text-xs font-bold hover:bg-light-surface-variant transition cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>
            loyalty
          </span>
          <span>Copier</span>
        </button>
      </section>

      {/* Downloadable Digital Receipts Section (Matching Stitch Ultra) */}
      <section className="flex flex-col gap-gutter-md">
        <h2 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-bold">
          Dernières factures &amp; Reçus numériques
        </h2>

        {/* Featured Sample Receipt (Matching Stitch Ultra Reçu #SNY-8419) */}
        <article className="p-gutter-lg rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline shadow-xs flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant font-semibold">
                Reçu #SNY-8419
              </span>
              <h3 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-bold mt-0.5">
                Chez Fanta · Kipé
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-light-primary-container dark:bg-dark-primary-container text-light-primary dark:text-dark-primary font-label text-label-sm font-semibold">
              Livré avec succès
            </span>
          </div>

          <div className="border-y border-light-outline dark:border-dark-outline py-gutter-sm flex flex-col gap-gutter-xs">
            <div className="flex items-center justify-between">
              <span className="font-body text-body-md text-light-on-surface dark:text-dark-on-surface">
                1× Maffé Tiga Authentique
              </span>
              <span className="font-mono text-mono-sm tabular-nums text-light-on-surface dark:text-dark-on-surface">
                45 000 GNF
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body text-body-md text-light-on-surface dark:text-dark-on-surface">
                1× Riz Gras Capitaine
              </span>
              <span className="font-mono text-mono-sm tabular-nums text-light-on-surface dark:text-dark-on-surface">
                55 000 GNF
              </span>
            </div>
            <div className="flex items-center justify-between text-light-primary dark:text-dark-primary font-medium">
              <span className="font-body text-body-sm">Remise SONEYA20 (-20%)</span>
              <span className="font-mono text-mono-sm tabular-nums">-20 000 GNF</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md">
            <div>
              <span className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant block">
                Payé via Orange Money · Conakry
              </span>
              <span className="font-headline text-headline-md tabular-nums text-light-on-surface dark:text-dark-on-surface font-bold">
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
              className="inline-flex items-center justify-center gap-gutter-xs px-gutter-md py-2.5 rounded-md bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md hover:opacity-90 transition font-semibold cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">download</span>
              <span>Télécharger reçu</span>
            </button>
          </div>
        </article>

        {/* Existing Actual User Orders in State */}
        {orders.map((ord) => (
          <article
            key={ord.id}
            className="p-gutter-md rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex flex-col gap-gutter-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-mono-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                  {ord.trackingNumber || `#SNY-${ord.id.slice(-4)}`}
                </span>
                <h4 className="font-title text-title-md font-semibold text-light-on-surface dark:text-dark-on-surface">
                  {ord.partnerName}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-light-surface-container dark:bg-dark-surface-container text-light-primary">
                {ord.status === 'delivered' ? 'Livré' : ord.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-gutter-xs text-xs text-light-on-surface-variant">
              <span>{ord.items.length} article(s) · {formatTime(ord.createdAt)}</span>
              <span className="font-mono font-bold text-light-on-surface dark:text-dark-on-surface">
                {formatGnf(ord.totalGnf)}
              </span>
            </div>

            <div className="pt-gutter-xs border-t border-light-outline/50 flex justify-end">
              <button
                type="button"
                onClick={() => handleDownloadReceipt(ord)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-light-primary dark:text-dark-primary hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">receipt</span>
                <span>Télécharger le reçu PDF</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Nearby Suggestions in Kipé (Matching Stitch Ultra) */}
      <section className="flex flex-col gap-gutter-sm pt-2">
        <h2 className="font-title text-title-lg text-light-on-surface dark:text-dark-on-surface font-bold">
          Suggestions proches à Kipé
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
          {/* Le Cèdre */}
          <article
            onClick={() => {
              const cedar = partners.find((p) => p.name.includes('Cèdre')) || partners[1];
              if (cedar) setSelectedPartnerId(cedar.id);
            }}
            className="p-gutter-sm rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center gap-gutter-md hover:shadow-sm transition cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/ALJJyrBZfVk4S9Hcn3M_mNMIPlwsMl-18qVd9C5Iko3MXhASI6kJ6Dhn3-FzZmxj6NpZTiqwucCbsI0VVZTiVDKy5gRo46dEoWiYL3qOCodifO9Y-ZRxDVjGFzbc1PRtSADEXv8ww4xRqc3NanpiOIyAzxMy5mc7tDBBoyOuEhEfEXD1u472gq0RD9BuVhhXl-VLl0P15P1COgkuP6ObVjHW-fO7G-BD9AVh7YRuLMYOIwSt_d2mL3BDAIyc3TdwwWmckQ"
              alt="Le Cèdre Grillades"
              className="w-24 h-24 object-cover rounded-md shrink-0"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold truncate">
                Le Cèdre Grillades
              </h3>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Cuisine Libanaise &amp; Grillades
              </p>
              <span className="font-mono text-xs text-light-primary dark:text-dark-primary font-bold mt-1">
                À 900 m · 20 min
              </span>
            </div>
          </article>

          {/* Pharmacie Kipé */}
          <article
            onClick={() => {
              const phar = partners.find((p) => p.category === 'pharmacy') || partners[2];
              if (phar) setSelectedPartnerId(phar.id);
            }}
            className="p-gutter-sm rounded-lg bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline flex items-center gap-gutter-md hover:shadow-sm transition cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/ALJJyrBFyhXQ7v5iIkmiNDuukstEd_SYcsyu4vE7P6dFoAXJ2MhHC6LtSi5cxwOvibTgF1anB_wjl82Zt-3z2xXkjRbKC3yOe0Nkl65axVjSd7a42qYok9a0NRVWpNBTAFO_Qq_rruef3ZJuOm_ld_cbWPKjulS2wrnNIRiOHmph9JXhpF7yp2L9fTB8log1VVg7L8aEEf8LTalW3MQOq9Lf5I7lzLrDLgG6dqseLCqtngYv9_gKI-LFVd4WqgM"
              alt="Pharmacie Kipé"
              className="w-24 h-24 object-cover rounded-md shrink-0"
            />
            <div className="flex flex-col gap-0.5 min-w-0">
              <h3 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface font-semibold truncate">
                Pharmacie Kipé
              </h3>
              <p className="font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                Santé 24h/24 &amp; Ordonnances
              </p>
              <span className="font-mono text-xs text-light-primary dark:text-dark-primary font-bold mt-1">
                À 450 m · Ouvert
              </span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};
