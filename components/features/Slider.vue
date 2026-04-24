<template>
  <div class="slider-wrapper">
    <div v-if="loading" class="skeleton-container" :style="{ gridTemplateColumns: `repeat(${skeletonSlidesPerView}, 1fr)` }">
      <template v-if="isProductComponent">
        <div v-for="i in skeletonCount" :key="i" class="skeleton-product-card">
          <div class="skeleton-img" />
          <div class="skeleton-name" />
          <div class="skeleton-price" />
        </div>
      </template>
      <template v-else-if="isFeedbackComponent">
        <div v-for="i in skeletonCount" :key="i" class="skeleton-feedback-card">
          <div class="skeleton-avatar" />
          <div class="skeleton-text" />
          <div class="skeleton-text" />
        </div>
      </template>
    </div>
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
import FeedbackFromMap from '~/components/shared/FeedbackFromMap.vue';

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

const isProductComponent = computed(() => {
  return props.slideComponent === ProductCard;
});

const isFeedbackComponent = computed(() => {
  return props.slideComponent === FeedbackFromMap;
});

const skeletonCount = computed(() => {
  if (window.innerWidth > 1100) {
    return props.breakpoints[1100]!.grid!.rows * props.breakpoints[1100]!.slidesPerView;
  } else if (window.innerWidth > 744) {
    return props.breakpoints[744]!.grid!.rows * props.breakpoints[744]!.slidesPerView;
  } else {
    return props.breakpoints[0]!.grid!.rows * props.breakpoints[0]!.slidesPerView;
  }
});

const skeletonSlidesPerView = computed(() => {
  if (window.innerWidth > 1100) {
    return props.breakpoints[1100]!.slidesPerView;
  } else if (window.innerWidth > 744) {
    return props.breakpoints[744]!.slidesPerView;
  } else {
    return props.breakpoints[0]!.slidesPerView;
  }
});

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

.skeleton-container {
  height: var(--slider-desktop-height, 543px);
  display: grid;
  gap: 10px;
}

.skeleton-img {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-name {
  width: 80%;
  height: 14px;
  margin-top: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-price {
  width: 60%;
  height: 20px;
  margin-top: 27px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-feedback-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.swiper {
  width: 100%;
  box-sizing: border-box;
  transition: height 0.3s ease;
  height: var(--slider-desktop-height, 543px);
}

.skeleton-product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.skeleton-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  width: 80%;
  height: 14px;
  margin-top: 10px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
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
@media (max-width: 1100px) {
  .swiper, .loading {
    height: var(--slider-tablet-height, 823px);
    padding-bottom: 50px;
  }
  .skeleton-container {
    height: var(--slider-tablet-height, 823px);
  }
}

@media (max-width: 744px) {
  .swiper, .loading {
    height: var(--slider-mobile-height, 809px);
  }
  .skeleton-container {
    height: var(--slider-mobile-height, 809px);
  }
}
</style>
