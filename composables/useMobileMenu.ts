export function useMobileMenu() {
  const isMobileMenuOpen = useState('mobile-menu:open', () => false);
  const focusSearchOnOpen = useState('mobile-menu:focus-search', () => false);

  function openMobileMenu() {
    isMobileMenuOpen.value = true;
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false;
  }

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  }

  function openMobileSearch() {
    focusSearchOnOpen.value = true;
    isMobileMenuOpen.value = true;
  }

  return {
    isMobileMenuOpen,
    focusSearchOnOpen,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    openMobileSearch,
  };
}
