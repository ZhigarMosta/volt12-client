<template>
  <div
      class="image-split-card"
      :class="{ 'is-clickable': slug }"
      ref="card"
      @click="onCardClick"
  >
    <p class="title">{{ title }}</p>
    <div class="image-action">
      <div class="image-stage" role="img"
           @mousemove="handleMove"
           @mouseleave="handleLeave"
           @touchmove="handleTouchMove"
      >
        <img
            v-if="normalizedImages.length"
            :src="normalizedImages[activeIndex].url"
            class="product-image"
            :alt="normalizedImages[activeIndex].alt || title"
        />
        <div v-else class="placeholder">No image</div><!--   TODO лишьний код, продукты без картинок выводится не будут    -->

        <div class="dots" v-if="normalizedImages.length > 1">
          <span
              v-for="(img, idx) in normalizedImages"
              :key="idx"
              class="dot"
              :class="{ active: idx === activeIndex }"
          ></span>
        </div>
      </div>
      <div class="actions">
        <button class="action" @click.stop="onFavoriteClick">
          <svg class="favorite" width="25" height="21" viewBox="0 0 25 21" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.5332 1C8.00107 1.00003 9.40835 1.58057 10.4453 2.61328L10.4463 2.61523C10.6948 2.86192 11.011 3.16422 11.3916 3.52148L12.0762 4.16504L12.7607 3.52051C13.1401 3.16354 13.455 2.86147 13.7031 2.61523C14.7358 1.59131 16.1332 1.01366 17.5918 1.00977C19.0504 1.00588 20.4511 1.57632 21.4893 2.59473C22.527 3.61289 23.1191 4.99705 23.1377 6.44629C23.1562 7.89571 22.5993 9.29465 21.5879 10.3389L12.292 19.5996C12.2349 19.6565 12.1567 19.6895 12.0742 19.6895C11.9918 19.6894 11.9126 19.6565 11.8555 19.5996L2.55762 10.3379C1.54776 9.29964 0.988638 7.90802 1 6.46387C1.01069 5.10996 1.52319 3.80961 2.43359 2.80957L2.62109 2.61328C3.65807 1.58061 5.06535 1 6.5332 1Z"
                stroke="var(--black)" stroke-width="2"/>
          </svg>
        </button>
        <button class="action" :class="{ 'action--active': inCompare }" @click.stop="onCompareClick">
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M17.68 0.00455729C19.5294 0.0982503 21 1.62738 21 3.5V17.5L20.9954 17.68C20.9048 19.4697 19.4697 20.9048 17.68 20.9954L17.5 21H3.5C1.62738 21 0.0982502 19.5294 0.00455729 17.68L0 17.5V3.5C2.25493e-07 1.567 1.567 5.63724e-08 3.5 0H17.5L17.68 0.00455729ZM3.5 1.75C2.5335 1.75 1.75 2.5335 1.75 3.5V17.5C1.75 18.4665 2.5335 19.25 3.5 19.25H4.95833V5.83333C4.95833 5.35008 5.35008 4.95833 5.83333 4.95833C6.31658 4.95833 6.70833 5.35008 6.70833 5.83333V19.25H9.625V11.6667C9.625 11.1834 10.0168 10.7917 10.5 10.7917C10.9832 10.7917 11.375 11.1834 11.375 11.6667V19.25H14.2917V9.33333C14.2917 8.85008 14.6834 8.45833 15.1667 8.45833C15.6499 8.45833 16.0417 8.85008 16.0417 9.33333V19.25H17.5C18.4665 19.25 19.25 18.4665 19.25 17.5V3.5C19.25 2.5335 18.4665 1.75 17.5 1.75H3.5Z"
                  :fill="inCompare ? 'var(--red)' : 'var(--black)'"/>
          </svg>
        </button>
      </div>
    </div>


    <div class="info">
      <div class="price-block">
        <p class="price">₽ {{ price }}</p>
        <div class="actions-mobile">
          <button class="action" @click.stop="onFavoriteClick">
            <svg class="favorite" width="25" height="21" viewBox="0 0 25 21" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M6.5332 1C8.00107 1.00003 9.40835 1.58057 10.4453 2.61328L10.4463 2.61523C10.6948 2.86192 11.011 3.16422 11.3916 3.52148L12.0762 4.16504L12.7607 3.52051C13.1401 3.16354 13.455 2.86147 13.7031 2.61523C14.7358 1.59131 16.1332 1.01366 17.5918 1.00977C19.0504 1.00588 20.4511 1.57632 21.4893 2.59473C22.527 3.61289 23.1191 4.99705 23.1377 6.44629C23.1562 7.89571 22.5993 9.29465 21.5879 10.3389L12.292 19.5996C12.2349 19.6565 12.1567 19.6895 12.0742 19.6895C11.9918 19.6894 11.9126 19.6565 11.8555 19.5996L2.55762 10.3379C1.54776 9.29964 0.988638 7.90802 1 6.46387C1.01069 5.10996 1.52319 3.80961 2.43359 2.80957L2.62109 2.61328C3.65807 1.58061 5.06535 1 6.5332 1Z"
                  stroke="var(--black)" stroke-width="2"/>
            </svg>
          </button>
          <button class="action" :class="{ 'action--active': inCompare }" @click.stop="onCompareClick">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M17.68 0.00455729C19.5294 0.0982503 21 1.62738 21 3.5V17.5L20.9954 17.68C20.9048 19.4697 19.4697 20.9048 17.68 20.9954L17.5 21H3.5C1.62738 21 0.0982502 19.5294 0.00455729 17.68L0 17.5V3.5C2.25493e-07 1.567 1.567 5.63724e-08 3.5 0H17.5L17.68 0.00455729ZM3.5 1.75C2.5335 1.75 1.75 2.5335 1.75 3.5V17.5C1.75 18.4665 2.5335 19.25 3.5 19.25H4.95833V5.83333C4.95833 5.35008 5.35008 4.95833 5.83333 4.95833C6.31658 4.95833 6.70833 5.35008 6.70833 5.83333V19.25H9.625V11.6667C9.625 11.1834 10.0168 10.7917 10.5 10.7917C10.9832 10.7917 11.375 11.1834 11.375 11.6667V19.25H14.2917V9.33333C14.2917 8.85008 14.6834 8.45833 15.1667 8.45833C15.6499 8.45833 16.0417 8.85008 16.0417 9.33333V19.25H17.5C18.4665 19.25 19.25 18.4665 19.25 17.5V3.5C19.25 2.5335 18.4665 1.75 17.5 1.75H3.5Z"
                    :fill="inCompare ? 'var(--red)' : 'var(--black)'"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="wrapper-btn-card" @click.stop>
        <template v-if="cartQty > 0">
          <div class="qty-control">
            <button class="qty-btn" @click="onDecrement">−</button>
            <span class="qty-value">{{ cartQty }}</span>
            <button class="qty-btn" @click="onIncrement">+</button>
          </div>
        </template>
        <template v-else>
          <UiButton fullWidth vertical-spacing="compact" variant="red" @click="onAddToCart">
            В корзину
          </UiButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { addToCompare, removeFromCompare } from '~/services/productApi';
import { addToCart, updateCartItem } from '~/services/cartApi';
import { addToFavorites } from '~/services/favoritesApi';

type ImgItem = {
  img_link?: string;
  alt?: string;
  title?: string;
  position?: number;
  product_code?: string;
};

type UserState = {
  cart_count: number | null;
  in_compare: boolean;
  in_favorite: boolean;
} | null;

const props = defineProps<{
  images?: ImgItem[];
  title: string;
  subtitle?: string;
  price: string | number;
  productId?: number;
  slug?: string;
  userState?: UserState;
}>();

const { isAuthenticated } = useAuth();

// --- реактивное состояние ---
const cartQty = ref(0);
const inCompare = ref(false);

function readLocal<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}
function writeLocal(key: string, val: any) {
  localStorage.setItem(key, JSON.stringify(val));
}

onMounted(() => {
  if (!props.productId) return;
  if (isAuthenticated.value && props.userState !== undefined) {
    // авторизован — приоритет данным с сервера
    cartQty.value = props.userState?.cart_count ?? 0;
    inCompare.value = props.userState?.in_compare ?? false;
  } else {
    // не авторизован — смотрим localStorage
    const cart: Record<number, number> = readLocal('cart', {});
    const compare: Record<number, boolean> = readLocal('compare', {});
    cartQty.value = cart[props.productId] ?? 0;
    inCompare.value = !!compare[props.productId];
  }
});

// --- корзина ---
async function onAddToCart() {
  if (!props.productId) return;
  cartQty.value = 1;
  if (!isAuthenticated.value) {
    const cart: Record<number, number> = readLocal('cart', {});
    cart[props.productId] = 1;
    writeLocal('cart', cart);
    return;
  }
  await addToCart(props.productId, 1);
}

async function onIncrement() {
  if (!props.productId) return;
  cartQty.value += 1;
  if (!isAuthenticated.value) {
    const cart: Record<number, number> = readLocal('cart', {});
    cart[props.productId] = cartQty.value;
    writeLocal('cart', cart);
    return;
  }
  await updateCartItem(props.productId, cartQty.value);
}

async function onDecrement() {
  if (!props.productId) return;
  cartQty.value -= 1;
  if (!isAuthenticated.value) {
    const cart: Record<number, number> = readLocal('cart', {});
    if (cartQty.value <= 0) { delete cart[props.productId]; } else { cart[props.productId] = cartQty.value; }
    writeLocal('cart', cart);
    return;
  }
  await updateCartItem(props.productId, cartQty.value);
}

// --- сравнение ---
function onCompareClick() {
  if (!props.productId) return;
  if (!isAuthenticated.value) {
    inCompare.value = !inCompare.value;
    const compare: Record<number, boolean> = readLocal('compare', {});
    if (inCompare.value) { compare[props.productId] = true; } else { delete compare[props.productId]; }
    writeLocal('compare', compare);
    return;
  }
  if (inCompare.value) {
    removeFromCompare(props.productId);
    inCompare.value = false;
  } else {
    addToCompare(props.productId);
    inCompare.value = true;
  }
}

// --- избранное ---
function onFavoriteClick() {
  if (!isAuthenticated.value || !props.productId) return;
  addToFavorites(props.productId);
}

// --- навигация и галерея ---
function onCardClick() {
  if (!props.slug) return;
  navigateTo(`/product/${props.slug}`);
}

const config = useRuntimeConfig();
const baseURL = computed(() => config.public.apiBase as string);
const rawImages = computed<ImgItem[]>(() => props.images ?? []);

type NormItem = { url: string; alt?: string; position: number; code?: string };

const normalizedImages = computed<NormItem[]>(() => {
  const arr = rawImages.value;
  const seen = new Set<string>();
  const out: NormItem[] = [];
  for (let i = 0; i < arr.length; i++) {
    const it = arr[i] ?? {};
    const path = it.img_link ?? '';
    if (!path) continue;
    let url = path;
    if (!/^https?:\/\//i.test(path)) {
      const base = baseURL.value.replace(/\/+$/, '');
      url = base + '/' + path.replace(/^\/+/, '');
    }
    if (!seen.has(url)) {
      seen.add(url);
      out.push({ url, alt: it.alt ?? '', position: typeof it.position === 'number' ? it.position : out.length, code: it.product_code ?? '' });
    }
  }
  out.sort((a, b) => a.position - b.position);
  return out;
});

const activeIndex = ref(0);
const card = ref<HTMLElement | null>(null);

function updateIndexFromX(clientX: number) {
  const imgs = normalizedImages.value;
  if (!imgs.length) return;
  const rect = card.value?.getBoundingClientRect();
  if (!rect) return;
  const idx = Math.max(0, Math.min(imgs.length - 1, Math.floor(((clientX - rect.left) / rect.width) * imgs.length)));
  activeIndex.value = idx;
}

function handleMove(e: MouseEvent) { updateIndexFromX(e.clientX); }
function handleTouchMove(e: TouchEvent) { if (e.touches.length > 0) updateIndexFromX(e.touches[0].clientX); }
function handleLeave() { activeIndex.value = 0; }
</script>

<style scoped>
.wrapper-btn-card{
  width: 100%;
  max-width: 137px;
}

.qty-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: var(--red);
  border-radius: 8px;
  padding: 6px 10px;
}

.qty-btn {
  color: white;
  font-size: 18px;
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
  font-size: 16px;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;

  margin-top: 5px;
}

.image-action {
  display: flex;
  gap: 23px;
  justify-content: right;
}

.image-split-card.is-clickable {
  cursor: pointer;
}

.image-split-card {
  width: 100%;
  height: 100%;
  max-width: 267px;

  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(185, 185, 185, 0.38);

  padding: 15px 17px;
}

.image-stage {
  position: relative;
  width: 100%;
  min-width: 167px;
  height: 100%;
  min-height: 138px;

  margin-top: 5px;
}

.product-image {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 167px;
  max-height: 138px;
}

.placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--gray-placeholder);
}

.dots {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gray-light);
  display: inline-block;
}

.dot.active {
  background: var(--red);
}

.info {
  display: flex;
  gap: 13px;
  justify-content: space-between;
  align-items: center;

  padding-top: 20px;
  margin-top: auto;
}

.title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  opacity: 0.7;

  width: 100%;
  max-width: 155px;
}


.price {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);

  white-space: nowrap;
}

.actions-mobile{
  display: none;
}
@media (max-width: 1100px) {
  .image-split-card {
    max-width: 325px;
  }
}

@media (max-width: 744px) {
  .image-split-card {
    max-width: none;
  }

  .info {
    flex-direction: column;
  }
  .actions{
    display: none;
  }
  .actions-mobile{
    display: flex;
    gap: 10px;
  }
  .price-block{
    display: flex;
    justify-content: space-between;
  }
  .btn-card {
    max-width: none;
  }
  .info {
    display: flex;
    gap: 13px;
    justify-content: normal;
    align-items: normal;

    padding-top: 20px;
    margin-top: auto;
  }
  .price {
    font-size: 16px;
  }
  .product-image {
    max-width: 141px;
    max-height: 116px;
  }
  .image-stage {
    min-width: 141px;
    min-height: 116px;
  }

}
</style>
