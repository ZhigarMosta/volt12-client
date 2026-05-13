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
    <div v-else class="slider-content">
      <button v-if="showNavigation" v-show="!isBeginning" ref="prevBtn" class="nav-btn nav-prev" :style="{ top: navTop }">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: scaleX(-1)">
          <circle cx="21" cy="21" r="21" fill="#E2000F" />
          <path d="M25.7072 21.7071C26.0977 21.3166 26.0977 20.6834 25.7072 20.2929L19.3432 13.9289C18.9527 13.5384 18.3196 13.5384 17.929 13.9289C17.5385 14.3195 17.5385 14.9526 17.929 15.3431L23.5859 21L17.929 26.6569C17.5385 27.0474 17.5385 27.6805 17.929 28.0711C18.3196 28.4616 18.9527 28.4616 19.3432 28.0711L25.7072 21.7071ZM25 21V22H25.0001V21V20H25V21Z" fill="white" />
        </svg>
      </button>
      <swiper
          class="swiper"
          :slides-per-view="slidesPerView"
          :slides-per-group="resolvedSlidesPerGroup"
          :grid="slidesPerView !== 'auto' ? { rows: gridRows } : undefined"
          :space-between="spaceBetween"
          :pagination="paginationConfig"
          :navigation="navConfig"
          :modules="modules"
          :breakpoints="breakpoints"
          :class="['mySwiper', swiperClass, { 'auto-slide': slidesPerView === 'auto' }]"
          @init="onSwiperInit"
          @slideChange="onSlideChange"
          @reachBeginning="isBeginning = true"
          @reachEnd="isEnd = true"
          @fromEdge="onFromEdge"
          @update="onSwiperUpdate"
      >
        <swiper-slide class="swiper-slide" v-for="(item, index) in items" :key="item.id">
          <component :is="slideComponent" v-bind="getSlideProps(item, index)" />
        </swiper-slide>
      </swiper>
      <button v-if="showNavigation" v-show="!isEnd" ref="nextBtn" class="nav-btn nav-next" :style="{ top: navTop }">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="21" cy="21" r="21" fill="#E2000F" />
          <path d="M25.7072 21.7071C26.0977 21.3166 26.0977 20.6834 25.7072 20.2929L19.3432 13.9289C18.9527 13.5384 18.3196 13.5384 17.929 13.9289C17.5385 14.3195 17.5385 14.9526 17.929 15.3431L23.5859 21L17.929 26.6569C17.5385 27.0474 17.5385 27.6805 17.929 28.0711C18.3196 28.4616 18.9527 28.4616 19.3432 28.0711L25.7072 21.7071ZM25 21V22H25.0001V21V20H25V21Z" fill="white" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Component } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Grid, Pagination, Navigation } from 'swiper/modules';
import type { Product, Feedback } from '~/types/product';
import ProductCard from '~/components/shared/ProductCard.vue';
import FeedbackFromMap from '~/components/shared/FeedbackFromMap.vue';

interface Breakpoint {
  slidesPerView: number | 'auto';
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
  slidesPerView?: number | 'auto';
  slidesPerGroup?: number;
  gridRows?: number;
  spaceBetween?: number;
  breakpoints?: Record<number, Breakpoint>;
  heights?: Heights;
  slideComponent?: Component | string;
  swiperClass?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  navTop?: string;
  slideProps?: (item: any, index: number) => Record<string, any>;
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
  swiperClass: '',
  showNavigation: false,
  showPagination: true,
  navTop: '50%',
  slideProps: (item: any, index: number) => ({ product: item, feedback: item })
});

function getSlideProps(item: any, index: number): Record<string, any> {
  return props.slideProps(item, index);
}

const resolvedSlidesPerGroup = computed(() => {
  if (props.slidesPerView === 'auto') return 1;
  return props.slidesPerGroup;
});

const prevBtn = ref<HTMLElement | null>(null);
const nextBtn = ref<HTMLElement | null>(null);

const navConfig = computed(() => {
  if (!props.showNavigation) return undefined;
  return {};
});

const paginationConfig = computed(() => {
  if (!props.showPagination) return undefined;
  return { clickable: true };
});

const internalItems = ref<SliderItem[]>([]);
const loading = ref(false);
const error = ref<any>(null);

const modules = computed(() => {
  const mods: any[] = [];
  if (props.showPagination) mods.push(Pagination);
  if (props.slidesPerView !== 'auto') mods.push(Grid);
  if (props.showNavigation) mods.push(Navigation);
  return mods;
});

const isProductComponent = computed(() => {
  return props.slideComponent === ProductCard;
});

const isFeedbackComponent = computed(() => {
  return props.slideComponent === FeedbackFromMap;
});

function getSkeletonSPV(breakpoint: Breakpoint | undefined): number {
  if (!breakpoint) return props.slidesPerView === 'auto' ? 4 : (props.slidesPerView as number);
  return breakpoint.slidesPerView === 'auto' ? 4 : breakpoint.slidesPerView;
}

const skeletonCount = computed(() => {
  const bp = window.innerWidth > 1100 ? props.breakpoints[1100]
    : window.innerWidth > 744 ? props.breakpoints[744]
    : props.breakpoints[0];
  if (!bp) return props.slidesPerView === 'auto' ? 4 : (props.slidesPerView as number);
  return bp.grid.rows * getSkeletonSPV(bp);
});

const skeletonSlidesPerView = computed(() => {
  const bp = window.innerWidth > 1100 ? props.breakpoints[1100]
    : window.innerWidth > 744 ? props.breakpoints[744]
    : props.breakpoints[0];
  return getSkeletonSPV(bp);
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
  } finally {
    loading.value = false;
  }
};

const isBeginning = ref(true);
const isEnd = ref(false);

function checkEdges(swiper: any) {
  if (!props.showNavigation) return;
  isBeginning.value = swiper.isBeginning;
  isEnd.value = swiper.maxTranslate() >= 0 || swiper.progress >= 1;
}

function onSwiperInit(swiper: any) {
  if (props.showNavigation && prevBtn.value && nextBtn.value) {
    swiper.params.navigation.prevEl = prevBtn.value;
    swiper.params.navigation.nextEl = nextBtn.value;
    swiper.navigation.init();
    swiper.navigation.update();
  }
  checkEdges(swiper);
}

function onSlideChange(swiper: any) { checkEdges(swiper); }
function onFromEdge(swiper: any) { checkEdges(swiper); }
function onSwiperUpdate(swiper: any) { checkEdges(swiper); }

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.nav-btn {
  position: absolute;
  z-index: 10;
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
.nav-prev {
  left: -21px;
}
.nav-next {
  right: -21px;
}

.slider-wrapper {
  width: 100%;
}
.slider-content {
  position: relative;
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
.auto-slide .swiper-slide {
  width: auto;
  flex-shrink: 0;
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
