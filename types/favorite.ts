import type { CartItemImage } from '~/types/cart';

export interface FavoriteItem {
  id: number;            // id записи избранного (для DELETE)
  catalogItemId: number; // id товара
  name: string;
  price: number;
  slug: string;
  images: CartItemImage[];
}
