<script setup lang="ts">
import PreviewCard from '../shared/PreviewCard.vue';

const cards = [
  {
    image: '/icons/car-preview-card.png',
    name: 'Каталог',
    description: 'Получайте бонусы, отслеживайте заказы и делитесь мнением',
    to: '/catalog'
  },
  {
    image: '/images/preview-services.svg',
    name: 'Услуги',
    description: 'Профессиональная установка и обслуживание автоэлектроники',
    to: '/services'
  },
  {
    image: '/images/preview-faq.svg',
    name: 'FAQ',
    description: 'Ответы на частые вопросы об установке и оборудовании',
    to: '/contacts?faq=1'
  }
];
</script>

<template>
  <section class="preview-cards">
    <PreviewCard
      v-for="(card, index) in cards"
      :key="index"
      :image="card.image"
      :name="card.name"
      :description="card.description"
      :to="card.to"
    />
  </section>
</template>

<style scoped>
.preview-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 48px;
}

@media (max-width: 1100px) {
  .preview-cards {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 32px;
  }
}
@media (max-width: 744px) {
  .preview-cards {
    margin-top: 0;
  }
}
</style>