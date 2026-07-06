<template>
  <div class="gallery">
    <div class="gallery-active" :class="{ active: active }"></div>
    <button
        type="button"
        class="gallery-thumb"
        @click="onSelect"
        @mouseenter="onHover"
        @mouseleave="onHoverLeave"
    >
      <ImageWithSkeleton class="img" :src="image.url" :alt="image.alt || ''" :title="image.title || undefined"/>
    </button>
  </div>
</template>

<script setup lang="ts">
type GalleryThumbImage = {
  id: number;
  url: string;
  alt?: string;
  title?: string;
};

const props = defineProps<{
  image: GalleryThumbImage;
  active?: boolean;
  onSelect?: () => void;
  onHover?: () => void;
  onHoverLeave?: () => void;
}>();

function onSelect() {
  props.onSelect?.();
}

function onHover() {
  props.onHover?.();
}

function onHoverLeave() {
  props.onHoverLeave?.();
}
</script>

<style scoped>
.gallery{
  display: flex;
  gap: 4px;
}
.img{
  width: 90px;
  height: 92px;
  border-radius: 8px;
  object-fit: cover;
}

.gallery-thumb {
  cursor: zoom-in;
  border: 1px solid rgba(185, 185, 185, 0.38);
  width: 90px;
  border-radius: 8px;
  height: 92px;
}
.gallery-active.active {
  opacity: 1;
}
.gallery-active {
  background: var(--red);
  border-radius: 100px;
  width: 4px;
  height: 92px;
  transition: opacity 0.2s;
  opacity: 0;
}

@media (max-width: 744px) {
  .gallery-active{
    order: 2;
  }
  .gallery-thumb{
    order: 1;
  }
  .gallery{
    flex-direction: column;
  }
  .gallery-active {
    height: 4px;
    width: 88px;
  }
}
</style>
