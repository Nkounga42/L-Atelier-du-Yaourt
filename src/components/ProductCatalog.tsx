import React, { useState } from 'react';
import { YogurtProduct, YogurtSize, CartItem, UserProfile } from '../types';
import { YOGURT_PRODUCTS, PRICING_GRID, CONDITIONS } from '../data';
import { ShoppingCart, Check, Info, Plus, Minus, Tag, Beaker } from 'lucide-react';

interface ProductCatalogProps {
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  profile: UserProfile;
}

export default function ProductCatalog({ onAddToCart, profile }: ProductCatalogProps) {
  // State for each product's active configuration in the UI
  const [selections, setSelections] = useState<Record<string, {
    size: YogurtSize;
    subFlavor: string;
    quantity: number;
    success: boolean;
  }>>(() => {
    // Initialize default states for each product
    const initial: Record<string, any> = {};
    YOGURT_PRODUCTS.forEach(p => {
      initial[p.id] = {
        size: '25cl',
        subFlavor: p.subFlavors && p.subFlavors.length > 0 ? p.subFlavors[0] : '',
        quantity: profile === 'revendeur' ? CONDITIONS.minRevendeurs : CONDITIONS.minParticuliers,
        success: false
      };
    });
    return initial;
  });

  // Sync default quantity when profile change is detected
  React.useEffect(() => {
    setSelections(prev => {
      const updated = { ...prev };
      YOGURT_PRODUCTS.forEach(p => {
        if (updated[p.id]) {
          updated[p.id].quantity = profile === 'revendeur' ? CONDITIONS.minRevendeurs : CONDITIONS.minParticuliers;
        }
      });
      return updated;
    });
  }, [profile]);

  const updateSelection = (productId: string, key: 'size' | 'subFlavor' | 'quantity' | 'success', value: any) => {
    setSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [key]: value
      }
    }));
  };

  const handleQtyChange = (productId: string, delta: number) => {
    const currentQty = selections[productId]?.quantity || 0;
    const step = profile === 'revendeur' ? 5 : 1;
    const minVal = profile === 'revendeur' ? 5 : 1; // allow lowering before adding, but warn on rules
    const newQty = Math.max(minVal, currentQty + (delta * step));
    updateSelection(productId, 'quantity', newQty);
  };

  const handleAddClick = (product: YogurtProduct) => {
    const pSelection = selections[product.id];
    if (!pSelection) return;

    const price = PRICING_GRID[pSelection.size];
    
    // Call app handler
    onAddToCart({
      product,
      size: pSelection.size,
      selectedSubFlavor: pSelection.subFlavor,
      quantity: pSelection.quantity,
      price
    });

    // Show temporary success checkmark animation
    updateSelection(product.id, 'success', true);
    setTimeout(() => {
      updateSelection(product.id, 'success', false);
    }, 1500);
  };

  return (
    <div className="space-y-6" id="product-catalog-section">
      <div className="flex items-center justify-between" id="catalog-title-bar">
        <div>
          <h2 className="font-serif text-2xl text-slate-900 font-bold">Notre Catalogue de Saveurs</h2>
          <p className="text-slate-500 text-xs">Sélectionnez vos parfums, volumes et personnalisez vos mélanges</p>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">5 Références en Stock</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="catalog-grid">
        {YOGURT_PRODUCTS.map((product) => {
          const config = selections[product.id] || {
            size: '25cl',
            subFlavor: '',
            quantity: 1,
            success: false
          };

          const activePrice = PRICING_GRID[config.size];
          const totalCalculated = activePrice * config.quantity;

          // Rule warnings in component body for proactive awareness
          const isQtyUnderRule = profile === 'revendeur' 
            ? config.quantity < CONDITIONS.minRevendeurs 
            : config.quantity < CONDITIONS.minParticuliers;

          return (
            <div
              key={product.id}
              id={`product-card-${product.id}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Product Thumbnail Banner */}
              <div className="relative h-48 w-full bg-slate-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Category Pill Tag */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-900 font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm">
                  {product.category}
                </span>

                {/* Stock status indicator */}
                <span className="absolute top-3 right-3 bg-emerald-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  En Stock
                </span>

                {/* Title overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-lg font-bold leading-tight drop-shadow-sm">{product.name}</h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col space-y-4">
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {/* Optional Subflavors / Specific option selection */}
                {product.subFlavors && product.subFlavors.length > 0 && (
                  <div className="space-y-1.5" id={`subflavor-${product.id}`}>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-500" />
                      Sélectionnez la variété :
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {product.subFlavors.map((subf) => (
                        <button
                          key={subf}
                          id={`flavor-option-${product.id}-${subf.toLowerCase().replace(/\s+/g, '-')}`}
                          type="button"
                          onClick={() => updateSelection(product.id, 'subFlavor', subf)}
                          className={`text-xs px-2.5 py-1 rounded-lg transition-all border ${
                            config.subFlavor === subf
                              ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {subf}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                <div className="space-y-1.5" id={`size-${product.id}`}>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Beaker className="w-3 h-3 text-emerald-600" />
                    Format / Volume du contenant :
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['25cl', '50cl', '1L'] as YogurtSize[]).map((sz) => {
                      const szLabel = sz === '1L' ? '1 Litre' : sz.replace('cl', ' cl');
                      const szPrice = PRICING_GRID[sz];
                      return (
                        <button
                          key={sz}
                          id={`size-option-${product.id}-${sz}`}
                          type="button"
                          onClick={() => updateSelection(product.id, 'size', sz)}
                          className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl border transition-all ${
                            config.size === sz
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="text-xs">{szLabel}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{szPrice} FCFA</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing / Qty Selector and Actions at bottom of card */}
                <div className="pt-3 border-t border-slate-100 mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Prix Unitaire</div>
                      <div className="text-sm font-bold font-mono text-slate-700">{activePrice} FCFA</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Total estimatif</div>
                      <div className="text-base font-extrabold font-mono text-emerald-700">{totalCalculated.toLocaleString()} FCFA</div>
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center justify-between gap-3 bg-slate-50 p-2 rounded-xl">
                    <div className="flex items-center gap-1">
                      <button
                        id={`qty-minus-${product.id}`}
                        type="button"
                        onClick={() => handleQtyChange(product.id, -1)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-700 active:scale-95 transition-transform"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="w-12 text-center">
                        <span className="text-sm font-bold font-mono text-slate-800">{config.quantity}</span>
                        <span className="block text-[8px] text-slate-400 uppercase font-bold">Qté</span>
                      </div>

                      <button
                        id={`qty-plus-${product.id}`}
                        type="button"
                        onClick={() => handleQtyChange(product.id, 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-100 text-slate-700 active:scale-95 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      id={`add-to-cart-btn-${product.id}`}
                      type="button"
                      onClick={() => handleAddClick(product)}
                      disabled={product.inStock === false}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        config.success
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm hover:shadow active:scale-98'
                      }`}
                    >
                      {config.success ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Ajouté !</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Ajouter au panier</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Proactive minimum constraint checker inside card */}
                  {isQtyUnderRule && (
                    <div className="flex items-start gap-1 p-2 rounded-lg bg-amber-50 text-amber-900 text-[10px] leading-tight" id={`warning-rule-${product.id}`}>
                      <Info className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                      <span>
                        {profile === 'revendeur'
                          ? `Attention : Le minimum grossiste est de ${CONDITIONS.minRevendeurs} unités pour cette référence.`
                          : `Attention : Nous conseillons au moins ${CONDITIONS.minParticuliers} unités par goût (règle de livraison).`
                        }
                      </span>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
