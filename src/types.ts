/**
 * Types defining Yogurt Products, Sizes, Cart Items, and Rules.
 */

export type UserProfile = 'particulier' | 'revendeur';

export type ProductFlavorCategory = 'Fruité' | 'Au chocolat' | 'Vanille' | 'Nature' | 'Non sucré';

export interface YogurtProduct {
  id: string;
  category: ProductFlavorCategory;
  name: string;
  description: string;
  subFlavors?: string[]; // e.g., fraise, mangue, ananas etc. or chocolat noir, chocolat au lait
  image: string;
  inStock: boolean;
}

export type YogurtSize = '25cl' | '50cl' | '1L';

export interface PriceGrid {
  '25cl': number;
  '50cl': number;
  '1L': number;
}

export interface CartItem {
  id: string; // unique key: flavorCategory + size + selectedSubFlavor
  product: YogurtProduct;
  size: YogurtSize;
  selectedSubFlavor?: string;
  quantity: number;
  price: number;
}

export interface OrderDetails {
  fullName: string;
  phone: string;
  email?: string;
  profile: UserProfile;
  shopType: 'wordpress' | 'direct';
  paymentMethod: 'espèces' | 'orange_money' | 'wave' | 'mtn_momo' | 'virement';
  deliveryAddress: string;
  deliveryNotes?: string;
}

export interface RuleValidationResult {
  isValid: boolean;
  messages: string[];
}
