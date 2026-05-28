export interface FeedbackPayload {
  type: string;
  user_name: string;
  user_phone: string;
  user_email?: string;
  description: string;
}

export interface FeedbackResponse {
  success: boolean;
  errors?: string[];
}

function getApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

export async function sendFeedback(payload: FeedbackPayload): Promise<void> {
  const apiBase = getApiBase();
  const res = await $fetch<FeedbackResponse>(`${apiBase}/volt12/feedback`, {
    method: 'POST',
    body: payload,
  });

  if (!res.success) {
    const message = res.errors?.join(', ') || 'Не удалось отправить заявку';
    throw new Error(message);
  }
}
