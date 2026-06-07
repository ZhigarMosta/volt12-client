export function useAuthModal() {
  const showAuthModal = useState('auth:modal', () => false);

  function openAuthModal() {
    showAuthModal.value = true;
  }

  return { showAuthModal, openAuthModal };
}
