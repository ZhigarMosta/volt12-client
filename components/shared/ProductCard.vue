<template>
  <NuxtLink :to="`/product/${product.slug}`" class="product-card">
    <div class="product-img-wrap">
      <ImageWithSkeleton
        class="product-img"
        :src="imageUrl"
        :alt="imageAlt"
        :title="imageTitle"
      />
      <ProductBadges :label="product.label" :discount-percent="product.discount_percent" />
    </div>
    <p class="product-name">{{ product.name }}</p>
    <p class="product-price">
      {{ formatPrice(product.price) }}
      <s
        v-if="product.old_price != null && product.discount_percent != null"
        class="product-old-price"
      >{{ formatPrice(product.old_price) }}</s>
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '~/types/product';
import {getProductImageAlt, getProductImageTitle, getProductImageUrl} from '~/services/productApi';
import { formatPrice } from '~/utils/format';

const props = defineProps<{
  product: Product;
}>();
const imageUrl = computed(() => getProductImageUrl(props.product));
const imageTitle = computed(() => getProductImageTitle(props.product));
const imageAlt = computed(() => getProductImageAlt(props.product));
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

.product-img-wrap {
  position: relative;
  width: 100%;
  margin-top: 17px;
}

.product-img {
  width: 100%;
  height: 120px;
  object-fit: contain;
}

.product-old-price {
  font-size: 14px;
  color: var(--gray-light);
  text-decoration: line-through;
  margin-left: 8px;
  white-space: nowrap;
}
</style>
