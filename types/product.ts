export interface CatalogItemImage {
  id?: number;
  alt: string;
  title: string;
  position: number;
  img_link: string;
  product_code?: string;
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
  catalogItemImages?: CatalogItemImage[];
  images?: CatalogItemImage[];
  user_state: {
    cart_count: number | null;
    in_compare: boolean;
    in_favorite: boolean;
  } | null;
}

export interface PopularCatalog {
  id: number;
  name: string;
}

export interface Catalog {
  id: number;
  name: string;
  slug: string;
  img_link?: string;
  imgAlt?: string;
  imgTitle?: string;
  items_count?: number;
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
  sortPrice?: number;
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

export interface ServiceGroup {
  id: number;
  name: string;
  position: number;
  img_link: string | null;
  service_count: number;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  position: number | null;
  img_link: string | null;
  img_alt: string | null;
  img_title: string | null;
  service_group_id: number | null;
}

export interface ServicesResponse {
  items: Service[];
  groups: ServiceGroup[];
  meta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
  };
}

export interface RelatedService {
  id: number;
  name: string;
  slug: string;
  img_link: string;
  img_alt: string | null;
  img_title: string | null;
  short_description: string | null;
}

export interface Feedback {
  id?: number;
  user_name: string;
  map: string;
  star_count: number;
  message: string;
  feedback_link: string;
}

export interface ProductCharacteristic {
  id: number;
  name: string;
  exist: boolean;
}

export interface CatalogItemDetailImage {
  id: number;
  img_link: string;
  alt?: string;
  title?: string;
  position?: number;
}

export interface CatalogItemDetail {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  short_description: string | null;
  product_code: string;
  is_new: boolean;
  is_popular: boolean;
  is_published: boolean;
  position: number;
  count: number;
  catalog_id: number | null;
  images: CatalogItemDetailImage[];
  characteristics: ProductCharacteristic[];
  user_state: {
    cart_item_id: number | null;
    cart_count: number | null;
    in_compare: boolean;
    in_favorite: boolean;
  } | null;
}

export interface RelatedCatalogItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  img_link: string | null;
  product_code: string;
}

export interface CatalogItemDetailResponse {
  success: boolean;
  item: CatalogItemDetail;
  related: RelatedCatalogItem[];
  recently_viewed: RelatedCatalogItem[];
  error?: string;
}
