import React from 'react';
import { CartItem, OrderDetails, YogurtSize } from '../types';
import { CONDITIONS } from '../data';
import { Printer, X, Check, Copy, ExternalLink, Calendar, Receipt, MessageCircleCode } from 'lucide-react';

interface OrderReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  orderDetails: OrderDetails | null;
  onClearCart: () => void;
}

export default function OrderReceiptModal({
  isOpen,
  onClose,
  cart,
  orderDetails,
  onClearCart,
}: OrderReceiptModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !orderDetails) return null;

  const currentLocalTime = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = orderDetails.deliveryAddress === 'Retrait en boutique'
    ? 0
    : (subtotal >= CONDITIONS.deliveryThresholdFree ? 0 : CONDITIONS.deliveryStandardCost);
  const grandTotal = subtotal + deliveryCost;

  // Format payment name for human legibility
  const getPaymentLabel = (method: OrderDetails['paymentMethod']) => {
    switch (method) {
      case 'orange_money':
        return 'Mobile Money (Orange, Wave, MTN)';
      case 'espèces':
        return 'Espèces à la livraison';
      case 'virement':
        return 'Virement Bancaire (Professionnel)';
      default:
        return method;
    }
  };

  // Pre-composing WhatsApp Text
  const generateWhatsAppText = (): string => {
    let text = `*🧾 BON DE COMMANDE - CATALOGUE DE YAOURTS*\n`;
    text += `-------------------------------------------\n`;
    text += `*Date* : ${new Date().toLocaleDateString('fr-FR')}\n`;
    text += `*Client* : ${orderDetails.fullName}\n`;
    text += `*Statut* : ${orderDetails.profile === 'revendeur' ? 'Revendeur / Grossiste' : 'Particulier'}\n`;
    text += `*Téléphone* : +225 ${orderDetails.phone}\n`;
    text += `*Paiement* : ${getPaymentLabel(orderDetails.paymentMethod)}\n`;
    text += `*Livraison* : ${orderDetails.deliveryAddress}\n`;
    if (orderDetails.deliveryNotes) {
      text += `*Notes* : ${orderDetails.deliveryNotes}\n`;
    }
    text += `-------------------------------------------\n`;
    text += `*🛒 DETAILS DU PANIER :*\n`;

    cart.forEach((item) => {
      const vol = item.size === '1L' ? '1 Litre' : item.size;
      text += `• ${item.quantity}x Yaourt ${item.product.category} (${item.selectedSubFlavor || 'Classique'}) [${vol}] : ${(item.price * item.quantity).toLocaleString()} FCFA\n`;
    });

    text += `-------------------------------------------\n`;
    text += `*Sous-total* : ${subtotal.toLocaleString()} FCFA\n`;
    text += `*Frais de Livraison* : ${deliveryCost === 0 ? 'Gratuit' : `${deliveryCost.toLocaleString()} FCFA`}\n`;
    text += `*TOTAL À PAYER : ${grandTotal.toLocaleString()} FCFA*\n`;
    text += `-------------------------------------------\n`;
    text += `_Commande préparée depuis l'application catalogue._`;

    return text;
  };

  const handleCopyText = async () => {
    const text = generateWhatsAppText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppText());
    // Direct whatsapp send, typical standard for African WooCommerce platforms
    const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4" id="receipt-modal">
      <div className="bg-white text-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Window Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-800" />
            <span className="font-serif font-bold text-slate-800">Votre Bon de Commande Officiel</span>
          </div>
          <button
            id="close-modal-x"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative advice */}
        <div className="bg-amber-50 text-amber-900 p-4 mx-6 mt-4 rounded-2xl text-xs space-y-1.5 border border-amber-100/50 no-print">
          <h4 className="font-bold">✨ Que faire maintenant ?</h4>
          <p className="leading-relaxed">
            Votre commande a été simulée conformément aux tarifs officiels. Vous pouvez <b>l’imprimer au format d'une facture officielle (PDF)</b> ou <b>l’envoyer directement à notre équipe via WhatsApp</b> pour validation et livraison immédiate.
          </p>
        </div>

        {/* Scrollable physical Receipt Form Area - Designated with .print-area for window.print() */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 print-area" id="bon-de-commande-print">
          
          {/* Invoice Header Mockup */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-dashed border-slate-200 pb-5">
            <div>
              <div className="font-serif font-extrabold text-xl text-emerald-800">L'ATELIER DU YAOURT</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Vente de Yaourts en Gros & Détail</div>
              <div className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                Fabrication artisanale de qualité supérieure à partir de lait frais local. Distribué sur la boutique officielle WordPress.
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-[11px] text-slate-600 space-y-0.5">
              <div className="font-bold text-slate-800 uppercase text-xs flex items-center sm:justify-end gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                BON DE COMMANDE
              </div>
              <div><b>Date :</b> {currentLocalTime}</div>
              <div><b>Statut client :</b> {orderDetails.profile === 'revendeur' ? 'Grossiste / Revendeur' : 'Particulier'}</div>
              <div><b>Référence SIM :</b> YOG-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-3">
            <h4 className="font-serif font-bold text-slate-800 text-sm border-b border-slate-200/80 pb-1.5 flex items-center justify-between">
              <span>👤 Coordonnées du Client :</span>
              <span className="text-[10px] px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded-full font-sans uppercase font-semibold">
                {orderDetails.profile}
              </span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 font-semibold uppercase block text-[9px]">Nom ou Raison Sociale :</span>
                <span className="font-bold text-slate-800">{orderDetails.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase block text-[9px]">Téléphone direct :</span>
                <span className="font-bold text-emerald-800 font-mono">+225 {orderDetails.phone}</span>
              </div>
              {orderDetails.email && (
                <div>
                  <span className="text-slate-400 font-semibold uppercase block text-[9px]">Adresse Email :</span>
                  <span className="font-sans text-slate-800">{orderDetails.email}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400 font-semibold uppercase block text-[9px]">Mode de Paiement :</span>
                <span className="font-semibold text-slate-800">{getPaymentLabel(orderDetails.paymentMethod)}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-semibold uppercase block text-[9px]">Adresse / Précision de Livraison :</span>
                <span className="font-medium text-slate-800 break-words">{orderDetails.deliveryAddress}</span>
              </div>
              {orderDetails.deliveryNotes && (
                <div className="sm:col-span-2 bg-amber-50/60 p-2 rounded border border-amber-100 text-[11px] text-amber-950">
                  <span className="font-bold uppercase tracking-wider block text-[8px] text-amber-800 mb-0.5">Remarques particulières :</span>
                  {orderDetails.deliveryNotes}
                </div>
              )}
            </div>
          </div>

          {/* Cart Table Row Details */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-slate-800 text-sm">🛒 Liste des Produits Commandés :</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3">Produit / Saveur</th>
                    <th className="p-3 text-center">Volume</th>
                    <th className="p-3 text-right">Tarif Unitaire</th>
                    <th className="p-3 text-center">Quantité</th>
                    <th className="p-3 text-right">Total (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {cart.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-900">
                        {item.product.category}
                        <span className="block text-[10px] text-slate-550 font-normal">
                          Aroma : {item.selectedSubFlavor || 'Classique'}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-600">
                        {item.size === '1L' ? '1 Litre' : item.size}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-600">
                        {item.price} FCFA
                      </td>
                      <td className="p-3 text-center font-semibold font-mono text-slate-800">
                        {item.quantity} u
                      </td>
                      <td className="p-3 text-right font-bold font-mono text-slate-900">
                        {(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Totals and Summary rows */}
                  <tr className="bg-slate-50/50">
                    <td colSpan={3} className="p-3"></td>
                    <td className="p-3 text-slate-500 font-semibold text-right">Sous-total :</td>
                    <td className="p-3 text-right font-bold font-mono text-slate-800">{subtotal.toLocaleString()} FCFA</td>
                  </tr>
                  
                  {orderDetails.deliveryAddress !== 'Retrait en boutique' && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={3} className="p-3 text-[10px] text-slate-400 italic">
                        * Moins de 5 000 FCFA d'achat = 1 000 FCFA de livraison standard. Gratuit au-delà.
                      </td>
                      <td className="p-3 text-slate-500 font-semibold text-right flex items-center justify-end gap-1">
                        Livraison :
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-800 font-mono">
                        {deliveryCost === 0 ? 'GRATUIT' : `${deliveryCost.toLocaleString()} FCFA`}
                      </td>
                    </tr>
                  )}

                  <tr className="bg-emerald-50 text-emerald-900 font-serif font-bold text-sm">
                    <td colSpan={3} className="p-3 align-middle text-[11px] text-emerald-800/80 font-sans">
                      * Les prix sont taxes comprises (TTC), valables sur notre boutique WordPress.
                    </td>
                    <td className="p-3 text-right align-middle uppercase tracking-wider text-xs">Total à Payer :</td>
                    <td className="p-3 text-right font-mono font-extrabold text-base text-emerald-900">{grandTotal.toLocaleString()} FCFA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Important Rules and policies summary directly based on section 2.3 & 3 of user requested catalogue */}
          <div className="border hover:shadow-inner border-slate-100 p-4 rounded-xl text-[10px] text-slate-500 space-y-2 leading-relaxed">
            <span className="font-serif font-bold text-xs text-slate-700 block">❄ Instructions de Conservation et Transport :</span>
            <ul className="list-disc list-inside space-y-1">
              <li><b>Température recommandée :</b> Les yaourts doivent être impérativement conservés au réfrigérateur entre 2°C et 6°C.</li>
              <li><b>Durée de consommation (DLC) :</b> Elle est stipulée sur chaque contenant hermétique, s'étalant sur une période de 14 à 21 jours après fabrication.</li>
              <li><b>Chaîne de froid :</b> Notre service logistique assure le transport sous glacière isotherme scellée pour préserver l'équilibre bactériologique et la fraîcheur.</li>
              <li><b>Paiement Sécurisé :</b> Pour Mobile Money ou Virement, merci d'utiliser les numéros officiels fournis par notre support ou directement sur WooCommerce.</li>
            </ul>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              id="print-invoice-action"
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimer Facture / PDF
            </button>

            <button
              id="copy-text-action"
              type="button"
              onClick={handleCopyText}
              className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier le Texte de Commande
                </>
              )}
            </button>
          </div>

          <button
            id="send-whatsapp-action"
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-98 transition-all"
          >
            <MessageCircleCode className="w-4.5 h-4.5 text-white" />
            Envoyer sur WhatsApp
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
