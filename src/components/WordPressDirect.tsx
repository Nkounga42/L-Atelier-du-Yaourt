import React from 'react';
import { Store, ShoppingCart, Globe2, Sparkles, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

export default function WordPressDirect() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6" id="wordpress-info-panel">
      
      {/* Small badge */}
      <div className="inline-flex items-center space-x-1.5 bg-sky-50 text-sky-900 px-3 py-1 rounded-full text-xs font-semibold w-max" id="wp-badge">
        <Globe2 className="w-3.5 h-3.5 text-sky-600" />
        <span>Boutique En Ligne WordPress</span>
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-xl font-bold text-slate-900 leading-tight">Notre Boutique Online WooCommerce</h3>
        <p className="text-slate-600 text-xs leading-relaxed">
          Pour une expérience entièrement autonome, visitez notre plateforme e-commerce motorisée par <b>WordPress et WooCommerce</b>. Elle vous permet d'effectuer des achats en ligne sécurisés et de suivre votre livraison en temps réel.
        </p>
      </div>

      {/* Grid of features from section 3 of user doc */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2" id="wp-features">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-800">Panier Sécurisé</h4>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Calcul automatique des taxes et validation instantanée via WooCommerce.</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-800">Promotions Abonnés</h4>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Offres et ristournes exclusives réservées aux membres fidèles de la boutique.</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
          <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-800">Suivi en Temps Réel</h4>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Sachez exactement quand votre glacière de yaourts quitte notre atelier.</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
          <div className="p-2 bg-rose-100 text-rose-800 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-800">Espace Privé</h4>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Consultez l'historique complet de vos factures et commandez en un clic.</p>
          </div>
        </div>
      </div>

      {/* WordPress direct mockup screen / visual rhythm */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-850 relative overflow-hidden" id="wp-mockup">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[9px] font-mono text-slate-400">boutiqueyaourt.ci (WooCommerce)</span>
          <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">SSL Secure</span>
        </div>

        <div className="space-y-2 text-[11px] font-mono text-slate-300">
          <div className="text-slate-500 text-[10px]"># Intégration technique WordPress — WooCommerce</div>
          <p className="text-amber-300 font-bold">📢 Commandes Professionnelles ou Partenariats ?</p>
          <p className="leading-relaxed">
            Pour les commandes en gros dépassant les limites standard, ou si vous souhaitez devenir distributeur officiel dans votre région, vous pouvez nous contacter directement.
          </p>
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 mt-2">
            <span>Téléphone: +225 07-00-00-00-00</span>
            <span className="text-emerald-400">Disponibilité : 7j / 7</span>
          </div>
        </div>
      </div>

      {/* Contact call-out action to link up the catalog usage */}
      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" id="wp-cta">
        <div className="flex items-center gap-2.5 text-amber-950">
          <PhoneCall className="w-4.5 h-4.5 text-amber-600 shrink-0" />
          <span className="font-semibold">Une question concernant notre grille de livraison ou de production ?</span>
        </div>
        <a
          id="wp-contact-action-btn"
          href="tel:+22507000000"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl transition-all"
        >
          Nous appeler
        </a>
      </div>

    </div>
  );
}
