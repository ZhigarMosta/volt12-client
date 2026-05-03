<template>
  <button class="mobile-search-button" type="button" @click="handleClick">
    <NuxtImg
      src="/icons/search.svg"
      width="29"
      height="29"
      alt="Search Icon"
      class="search-icon"
    />
  </button>
</template>

<script setup>
const emit = defineEmits(['open-search'])

const handleClick = () => {
  emit('open-search')
}
</script>

<style scoped>
.mobile-search-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>