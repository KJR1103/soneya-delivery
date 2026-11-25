import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { calculateDistanceKm, calculateDeliveryFeeGnf } from '../../utils/geo';
import { MOCK_PROMO_CODES } from '../../data/mockData';
import { ConakryMap } from './ConakryMap';
import { PaymentModal } from './PaymentModal';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Tag,
  Check,
  ChevronRight,
  Navigation,
  HeartHandshake,
  ShieldCheck,
  Camera,
  FileText,
  X,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    cartPartner,
    addToCart,
    updateQuantity,
    clearCart,
    cartSubtotalGnf,
    location,
    createOrder,
    setActiveTab,
    setSelectedOrderId,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [tipGnf, setTipGnf] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange_money');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [deliveryLandmark, setDeliveryLandmark] = useState(
    'Portail bleu, en face de la pharmacie Kipé'
  );
  const [isScheduled] = useState(false);
  const [scheduledTime] = useState('Aujourd hui à 13h30');
  const [pointsDiscountGnf] = useState(0);

  const [prescriptionPhoto, setPrescriptionPhoto] = useState<string | null>(null);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  if (cart.length === 0 || !cartPartner) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4 m-reveal">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-[#DCE3F4] flex items-center justify-center text-[#1E3A8A] border border-[#E2E8F0]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-headline font-extrabold text-xl text-[#0F172A]">
          Votre panier est vide
        </h2>
        <p className="text-xs text-[#64748B] max-w-xs mx-auto leading-relaxed">
          Commandez vos plats, courses, médicaments et articles à Conakry en toute sécurité !
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-3.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer min-h-[44px]"
        >
          Découvrir les commerces de Conakry
        </button>
      </div>
    );
  }

  const distanceKm = calculateDistanceKm(
    location.quartier.lat,
    location.quartier.lng,
    cartPartner.lat,
    cartPartner.lng
  );

  const feeCalc = calculateDeliveryFeeGnf(distanceKm);
  let effectiveDeliveryFee = feeCalc.feeGnf;
  const serviceFeeGnf = 3000;

  let discountGnf = pointsDiscountGnf;
  if (appliedPromo) {
    const promo = MOCK_PROMO_CODES.find((p) => p.code === appliedPromo);
    if (promo) {
      if (promo.code === 'LIVRAISON0' || promo.discountType === 'free_delivery') {
        discountGnf += effectiveDeliveryFee;
        effectiveDeliveryFee = 0;
      } else if (promo.code === 'SONEYA20') {
        const rawDiscount = Math.round((cartSubtotalGnf * 20) / 100);
        discountGnf += Math.min(40000, rawDiscount);
      } else if (promo.code === 'BIENVENUE') {
        if (cartSubtotalGnf >= 100000) {
          discountGnf += 15000;
        }
      } else if (promo.discountType === 'flat') {
        discountGnf += promo.discountValue;
      } else if (promo.discountType === 'percentage') {
        discountGnf += Math.round((cartSubtotalGnf * promo.discountValue) / 100);
      }
    }
  }

  const grandTotalGnf = Math.max(
    0,
    cartSubtotalGnf + effectiveDeliveryFee + serviceFeeGnf + tipGnf - discountGnf
  );

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();
    const found = MOCK_PROMO_CODES.find((p) => p.code === code);
    if (!found) {
      setPromoError(
        'Code promo invalide. Essayez « SONEYA20 », « LIVRAISON0 » ou « BIENVENUE »'
      );
      return;
    }
    if (found.code === 'BIENVENUE' && cartSubtotalGnf < 100000) {
      setPromoError('Le code BIENVENUE requiert un panier minimum de 100 000 GNF.');
      return;
    }
    if (found.minOrderGnf && cartSubtotalGnf < found.minOrderGnf) {
      setPromoError(`Commande minimum de ${formatGnf(found.minOrderGnf)} requise.`);
      return;
    }
    setAppliedPromo(found.code);
    setPromoInput('');
  };

  const handlePaymentSuccess = (paymentDetails: { method: PaymentMethod; phone?: string }) => {
    setIsPaymentModalOpen(false);

    const newOrder = createOrder({
      partnerId: cartPartner.id,
      partnerName: cartPartner.name,
      partnerPhone: cartPartner.phone,
      partnerLat: cartPartner.lat,
      partnerLng: cartPartner.lng,
      partnerAddress: cartPartner.address,
      partnerCategory: cartPartner.category,
      clientName: 'Client Conakry',
      clientPhone: paymentDetails.phone || '+224 622 45 67 89',
      clientAddress: location.addressLabel,
      clientQuartier: location.quartier.name,
      clientLat: location.quartier.lat,
      clientLng: location.quartier.lng,
      deliveryLandmark,
      isScheduled,
      scheduledTime: isScheduled ? scheduledTime : undefined,
      items: [...cart],
      itemsSubtotalGnf: cartSubtotalGnf,
      deliveryDistanceKm: distanceKm,
      deliveryFeeGnf: effectiveDeliveryFee,
      serviceFeeGnf,
      tipGnf,
      discountGnf,
      promoCode: appliedPromo || undefined,
      totalGnf: grandTotalGnf,
      paymentMethod: paymentDetails.method,
      paymentPhone: paymentDetails.phone,
      estimatedDeliveryMinutes: isScheduled ? 60 : 28,
      deliveryCode: '4821',
    });

    setSelectedOrderId(newOrder.id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 pb-36 space-y-4 text-[#0F172A] m-reveal">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="font-headline font-extrabold text-xl text-[#0F172A]">
            Mon Panier
          </h1>
          <p className="text-xs text-[#64748B] truncate">
            Livraison vers {location.quartier.name} · Établissement : {cartPartner.name}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-rose-50 transition shrink-0 cursor-pointer min-h-[40px]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vider</span>
        </button>
      </div>

      {/* Trajectory Map Preview */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#1E3A8A]" />
            Trajet GPS calculé : {distanceKm} km (Haversine × 1,3)
          </span>
          <span className="text-[11px] font-bold text-[#1E3A8A]">
            {feeCalc.appliedMinimum ? 'Tarif min. 8 000 GNF' : `${formatGnf(feeCalc.feeGnf)}`}
          </span>
        </div>
        <ConakryMap
          partnerLat={cartPartner.lat}
          partnerLng={cartPartner.lng}
          partnerName={cartPartner.name}
          clientLat={location.quartier.lat}
          clientLng={location.quartier.lng}
          clientAddress={location.quartier.name}
          orderStatus="submitted"
        />
      </div>

      {/* Landmark input */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-2.5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
          <Navigation className="w-4 h-4 text-[#1E3A8A]" />
          <span>Point de repère &amp; adresse de livraison (Conakry)</span>
        </div>
        <input
          type="text"
          value={deliveryLandmark}
          onChange={(e) => setDeliveryLandmark(e.target.value)}
          placeholder="Ex: Face station Total Kipé, portail bleu, 2ème étage..."
          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A] text-[#0F172A] placeholder:text-[#64748B] font-medium min-h-[44px]"
        />
        <p className="text-[11px] text-[#64748B]">
          Permet au motard de vous trouver immédiatement sans multiples appels.
        </p>
      </div>

      {/* JOINDRE UNE ORDONNANCE (Pharmacie Conakry) */}
      {cartPartner.category === 'pharmacy' && (
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#1E3A8A]/40 space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#DCE3F4] text-[#1E3A8A] flex items-center justify-center font-bold border border-[#E2E8F0]">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="font-headline font-extrabold text-xs text-[#0F172A] uppercase tracking-wider">
                  Photo de l'ordonnance médicale
                </span>
                <span className="text-[10px] text-[#64748B] block">
                  Exigée pour les médicaments sous prescription à Conakry
                </span>
              </div>
            </div>
            {prescriptionPhoto && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE3F4] text-[#1E3A8A] border border-[#E2E8F0] flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Ordonnance jointe</span>
              </span>
            )}
          </div>

          {prescriptionPhoto ? (
            <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={prescriptionPhoto}
                  alt="Ordonnance médicale"
                  className="w-14 h-14 object-cover rounded-lg border border-[#E2E8F0] shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0F172A] truncate">
                    Ordonnance_Dr_Conakry.jpg
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    Transmise au pharmacien agréé pour validation
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrescriptionPhoto(null)}
                className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition shrink-0 cursor-pointer"
                title="Supprimer la photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                setPrescriptionPhoto(
                  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'
                )
              }
              className="w-full py-3 px-4 rounded-xl border border-dashed border-[#1E3A8A] bg-[#F8FAFC] hover:bg-[#DCE3F4]/40 text-[#1E3A8A] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Camera className="w-4 h-4" />
              <span>Prendre en photo / Importer l'ordonnance</span>
            </button>
          )}

          <input
            type="text"
            value={prescriptionNotes}
            onChange={(e) => setPrescriptionNotes(e.target.value)}
            placeholder="Nom du médecin ou instructions de posologie (facultatif)..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A] text-[#0F172A] placeholder:text-[#64748B] min-h-[42px]"
          />
        </div>
      )}

      {/* Items List */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-3 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Articles commandés ({cart.length})
          </div>
          <span className="text-[11px] text-[#64748B] truncate">
            {cartPartner.name}
          </span>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {cart.map((item) => {
            const itemPrice =
              item.product.priceGnf + (item.selectedOption?.priceModifierGnf || 0);
            return (
              <div
                key={item.product.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#DCE3F4]/40 border border-[#E2E8F0]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-[#0F172A] truncate">
                      {item.product.name}
                    </div>
                    {item.selectedOption && (
                      <div className="text-[10px] text-[#64748B]">
                        Option : {item.selectedOption.name}
                      </div>
                    )}
                    {item.instructions && (
                      <div className="text-[10px] text-[#64748B] italic truncate">
                        {item.instructions}
                      </div>
                    )}
                    <div className="text-xs font-bold text-[#1E3A8A] mt-0.5">
                      {formatGnf(itemPrice * item.quantity)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0F172A] hover:bg-[#DCE3F4] transition cursor-pointer"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-[#0F172A] font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0F172A] hover:bg-[#DCE3F4] transition cursor-pointer"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {cartPartner.products.filter((p) => !cart.some((c) => c.product.id === p.id))
        .length > 0 && (
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Recommandations / Vous aimerez aussi
            </span>
            <span className="text-[10px] text-[#1E3A8A] font-semibold">
              Ajout en 1 clic
            </span>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5">
            {cartPartner.products
              .filter((p) => !cart.some((c) => c.product.id === p.id))
              .slice(0, 3)
              .map((rec) => (
                <div
                  key={rec.id}
                  className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between space-y-2 hover:border-[#1E3A8A] transition"
                >
                  <div className="space-y-1.5">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-20 rounded-lg object-cover bg-[#DCE3F4]"
                    />
                    <div className="font-bold text-[11px] text-[#0F172A] line-clamp-1">
                      {rec.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-[#1E3A8A]">
                      {formatGnf(rec.priceGnf)}
                    </span>
                    <button
                      onClick={() => addToCart(rec, cartPartner)}
                      className="w-8 h-8 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                      title="Ajouter au panier"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Promo Code Box */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
            <Tag className="w-4 h-4 text-[#F4B028]" />
            <span>Codes Promo &amp; Réductions</span>
          </div>
          {appliedPromo && (
            <span className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Code activé
            </span>
          )}
        </div>

        {appliedPromo ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#DCE3F4]/50 border border-[#E2E8F0] text-xs gap-2">
            <div className="min-w-0">
              <span className="font-extrabold text-[#1E3A8A]">
                {appliedPromo}
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                {MOCK_PROMO_CODES.find((p) => p.code === appliedPromo)?.description}
              </p>
            </div>
            <button
              onClick={() => setAppliedPromo(null)}
              className="text-xs font-semibold text-rose-600 hover:underline p-1.5 shrink-0 cursor-pointer"
            >
              Retirer
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: SONEYA20, LIVRAISON0, BIENVENUE"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 min-w-0 px-3.5 py-2.5 text-xs uppercase font-mono rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#1E3A8A] text-[#0F172A] placeholder:text-[#64748B] min-h-[44px]"
              />
              <button
                onClick={handleApplyPromo}
                className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs transition active:scale-95 shrink-0 cursor-pointer min-h-[44px]"
              >
                Appliquer
              </button>
            </div>
            {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {['SONEYA20', 'LIVRAISON0', 'BIENVENUE'].map((c) => (
                <button
                  key={c}
                  onClick={() => setAppliedPromo(c)}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#1E3A8A] transition whitespace-nowrap cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Driver Tip */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]">
            <HeartHandshake className="w-4 h-4 text-[#1E3A8A]" />
            <span>Pourboire direct pour le motard (100% reversé)</span>
          </div>
          <span className="text-xs font-bold text-[#1E3A8A]">
            {formatGnf(tipGnf)}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[0, 2000, 5000, 10000].map((amount) => {
            const isSelected = tipGnf === amount;
            return (
              <button
                key={amount}
                onClick={() => setTipGnf(amount)}
                className={`py-2.5 text-xs font-semibold rounded-xl border transition cursor-pointer min-h-[42px] ${
                  isSelected
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-xs'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] hover:border-[#1E3A8A]'
                }`}
              >
                {amount === 0 ? 'Aucun' : formatGnf(amount)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Paiement 100% Mobile Money
          </div>
          <span className="text-[10px] font-semibold text-[#64748B] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" /> Pas d'espèces · Pas de carte
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setPaymentMethod('orange_money')}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer min-h-[58px] ${
              paymentMethod === 'orange_money'
                ? 'border-[#1E3A8A] bg-[#DCE3F4]/50 text-[#0F172A] font-bold ring-2 ring-[#1E3A8A]/30'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#1E3A8A]'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
              OM
            </div>
            <div className="min-w-0">
              <div className="text-xs truncate font-bold text-[#0F172A]">
                Orange Money
              </div>
              <div className="text-[10px] text-[#64748B]">
                Guinée (#144#)
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('mtn_momo')}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer min-h-[58px] ${
              paymentMethod === 'mtn_momo'
                ? 'border-[#1E3A8A] bg-[#DCE3F4]/50 text-[#0F172A] font-bold ring-2 ring-[#1E3A8A]/30'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#1E3A8A]'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-yellow-500 text-[#0F172A] flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
              MTN
            </div>
            <div className="min-w-0">
              <div className="text-xs truncate font-bold text-[#0F172A]">
                MTN MoMo
              </div>
              <div className="text-[10px] text-[#64748B]">
                Mobile Money (*440#)
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Bill Breakdown */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-3 shadow-xs">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
          Facture détaillée
        </div>

        <div className="space-y-2 text-xs text-[#64748B]">
          <div className="flex justify-between">
            <span>Sous-total commande</span>
            <span className="font-semibold text-[#0F172A]">
              {formatGnf(cartSubtotalGnf)}
            </span>
          </div>

          <div className="flex justify-between items-start gap-2">
            <div>
              <span>Frais de livraison GPS ({distanceKm} km)</span>
              <div className="text-[10px] text-[#64748B]">
                5 000 GNF + ({distanceKm} km × 3 500 GNF){' '}
                {feeCalc.appliedMinimum ? '[Min. 8 000 GNF]' : ''}
              </div>
            </div>
            <span className="font-semibold text-[#0F172A] shrink-0">
              {formatGnf(effectiveDeliveryFee)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <div>
              <span>Frais de service client</span>
              <div className="text-[10px] text-[#64748B]">
                Maintenance &amp; support Conakry 24/7
              </div>
            </div>
            <span className="font-semibold text-[#0F172A] shrink-0">
              {formatGnf(serviceFeeGnf)}
            </span>
          </div>

          {tipGnf > 0 && (
            <div className="flex justify-between">
              <span>Pourboire livreur</span>
              <span className="font-semibold text-[#0F172A]">
                {formatGnf(tipGnf)}
              </span>
            </div>
          )}

          {discountGnf > 0 && (
            <div className="flex justify-between text-[#1E3A8A] font-semibold">
              <span>Réduction totale appliquée</span>
              <span>-{formatGnf(discountGnf)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-baseline gap-2">
            <div>
              <span className="font-headline font-black text-sm text-[#0F172A]">
                Total net à payer
              </span>
              <div className="text-[10px] text-[#64748B]">
                Paiement direct{' '}
                {paymentMethod === 'orange_money' ? 'Orange Money' : 'MTN MoMo'}
              </div>
            </div>
            <span className="font-headline font-black text-xl sm:text-2xl text-[#1E3A8A] shrink-0">
              {formatGnf(grandTotalGnf)}
            </span>
          </div>
        </div>
      </div>

      {/* Security code note */}
      <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#0F172A] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            Preuve de remise par code secret à 4 chiffres :
          </span>
          <p className="text-[11px] text-[#64748B] mt-0.5">
            Dès validation du paiement, votre code secret de 4 chiffres s'affichera à l'écran. Vous le communiquerez au motard uniquement à la réception de votre colis.
          </p>
        </div>
      </div>

      {/* Checkout Submit CTA: Corail profond #D8432F (Action Principale) */}
      <div className="sticky bottom-20 lg:bottom-4 z-30 -mx-4 sm:mx-0 p-3 sm:p-0 bg-[#F8FAFC]/95 sm:bg-transparent backdrop-blur-md border-t sm:border-t-0 border-[#E2E8F0]">
        <button
          onClick={() => setIsPaymentModalOpen(true)}
          className="w-full py-4 rounded-xl bg-[#D8432F] hover:bg-[#D8432F]/90 text-white font-headline font-black text-sm shadow-md flex items-center justify-between px-5 sm:px-6 transition active:scale-98 cursor-pointer min-h-[52px]"
        >
          <span>Passer la commande</span>
          <div className="flex items-center gap-1.5 font-bold font-mono">
            <span>{formatGnf(grandTotalGnf)}</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </button>
      </div>

      {/* Payment Processing Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalGnf={grandTotalGnf}
        paymentMethod={paymentMethod}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
