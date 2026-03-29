<template>
  <div
      class="image-split-card"
      ref="card"
  >
    <div class="image-stage" aria-label="product image" role="img"
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
      <div v-else class="placeholder">No image</div>
    </div>

    <div class="dots" v-if="normalizedImages.length > 1">
      <span
          v-for="(img, idx) in normalizedImages"
          :key="idx"
          class="dot"
          :class="{ active: idx === activeIndex }"
      ></span>
    </div>

    <div class="info">
      <div class="title">{{ title }}</div>
      <div class="subtitle" v-if="subtitle">{{ subtitle }}</div>
      <div class="price">{{ price }}</div>
      <button class="add-btn" type="button" @click="onAddToCart">В корзину</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type ImgItem = {
  // данные приходят в стиле: { img_link: "uploads/...", ... }
  img_link?: string;
  alt?: string;
  title?: string;
  position?: number;
  product_code?: string;
  // -- другие поля можно игнорировать
};

const props = defineProps<{
  images?: ImgItem[];
  title: string;
  subtitle?: string;
  price: string | number;
  onAdd?: () => void;
}>();

// Базовый URL для относительных путей
const baseURL = 'http://127.0.0.1:8000/';

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

    // Приводим к абсолютной ссылке, используя img_link как источник
    let url = path;
    if (!/^https?:\/\//i.test(path)) {
      url = baseURL + path.replace(/^\/+/, '');
    }

    // Уникальность по url (чтобы не терять обе картинки, даже если product_code повторяется)
    if (!seen.has(url)) {
      seen.add(url);
      out.push({
        url,
        alt: it.alt ?? '',
        position: typeof it.position === 'number' ? it.position : out.length,
        code: it.product_code ?? '',
      });
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
  let x = clientX - rect.left;
  const w = rect.width;
  let idx = Math.floor((x / w) * imgs.length);
  idx = Math.max(0, Math.min(imgs.length - 1, idx));
  activeIndex.value = idx;
}

function handleMove(e: MouseEvent) {
  updateIndexFromX(e.clientX);
}
function handleTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) updateIndexFromX(e.touches[0].clientX);
}
function handleLeave() {
  activeIndex.value = 0;
}
function onAddToCart() {
  props.onAdd?.();
}
</script>

<style scoped>
.image-split-card {
  width: 320px;
  border-radius: 20px;
  box-shadow: 0 6px 24px rgba(0,0,0,.08);
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.image-stage {
  position: relative;
  width: 100%;
  padding-top: 60%;
  background: #f6f6f6;
}
.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #999;
}
.dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 10px 0 6px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  display: inline-block;
}
.dot.active {
  background: #d21f26;
}
.info {
  padding: 12px 14px 16px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #333;
}
.subtitle {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}
.price {
  font-size: 20px;
  font-weight: 700;
  margin: 8px 0;
  color: #111;
}
.add-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #e31b23;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
.add-btn:hover {
  background: #c1181e;
}
</style>
