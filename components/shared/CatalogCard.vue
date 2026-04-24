<template>
  <NuxtLink :to="`/catalog/${catalog.slug}`" class="catalog-card">
    <div class="catalog-content">
      <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="catalog.imgAlt || catalog.name"
          :title="catalog.imgTitle || catalog.name"
          class="catalog-image"
      />
      <div class="catalog-inf">
        <div class="catalog-name">{{ catalog.name }}</div>
        <div class="catalog-count">{{ catalog.items_count }} товаров</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Catalog } from '~/types/product';

const props = defineProps<{
  catalog: Catalog;
}>();

const baseURL = useRuntimeConfig().public.apiBase;

const imageUrl = computed(() => {
  const path = props.catalog.img_link ?? '';
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return baseURL.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
});
</script>

<style scoped>
.catalog-card {
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  width: 100%;
  height: 157px;
}
.catalog-content{
  display: flex;
  gap: 16px;
  margin: 27px 0 0 18px;
}
.catalog-inf{
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  min-width: 0;
  padding-right: 8px;
}
.catalog-image {
  width: 121px;
  height: 101px;
  object-fit: cover;
}

.catalog-name {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 24px;
  color: var(--black);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.catalog-count {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-light);
}

@media (max-width: 1100px) {
  .catalog-name {
    font-size: 20px;
  }
}
</style>
