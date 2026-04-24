<template>
  <section class="popular-catalogs">
    <AnimatedTabs
        class="tabs"
        v-model="activeTabIndex"
        :tabs="catalogNames"
        :loading="loading"
        :skeleton-count="3"
    />
    <div v-if="!loading && catalogs.length > 0">
      <Slider
          v-if="selectedCatalogId"
          :key="selectedCatalogId"
          :fetch-items="fetchCatalogItems"
          :breakpoints="sliderBreakpoints"
          :slide-component="ProductCard"
      />
      <div class="button-wrapper">
        <UiButton to="/catalog" size="sm" variant="red">
          Перейти в каталог
        </UiButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sliderBreakpoints = computed(() => ({
  0: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    grid: { rows: 3 },
    spaceBetween: 10
  },
  744: {
    slidesPerView: 3,
    slidesPerGroup: 3,
    grid: { rows: 3 },
    spaceBetween: 10
  },
  1100: {
    slidesPerView: 6,
    slidesPerGroup: 6,
    grid: { rows: 2 },
    spaceBetween: 10
  }
}));
import { ref, computed, onMounted, watch } from 'vue';
import type { PopularCatalog } from '~/types/product';
import {getCatalogItems, getPopularCatalogs} from '~/services/productApi';
import ProductCard from "~/components/shared/ProductCard.vue";

const catalogs = ref<PopularCatalog[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const activeTabIndex = ref(0);
const selectedCatalogId = ref<number | null>(null);

const catalogNames = computed(() => catalogs.value.map(c => c.name));

const fetchCatalogItems = async () => {
  const response = await getCatalogItems({
    catalogId: selectedCatalogId.value,
    limit: 12
  });
  return response.items || [];
};

const updateSelectedCatalog = (index: number) => {
  selectedCatalogId.value = catalogs.value[index]?.id || null;
};

watch(activeTabIndex, (newIndex) => {
  updateSelectedCatalog(newIndex);
});

const loadCatalogs = async () => {
  loading.value = true;
  error.value = null;

  try {
    catalogs.value = await getPopularCatalogs();
    if (catalogs.value.length > 0) {
      selectedCatalogId.value = catalogs.value[0].id;
    }
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCatalogs();
});
</script>

<style scoped>
.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 43px;
}
.popular-catalogs {
  margin-bottom: 60px;
}
.tabs{
  margin-bottom: 41px;
}
</style>
