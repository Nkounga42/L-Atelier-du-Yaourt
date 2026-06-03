import React, { useState, useMemo } from 'react';
import { CartItem, UserProfile, OrderDetails, RuleValidationResult } from '../types';
import { CONDITIONS } from '../data';
import { Trash2, ShoppingBasket, Truck, BadgeAlert, CheckCircle2, FileText, ArrowRight, Wallet, MapPin, Contact2 } from 'lucide-react';

interface OrderSimulatorProps {
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  profile: UserProfile;
  onOpenReceipt: (details: OrderDetails) => void;
}

export default function OrderSimulator({
  cart,
  onRemoveItem,
  onClearCart,
  onUpdateQuantity,
  profile,
  onOpenReceipt,
}: OrderSimulatorProps) {
  // Order customer details local state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<OrderDetails['paymentMethod']>('orange_money');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  // Calculating Totals
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const deliveryCost = useMemo(() => {
    if (deliveryType === 'pickup') return 0;
    if (subtotal >= CONDITIONS.deliveryThresholdFree) return 0;
    return CONDITIONS.deliveryStandardCost;
  }, [subtotal, deliveryType]);

  const grandTotal = subtotal + deliveryCost;

  // Commercial Rules Engine Verification
  const ruleValidations = useMemo((): RuleValidationResult => {
    const messages: string[] = [];
    let isValid = true;

    if (cart.length === 0) {
      return { isValid: false, messages: ['Votre panier est actuellement vide.'] };
    }

    // Rule 1: Panier Minimum
    if (subtotal < CONDITIONS.minPanierOnline) {
      isValid = false;
      messages.push(
        `Le montant total (hors livraison) est de ${subtotal.toLocaleString()} FCFA. Un panier minimum de ${CONDITIONS.minPanierOnline.toLocaleString()} FCFA est exigé pour commander en ligne.`
      );
    }

    // Rule 2: Particuliers minimum (2 units per flavor category)
    if (profile === 'particulier') {
      const categoryTotals: Record<string, number> = {};
      cart.forEach((item) => {
        const cat = item.product.category;
        categoryTotals[cat] = (categoryTotals[cat] || 0) + item.quantity;
      });

      Object.entries(categoryTotals).forEach(([cat, qty]) => {
        if (qty < CONDITIONS.minParticuliers) {
          isValid = false;
          messages.push(
            `Pour la catégorie "${cat}" : vous avez ${qty} unité(s). Le minimum est de ${CONDITIONS.minParticuliers} unités par goût.`
          );
        }
      });
    }

    // Rule 3: Revendeurs / Grossistes minimum (20 units per reference)
    if (profile === 'revendeur') {
      cart.forEach((item) => {
        if (item.quantity < CONDITIONS.minRevendeurs) {
          isValid = false;
          const refName = `${item.product.category} (${item.size === '1L' ? '1 Litre' : item.size})`;
          messages.push(
            `Référence "${refName}" : ${item.quantity} unité(s) dans le panier. En tant que revendeur, le minimum est de ${CONDITIONS.minRevendeurs} unités par référence.`
          );
        }
      });
    }

    return { isValid, messages };
  }, [cart, subtotal, profile]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Veuillez remplir votre nom complet et votre numéro de téléphone.');
      return;
    }
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      alert('Veuillez spécifier votre adresse de livraison complète.');
      return;
    }

    onOpenReceipt({
      fullName,
      phone,
      email,
      profile,
      shopType: 'direct',
      paymentMethod,
      deliveryAddress: deliveryType === 'pickup' ? 'Retrait en boutique' : deliveryAddress,
      deliveryNotes: deliveryNotes || undefined,
    });
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 md:p-6 shadow-xl border border-slate-800" id="order-simulator-container">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4" id="sim-header">
        <div className="flex items-center gap-2">
          <ShoppingBasket className="w-5 h-5 text-emerald-400" />
          <h3 className="font-serif text-lg font-bold">Simulateur de Commande</h3>
        </div>
        
        {cart.length > 0 && (
          <button
            id="clear-cart-bottom-btn"
            type="button"
            onClick={onClearCart}
            className="text-slate-400 hover:text-rose-400 transition-colors text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vider
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-3" id="blank-cart-state">
          <ShoppingBasket className="w-12 h-12 text-slate-700 mx-auto stroke-1" />
          <p className="text-sm font-semibold max-w-xs mx-auto">Votre panier est encore vide. Ajoutez des parfums dans le catalogue à gauche !</p>
        </div>
      ) : (
        <div className="space-y-5" id="filled-cart-state">
          {/* Cart items listing */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1" id="cart-items-scroll">
            {cart.map((item) => (
              <div
                key={item.id}
                id={`cart-row-${item.id}`}
                className="bg-slate-800/80 rounded-xl p-3 flex items-start justify-between gap-3 border border-slate-800 hover:border-slate-700 transition-all text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-200">
                    {item.product.category} — {item.selectedSubFlavor || 'Classique'}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span className="bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-mono font-bold">
                      {item.size === '1L' ? '1 Litre' : item.size}
                    </span>
                    <span className="font-mono">{item.price} FCFA / u</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <input
                      id={`cart-qty-input-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-11 bg-slate-900 border border-slate-700 text-slate-200 text-center rounded font-mono p-1 text-xs"
                    />
                  </div>
                  <div className="text-right font-mono font-bold text-slate-200 w-16">
                    {(item.price * item.quantity).toLocaleString()} <span className="text-[9px]">FCFA</span>
                  </div>
                  <button
                    id={`remove-cart-item-${item.id}`}
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Retirer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="bg-slate-800/50 rounded-2xl p-4 space-y-2 border border-slate-800 font-mono text-xs" id="receipt-costs">
            <div className="flex justify-between text-slate-300">
              <span>Sous-total articles :</span>
              <span className="font-semibold text-slate-200">{subtotal.toLocaleString()} FCFA</span>
            </div>

            {/* Delivery selection type toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1 pb-1" id="delivery-selector">
              <button
                id="delivery-type-home"
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-1 bg-slate-900/60 rounded border text-[10px] ${
                  deliveryType === 'delivery' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-slate-800 text-slate-400'
                }`}
              >
                En livraison
              </button>
              <button
                id="delivery-type-pickup"
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`py-1 bg-slate-900/60 rounded border text-[10px] ${
                  deliveryType === 'pickup' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-slate-800 text-slate-400'
                }`}
              >
                Retrait Boutique
              </button>
            </div>

            {deliveryType === 'delivery' && (
              <div className="flex justify-between text-slate-350">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  Livraison (Isotherme) :
                </span>
                <span>
                  {deliveryCost === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">Gratuit</span>
                  ) : (
                    `${deliveryCost.toLocaleString()} FCFA`
                  )}
                </span>
              </div>
            )}

            {/* Delivery threshold meter */}
            {deliveryType === 'delivery' && subtotal < CONDITIONS.deliveryThresholdFree && (
              <div className="text-[10px] text-slate-400 bg-slate-900/40 p-2 rounded border border-slate-800/80" id="delivery-progress">
                <span>Ajoutez <b className="text-amber-400">{ (CONDITIONS.deliveryThresholdFree - subtotal).toLocaleString() } FCFA</b> pour obtenir la <b>livraison gratuite</b> !</span>
              </div>
            )}

            <div className="border-t border-slate-700/80 pt-2 flex justify-between text-sm text-white font-serif font-bold">
              <span>TOTAL ESTIMÉ :</span>
              <span className="text-emerald-400">{grandTotal.toLocaleString()} FCFA</span>
            </div>
          </div>

          {/* Rules and compliance banner */}
          <div className="space-y-2" id="rules-banner-container">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Vérification des conditions de vente :</div>
            {ruleValidations.messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                  ruleValidations.isValid
                    ? 'bg-emerald-900/20 text-emerald-300 border border-emerald-800/50'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-900/40'
                }`}
              >
                {ruleValidations.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <BadgeAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <span className="leading-tight">{msg}</span>
              </div>
            ))}

            {ruleValidations.isValid && (
              <div className="bg-emerald-950/30 p-2.5 rounded-xl text-emerald-300 text-xs flex items-center gap-2 border border-emerald-900/40" id="all-rules-met">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
                <span><b>Parfait !</b> Votre panier satisfait toutes nos exigences commerciales pour les <b>{profile === 'revendeur' ? 'Revendeurs' : 'Particuliers'}</b>.</span>
              </div>
            )}
          </div>

          {/* Interactive Customer checkout Details parameters */}
          <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-3 border-t border-slate-800" id="cart-checkout-form">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Informations de livraison & contact :</div>
            
            <div className="relative" id="field-fullname">
              <Contact2 className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
              <input
                id="input-fullname"
                type="text"
                required
                placeholder="Nom complet / Raison Sociale"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-600 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <div className="relative" id="field-phone">
              <span className="absolute left-2.5 top-2.5 font-bold text-xs text-slate-500">+225</span>
              <input
                id="input-phone"
                type="tel"
                required
                placeholder="Numéro Mobile de contact (e.g. 07...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-600 rounded-xl py-2 pl-12 pr-3 text-xs text-slate-100 placeholder-slate-500 outline-none font-mono"
              />
            </div>

            <div className="relative" id="field-email">
              <input
                id="input-email"
                type="email"
                placeholder="Adresse email (optionnel, pour facture)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-600 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            {deliveryType === 'delivery' && (
              <div className="relative hover:scale-[1.01] transition-transform" id="field-address">
                <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-emerald-500" />
                <textarea
                  id="textarea-address"
                  required={deliveryType === 'delivery'}
                  rows={2}
                  placeholder="Quartier, Précisions de livraison (Zone Standard)..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-600 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none"
                />
              </div>
            )}

            <div className="relative" id="field-notes">
              <input
                id="input-notes"
                type="text"
                placeholder="Remarques (e.g. horaire souhaité, etc.)"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-600 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <div className="space-y-1.5" id="field-payment">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Wallet className="w-3 h-3 text-emerald-400" />
                Mode de paiement préféré :
              </label>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <label className="flex items-center gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="orange_money"
                    checked={paymentMethod === 'orange_money'}
                    onChange={() => setPaymentMethod('orange_money')}
                    className="accent-emerald-500"
                  />
                  <span className="text-[10px] font-semibold">Orange Money / MoMo / Wave</span>
                </label>
                <label className="flex items-center gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="espèces"
                    checked={paymentMethod === 'espèces'}
                    onChange={() => setPaymentMethod('espèces')}
                    className="accent-emerald-500"
                  />
                  <span className="text-[10px] font-semibold">Espèces à la livraison</span>
                </label>
                {profile === 'revendeur' && (
                  <label className="flex items-center gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer col-span-2">
                    <input
                      type="radio"
                      name="payment"
                      value="virement"
                      checked={paymentMethod === 'virement'}
                      onChange={() => setPaymentMethod('virement')}
                      className="accent-emerald-500"
                    />
                    <span className="text-[10px] font-semibold">Virement Bancaire (Pro uniquement)</span>
                  </label>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <button
              id="generate-invoice-btn"
              type="submit"
              disabled={!ruleValidations.isValid}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                ruleValidations.isValid
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/10 cursor-pointer font-bold uppercase tracking-wider'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Générer le Bon de Commande</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
