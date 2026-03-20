<template>
  <div class="popular-products-widget">
    <H2 class="h2">Популярные товары</H2>
    <Slider class="slider"
            :fetch-items="getPopularProducts"
            :breakpoints="sliderBreakpoints"
            :slide-component="ProductCard"
    />
  </div>
</template>

<script setup lang="ts">
import {getPopularProducts} from '~/services/productApi';
import ProductCard from '~/components/shared/ProductCard.vue';

const sliderBreakpoints = {
  0: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    grid: {rows: 3},
    spaceBetween: 10
  },
  744: {
    slidesPerView: 3,
    slidesPerGroup: 3,
    grid: {rows: 3},
    spaceBetween: 10
  },
  1100: {
    slidesPerView: 6,
    slidesPerGroup: 6,
    grid: {rows: 2},
    spaceBetween: 10
  }
};
</script>

<style scoped>
.slider {
  --slider-desktop-height: 543px;
  --slider-tablet-height: 823px;
  --slider-mobile-height: 809px;
}

.h2 {
  margin-bottom: 29px;
}

.popular-products-widget {
  margin-top: 51px;
}

@media (max-width: 1100px) {
  .h2 {
    margin-bottom: 31px;
  }

  .popular-products-widget {
    margin-top: 48px;
  }
}

@media (max-width: 744px) {
  .h2 {
    margin-bottom: 65px;
  }
}
</style>
