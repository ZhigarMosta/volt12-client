export interface CartItemImage {
  url: string;
  alt?: string;
  position: number;
}

export interface CartItem {
  id: number;           // id записи корзины (для PUT/DELETE)
  catalogItemId: number; // id товара (для addToCart)
  name: string;
  price: number;
  slug: string;
  images: CartItemImage[];
  quantity: number;
}
