<script setup lang="ts">
import PreviewCard from '../shared/PreviewCard.vue';

const cards = [
  {
    image: '/icons/car-preview-card.png',
    name: 'Каталог',
    description: 'Получайте бонусы, отслеживайте заказы и делитесь мнением',
    to: '/'
  },
  {
    image: '/icons/car-preview-card.png',
    name: 'Каталог',
    description: 'Получайте бонусы, отслеживайте заказы и делитесь мнением',
    to: '/'
  },
  {
    image: '/icons/car-preview-card.png',
    name: 'Каталог',
    description: 'Получайте бонусы, отслеживайте заказы и делитесь мнением',
    to: '/'
  },
  {
    image: '/icons/car-preview-card.png',
    name: 'Каталог',
    description: 'Получайте бонусы, отслеживайте заказы и делитесь мнением',
    to: '/'
  },
  {
    image: '/icons/car-preview-card.png',
    name: 'Каталог',
    description: 'Получайте бонусы, отслеживайте заказы и делитесь мнением',
    to: '/'
  },
  {
    image: '/icons/car-preview-card.png',
    name: 'Каталог',
    description: 'Получайте бонусы, отслеживайте заказы и делитесь мнением',
    to: '/'
  }
];
</script>

<template>
  <div class="preview-cards">
    <PreviewCard
      v-for="(card, index) in cards"
      :key="index"
      :image="card.image"
      :name="card.name"
      :description="card.description"
      :to="card.to"
    />
  </div>
</template>

<style scoped>
.preview-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 0 70px;
  margin-top: 48px;
}

@media (max-width: 1100px) {
  .preview-cards {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 37px;
    margin-top: 32px;
  }
}
@media (max-width: 744px) {
  .preview-cards {
    padding: 0 20px;
    margin-top: 0;
  }
}
</style>