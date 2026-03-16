<template>
  <div class="popular-products-widget">
    <Slider
      :fetch-items="getPopularProducts"
      :breakpoints="sliderBreakpoints"
      :heights="sliderHeights"
      :slide-component="ProductCard"
    />
  </div>
</template>

<script setup lang="ts">
import { getPopularProducts } from '~/services/productApi';
import ProductCard from '~/components/shared/ProductCard.vue';

const sliderBreakpoints = {
  0: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    grid: { rows: 3 },
    spaceBetween: 10
  },
  744: {
    slidesPerView: 3,
    slidesPerGroup: 3,
    grid: { rows: 3 },
    spaceBetween: 10
  },
  1100: {
    slidesPerView: 6,
    slidesPerGroup: 6,
    grid: { rows: 2 },
    spaceBetween: 10
  }
};

const sliderHeights = {
  mobile: 809,
  tablet: 823,
  desktop: 543
};
</script>

<style scoped>

</style>
