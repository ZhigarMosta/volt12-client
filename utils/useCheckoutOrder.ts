import { useLocalStorageRef } from '~/utils/useLocalStorageRef';

export interface CheckoutOrderItem {
  id: number;
  catalogItemId: number;
  name: string;
  price: number;
  quantity: number;
}

const STORAGE_KEY = 'checkout_order_items';

export function useCheckoutOrder() {
  const orderItems = useLocalStorageRef<CheckoutOrderItem[]>(STORAGE_KEY, []);

  function saveOrder(items: CheckoutOrderItem[]) {
    orderItems.value = items;
  }

  function clearOrder() {
    orderItems.value = [];
  }

  return { orderItems, saveOrder, clearOrder };
}
