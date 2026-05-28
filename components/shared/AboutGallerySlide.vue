<script setup lang="ts">
import type { AboutGalleryImage } from '~/types/about';

defineProps<{
  image: AboutGalleryImage;
}>();
</script>

<template>
  <NuxtImg
      class="about-gallery-slide"
      :src="image.src"
      :alt="image.alt"
  />
</template>

<style scoped>
.about-gallery-slide {
  border-radius: 16px;
  width: 420px;
  height: 272px;
  object-fit: cover;
  display: block;
}

@media (max-width: 1100px) {
  .about-gallery-slide {
    width: 325px;
    height: 210px;
  }
}

@media (max-width: 744px) {
  .about-gallery-slide {
    width: 184px;
    height: 118px;
  }
}
</style>
