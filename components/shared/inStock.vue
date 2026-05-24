<template>
  <div class="in-stock" v-if="count > 0">
    <NuxtImg src="/icons/inStock.svg" alt="in-stock"/>
    <p class="stock"> В наличии {{count}} штук </p>
  </div>
  <div class="in-stock" v-else>
    <NuxtImg src="/icons/outOfStock.svg" alt="in-stock"/>
    <p class="stock"> Нет в наличии </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  count: number
}>()
</script>

<style scoped>
.in-stock{
  display: flex;
  gap: 8px;
  align-items: center;
}
.stock {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--red);
}
</style>