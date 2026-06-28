<template>
  <div class="compare-item">
    <div class="catalog-item" :class="{ 'catalog-item--clickable': product?.slug }" @click="goToProduct">
      <div class="top">
        <p class="catalog-item--name">{{ product?.name }}</p>
        <button class="remove" @click.stop="$emit('remove', product?.id)">
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.537428 0H3.89635L7.01344 4.02444L10.1574 0H13.4626L8.67946 6.14257L14 13H10.6411L6.95969 8.26069L3.27831 13H0L5.32054 6.19552L0.537428 0Z" fill="#2D2D2D" />
          </svg>
        </button>
      </div>
      <NuxtImg v-if="hasImage" class="img" :src="productImage" :alt="imageAlt" :title="imageTitle"/>
      <NoImagePlaceholder v-else class="img" />
      <div class="bottom">
        <p class="price">₽ {{ product?.price }}</p>
      </div>
    </div>
    <div class="characteristics" :class="{ 'characteristics--paginated': hasPagination }">
      <div v-for="ch in product?.catalog_characteristics" :key="ch.id">
        <span class="char-value">{{ hasCharacteristic(ch.id) ? 'да' : 'нет' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  product?: any;
  hasPagination?: boolean;
}>();

defineEmits<{
  remove: [catalogItemId: number];
}>();

const config = useRuntimeConfig();

const productImage = computed(() => {
  const images = props.product?.images;
  if (images?.length > 0) {
    const img = images[0].img_link;
    if (/^https?:\/\//i.test(img)) return img;
    return `${config.public.apiBase}/${img}`;
  }
  return '/icons/test.png';
});

const hasImage = computed(() => (props.product?.images?.length ?? 0) > 0);
const imageAlt = computed(() => props.product?.images?.[0]?.alt || props.product?.name);
const imageTitle = computed(() => props.product?.images?.[0]?.title || props.product?.name);

function hasCharacteristic(characteristicId: number): boolean {
  return props.product?.characteristics?.some(
    (c: any) => c.characteristic_id === characteristicId
  ) ?? false;
}

function goToProduct() {
  if (props.product?.slug) {
    navigateTo(`/product/${props.product.slug}`);
  }
}
</script>

<style scoped>
.compare-item {
  display: flex;
  flex-direction: column;
  width: 267px;
}
.catalog-item {
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  width: 267px;
  background: #fff;
  padding: 17px 14px 22px 19px;
}
.catalog-item--clickable {
  cursor: pointer;
}
.catalog-item--name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #2d2d2d;
  opacity: 0.7;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: start;
}
.remove {
  margin-right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.img {
  margin-left: 19px;
  width: 167px;
  height: 124px;
  object-fit: cover;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: #2d2d2d;
}
.actions {
  display: flex;
  gap: 14px;
  align-items: center;
}
.action {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--red);
  border-radius: 8px;
  width: 80px;
  height: 32px;
  padding: 4px 8px;
}
.qty-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: white;
  line-height: 1;
  padding: 0 2px;
  display: flex;
  align-items: center;
}
.qty-value {
  text-align: center;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: white;
}

.characteristics {
  margin-top: 73px;
  display: flex;
  flex-direction: column;
  gap: 44px;
}
.characteristics--paginated {
  margin-top: 103px;
}
.char-value {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #2d2d2d;
}
</style>
