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

export interface PopularCatalog {
  id: number;
  name: string;
}

export interface Catalog {
  id: number;
  name: string;
  slug: string;
}

export interface Characteristic {
  id: number;
  name: string;
}

export interface CharacteristicGroup {
  id: number;
  name: string;
  items: Characteristic[];
}

export interface CatalogCharacteristics {
  without_group: Characteristic[];
  with_group: CharacteristicGroup[];
}

export interface CatalogItemsFilters {
  catalogId: number;
  limit: number;
  page?: number;
  filterGroups?: number[][];
  price?: {
    min?: number;
    max?: number;
  };
  search?: string;
}

export interface CatalogItemsResponse {
  items: Product[];
  facets?: Record<number, number>;
  meta?: {
    total_items: number;
    total_pages: number;
    current_page: number;
  };
}

export interface CatalogItemsParams {
  catalogId: number;
  limit: number;
}

export interface Feedback {
  id?: number;
  user_name: string;
  map: string;
  star_count: number;
  message: string;
  feedback_link: string;
}
