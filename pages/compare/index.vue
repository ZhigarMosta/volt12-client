<template>
  <div class="compare-page">
    <div v-if="loading" class="loading">Загрузка...</div>
    <template v-else-if="catalogs.length > 0">
      <div class="top-bur">
        <div class="tabs-wrapper">
      <button v-show="!isBeginning" class="tabs-nav nav-prev">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: scaleX(-1)">
          <circle cx="21" cy="21" r="21" fill="#E2000F" />
          <path d="M25.7072 21.7071C26.0977 21.3166 26.0977 20.6834 25.7072 20.2929L19.3432 13.9289C18.9527 13.5384 18.3196 13.5384 17.929 13.9289C17.5385 14.3195 17.5385 14.9526 17.929 15.3431L23.5859 21L17.929 26.6569C17.5385 27.0474 17.5385 27.6805 17.929 28.0711C18.3196 28.4616 18.9527 28.4616 19.3432 28.0711L25.7072 21.7071ZM25 21V22H25.0001V21V20H25V21Z" fill="white" />
        </svg>
      </button>
      <swiper
          class="tabs-swiper"
          :slides-per-view="'auto'"
          :space-between="21"
          :navigation="{ prevEl: '.tabs-nav.nav-prev', nextEl: '.tabs-nav.nav-next' }"
          :modules="[Navigation]"
          @init="onSwiperInit"
          @slideChange="onSlideChange"
          @reachBeginning="isBeginning = true"
          @reachEnd="isEnd = true"
          @fromEdge="onFromEdge"
      >
        <swiper-slide
            v-for="(cat, index) in catalogs"
            :key="cat.catalog.id"
            class="tabs-slide"
            :class="{ active: activeCatalogIndex === index }"
            @click="activeCatalogIndex = index"
        >
          <button class="select-catalog">
            <NuxtImg class="catalog_img" v-if="cat.catalog.img?.link" :src="`${baseURL}/${cat.catalog.img.link}`" :alt="cat.catalog.img.alt" :title="cat.catalog.img.title" />
            <p class="catalog_name">{{ cat.catalog.name }}</p>
            <p class="tab-count">{{ cat.items.length }}</p>
          </button>
          <div class="active-bar" />
        </swiper-slide>
      </swiper>
      <button v-show="!isEnd" class="tabs-nav nav-next">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="21" fill="#E2000F" />
          <path d="M25.7072 21.7071C26.0977 21.3166 26.0977 20.6834 25.7072 20.2929L19.3432 13.9289C18.9527 13.5384 18.3196 13.5384 17.929 13.9289C17.5385 14.3195 17.5385 14.9526 17.929 15.3431L23.5859 21L17.929 26.6569C17.5385 27.0474 17.5385 27.6805 17.929 28.0711C18.3196 28.4616 18.9527 28.4616 19.3432 28.0711L25.7072 21.7071ZM25 21V22H25.0001V21V20H25V21Z" fill="white" />
        </svg>
      </button>
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
          :showNavigation="true"
          nav-top="105px"
      />
    </template>
    <div v-else class="empty">Нет товаров для сравнения</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CompareItem from '~/components/shared/CompareItem.vue';
import FilterRadio from '~/components/shared/FilterRadio.vue';
import { getCompareList } from '~/services/productApi';

const loading = ref(true);
const catalogs = ref<any[]>([]);
const activeCatalogIndex = ref(0);
const filterMode = ref('all');
const isBeginning = ref(true);
const isEnd = ref(false);

function onSwiperInit(swiper: any) {
  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.maxTranslate() >= 0 || swiper.progress >= 1;
}

function onSlideChange(swiper: any) {
  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.maxTranslate() >= 0 || swiper.progress >= 1;
}

function onFromEdge(swiper: any) {
  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.maxTranslate() >= 0 || swiper.progress >= 1;
}

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
const config = useRuntimeConfig();
const baseURL = computed(() => config.public.apiBase as string);

</script>

<style scoped>
.catalog_name{
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #000;
}
.select-catalog{
  display: flex;
  gap: 12.5px;
  padding: 0 30px 0 10px;
  justify-content: space-between;
  align-items: center;
  background: var(--gray);
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
}

.catalog_img{
  width: 50px;
  height: 50px;
}

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
}
.tabs-slide {
  width: auto !important;
  height: auto;
  cursor: pointer;
}
.active-bar {
  margin-top: 6px;
  height: 4px;
  border-radius: 100px;
  background: var(--red);
  opacity: 0;
  transition: opacity 0.2s;
}
.tabs-slide.active .active-bar {
  opacity: 1;
}
.tabs-nav {
  position: absolute;
  z-index: 10;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  line-height: 0;
}
.tabs-wrapper .nav-prev {
  left: -21px;
  margin-top: -5px;
}
.tabs-wrapper .nav-next {
  right: -21px;
  margin-top: -5px;
}
.filter-radios {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
  margin-bottom: 10px;
}

.tab-count {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-light);
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
