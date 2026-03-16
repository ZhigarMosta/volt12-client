export interface CatalogItemImage {
  id: number;
  alt: string;
  title: string;
  position: number;
  img_link: string;
  product_code: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  position: number;
  product_code: string;
  slug: string;
  is_new: boolean;
  is_popular: boolean;
  is_published: boolean;
  catalogItemImages: CatalogItemImage[];
}
