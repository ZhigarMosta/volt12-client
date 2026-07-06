<template>
  <span class="lazy-image" :class="{ 'lazy-image--loaded': loaded, 'lazy-image--error': errored }">
    <span class="lazy-image__skeleton" aria-hidden="true" />
    <img
        v-if="src"
        ref="imgEl"
        class="lazy-image__img"
        :src="src"
        :alt="alt || ''"
        :title="title"
        :loading="loading"
        @load="onLoad"
        @error="onError"
    />
  </span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';

const props = withDefaults(
    defineProps<{
      src?: string | null;
      alt?: string;
      title?: string;
      loading?: 'lazy' | 'eager';
    }>(),
    {
      loading: 'lazy',
    },
);

const imgEl = ref<HTMLImageElement | null>(null);
const loaded = ref(false);
const errored = ref(false);

// Картинка может быть уже в кэше браузера (например, при повторном наведении
// на превью в галерее товара) — тогда `load` может не дать увидеть анимацию,
// проверяем complete сразу, чтобы не мигать скелетоном зря.
function checkAlreadyLoaded() {
  if (imgEl.value?.complete && imgEl.value.naturalWidth > 0) {
    loaded.value = true;
  }
}

function onLoad() {
  loaded.value = true;
}

function onError() {
  errored.value = true;
  loaded.value = true;
}

watch(
    () => props.src,
    () => {
      loaded.value = false;
      errored.value = false;
      nextTick(checkAlreadyLoaded);
    },
);

onMounted(checkAlreadyLoaded);
</script>

<style scoped>
.lazy-image {
  position: relative;
  display: block;
  overflow: hidden;
}

.lazy-image__skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: lazy-image-shimmer 1.5s infinite;
  opacity: 1;
  transition: opacity 0.25s ease;
}

.lazy-image--loaded .lazy-image__skeleton,
.lazy-image--error .lazy-image__skeleton {
  opacity: 0;
}

.lazy-image__img {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: inherit;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.lazy-image--loaded .lazy-image__img {
  opacity: 1;
}

@keyframes lazy-image-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .lazy-image__skeleton {
    animation: none;
  }
}
</style>
