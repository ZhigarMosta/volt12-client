<template>
  <div class="compare-page">
    <div v-if="loading" class="compare-skeleton">
      <div class="sk-top-bur">
        <div class="sk-tabs">
          <div class="sk-tab" v-for="i in 4" :key="i" />
        </div>
        <div class="sk-radios">
          <div class="sk-radio" v-for="i in 2" :key="i" />
        </div>
      </div>
      <div class="sk-body">
        <div class="sk-chars">
          <div class="sk-char" v-for="i in 4" :key="i" />
        </div>
        <div class="sk-cards">
          <div class="sk-card" v-for="i in 4" :key="i">
            <div class="sk-card-img" />
            <div class="sk-card-name" />
            <div class="sk-card-price" />
          </div>
        </div>
      </div>
    </div>
    <template v-else-if="catalogs.length > 0">
      <div class="top-bur">
        <div class="tabs-wrapper">
          <Slider
              class="tabs-swiper"
              slides-per-view="auto"
              :items="catalogs"
              :space-between="21"
              :slide-component="TabSlide"
              :slide-props="tabSlideProps"
              show-navigation
              :showPagination="false"
          />
        </div>
        <div class="filter-radios">
          <FilterRadio value="all" name="Все характеристики" v-model="filterMode"/>
          <FilterRadio value="differences" name="Только отличия" v-model="filterMode"/>
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
          slides-per-view="auto"
          :items="currentItems"
          :space-between="23"
          :slide-component="CompareItem"
          :style="sliderHeightStyle"
          show-navigation
          nav-top="105px"
      />
    </template>
    <EmptyState
        v-else
        title="Пока сравнивать нечего"
        subtitle="Отметьте нужные товары в каталоге"
        button-text="В каталог"
        :on-click="goToCatalog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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

const characteristicsCount = computed(() => {
  const cat = catalogs.value[activeCatalogIndex.value];
  return cat?.catalog?.characteristics?.length ?? 0;
});

const sliderHeightStyle = computed(() => {
  const height = 284 + characteristicsCount.value * 62;
  return {
    '--slider-desktop-height': `${height}px`,
    '--slider-tablet-height': `${height}px`,
    '--slider-mobile-height': `${height}px`,
  };
});

const router = useRouter();
function goToCatalog() {
  router.push('/catalog');
}

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
.tabs-swiper {
  --slider-desktop-height: 62px;
  --slider-tablet-height: 62px;
  --slider-mobile-height: 62px;
}

.compare-page {
  padding: 30px 70px;
}
.compare-skeleton {
  padding: 30px 70px;
}
.sk-top-bur {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
  margin-bottom: 24px;
}
.sk-tabs {
  display: flex;
  gap: 21px;
  flex: 1;
}
.sk-tab {
  height: 50px;
  border-radius: 8px;
  flex: 1;
  max-width: 200px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}
.sk-radios {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}
.sk-radio {
  width: 120px;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}
.sk-body {
  display: flex;
  gap: 23px;
  margin-top: 24px;
}
.sk-chars {
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
.sk-char {
  width: 80px;
  height: 18px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}
.sk-cards {
  height: 500px;
  display: flex;
  gap: 23px;
  overflow: hidden;
}
.sk-card {
  width: 267px;
  flex-shrink: 0;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  padding: 17px 14px 22px 19px;
  background: #fff;
}
.sk-card-img {
  width: 167px;
  height: 124px;
  border-radius: 8px;
  margin: 0 auto;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}
.sk-card-name {
  width: 70%;
  height: 14px;
  margin-top: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}
.sk-card-price {
  width: 40%;
  height: 20px;
  margin-top: 27px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}
@keyframes sk-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
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
}
.tabs-wrapper :deep(.nav-prev) {
  left: -21px;
  margin-top: -5px;
}
.tabs-wrapper :deep(.nav-next) {
  right: -21px;
  margin-top: -5px;
}
.slider :deep(.swiper-pagination) {
  top: 0;
  margin-top: 225px;
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
@media (max-width: 1100px) {
  .compare-page {
    padding: 37px 37px;
  }
}
@media (max-width: 744px) {
  .compare-page {
    padding: 37px 20px;
    overflow-x: hidden;
  }
  .top-bur {
    flex-direction: column;
    align-items: stretch;
  }
  .tabs-wrapper :deep(.nav-prev) {
    left: -10px;
  }
  .tabs-wrapper :deep(.nav-next) {
    right: -10px;
  }
  .slider :deep(.nav-prev) {
    left: -10px;
  }
  .slider :deep(.nav-next) {
    right: -10px;
  }
}
</style>
