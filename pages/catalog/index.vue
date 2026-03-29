<template>
  <div class="catalogs-widget">
    <H2 class="h2">Каталоги</H2>
    <div class="catalogs-grid">
      <CatalogCard
          v-for="catalog in catalogs"
          :key="catalog.id"
          :catalog="catalog"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCatalogs } from '~/services/productApi';
import CatalogCard from '~/components/shared/CatalogCard.vue';

const { data: catalogs } = await useAsyncData('catalogs', () => getCatalogs());
</script>

<style scoped>
.catalogs-widget {
  margin-top: 51px;
}

.h2 {
  margin-bottom: 29px;
}

.catalogs-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

@media (max-width: 1100px) {
  .h2 {
    margin-bottom: 31px;
  }

  .catalogs-widget {
    margin-top: 48px;
  }

  .catalogs-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

@media (max-width: 744px) {
  .h2 {
    margin-bottom: 65px;
  }

  .catalogs-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .catalogs-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>
