<template>
  <div class="feedback-from-maps-widget">
    <H2 class="h2">Отзывы с карт</H2>
    <Slider class="slider"
            :fetch-items="getFeedbackFromMap"
            :breakpoints="sliderBreakpoints"
            :slide-component="FeedbackFromMap"
    />
  </div>
</template>

<script setup lang="ts">
import { getFeedbackFromMap } from '~/services/productApi';
import FeedbackFromMap from '~/components/shared/FeedbackFromMap.vue';

const sliderBreakpoints = {
  0: {
    slidesPerView: 1,
    slidesPerGroup: 2,
    grid: { rows: 2 },
    spaceBetween: 20
  },
  744: {
    slidesPerView: 2,
    slidesPerGroup: 1,
    grid: { rows: 1 },
    spaceBetween: 20
  },
  1100: {
    slidesPerView: 3,
    slidesPerGroup: 1,
    grid: { rows: 1 },
    spaceBetween: 20
  }
};
</script>

<style scoped>
.slider {
  --slider-desktop-height: 224px;
  --slider-tablet-height: 250px;
  --slider-mobile-height: 442px;
}

.h2 {
  margin-bottom: 48px;
}

.feedback-from-maps-widget {
  margin-top: 51px;
}

@media (max-width: 1100px) {

}

@media (max-width: 744px) {

}
</style>
