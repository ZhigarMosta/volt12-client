/** Поля окна «Купить в один клик», на которые раскладываются ошибки бэкенда. */
export type QuickOrderField = 'quantity' | 'name' | 'phone' | 'email' | 'comment' | 'agree' | 'form';

export interface QuickOrderPayload {
  catalog_item_id: number;
  quantity?: number;
  name: string;
  /** Телефон уходит как ввёл пользователь, вместе с маской — бэкенд нормализует сам. */
  phone: string;
  email: string;
  comment?: string;
  agree_policy: boolean;
}

export type QuickOrderResult =
  | { ok: true; orderId: number }
  | { ok: false; kind: 'validation'; fieldErrors: string[] }
  | { ok: false; kind: 'not_found'; message: string }
  | { ok: false; kind: 'rate_limit'; message: string }
  | { ok: false; kind: 'unknown'; message: string };

/** Строка ошибки от бэкенда → поле окна и текст для пользователя. */
const ERROR_MAP: Record<string, { field: QuickOrderField; message: string }> = {
  'catalog_item_id is required': { field: 'form', message: 'Товар больше не доступен' },
  'catalog_item not found': { field: 'form', message: 'Товар больше не доступен' },
  'quantity is invalid': { field: 'quantity', message: 'Укажите количество от 1 до 99' },
  'name is required': { field: 'name', message: 'Введите имя' },
  'name is invalid': { field: 'name', message: 'Имя не должно быть длиннее 255 символов' },
  'phone is required': { field: 'phone', message: 'Введите номер телефона' },
  'phone is invalid': { field: 'phone', message: 'Введите корректный номер телефона' },
  'email is required': { field: 'email', message: 'Введите email' },
  'email is invalid': { field: 'email', message: 'Введите корректный email' },
  'comment is invalid': { field: 'comment', message: 'Комментарий не должен быть длиннее 1000 символов' },
  'agree_policy is required': { field: 'agree', message: 'Нужно согласие на обработку данных' },
  'Too many requests': { field: 'form', message: 'Слишком много запросов, попробуйте позже' },
};

export function mapQuickOrderError(code: string): { field: QuickOrderField; message: string } {
  return ERROR_MAP[code] ?? { field: 'form', message: 'Проверьте правильность заполнения формы' };
}

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

export async function sendQuickOrder(payload: QuickOrderPayload): Promise<QuickOrderResult> {
  const apiBase = getApiBase();

  try {
    const res = await $fetch<{ success: boolean; order_id: number }>(`${apiBase}/volt12/quick_order`, {
      method: 'POST',
      // Авторизация не обязательна, но по cookie бэкенд привяжет заказ к аккаунту
      credentials: 'include',
      body: payload,
    });

    if (res.success && res.order_id) return { ok: true, orderId: res.order_id };
    return { ok: false, kind: 'unknown', message: 'Не удалось отправить заявку, попробуйте ещё раз' };
  } catch (e: any) {
    const status = e?.response?.status ?? e?.statusCode;
    const data = e?.data ?? e?.response?._data;
    const errors: string[] = Array.isArray(data?.errors) ? data.errors : [];

    if (status === 400) {
      return { ok: false, kind: 'validation', fieldErrors: errors };
    }

    if (status === 404) {
      return { ok: false, kind: 'not_found', message: 'Товар больше не доступен' };
    }

    if (status === 429) {
      return { ok: false, kind: 'rate_limit', message: 'Слишком много запросов, попробуйте позже' };
    }

    return { ok: false, kind: 'unknown', message: 'Не удалось отправить заявку, попробуйте ещё раз' };
  }
}
