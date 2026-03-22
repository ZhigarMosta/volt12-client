<script setup lang="ts">
import type { Feedback } from '~/types/product';

const props = defineProps<{
  feedback: Feedback;
}>();

const countStar = 5;

const getMapName = (map: string) => {
  const mapNames: Record<string, string> = {
    '2gis': '2GIS',
    'yandex': 'Яндекс карт',
    'google': 'Google карт'
  };
  return mapNames[map.toLowerCase()] || map;
};
</script>

<template>
  <a :href="feedback.feedback_link" target="_blank" rel="noopener noreferrer" class="feedback-from-map">
    <div class="feedback-from-map-top">
      <div class="author">
        <p class="user">{{ feedback.user_name }}</p>
        <p class="from">отзыв с {{ getMapName(feedback.map) }}</p>
      </div>
      <div class="stars">
        <svg
            v-for="position in countStar"
            :key="position"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="{ 'empty': position >= feedback.star_count }"
        >
          <path
              d="M9.5105 0L11.7556 6.56434H19.0211L13.1432 10.6213L15.3884 17.1857L9.5105 13.1287L3.63265 17.1857L5.87779 10.6213L-6.67572e-05 6.56434H7.26536L9.5105 0Z"
              fill="#E2000F"/>
        </svg>
      </div>
    </div>
    <p class="message">{{ feedback.message }}</p>
  </a>
</template>

<style scoped>
.stars {
  display: flex;
  gap: 1px;
}

.stars svg.empty path{
  fill: var(--gray-light);
  stroke-width: 1;
}

.feedback-from-map {
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  height: 190px;
  padding: 28px 31px 26px 31px;

  background: var(--gray);
  display: block;
  text-decoration: none;
  box-sizing: border-box;
}

.feedback-from-map:hover {
  opacity: 0.9;
}

.feedback-from-map-top {
  display: flex;
  justify-content: space-between;
}

.user {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
}

.from {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  opacity: 0.5;
}

.message {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: var(--black);
  opacity: 0.7;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;

  width: 100%;
  max-width: 312px;
  height: 80px;
  margin-top: 14px;
}
@media (max-width: 1100px) {
  .feedback-from-map {
    padding: 28px 20px 29px 31px;
  }
}
</style>
