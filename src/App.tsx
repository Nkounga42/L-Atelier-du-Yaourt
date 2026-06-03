import React, { useState } from 'react';
import { UserProfile, CartItem, OrderDetails } from './types';
import HeroSection from './components/HeroSection';
import ProductCatalog from './components/ProductCatalog';
import OrderSimulator from './components/OrderSimulator';
import OrderReceiptModal from './components/OrderReceiptModal';
import WordPressDirect from './components/WordPressDirect';
import { CONDITIONS } from './data';
import { Truck, Sparkles, BookOpenCheck, CreditCard, ShieldCheck } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>('particulier');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeOrderDetails, setActiveOrderDetails] = useState<OrderDetails | null>(null);

  // Cart Management Handlers
  const handleAddToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCart((prevCart) => {
      // Check if reference exists
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === newItem.product.id &&
          item.size === newItem.size &&
          item.selectedSubFlavor === newItem.selectedSubFlavor
      );

      if (existingIndex > -1) {
        // Quantities accumulate
        const updated = [...prevCart];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      } else {
        // Add as a new item. Generating a unique ID to prevent React render glitches
        const id = `${newItem.product.id}-${newItem.size}-${newItem.selectedSubFlavor || 'classique'}-${Date.now()}`;
        return [...prevCart, { ...newItem, id }];
      }
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenReceipt = (details: OrderDetails) => {
    setActiveOrderDetails(details);
    setIsReceiptOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-200 selection:text-emerald-900 font-sans" id="app-root">
      
      {/* Header and Brand Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 no-print" id="shop-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center font-serif font-extrabold text-white text-lg tracking-tight shadow-md">
              Y
            </div>
            <div>
              <span className="font-serif font-extrabold tracking-tight text-slate-900 text-lg">L'Atelier du Yaourt</span>
              <span className="block text-[9px] uppercase tracking-wider font-extrabold text-emerald-700 font-mono -mt-1">Gamme Complète</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            <a
              id="header-wp-link"
              href="#wordpress-info-panel"
              className="text-slate-600 hover:text-emerald-800 transition-colors hidden sm:inline-block"
            >
              Boutique WordPress
            </a>
            <span className="text-slate-200 hidden sm:inline-block">|</span>
            <div className="bg-emerald-50 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Grille Tarifaire Officielle 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 lg:pb-20" id="main-content">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Area (8 cols on lg screen): Hero, Catalog, Conditions and WordPress Info */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 no-print" id="storefront-left-rail">
            
            {/* 1. Hero Content & Profile Configuration Selector */}
            <HeroSection
              currentProfile={profile}
              setProfile={setProfile}
              cartTotal={cart.length}
            />

            {/* 2. Interactive Flavor & Volume Catalog Grid */}
            <ProductCatalog
              onAddToCart={handleAddToCart}
              profile={profile}
            />

            {/* 3. Detailed Official Conditions from the printed user source */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4" id="conditions-section">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <BookOpenCheck className="w-5 h-5 text-emerald-800" />
                <h3 className="font-serif text-lg font-bold text-slate-800">Conditions de Vente & Transport</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
                <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50/40 border border-amber-100/40 hover:bg-amber-50 transition-colors">
                  <div className="font-bold text-amber-950 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>1. Produits & DLC</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-slate-550">
                    Nos yaourts de qualité supérieure sont fabriqués à partir de lait frais d’origine locale, conditionnés hermétiquement pour une fraîcheur maximale de <b>{CONDITIONS.conservationDuration}</b> au froid (entre 2°C et 6°C).
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100/40 hover:bg-emerald-50 transition-colors">
                  <div className="font-bold text-emerald-950 flex items-center gap-1">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>2. Transport Isotherme</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-slate-550">
                    Livraison gratuite dès <b>{CONDITIONS.deliveryThresholdFree.toLocaleString()} FCFA</b> d’achats dans notre zone de livraison standard. Tous les yaourts sont acheminés en <b>glacières isothermes</b> certifiées.
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-blue-50/40 border border-blue-100/40 hover:bg-blue-50 transition-colors">
                  <div className="font-bold text-blue-950 flex items-center gap-1">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>3. Transactions</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-slate-550">
                    Options sécurisées : Espèces à la livraison, <b>Orange Money, Wave, MTN MoMo</b> ou virement bancaire pour vos commandes grossistes.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. WordPress Custom Connection Panel */}
            <WordPressDirect />
          </div>

          {/* Right Area (4 cols on lg screen): Sticky Interactive Order Simulator */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 no-print" id="storefront-right-rail">
            <OrderSimulator
              cart={cart}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onUpdateQuantity={handleUpdateQuantity}
              profile={profile}
              onOpenReceipt={handleOpenReceipt}
            />
          </div>

        </div>
      </main>

      {/* Floating checkout utility button strictly for Mobile views */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 left-4 z-40 lg:hidden no-print" id="mobile-floating-cart-bar">
          <a
            id="mobile-scroll-to-simulator"
            href="#order-simulator-container"
            className="flex items-center justify-between bg-emerald-800 text-white p-4 rounded-2xl shadow-xl font-bold text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center font-mono text-xs">{cart.length}</span>
              Voir mon panier
            </span>
            <span className="font-mono">{cart.reduce((s,i)=>s+(i.price*i.quantity),0).toLocaleString()} FCFA</span>
          </a>
        </div>
      )}

      {/* High-fidelity Bon de Commande Receipt Invoice Modal */}
      <OrderReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        cart={cart}
        orderDetails={activeOrderDetails}
        onClearCart={handleClearCart}
      />

      {/* Sleek footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 mt-16 border-t border-slate-900 no-print" id="shop-footer">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-center md:text-left">
          <div className="space-y-1.5">
            <div className="font-serif font-bold text-slate-200 text-sm">L'Atelier du Yaourt</div>
            <div>© 2026 Tous droits réservés. Références conformes aux grilles tarifaires de notre boutique WordPress WooCommerce.</div>
          </div>
          <div className="flex gap-4">
            <div className="text-slate-300 font-semibold">Conditions de vente sanitaires respectées</div>
            <span className="text-slate-700">|</span>
            <div className="text-slate-300 font-semibold font-serif italic">100% Onctueux & Frais</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
