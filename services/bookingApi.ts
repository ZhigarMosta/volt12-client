export type BookingType = 'alarm_selection' | 'alarm_installation';

export interface BookingPayload {
  type: BookingType;
  user_name: string;
  user_phone: string;
  user_email: string;
  message?: string;
}

interface BookingApiResponse {
  success: boolean;
  errors?: string[];
}

export type BookingResult =
  | { ok: true }
  | { ok: false; kind: 'validation'; fieldErrors: string[] }
  | { ok: false; kind: 'rate_limit'; message: string }
  | { ok: false; kind: 'unknown'; message: string };

const FIELD_ERROR_MAP: Record<string, string> = {
  'type is required': 'Выберите услугу',
  'type is invalid': 'Выберите услугу из списка',
  'user_name is required': 'Введите имя',
  'user_phone is required': 'Введите номер телефона',
  'user_email is required': 'Введите email',
  'user_email is invalid': 'Введите корректный email',
};

export function mapBookingFieldError(code: string): string {
  return FIELD_ERROR_MAP[code] ?? 'Проверьте правильность заполнения формы';
}

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

export async function sendBooking(payload: BookingPayload): Promise<BookingResult> {
  const apiBase = getApiBase();

  try {
    const res = await $fetch<BookingApiResponse>(`${apiBase}/volt12/booking`, {
      method: 'POST',
      body: payload,
    });

    if (res.success) return { ok: true };
    return { ok: false, kind: 'unknown', message: 'Не удалось отправить заявку, попробуйте позже' };
  } catch (e: any) {
    const status = e?.response?.status ?? e?.statusCode;
    const data = e?.data ?? e?.response?._data;
    const errors: string[] = Array.isArray(data?.errors) ? data.errors : [];

    if (status === 400) {
      return { ok: false, kind: 'validation', fieldErrors: errors };
    }

    if (status === 429) {
      const readable = errors.find((err) => /[а-яА-Я]/.test(err));
      return { ok: false, kind: 'rate_limit', message: readable ?? 'Слишком много запросов, попробуйте позже' };
    }

    return { ok: false, kind: 'unknown', message: 'Не удалось отправить заявку, попробуйте позже' };
  }
}
