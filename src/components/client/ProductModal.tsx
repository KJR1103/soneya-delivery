import React, { useState } from 'react';
import { Partner, Product, ProductOption } from '../../types';
import { formatGnf } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-light-on-surface/60 backdrop-blur-xs p-0 sm:p-gutter-md animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[90dvh] flex flex-col rounded-t-xl sm:rounded-xl bg-light-surface-container-low dark:bg-dark-surface-container-low shadow-2xl border border-light-outline dark:border-dark-outline overflow-hidden">
        {/* Contextual Header: back button, partner name, cart/favorite */}
        <header className="px-gutter-md py-gutter-md flex items-center justify-between shrink-0 border-b border-light-outline dark:border-dark-outline">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface transition-colors duration-state-change ease-state-change hover:opacity-90 cursor-pointer"
            aria-label="Retour"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">arrow_back</span>
          </button>
          <span className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface truncate px-gutter-sm">
            {partner.name}
          </span>
          <button
            onClick={() => toggleFavorite(product.id)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface transition-colors duration-state-change ease-state-change hover:opacity-90 cursor-pointer"
            aria-label="Ajouter aux favoris"
          >
            <span
              className="material-symbols-outlined text-title-md"
              style={isFavorite ? { fontVariationSettings: "'FILL' 1", color: '#E11D48' } : undefined}
              aria-hidden="true"
            >
              {isFavorite ? 'favorite' : 'favorite'}
            </span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <main className="px-gutter-md pb-gutter-xl flex flex-col gap-gutter-lg">
            {/* Centered Dish Photo & Stepper */}
            <div className="flex flex-col items-center gap-gutter-md pt-gutter-lg">
              <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-light-surface-container-low dark:border-dark-surface-container-low shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Quantity stepper */}
              <div className="inline-flex items-center gap-gutter-md px-gutter-md py-1.5 rounded-full bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-full bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface font-label text-label-lg flex items-center justify-center transition-colors duration-state-change ease-state-change hover:opacity-90 cursor-pointer disabled:opacity-30"
                  aria-label="Diminuer la quantité"
                >
                  <span className="material-symbols-outlined text-label-md" aria-hidden="true">remove</span>
                </button>
                <span className="font-mono text-mono-md text-light-on-surface dark:text-dark-on-surface tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-lg flex items-center justify-center transition-colors duration-state-change ease-state-change hover:opacity-90 cursor-pointer"
                  aria-label="Augmenter la quantité"
                >
                  <span className="material-symbols-outlined text-label-md" aria-hidden="true">add</span>
                </button>
              </div>
            </div>

            {/* Title, Price & Metadata */}
            <section className="flex flex-col gap-gutter-sm">
              <div className="flex items-start justify-between gap-gutter-md">
                <h1 className="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface">
                  {product.name}
                </h1>
                <span className="font-mono text-headline-md text-light-primary dark:text-dark-primary tabular-nums shrink-0">
                  {formatGnf(product.priceGnf)}
                </span>
              </div>

              <div className="flex items-center gap-gutter-md text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-label-md text-accent" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">star</span>
                  4.9
                </span>
                {product.prepTimeMin && <span>{product.prepTimeMin} min prép.</span>}
                <span>{partner.quartierName} · Halal</span>
              </div>

              <p className="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant text-pretty">
                {product.description}
              </p>
            </section>

            {/* Options Selector */}
            {product.options && product.options.length > 0 && (
              <section className="flex flex-col gap-gutter-sm">
                <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">
                  Format / Taille
                </h2>
                <div className="flex flex-wrap gap-gutter-sm">
                  {product.options.map((opt) => {
                    const isSelected = selectedOption?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`px-gutter-md py-2 rounded-md font-label text-label-md transition-colors duration-state-change ease-state-change hover:opacity-90 cursor-pointer ${
                          isSelected
                            ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary'
                            : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface'
                        }`}
                      >
                        {opt.name}
                        {opt.priceModifierGnf > 0 && (
                          <span className="ml-1">(+{formatGnf(opt.priceModifierGnf)})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Add-ons / Suppléments */}
            <section className="flex flex-col gap-gutter-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">
                  Ajouter plus / Suppléments
                </h2>
                <span className="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">Facultatif</span>
              </div>
              <div className="flex flex-wrap gap-gutter-sm">
                {DEFAULT_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`px-gutter-md py-2 rounded-md font-label text-label-md transition-colors duration-state-change ease-state-change hover:opacity-90 cursor-pointer ${
                        isChecked
                          ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary'
                          : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface'
                      }`}
                    >
                      {addon.name} (+{formatGnf(addon.priceGnf)})
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Package / Emballage */}
            <section className="flex flex-col gap-gutter-sm">
              <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">
                Conditionnement & Emballage
              </h2>
              <button
                type="button"
                onClick={() => setIncludePackageBox(!includePackageBox)}
                className={`px-gutter-md py-2 rounded-md font-label text-label-md transition-colors duration-state-change ease-state-change hover:opacity-90 cursor-pointer inline-flex items-center gap-gutter-xs ${
                  includePackageBox
                    ? 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary'
                    : 'bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline text-light-on-surface dark:text-dark-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">inventory_2</span>
                <span>Boîte isotherme (+{formatGnf(1000)})</span>
              </button>
            </section>

            {/* Special Instructions */}
            <section className="flex flex-col gap-gutter-sm">
              <h2 className="font-title text-title-md text-light-on-surface dark:text-dark-on-surface">
                Remarques spécifiques
              </h2>
              <input
                type="text"
                placeholder="Ex: Sauce à part, sans oignons, bien cuit..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-gutter-md py-2.5 rounded-md bg-light-surface-container-low dark:bg-dark-surface-container-low border border-light-outline dark:border-dark-outline focus:outline-none focus:border-light-primary dark:focus:border-dark-primary font-body text-body-md text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant dark:placeholder:text-dark-on-surface-variant"
              />
            </section>
          </main>
        </div>

        {/* Add to cart button */}
        <div className="px-gutter-md py-gutter-md border-t border-light-outline dark:border-dark-outline bg-light-surface-container-low dark:bg-dark-surface-container-low shrink-0">
          <button
            onClick={handleAdd}
            className={`w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3.5 rounded-md font-label text-label-lg transition-colors duration-state-change ease-state-change hover:opacity-90 cursor-pointer ${
              addedAnimation
                ? 'bg-light-on-surface text-light-surface-container-low dark:bg-dark-on-surface dark:text-dark-surface-container-low scale-[0.98]'
                : 'bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary active:scale-95'
            }`}
          >
            <span className="truncate">{addedAnimation ? 'Ajouté !' : 'Ajouter au panier'}</span>
            <span className="font-mono text-label-lg shrink-0 tabular-nums">
              · {formatGnf(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
