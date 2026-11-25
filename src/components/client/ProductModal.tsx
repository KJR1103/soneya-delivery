import React, { useState } from 'react';
import { Partner, Product, ProductOption } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, Heart, Check, Clock, ShieldCheck, Box } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  partner: Partner;
  onClose: () => void;
}

interface ExtraAddOn {
  id: string;
  name: string;
  priceGnf: number;
}

const DEFAULT_ADDONS: ExtraAddOn[] = [
  { id: 'extra_cheese', name: 'Fromage râpé extra', priceGnf: 3000 },
  { id: 'extra_sauce', name: 'Sauce maison spéciale', priceGnf: 2000 },
  { id: 'extra_spices', name: 'Piment doux & Épices fraîches', priceGnf: 1000 },
];

export const ProductModal: React.FC<ProductModalProps> = ({ product, partner, onClose }) => {
  const { addToCart, favorites, toggleFavorite } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(
    product?.options ? product.options[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [includePackageBox, setIncludePackageBox] = useState(true);
  const [instructions, setInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const isFavorite = favorites.includes(product.id);
  const packageCostGnf = includePackageBox ? 1000 : 0;
  const addonsTotalGnf = selectedAddons.reduce((acc, addonId) => {
    const addon = DEFAULT_ADDONS.find((a) => a.id === addonId);
    return acc + (addon ? addon.priceGnf : 0);
  }, 0);

  const unitPrice =
    product.priceGnf +
    (selectedOption?.priceModifierGnf || 0) +
    addonsTotalGnf +
    packageCostGnf;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleAdd = () => {
    const customSummary = [
      selectedOption ? `Option: ${selectedOption.name}` : null,
      selectedAddons.length > 0
        ? `Suppléments: ${selectedAddons
            .map((id) => DEFAULT_ADDONS.find((a) => a.id === id)?.name)
            .join(', ')}`
        : null,
      includePackageBox ? 'Emballage isotherme inclus' : null,
      instructions.trim() ? `Note: ${instructions.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    addToCart(product, partner, selectedOption, customSummary);
    setAddedAnimation(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0B2B1E]/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[90dvh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0C1913] shadow-2xl border border-[#E2ECE7] dark:border-[#1E3B2D] overflow-hidden">
        {/* Top Header with Circular/Rounded Dish Presentation */}
        <div className="relative pt-6 pb-4 px-6 bg-white dark:bg-[#0C1913] border-b border-[#E2ECE7] dark:border-[#1E3B2D] shrink-0 flex flex-col items-center">
          {/* Top navigation row: Close button on left, Heart favorite on right */}
          <div className="w-full flex items-center justify-between absolute top-4 left-0 right-0 px-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-[#13291F] transition cursor-pointer shadow-xs"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(product.id)}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-white flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-[#13291F] transition cursor-pointer shadow-xs"
              aria-label="Ajouter aux favoris"
            >
              <Heart
                className={`w-4 h-4 transition ${
                  isFavorite ? 'fill-[#E11D48] text-[#E11D48]' : 'text-[#5C7A6E]'
                }`}
              />
            </button>
          </div>

          {/* Centered Dish Circular Hero Image */}
          <div className="mt-3 relative w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-4 ring-white dark:ring-[#1E3B2D] shadow-xl bg-white dark:bg-[#10231B]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.prepTimeMin && (
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] text-[#2F4F42] dark:text-emerald-100 text-[11px] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#0B7A4B] dark:text-[#10B981]" />
              <span>Préparation estimée : ~{product.prepTimeMin} min</span>
            </div>
          )}
        </div>

        {/* Content Body: Title, Description, Options, Add-ons, Package */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 divide-y divide-[#E2ECE7] dark:divide-[#1E3B2D]">
          {/* Dish Title & Price */}
          <div className="pt-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-heading font-black text-xl text-[#0B2B1E] dark:text-white leading-tight">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-[#2F4F42] dark:text-emerald-200/70">
                  Préparé avec soin par {partner.name} · {partner.quartierName}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-heading font-black text-lg text-[#0B7A4B] dark:text-[#10B981]">
                  {formatGnf(product.priceGnf)}
                </div>
                <div className="text-[11px] text-[#5C7A6E] line-through">
                  {formatGnf(Math.round(product.priceGnf * 1.15))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-[#2F4F42] dark:text-emerald-100/80 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Mandatory Options if available */}
          {product.options && product.options.length > 0 && (
            <div className="pt-4 space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
                Format / Taille
              </label>
              <div className="space-y-1.5">
                {product.options.map((opt) => {
                  const isSelected = selectedOption?.name === opt.name;
                  return (
                    <button
                      key={opt.name}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl border text-xs transition cursor-pointer ${
                        isSelected
                          ? 'border-[#0B7A4B] bg-[#0B7A4B]/5 dark:bg-[#0B7A4B]/20 text-[#0B7A4B] dark:text-white font-bold'
                          : 'border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50/50 dark:hover:bg-[#13291F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#0B7A4B] bg-[#0B7A4B] text-white'
                              : 'border-[#D4E9DD] dark:border-[#1E3B2D]'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span>{opt.name}</span>
                      </div>
                      {opt.priceModifierGnf > 0 && (
                        <span className="text-[11px] font-semibold text-[#2F4F42] dark:text-emerald-200/70">
                          +{formatGnf(opt.priceModifierGnf)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add more / Suppléments */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
                Ajouter plus / Suppléments
              </label>
              <span className="text-[10px] text-[#5C7A6E]">Facultatif</span>
            </div>

            <div className="space-y-1.5">
              {DEFAULT_ADDONS.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl border text-xs transition cursor-pointer ${
                      isChecked
                        ? 'border-[#0B7A4B] bg-[#0B7A4B]/5 dark:bg-[#0B7A4B]/20 text-[#0B2B1E] dark:text-white font-bold'
                        : 'border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50/50 dark:hover:bg-[#13291F]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked
                            ? 'border-[#0B7A4B] bg-[#0B7A4B] text-white'
                            : 'border-[#D4E9DD] dark:border-[#1E3B2D]'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{addon.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#2F4F42] dark:text-emerald-200/70">
                      +{formatGnf(addon.priceGnf)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Package / Emballage */}
          <div className="pt-4 space-y-2.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
              Conditionnement & Emballage
            </label>
            <button
              type="button"
              onClick={() => setIncludePackageBox(!includePackageBox)}
              className={`w-full min-h-[44px] flex items-center justify-between p-3 rounded-xl border text-xs transition cursor-pointer ${
                includePackageBox
                  ? 'border-[#0B7A4B] bg-emerald-50/50 dark:bg-[#10231B] text-[#0B2B1E] dark:text-white font-bold'
                  : 'border-[#E2ECE7] dark:border-[#1E3B2D] text-[#0B2B1E] dark:text-emerald-100 hover:bg-emerald-50/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Box className="w-4 h-4 text-[#0B7A4B]" />
                <span>Boîte & emballage isotherme garanti</span>
              </div>
              <span className="text-[11px] font-semibold text-[#2F4F42] dark:text-emerald-200/70">
                +1 000 GNF
              </span>
            </button>
          </div>

          {/* Special Instructions */}
          <div className="pt-4 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#2F4F42] dark:text-emerald-200/70">
              Remarques spécifiques
            </label>
            <input
              type="text"
              placeholder="Ex: Sauce à part, sans oignons, bien cuit..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] focus:outline-none focus:border-[#0B7A4B] text-[#0B2B1E] dark:text-white placeholder-[#5C7A6E]"
            />
          </div>
        </div>

        {/* Sticky Footer: Quantity Stepper and Wide CTA */}
        <div className="p-4 border-t border-[#E2ECE7] dark:border-[#1E3B2D] bg-white dark:bg-[#0C1913] flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Stepper - 1 + */}
          <div className="flex items-center bg-white dark:bg-[#10231B] border border-[#D4E9DD] dark:border-[#1E3B2D] rounded-xl p-1 shadow-xs shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0B2B1E] dark:text-white hover:bg-emerald-50 dark:hover:bg-[#13291F] disabled:opacity-30 cursor-pointer"
              aria-label="Diminuer la quantité"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-bold text-xs text-[#0B2B1E] dark:text-white font-mono">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0B2B1E] dark:text-white hover:bg-emerald-50 dark:hover:bg-[#13291F] cursor-pointer"
              aria-label="Augmenter la quantité"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Wide CTA: Add to order [Price] */}
          <button
            onClick={handleAdd}
            className={`flex-1 min-h-[46px] flex items-center justify-between gap-2 px-4 sm:px-5 py-3 rounded-xl font-heading font-bold text-xs shadow-md shadow-[#0B7A4B]/20 transition-all cursor-pointer ${
              addedAnimation
                ? 'bg-[#0B2B1E] text-white scale-[0.98]'
                : 'bg-[#0B7A4B] hover:bg-[#08613B] text-white active:scale-95'
            }`}
          >
            <span className="truncate">{addedAnimation ? 'Ajouté !' : 'Ajouter à la commande'}</span>
            <span className="font-heading font-black text-xs sm:text-sm shrink-0">
              {formatGnf(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
