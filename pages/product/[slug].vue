<template>
  <div class="product-detail">
    <template v-if="pending">
      <div class="detail-skeleton">
        <div class="sk-breadcrumbs"/>
        <div class="sk-title"/>
        <div class="sk-hero">
          <div class="sk-gallery"/>
          <div class="sk-info"/>
        </div>
      </div>
    </template>
    <div v-else-if="error" class="error">Ошибка: {{ error.message }}</div>
    <div v-else-if="!item" class="error">Товар не найден</div>

    <template v-else>
      <Navigate :items="breadcrumbsItems"/>

      <div class="product-header">
        <h1 class="product-title">{{ item.name }}</h1>
        <div v-if="!isTabletWidth">
          <InStock :count="100" />
        </div>
      </div>

      <div class="product-hero">
        <div class="gallery-block">
          <Slider
              v-if="gallerySlides.length > 1"
              ref="gallerySliderRef"
              class="gallery-slider"
              :items="gallerySlides"
              direction="vertical"
              :slides-per-view="4"
              :slides-per-group="1"
              :grid-rows="1"
              :space-between="14"
              :show-navigation="gallerySlides.length > 4"
              :show-pagination="false"
              :slide-component="ProductGalleryThumb"
              :slide-props="gallerySlideProps"
          />
          <div class="gallery-main-image-container">
            <img
                v-if="displayedGalleryImage"
                :src="displayedGalleryImage.url"
                :alt="displayedGalleryImage.alt || item.name"
                class="gallery-main-image"
            />
          </div>
        </div>

        <div class="product-info" >
          <div v-if="isTabletWidth">
            <InStock :count="100" />
          </div>

          <p v-if="item.description" class="short-description" >{{ item.short_description }}</p>

          <p class="product-price">{{ formatPrice(item.price) }}</p>

          <div class="product-actions">
            <UiButton class="buy-btn" variant="red" size="sm" full-width>
              Купить сейчас
            </UiButton>
            <div class="icon-actions">
              <button type="button" class="icon-btn" aria-label="В корзину">
                <svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.98741 10.1455H19.1458L23.2022 0.494744C23.4526 0.0373688 24.0321 -0.133644 24.497 0.112634C24.962 0.358913 25.1359 0.928957 24.8855 1.38633L20.5577 11.5318L20.2875 12.0266H8.93138L7.79589 15.3762C7.72709 15.5792 7.88089 15.7889 8.09844 15.7889H23.5408C24.0689 15.7889 24.497 16.21 24.497 16.7295C24.497 17.249 24.0689 17.6701 23.5408 17.6701H8.09844C6.57556 17.6701 5.50027 16.2021 5.98185 14.781L7.24558 11.0468L4.94596 1.99379L0.956201 1.99378C0.428106 1.99378 0 1.57267 0 1.0532C0 0.533736 0.428106 0.112625 0.956201 0.112625L6.43878 0.112637L8.98741 10.1455Z" fill="var(--black)" />
                  <path d="M10.7915 21.1188C10.7915 22.1578 9.93528 23 8.87909 23C7.8229 23 6.96669 22.1578 6.96669 21.1188C6.96669 20.0799 7.8229 19.2377 8.87909 19.2377C9.93528 19.2377 10.7915 20.0799 10.7915 21.1188Z" fill="var(--black)" />
                  <path d="M22.2659 21.1188C22.2659 22.1578 21.4097 23 20.3535 23C19.2973 23 18.4411 22.1578 18.4411 21.1188C18.4411 20.0799 19.2973 19.2377 20.3535 19.2377C21.4097 19.2377 22.2659 20.0799 22.2659 21.1188Z" fill="var(--black)" />
                </svg>
              </button>
              <button type="button" class="icon-btn" aria-label="В избранное">
                <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5332 1C8.00107 1.00003 9.40835 1.58057 10.4453 2.61328L12.0762 4.16504L12.7607 3.52051C14.7358 1.59131 16.1332 1.01366 17.5918 1.00977C19.0504 1.00588 20.4511 1.57632 21.4893 2.59473C22.527 3.61289 23.1191 4.99705 23.1377 6.44629C23.1562 7.89571 22.5993 9.29465 21.5879 10.3389L12.292 19.5996C12.2349 19.6565 12.1567 19.6895 12.0742 19.6895C11.9918 19.6894 11.9126 19.6565 11.8555 19.5996L2.55762 10.3379C1.54776 9.29964 0.988638 7.90802 1 6.46387C1.01069 5.10996 1.52319 3.80961 2.43359 2.80957L2.62109 2.61328C3.65807 1.58061 5.06535 1 6.5332 1Z" stroke="var(--black)" stroke-width="2"/>
                </svg>
              </button>
              <button type="button" class="icon-btn" aria-label="Сравнить" @click="onCompareClick">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.68 0.00455729C19.5294 0.0982503 21 1.62738 21 3.5V17.5L20.9954 17.68C20.9048 19.4697 19.4697 20.9048 17.68 20.9954L17.5 21H3.5C1.62738 21 0.0982502 19.5294 0.00455729 17.68L0 17.5V3.5C0 1.567 1.567 0 3.5 0H17.5L17.68 0.00455729ZM3.5 1.75C2.5335 1.75 1.75 2.5335 1.75 3.5V17.5C1.75 18.4665 2.5335 19.25 3.5 19.25H4.95833V5.83333C4.95833 5.35008 5.35008 4.95833 5.83333 4.95833C6.31658 4.95833 6.70833 5.35008 6.70833 5.83333V19.25H9.625V11.6667C9.625 11.1834 10.0168 10.7917 10.5 10.7917C10.9832 10.7917 11.375 11.1834 11.375 11.6667V19.25H14.2917V9.33333C14.2917 8.85008 14.6834 8.45833 15.1667 8.45833C15.6499 8.45833 16.0417 8.85008 16.0417 9.33333V19.25H17.5C18.4665 19.25 19.25 18.4665 19.25 17.5V3.5C19.25 2.5335 18.4665 1.75 17.5 1.75H3.5Z" fill="var(--black)"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="characteristics-section">
        <h2 class="section-title">Характеристики</h2>

        <div v-if="item.description" class="characteristics-description" v-html="item.description"/>

<!--        <div v-if="specRows.length" class="spec-table">-->
<!--          <div v-for="(row, idx) in specRows" :key="idx" class="spec-row">-->
<!--            <span class="spec-label">{{ row.label }}</span>-->
<!--            <span class="spec-value">{{ row.value }}</span>-->
<!--          </div>-->
<!--        </div>-->
      </section>

      <section v-if="related.length > 0" class="products-section">
        <h2 class="section-title mb-like-h">Вам может понравиться</h2>
        <Slider
            class="slider-mb-like"
            slides-per-view="auto"
            :items="related"
            :slide-props="catalogItemSlideProps"
            :space-between="23"
            :slide-component="CatalogItem"
            show-navigation
            :show-pagination="false"
        />
      </section>

      <section v-if="recentlyViewed.length > 0" class="products-section">
        <h2 class="section-title mb-like-h">Вы смотрели</h2>
        <Slider
            class="products-slider"
            :items="recentlyViewed"
            :slide-component="CatalogItem"
            :slide-props="catalogItemSlideProps"
            :breakpoints="productSliderBreakpoints"
            :show-navigation="false"
            :show-pagination="false"
        />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CatalogItemDetail, RelatedCatalogItem } from '~/types/product';
import { addToCompare, getCatalogItemDetail } from '~/services/productApi';
import { formatPrice } from '~/utils/format';
import ProductGalleryThumb from '~/components/shared/ProductGalleryThumb.vue';
import CatalogItem from '~/components/shared/CatalogItem.vue';
import CompareItem from "~/components/shared/CompareItem.vue";

type GallerySlide = {
  id: number;
  url: string;
  alt?: string;
};

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const { isAuthenticated } = useAuth();

const config = useRuntimeConfig();
const apiBase = computed(() => (config.public.apiBase as string).replace(/\/+$/, ''));

const item = ref<CatalogItemDetail | null>(null);
const related = ref<RelatedCatalogItem[]>([]);
const recentlyViewed = ref<RelatedCatalogItem[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);
const selectedImageIndex = ref(0);
const hoverImageIndex = ref<number | null>(null);
const gallerySliderRef = ref<{ slideTo: (index: number) => void } | null>(null);

const breadcrumbsItems = computed(() => [
  { to: '/', text: 'Главная' },
  { to: '/catalog', text: 'Каталог' },
  { to: route.path, text: item.value?.name ?? 'Товар' },
]);

const productSliderBreakpoints = {
  0: {
    slidesPerView: 1,
    slidesPerGroup: 1,
    grid: { rows: 1 },
    spaceBetween: 12,
  },
  744: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    grid: { rows: 1 },
    spaceBetween: 12,
  },
  1100: {
    slidesPerView: 4,
    slidesPerGroup: 4,
    grid: { rows: 1 },
    spaceBetween: 20,
  },
};

const galleryImages = computed<GallerySlide[]>(() => {
  if (!item.value?.images?.length) return [];
  return item.value.images
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((image, index) => {
        const path = image.img_link ?? '';
        const url = /^https?:\/\//i.test(path)
            ? path
            : `${apiBase.value}/${path.replace(/^\/+/, '')}`;
        return {
          id: image.id ?? index,
          url,
          alt: image.alt,
        };
      });
});

const gallerySlides = computed(() => galleryImages.value);

const displayedImageIndex = computed(() => hoverImageIndex.value ?? selectedImageIndex.value);

const displayedGalleryImage = computed(
    () => galleryImages.value[displayedImageIndex.value] ?? null,
);

function gallerySlideProps(slide: GallerySlide, index: number) {
  return {
    image: slide,
    active: selectedImageIndex.value === index,
    onSelect: () => selectGalleryImage(index),
    onHover: () => {
      hoverImageIndex.value = index;
    },
    onHoverLeave: () => {
      hoverImageIndex.value = null;
    },
  };
}

function selectGalleryImage(index: number) {
  selectedImageIndex.value = index;
  hoverImageIndex.value = null;
  gallerySliderRef.value?.slideTo(index);
}

function catalogItemSlideProps(relatedItem: RelatedCatalogItem) {
  return {
    productId: relatedItem.id,
    slug: relatedItem.slug,
    title: relatedItem.name,
    price: relatedItem.price,
    images: relatedItem.img_link
        ? [{ img_link: relatedItem.img_link, alt: relatedItem.name }]
        : [],
  };
}

function onCompareClick() {
  if (!isAuthenticated.value || !item.value) return;
  addToCompare(item.value.id);
}

onMounted(async () => {
  try {
    const result = await getCatalogItemDetail(slug.value);
    if (result) {
      item.value = result.item;
      related.value = result.related ?? [];
      recentlyViewed.value = result.recently_viewed ?? [];
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e : new Error('Не удалось загрузить товар');
  } finally {
    pending.value = false;
  }
});
const tabletWidth = 1100;
const isTabletWidth = computed(() => {
  return window.innerWidth > tabletWidth;
});

</script>

<style scoped>
.mb-like-h {
  margin-bottom: 33px;
}
.slider-mb-like{
  --slider-desktop-height: 272px;
  --slider-tablet-height: 272px;
  --slider-mobile-height: 272px;
}
.slider-mb-like :deep(.nav-prev), .slider-mb-like :deep(.nav-next){
  top: -45px;
  right: 0;
}
.slider-mb-like :deep(.nav-prev){
  right: 64px;
}

.gallery-slider :deep(.nav-prev) {
  top: 0;
}

.gallery-slider :deep(.nav-next) {
  bottom: 0;
}

.gallery-slider :deep(.nav-next),.gallery-slider :deep(.nav-prev)  {
  left: auto;
  right: auto;
  margin-left: 8px;
  transform: rotate(90deg);
}

@keyframes sk-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.sk-breadcrumbs,
.sk-title,
.sk-gallery,
.sk-info {
  border-radius: 8px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

.sk-breadcrumbs {
  height: 14px;
  width: 280px;
  margin: 30px 0 25px;
}

.sk-title {
  height: 36px;
  width: 50%;
  margin-bottom: 24px;
}

.sk-hero {
  display: flex;
  gap: 40px;
}

.sk-gallery {
  width: 55%;
  height: 380px;
}

.sk-info {
  flex: 1;
  height: 380px;
}

.product-detail {
  padding: 0 70px;
}

.error {
  padding: 40px;
  text-align: center;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: var(--error);
}

.product-header {
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: var(--black);
}

.back-link {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  opacity: 0.5;
  text-decoration: none;
}

.back-link:hover {
  opacity: 0.8;
}

.product-hero {
  display: flex;
  gap: 35px;
  align-items: start;
  margin-bottom: 48px;
}

.gallery-block {
  display: flex;
  gap: 20px;
}

.gallery-slider {
  --slider-desktop-height: 410px;
  --slider-tablet-height: 410px;
  --slider-mobile-height: 410px;
  width: 98px;
}
.gallery-main-image-container{
  display: flex;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  overflow: hidden;
}
.gallery-main-image {
  width: 100%;
  max-height: 410px;
  max-width: 410px;
  object-fit: contain;
  flex: 1;
  min-width: 0;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.short-description {
  margin-top: 27px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  color: var(--black);
  opacity: 0.7;
}

.product-price {
  margin-top: 27px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 32px;
  color: var(--black);
}

.product-actions {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  align-items: stretch;
  max-width: 455px;
}

.buy-btn {
  white-space: nowrap;
}

.icon-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 87px;
  height: 47px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 8px;
  background: var(--white, #fff);
  cursor: pointer;
}

.section-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
}

.characteristics-section {
  margin-bottom: 48px;
}

.characteristics-description {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  color: var(--black);
  opacity: 0.7;
  margin-bottom: 24px;
}

.spec-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 40px;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
}

.spec-label {
  color: var(--black);
  opacity: 0.5;
}

.spec-value {
  font-weight: 500;
  color: var(--black);
  text-align: right;
}

.products-section {
  margin-bottom: 48px;
}

.products-slider {
  --slider-desktop-height: 310px;
  --slider-tablet-height: 310px;
  --slider-mobile-height: 310px;
}

@media (max-width: 1100px) {
  .product-hero {
    flex-direction: column;
  }
  .product-detail {
    padding: 0 37px;
  }
  .gallery-main-image {
    max-width: 100%;
  }
}

@media (max-width: 744px) {
  .product-detail {
    padding: 0 20px;
  }
  .gallery-block {
    flex-direction: column;
  }

  .gallery-slider {
    width: 100%;
  }

  .products-slider :deep(.slider-wrapper.is-vertical .swiper) {
    width: 100%;
    height: auto;
  }

  .product-actions {
    flex-direction: column;
    max-width: none;
  }

  .icon-actions {
    justify-content: flex-start;
  }

  .product-title {
    font-size: 24px;
  }

  .product-price {
    font-size: 24px;
  }
  .product-header {
    flex-direction: column;
    align-items: start;
    gap: 11px;
  }
}
</style>

<style>
.characteristics-description img {
  max-width: 100%;
  height: auto;
}

.characteristics-description a {
  color: var(--red);
  text-decoration: underline;
}
</style>
