function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

export interface CreateOrderPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  region: string;
  postal_code: string;
  street: string;
  house: string;
  entrance?: string;
  apartment?: string;
  comment?: string;
  items: { catalog_item_id: number; quantity: number }[];
}

export interface OrderListItem {
  id: number;
  status: string;
  total_price: number;
  items_count: number;
  created_at: string;
  city: string;
  region: string;
  street: string;
  house: string;
  entrance?: string;
  apartment?: string;
  postal_code: string;
}

export interface OrderListMeta {
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface OrderItemImage {
  id: number;
  img_link: string;
  alt?: string;
  title?: string;
}

export interface OrderItem {
  catalog_item_id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image?: OrderItemImage;
}

export interface OrderFull {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  city: string;
  region: string;
  postal_code: string;
  street: string;
  house: string;
  entrance?: string;
  apartment?: string;
  comment?: string;
  items: OrderItem[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<number> {
  const apiBase = getApiBase();
  const res = await $fetch<{ success: boolean; order_id: number }>(
    `${apiBase}/volt12/order`,
    { method: 'POST', credentials: 'include', body: payload }
  );
  return res.order_id;
}

export async function getOrders(page = 1, perPage = 10): Promise<{ orders: OrderListItem[]; meta: OrderListMeta }> {
  const apiBase = getApiBase();
  const res = await $fetch<{ success: boolean; items: OrderListItem[]; total: number; page: number; per_page: number; pages: number }>(
    `${apiBase}/volt12/orders`,
    { credentials: 'include', query: { page, per_page: perPage } }
  );
  return {
    orders: res.items ?? [],
    meta: { total: res.total, page: res.page, per_page: res.per_page, pages: res.pages },
  };
}

export async function getOrder(id: number): Promise<OrderFull> {
  const apiBase = getApiBase();
  const res = await $fetch<{ success: boolean; order: OrderFull }>(
    `${apiBase}/volt12/orders/${id}`,
    { credentials: 'include' }
  );
  return res.order;
}
