<template>
  <NuxtLink to="/" class="product-card">
    <img 
      class="product-img" 
      :src="imageUrl" 
      :alt="product.name"
      :title="imageTitle"
    >
    <p class="product-name">{{ product.name }}</p>
    <p class="product-price">{{ formatPrice(product.price) }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '~/types/product';
import {getProductImageTitle, getProductImageUrl} from '~/services/productApi';
import { formatPrice } from '~/utils/format';

const props = defineProps<{
  product: Product;
}>();

const imageUrl = computed(() => getProductImageUrl(props.product));
const imageTitle = computed(() => getProductImageTitle(props.product));
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: start;

  max-width: 200px;
  max-height: 260px;
  width: 100%;
  height: 100%;
}

.product-name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  opacity: 0.7;
  margin-top: 14px;
  text-align: left;
}

.product-price {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
  margin-top: 27px;
  text-align: left;
}

.product-img {
  width: 100%;
  height: 120px;
  object-fit: contain;
  margin-top: 17px;
}
</style>
