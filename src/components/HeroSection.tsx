import React from 'react';
import { UserProfile } from '../types';
import { CONDITIONS } from '../data';
import { Sparkles, Users, Store, BookOpen, ThumbsUp, ShoppingBag } from 'lucide-react';

interface HeroSectionProps {
  currentProfile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  cartTotal: number;
}

export default function HeroSection({ currentProfile, setProfile, cartTotal }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50/70 via-rose-50/50 to-emerald-50/40 border-b border-slate-100 rounded-3xl p-6 md:p-10 mb-8" id="hero-section">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Branding Content */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-100/60 text-amber-900 px-3 py-1.5 rounded-full text-xs font-semibold w-max" id="brand-badge">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Artisan Laitier Local — Premium</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight" id="main-title">
            Vos Yaourts Gourmands et <span className="text-emerald-700 italic font-semibold">100% Naturels</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl" id="brand-subtitle">
            Savourez une gamme d’exception élaborée à partir de lait frais de notre terroir. Emballage hermétique hygiénique, textures onctueuses et fraîcheur garantie livrée directement chez vous.
          </p>

          {/* Quick Metrics from document */}
          <div className="grid grid-cols-3 gap-3 pt-3 max-w-lg" id="features-grid">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-emerald-600 font-bold text-base md:text-lg">250 FCFA</div>
              <div className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Prix de départ (25cl)</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-amber-600 font-bold text-base md:text-lg">Isotherme</div>
              <div className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Chaine de froid</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-blue-600 font-bold text-base md:text-lg">WordPress</div>
              <div className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Boutique en ligne</div>
            </div>
          </div>

          {/* Profile Choice Section - Crucial for dynamic order logic checking */}
          <div className="pt-6 border-t border-slate-200/60" id="profile-container">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Type de Client : Définir pour adapter les règles</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="profile-btn-particulier"
                type="button"
                onClick={() => setProfile('particulier')}
                className={`flex-1 flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 text-left border ${
                  currentProfile === 'particulier'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-300/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-sm">Particulier / Famille</div>
                  <div className={`text-[11px] mt-0.5 ${currentProfile === 'particulier' ? 'text-amber-100' : 'text-slate-400'}`}>
                    Minimum {CONDITIONS.minParticuliers} unités par goût sélectionné
                  </div>
                </div>
                <Users className={`w-5 h-5 ml-2 shrink-0 ${currentProfile === 'particulier' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              <button
                id="profile-btn-revendeur"
                type="button"
                onClick={() => setProfile('revendeur')}
                className={`flex-1 flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 text-left border ${
                  currentProfile === 'revendeur'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-sm">Revendeur / Grossiste</div>
                  <div className={`text-[11px] mt-0.5 ${currentProfile === 'revendeur' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Minimum {CONDITIONS.minRevendeurs} unités par référence (goût + volume)
                  </div>
                </div>
                <Store className={`w-5 h-5 ml-2 shrink-0 ${currentProfile === 'revendeur' ? 'text-white' : 'text-slate-400'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Generated Glass Jar Image */}
        <div className="lg:col-span-5 relative" id="hero-image-wrapper">
          <div className="relative aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src="/src/assets/images/yogurt_collection_hero_1780412746733.png"
              alt="Gamme Complète Yaourts"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs leading-relaxed pointer-events-none">
              <span className="font-serif italic font-semibold text-sm">Notre collection fraîcheur</span>
              <p className="opacity-90">Conditionnés en récipients scellés, conservés entre 2°C et 6°C sous chaîne isotherme.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
