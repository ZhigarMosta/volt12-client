<template>
  <div class="slider-wrapper">
    <div v-if="loading" class="loading">Загрузка...</div>
    <swiper
        v-else
        class="swiper"
        :slides-per-view="slidesPerView"
        :slides-per-group="slidesPerGroup"
        :grid="{ rows: gridRows }"
        :space-between="spaceBetween"
        :pagination="{ clickable: true }"
        :modules="modules"
        :breakpoints="breakpoints"
        :class="['mySwiper', swiperClass]"
    >
      <swiper-slide class="swiper-slide" v-for="item in items" :key="item.id">
        <component :is="slideComponent" :product="item" :feedback="item" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Component } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { Grid, Pagination } from 'swiper/modules';
import type { Product, Feedback } from '~/types/product';
import ProductCard from '~/components/shared/ProductCard.vue';

interface Breakpoint {
  slidesPerView: number;
  slidesPerGroup: number;
  grid: { rows: number };
  spaceBetween?: number;
}

interface Heights {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

type SliderItem = Product | Feedback;

interface Props {
  items?: SliderItem[];
  fetchItems?: () => Promise<SliderItem[]>;
  slidesPerView?: number;
  slidesPerGroup?: number;
  gridRows?: number;
  spaceBetween?: number;
  breakpoints?: Record<number, Breakpoint>;
  heights?: Heights;
  slideComponent?: Component | string;
  swiperClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  fetchItems: undefined,
  slidesPerView: 3,
  slidesPerGroup: 3,
  gridRows: 3,
  spaceBetween: 10,
  breakpoints: () => ({}),
  heights: () => ({}),
  slideComponent: ProductCard,
  swiperClass: ''
});

const internalItems = ref<SliderItem[]>([]);
const loading = ref(false);
const error = ref<any>(null);

const modules = [Grid, Pagination];

const items = computed(() => {
  if (props.fetchItems) {
    return internalItems.value;
  }
  return props.items;
});

const fetchData = async () => {
  if (!props.fetchItems) return;

  loading.value = true;
  error.value = null;

  try {
    internalItems.value = await props.fetchItems();
  } catch (e: any) {
    error.value = e;
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.error {
  color: var(--red);
  padding: 20px;
  text-align: center;
}

.slider-wrapper {
  width: 100%;
}

.swiper {
  width: 100%;
  box-sizing: border-box;
  transition: height 0.3s ease;
  height: var(--slider-desktop-height, 543px);
}

.swiper-slide {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  margin-top: 0;
}

:deep(.swiper-pagination) {
  bottom: 0;
}

:deep(.swiper-pagination-bullet) {
  background: var(--gray-light);
  width: 10px;
  height: 10px;
  margin: 0 5px;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--red);
}
.loading{
  height: var(--slider-desktop-height, 543px);
}
@media (max-width: 1100px) {
  .swiper, .loading {
    height: var(--slider-tablet-height, 823px);
    padding-bottom: 50px;
  }
}

@media (max-width: 744px) {
  .swiper, .loading {
    height: var(--slider-mobile-height, 809px);
  }
}
</style>
