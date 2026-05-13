<template>
  <div class="compare-page">
    <div v-if="loading" class="loading">Загрузка...</div>
    <template v-else-if="catalogs.length > 0">
      <div class="top-bur">
        <div class="tabs-wrapper">
      <Slider
          class="tabs-swiper"
          :items="catalogs"
          :slides-per-view="'auto'"
          :space-between="21"
          :slide-component="TabSlide"
          :slide-props="tabSlideProps"
          show-navigation
          show-pagination
      />
        </div>
        <div class="filter-radios">
          <FilterRadio value="all" name="Все характеристики" v-model="filterMode" />
          <FilterRadio value="differences" name="Только отличия" v-model="filterMode" />
        </div>
      </div>
      <div class="catalog-characteristics">
        <div v-for="ch in filteredCharacteristics" :key="ch.id" class="char-row">
          <div class="char-name">{{ ch.name }}</div>
        </div>
      </div>
      <Slider
          class="slider"
          v-if="currentItems.length > 0"
          :items="currentItems"
          :slides-per-view="'auto'"
          :space-between="23"
          :slide-component="CompareItem"
          show-navigation
          nav-top="105px"
      />
    </template>
    <div v-else class="empty">Нет товаров для сравнения</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import CompareItem from '~/components/shared/CompareItem.vue';
import TabSlide from '~/components/shared/TabSlide.vue';
import FilterRadio from '~/components/shared/FilterRadio.vue';
import { getCompareList } from '~/services/productApi';

const loading = ref(true);
const catalogs = ref<any[]>([]);
const activeCatalogIndex = ref(0);
const filterMode = ref('all');

const tabSlideProps = (item: any, index: number) => ({
  name: item.catalog?.name,
  count: item.items?.length ?? 0,
  img: item.catalog?.img,
  index,
  isActive: index === activeCatalogIndex.value,
  onSelect: (i: number) => { activeCatalogIndex.value = i; }
});

const filteredCharacteristics = computed(() => {
  const cat = catalogs.value[activeCatalogIndex.value];
  if (!cat) return [];
  const allChars = cat.catalog.characteristics ?? [];
  if (filterMode.value !== 'differences') return allChars;
  const items = cat.items;
  if (items.length < 2) return allChars;
  return allChars.filter((ch: any) => {
    const values = items.map((item: any) =>
      item.characteristics?.some((c: any) => c.characteristic_id === ch.id) ?? false
    );
    return new Set(values).size > 1;
  });
});

const currentItems = computed(() => {
  const cat = catalogs.value[activeCatalogIndex.value];
  if (!cat) return [];
  const chars = filteredCharacteristics.value;
  return cat.items.map((item: any) => ({
    ...item,
    catalog_characteristics: chars,
  }));
});

onMounted(async () => {
  try {
    catalogs.value = await getCompareList();
  } catch {
    catalogs.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.slider {
  --slider-desktop-height: 843px;
  --slider-tablet-height: 823px;
  --slider-mobile-height: 809px;
}

.compare-page {
  padding: 40px 70px;
}
.loading, .empty {
  text-align: center;
  font-size: 18px;
  padding: 60px 0;
  color: var(--gray-light);
}
.top-bur {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
  margin-bottom: 24px;
}
.tabs-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}
.tabs-swiper {
  flex: 1;
  min-width: 0;
  --slider-desktop-height: auto;
}
.tabs-wrapper :deep(.nav-prev) {
  left: -21px;
  margin-top: -5px;
}
.tabs-wrapper :deep(.nav-next) {
  right: -21px;
  margin-top: -5px;
}
.filter-radios {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
  margin-bottom: 10px;
}

.catalog-characteristics {
  margin-top: 250px;
  position: absolute;
  left: calc(50% - 70px);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 44px;
  align-items: center;
  pointer-events: none;
}

.char-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.char-name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #b9b9b9;
  text-align: center;
}
</style>
