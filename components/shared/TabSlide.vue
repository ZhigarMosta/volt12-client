<template>
  <div class="tab-slide" :class="{ active: isActive }" @click="onSelect?.(index)">
    <button class="select-catalog">
      <NuxtImg class="catalog_img" v-if="img?.link" :src="imgSrc" :alt="img.alt" :title="img.title" />
      <p class="catalog_name">{{ name }}</p>
      <p class="tab-count">{{ count }}</p>
    </button>
    <div class="active-bar" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string
  count: number
  img?: { link?: string; alt?: string; title?: string }
  index: number
  isActive: boolean
  onSelect?: (index: number) => void
}>()

const config = useRuntimeConfig();

const imgSrc = computed(() => {
  if (!props.img?.link) return '';
  if (/^https?:\/\//i.test(props.img.link)) return props.img.link;
  return `${config.public.apiBase}/${props.img.link}`;
});
</script>

<style scoped>
.tab-slide {
  cursor: pointer;
}
.select-catalog {
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
  width: 100%;
}
.tab-slide.active .select-catalog {
  border-color: var(--red);
}
.catalog_img {
  width: 50px;
  height: 50px;
}
.catalog_name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #000;
}
.tab-count {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-light);
}
.active-bar {
  margin-top: 6px;
  height: 4px;
  border-radius: 100px;
  background: var(--red);
  opacity: 0;
  transition: opacity 0.2s;
}
.tab-slide.active .active-bar {
  opacity: 1;
}
</style>
