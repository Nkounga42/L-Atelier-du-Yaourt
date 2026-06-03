import { YogurtProduct, PriceGrid } from './types';

// Let's import or reference the generated images
export const IMAGES = {
  fruiteHero: '/src/assets/images/yogurt_fruite_hero_1780412722175.png',
  collectionHero: '/src/assets/images/yogurt_collection_hero_1780412746733.png',
  chocolat: 'https://images.unsplash.com/photo-1571244856341-4f3dd95db36e?auto=format&fit=crop&q=80&w=600',
  vanille: 'https://images.unsplash.com/photo-1505252585461-04db1dee846d?auto=format&fit=crop&q=80&w=600',
  nature: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
  nonsucre: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=600',
};

export const YOGURT_PRODUCTS: YogurtProduct[] = [
  {
    id: 'fruite',
    category: 'Fruité',
    name: 'Yaourt Fruité Artisanal',
    description: 'Une explosion de fraîcheur élaborée à base de lait frais local et d\'un onctueux coulis de fruits rigoureusement sélectionnés. Disponible en cinq saveurs exaltantes.',
    subFlavors: ['Fraise', 'Mangue', 'Ananas', 'Framboise', 'Citron'],
    image: IMAGES.fruiteHero,
    inStock: true,
  },
  {
    id: 'chocolat',
    category: 'Au chocolat',
    name: 'Yaourt Onctueux au Chocolat',
    description: 'Une alliance gourmande mariant la douceur lactée à la puissance aromatique de véritables éclats de chocolat pour satisfaire les adeptes de douceurs intenses.',
    subFlavors: ['Chocolat Noir', 'Chocolat au Lait'],
    image: IMAGES.chocolat,
    inStock: true,
  },
  {
    id: 'vanille',
    category: 'Vanille',
    name: 'Yaourt Doux à la Vanille',
    description: 'Parfumé délicatement aux gousses de vanille naturelle de Madagascar. Les grains de vanille visibles témoignent de l\'authenticité de notre recette traditionnelle.',
    subFlavors: ['Vanille Naturelle de Madagascar'],
    image: IMAGES.vanille,
    inStock: true,
  },
  {
    id: 'nature',
    category: 'Nature',
    name: 'Yaourt Nature Fraîcheur',
    description: 'La pure expression de la crèmerie locale. Sans aucun additif, ce yaourt est apprécié pour sa texture soyeuse et sa note légèrement acidulée typique des fermentations naturelles.',
    subFlavors: ['Classique Nature'],
    image: IMAGES.nature,
    inStock: true,
  },
  {
    id: 'nonsucre',
    category: 'Non sucré',
    name: 'Yaourt Nature Zéro Sucre',
    description: 'Formulé spécifiquement sans aucun sucre ajouté ni édulcorant de synthèse. Sa texture légère et saine est particulièrement recommandée pour les personnes diabétiques ou suivant un régime calorique strict.',
    subFlavors: ['Zéro Sucre Ajouté'],
    image: IMAGES.nonsucre,
    inStock: true,
  },
];

export const PRICING_GRID: PriceGrid = {
  '25cl': 250,
  '50cl': 500,
  '1L': 1000,
};

// Sales conditions details from catalogue
export const CONDITIONS = {
  minParticuliers: 2, // minimum 2 units per selected flavor category
  minRevendeurs: 20, // minimum 20 units per unique reference (flavor + size)
  minPanierOnline: 1500, // minimum WordPress basket
  deliveryThresholdFree: 5000, // free standard delivery starting at 5000 FCFA
  deliveryStandardCost: 1000,  // delivery charge underneath threshold
  conservationTemp: '2°C à 6°C',
  conservationDuration: '14 à 21 jours après fabrication',
  deliveryEquipment: 'Glacière isotherme pour le maintien rigoureux de la chaîne de froid',
};
