<template>
  <div class="catalogs-widget">
    <Navigate :items="breadcrumbsItems" />
    <div v-if="loading" class="catalogs-grid">
      <SkeletonCatalogCard v-for="i in 6" :key="i" />
    </div>
    <div v-else class="catalogs-grid">
      <CatalogCard
          v-for="catalog in catalogs"
          :key="catalog.id"
          :catalog="catalog"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCatalogs } from '~/services/productApi';
import CatalogCard from '~/components/shared/CatalogCard.vue';
import SkeletonCatalogCard from '~/components/shared/SkeletonCatalogCard.vue';

const loading = ref(true);
const { data: catalogs } = await useAsyncData('catalogs', () => getCatalogs());
const breadcrumbsItems = computed(() => [
  { to: '/', text: 'Главная' },
  { to: '/catalog', text: 'Каталог' }
]);

onMounted(() => {
  loading.value = false;
});
</script>

<style scoped>
.catalogs-widget {
  margin-top: 37px;
  padding: 0 70px;
  margin-bottom: 88px;
}

.h2 {
  margin-bottom: 29px;
}

.catalogs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1100px) {
  .h2 {
    margin-bottom: 31px;
  }

  .catalogs-widget {
    margin-top: 31px;
    padding: 0 37px;
    margin-bottom: 58px;
  }

  .catalogs-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 744px) {
  .h2 {
    margin-bottom: 65px;
  }

  .catalogs-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .catalogs-widget {
    padding: 0 20px;
    margin-bottom: 36px;
    margin-top: 36px;
  }
}
</style>
