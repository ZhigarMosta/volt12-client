export type ToastType = 'success' | 'error';

export interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

let nextId = 0;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

export function useToast() {
  const toast = useState<ToastState | null>('toast', () => null);

  function showToast(message: string, type: ToastType = 'success', duration = 3500) {
    if (hideTimer) clearTimeout(hideTimer);
    toast.value = { id: ++nextId, message, type };
    hideTimer = setTimeout(() => {
      toast.value = null;
    }, duration);
  }

  function hideToast() {
    if (hideTimer) clearTimeout(hideTimer);
    toast.value = null;
  }

  return { toast, showToast, hideToast };
}
