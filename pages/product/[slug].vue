<template>
  <div class="product-detail">
    <div v-if="pending" class="detail-skeleton">
      <div class="sk-breadcrumbs"/>
      <div class="sk-title"/>
      <div class="sk-hero">
        <div class="sk-gallery"/>
        <div class="sk-info"/>
      </div>
    </div>
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
          <div class="gallery-main-image-container">
            <Transition name="gallery-fade">
              <img
                  v-if="displayedGalleryImage"
                  :key="displayedImageIndex"
                  :src="displayedGalleryImage.url"
                  :alt="displayedGalleryImage.alt || item.name"
                  :title="displayedGalleryImage.title || item.name"
                  class="gallery-main-image"
              />
              <NoImagePlaceholder
                  v-else
                  key="no-image"
                  class="gallery-no-image"
                  label="Изображение отсутствует"
                  :icon-size="56"
                  label-size="16px"
              />
            </Transition>
          </div>
          <Slider
              v-if="gallerySlides.length > 1 && !isGalleryMobile"
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
          <Slider
              v-if="gallerySlides.length > 1 && isGalleryMobile"
              ref="gallerySliderRef"
              class="products-slider gallery-slider-mobile"
              slides-per-view="auto"
              :items="gallerySlides"
              :slide-props="gallerySlideProps"
              :space-between="23"
              :slide-component="ProductGalleryThumb"
              show-navigation
              :show-pagination="false"
          />
        </div>

        <div class="product-info" >
          <div v-if="isTabletWidth">
            <InStock :count="item.count" />
          </div>

          <div v-if="item.description" class="short-description" v-html="item.short_description"/>

          <p class="product-price">{{ formatPrice(item.price) }}</p>

          <div class="product-actions">
            <div v-if="inCart" class="qty-control">
              <button class="qty-btn" @click="onDecrement">−</button>
              <span class="qty-value">{{ cartQty }}</span>
              <button class="qty-btn" @click="onIncrement">+</button>
            </div>
            <UiButton v-else class="buy-btn" variant="red" size="sm" full-width @click="onCartClick">
              Купить сейчас
            </UiButton>
            <div class="icon-actions">
              <button type="button" class="icon-btn" :class="{ 'icon-btn--active': inFavorite }" aria-label="В избранное" @click="onFavoriteClick">
                <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5332 1C8.00107 1.00003 9.40835 1.58057 10.4453 2.61328L12.0762 4.16504L12.7607 3.52051C14.7358 1.59131 16.1332 1.01366 17.5918 1.00977C19.0504 1.00588 20.4511 1.57632 21.4893 2.59473C22.527 3.61289 23.1191 4.99705 23.1377 6.44629C23.1562 7.89571 22.5993 9.29465 21.5879 10.3389L12.292 19.5996C12.2349 19.6565 12.1567 19.6895 12.0742 19.6895C11.9918 19.6894 11.9126 19.6565 11.8555 19.5996L2.55762 10.3379C1.54776 9.29964 0.988638 7.90802 1 6.46387C1.01069 5.10996 1.52319 3.80961 2.43359 2.80957L2.62109 2.61328C3.65807 1.58061 5.06535 1 6.5332 1Z" :stroke="inFavorite ? 'var(--red)' : 'var(--black)'" :fill="inFavorite ? 'var(--red)' : 'none'" stroke-width="2"/>
                </svg>
              </button>
              <button type="button" class="icon-btn" :class="{ 'icon-btn--active': inCompare }" aria-label="Сравнить" @click="onCompareClick">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.68 0.00455729C19.5294 0.0982503 21 1.62738 21 3.5V17.5L20.9954 17.68C20.9048 19.4697 19.4697 20.9048 17.68 20.9954L17.5 21H3.5C1.62738 21 0.0982502 19.5294 0.00455729 17.68L0 17.5V3.5C0 1.567 1.567 0 3.5 0H17.5L17.68 0.00455729ZM3.5 1.75C2.5335 1.75 1.75 2.5335 1.75 3.5V17.5C1.75 18.4665 2.5335 19.25 3.5 19.25H4.95833V5.83333C4.95833 5.35008 5.35008 4.95833 5.83333 4.95833C6.31658 4.95833 6.70833 5.35008 6.70833 5.83333V19.25H9.625V11.6667C9.625 11.1834 10.0168 10.7917 10.5 10.7917C10.9832 10.7917 11.375 11.1834 11.375 11.6667V19.25H14.2917V9.33333C14.2917 8.85008 14.6834 8.45833 15.1667 8.45833C15.6499 8.45833 16.0417 8.85008 16.0417 9.33333V19.25H17.5C18.4665 19.25 19.25 18.4665 19.25 17.5V3.5C19.25 2.5335 18.4665 1.75 17.5 1.75H3.5Z" :fill="inCompare ? 'var(--red)' : 'var(--black)'"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="characteristics-section">
        <h2 class="section-title characteristics-title">Характеристики</h2>

        <div v-if="item.description" class="characteristics-description" v-html="item.description"/>

        <ProductCharacteristics
            v-if="item.characteristics.length"
            :characteristics="item.characteristics"
        />
      </section>

      <div class="more-products">
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
              slides-per-view="auto"
              :items="recentlyViewed"
              :slide-props="catalogItemSlideProps"
              :space-between="23"
              :slide-component="CatalogItem"
              show-navigation
              :show-pagination="false"
          />
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CatalogItemDetail, RelatedCatalogItem } from '~/types/product';
import { addToCompare, removeFromCompare, getCatalogItemDetail } from '~/services/productApi';
import { addToCart, updateCartItem } from '~/services/cartApi';
import { addToFavorites, removeFromFavorites } from '~/services/favoritesApi';
import { formatPrice } from '~/utils/format';
import { pushRecentlyViewedId, useRecentlyViewedIds } from '~/utils/recentlyViewed';
import ProductGalleryThumb from '~/components/shared/ProductGalleryThumb.vue';
import CatalogItem from '~/components/shared/CatalogItem.vue';

type GallerySlide = {
  id: number;
  url: string;
  alt?: string;
  title?: string;
};

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const { isAuthenticated } = useAuth();
const { openAuthModal } = useAuthModal();

const config = useRuntimeConfig();
const apiBase = computed(() => (config.public.apiBase as string).replace(/\/+$/, ''));

const item = ref<CatalogItemDetail | null>(null);
const related = ref<RelatedCatalogItem[]>([]);
const recentlyViewed = ref<RelatedCatalogItem[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);

const inCart = ref(false);
const cartQty = ref(0);
const inCompare = ref(false);
const inFavorite = ref(false);

function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

function writeLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initLocalState() {
  if (!item.value) return;
  const id = item.value.id;
  const cart: Record<number, number> = readLocalStorage('cart', {});
  const compare: Record<number, boolean> = readLocalStorage('compare', {});
  cartQty.value = cart[id] ?? 0;
  inCart.value = cartQty.value > 0;
  inCompare.value = !!compare[id];
}

async function onCartClick() {
  if (!item.value) return;
  cartQty.value = 1;
  inCart.value = true;
  if (!isAuthenticated.value) {
    const cart: Record<number, number> = readLocalStorage('cart', {});
    cart[item.value.id] = 1;
    writeLocalStorage('cart', cart);
    return;
  }
  await addToCart(item.value.id, 1);
}

async function onIncrement() {
  if (!item.value) return;
  cartQty.value += 1;
  if (!isAuthenticated.value) {
    const cart: Record<number, number> = readLocalStorage('cart', {});
    cart[item.value.id] = cartQty.value;
    writeLocalStorage('cart', cart);
    return;
  }
  await updateCartItem(item.value.id, cartQty.value);
}

async function onDecrement() {
  if (!item.value) return;
  if (cartQty.value <= 1) {
    cartQty.value = 0;
    inCart.value = false;
    if (!isAuthenticated.value) {
      const cart: Record<number, number> = readLocalStorage('cart', {});
      delete cart[item.value.id];
      writeLocalStorage('cart', cart);
      return;
    }
    await updateCartItem(item.value.id, 0);
    return;
  }
  cartQty.value -= 1;
  if (!isAuthenticated.value) {
    const cart: Record<number, number> = readLocalStorage('cart', {});
    cart[item.value.id] = cartQty.value;
    writeLocalStorage('cart', cart);
    return;
  }
  await updateCartItem(item.value.id, cartQty.value);
}

function onFavoriteClick() {
  if (!item.value) return;
  if (!isAuthenticated.value) {
    openAuthModal();
    return;
  }
  if (inFavorite.value) {
    removeFromFavorites(item.value.id);
    inFavorite.value = false;
  } else {
    addToFavorites(item.value.id);
    inFavorite.value = true;
  }
}
const selectedImageIndex = ref(0);
const hoverImageIndex = ref<number | null>(null);
const gallerySliderRef = ref<{ slideTo: (index: number) => void } | null>(null);

const breadcrumbsItems = computed(() => [
  { to: '/', text: 'Главная' },
  { to: '/catalog', text: 'Каталог' }
]);

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
          title: image.title,
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
  if (!item.value) return;
  if (!isAuthenticated.value) {
    const compare: Record<number, boolean> = readLocalStorage('compare', {});
    inCompare.value = !inCompare.value;
    if (inCompare.value) {
      compare[item.value.id] = true;
    } else {
      delete compare[item.value.id];
    }
    writeLocalStorage('compare', compare);
    return;
  }
  if (inCompare.value) {
    removeFromCompare(item.value.id);
    inCompare.value = false;
  } else {
    addToCompare(item.value.id);
    inCompare.value = true;
  }
}

const MOBILE_WIDTH = 744;
const TABLET_WIDTH = 1100;
const windowWidth = ref(0);

const isGalleryMobile = computed(() => windowWidth.value > 0 && windowWidth.value <= MOBILE_WIDTH);

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

onMounted(async () => {
  updateWindowWidth();
  window.addEventListener('resize', updateWindowWidth);

  const recentlyViewedIds = useRecentlyViewedIds();

  try {
    const result = await getCatalogItemDetail(slug.value, recentlyViewedIds.value);
    if (!result) {
      showError(createError({ statusCode: 404, statusMessage: 'Товар не найден' }));
      return;
    }
    item.value = result.item;
    related.value = result.related ?? [];
    recentlyViewed.value = (result.recently_viewed ?? []).filter(
        (viewed) => viewed.id !== result.item.id,
    );
    pushRecentlyViewedId(recentlyViewedIds, result.item.id);

    if (result.item.user_state) {
      cartQty.value = result.item.user_state.cart_count ?? 0;
      inCart.value = cartQty.value > 0;
      inCompare.value = result.item.user_state.in_compare;
      inFavorite.value = result.item.user_state.in_favorite;
    } else {
      initLocalState();
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e : new Error('Не удалось загрузить товар');
  } finally {
    pending.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

const isTabletWidth = computed(() => windowWidth.value > TABLET_WIDTH);

</script>

<style scoped>
.more-products{
  margin-bottom: 137px;
}
.mb-like-h {
  margin-bottom: 33px;
}
.slider-mb-like, .products-slider{
  --slider-desktop-height: 272px;
  --slider-tablet-height: 272px;
  --slider-mobile-height: 272px;
}
.slider-mb-like :deep(.nav-prev), .slider-mb-like :deep(.nav-next),.products-slider :deep(.nav-prev), .products-slider :deep(.nav-next){
  top: -45px;
  right: 0;
}
.slider-mb-like :deep(.nav-prev), .products-slider :deep(.nav-prev){
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
  order: 1;
  --slider-desktop-height: 410px;
  --slider-tablet-height: 410px;
  --slider-mobile-height: 410px;
  width: 98px;
}

.gallery-main-image-container {
  order: 2;
  position: relative;
  display: flex;
  max-height: 410px;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  overflow: hidden;
}

.gallery-main-image {
  width: 410px;
  height: 410px;
  object-fit: contain;
  display: block;
}

.gallery-no-image {
  width: 410px;
  height: 410px;
}

.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 0.35s ease;
}

.gallery-fade-leave-active {
  position: absolute;
  inset: 0;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
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
  max-width: 536px;
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

.icon-btn--active {
  border-color: var(--red);
}

.qty-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--red);
  border-radius: 8px;
  padding: 6px 16px;
  height: 47px;
  flex: 1;
  width: 100%;
  max-width: 160px;
}

.qty-btn {
  color: white;
  font-size: 22px;
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
}

.qty-value {
  color: white;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 18px;
}

.section-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
}

.characteristics-title {
  margin-bottom: 24px;
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

.characteristics-section :deep(.characteristics-list) {
  margin-top: 0;
}

.products-section {
  margin-bottom: 48px;
}

@media (max-width: 1100px) {
  .gallery-main-image{
    width: 100%;
    height: 100%;
  }
  .gallery-no-image{
    width: 100%;
    height: 100%;
  }
  .more-products{
    margin-bottom: 56px;
  }
  .product-hero {
    flex-direction: column;
  }
  .product-detail {
    padding: 0 37px;
  }
  .gallery-block,
  .gallery-main-image-container {
    width: 100%;
    max-width: 100%;
  }

  .gallery-main-image-container {
    height: min(410px, calc(100vw - 74px));
  }

  .short-description {
    max-width: 100%;
  }
}

@media (max-width: 744px) {
  .more-products{
    margin-bottom: 32px;
  }
  .product-detail {
    padding: 0 20px;
  }
  .gallery-block {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .gallery-main-image-container {
    order: 1;
    width: 100%;
    height: min(320px, calc(100vw - 40px));
  }

  .gallery-slider-mobile {
    order: 2;
    width: 100%;
    --slider-mobile-height: 100px;
  }

  .gallery-slider-mobile :deep(.nav-prev),
  .gallery-slider-mobile :deep(.nav-next) {
    top: 45%;
    right: auto;
    transform: translateY(-50%);
  }

  .gallery-slider-mobile :deep(.nav-prev) {
    left: 0;
  }

  .gallery-slider-mobile :deep(.nav-next) {
    right: 0;
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
