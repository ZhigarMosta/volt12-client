<template>
  <div class="mobile-button-bar">
    <MobileSearchButton @open-search="handleOpenSearch" />
    <MobileButton
      v-for="(button, index) in buttons"
      :key="index"
      :icon="button.icon"
      :alt="button.alt"
      :to="button.to"
    />
  </div>
</template>

<script setup>
const emit = defineEmits(['open-search'])

const handleOpenSearch = () => {
  emit('open-search')
}

const buttons = [
  { icon: '/icons/compare.svg', alt: 'Compare', to: '/compare' },
  { icon: '/icons/cart.svg', alt: 'Cart', to: '/cart' },
  { icon: '/icons/profile.svg', alt: 'Profile', to: '/profile' }
]
</script>

<style scoped>
.mobile-button-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 67px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: var(--white);
  z-index: 11;
}

@media (min-width: 744px) {
  .mobile-button-bar {
    display: none;
  }
}
</style>