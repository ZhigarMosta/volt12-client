import type { BookingType } from '~/services/bookingApi';

export function useBookingModal() {
  const isBookingModalOpen = useState('booking-modal:open', () => false);
  const bookingType = useState<BookingType>('booking-modal:type', () => 'alarm_selection');

  function openBookingModal(type: BookingType) {
    bookingType.value = type;
    isBookingModalOpen.value = true;
  }

  function closeBookingModal() {
    isBookingModalOpen.value = false;
  }

  return { isBookingModalOpen, bookingType, openBookingModal, closeBookingModal };
}
