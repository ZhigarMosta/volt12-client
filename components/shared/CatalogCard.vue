<template>
  <NuxtLink :to="`/catalog/${catalog.slug}`" class="catalog-card">
    <div class="catalog-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 7L12 13L21 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="catalog-name">{{ catalog.name }}</div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Catalog } from '~/types/product';

defineProps<{
  catalog: Catalog;
}>();
</script>

<style scoped>
.catalog-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
padding: 24px 16px;
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  color: var(--text-dark);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.catalog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.catalog-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: var(--red-special);
}

.catalog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.catalog-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: #e31b23;
}

.catalog-icon svg {
  width: 100%;
  height: 100%;
}

.catalog-name {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
}

@media (max-width: 744px) {
  .catalog-card {
    padding: 20px 12px;
  }

  .catalog-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
  }

  .catalog-name {
    font-size: 14px;
  }
}
</style>
