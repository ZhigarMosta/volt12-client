<template>
  <div class="mobile-button-bar">
    <MobileSearchButton @open-search="handleOpenSearch" />
    <MobileButton icon="/icons/compare.svg" alt="Compare" to="/some-page" />
    <MobileButton icon="/icons/cart.svg" alt="Cart" to="/another-page" />
    <MobileButton icon="/icons/profile.svg" alt="Profile" to="/third-page" />
  </div>
</template>

<script setup>
const emit = defineEmits(['open-search'])

const handleOpenSearch = () => {
  emit('open-search')
}
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
  box-shadow: 0 -2px 10px rgba(var(--gray-light-rgb), 0.2);
  z-index: 100;
}
</style>