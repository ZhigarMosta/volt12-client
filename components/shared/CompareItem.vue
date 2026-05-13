<template>
  <div class="compare-item">
    <div class="catalog-item">
      <div class="top">
        <p class="catalog-item--name">{{ product?.name }}</p>
        <button class="remove">
          <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.537428 0H3.89635L7.01344 4.02444L10.1574 0H13.4626L8.67946 6.14257L14 13H10.6411L6.95969 8.26069L3.27831 13H0L5.32054 6.19552L0.537428 0Z" fill="#2D2D2D" />
          </svg>
        </button>
      </div>
      <img class="img" :src="productImage" :alt="product?.name">
      <div class="bottom">
        <p class="price">₽ {{ product?.price }}</p>
        <div class="actions">
          <button class="action">
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.875 12.375L15.75 22.5M21.375 12.375L16.875 4.5M2.25 12.375H24.75M3.9375 12.375L5.7375 20.7C5.84269 21.2159 6.12545 21.6785 6.53657 22.0074C6.94769 22.3363 7.46112 22.5106 7.9875 22.5H19.0125C19.5389 22.5106 20.0523 22.3363 20.4634 22.0074C20.8745 21.6785 21.1573 21.2159 21.2625 20.7L23.175 12.375M5.0625 17.4375H21.9375M5.625 12.375L10.125 4.5M10.125 12.375L11.25 22.5" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="action">
            <svg class="favorite" width="25" height="21" viewBox="0 0 25 21" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M6.5332 1C8.00107 1.00003 9.40835 1.58057 10.4453 2.61328L10.4463 2.61523C10.6948 2.86192 11.011 3.16422 11.3916 3.52148L12.0762 4.16504L12.7607 3.52051C13.1401 3.16354 13.455 2.86147 13.7031 2.61523C14.7358 1.59131 16.1332 1.01366 17.5918 1.00977C19.0504 1.00588 20.4511 1.57632 21.4893 2.59473C22.527 3.61289 23.1191 4.99705 23.1377 6.44629C23.1562 7.89571 22.5993 9.29465 21.5879 10.3389L12.292 19.5996C12.2349 19.6565 12.1567 19.6895 12.0742 19.6895C11.9918 19.6894 11.9126 19.6565 11.8555 19.5996L2.55762 10.3379C1.54776 9.29964 0.988638 7.90802 1 6.46387C1.01069 5.10996 1.52319 3.80961 2.43359 2.80957L2.62109 2.61328C3.65807 1.58061 5.06535 1 6.5332 1Z"
                  stroke="var(--black)" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="characteristics">
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
  feedback?: any;
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

function hasCharacteristic(characteristicId: number): boolean {
  return props.product?.characteristics?.some(
    (c: any) => c.characteristic_id === characteristicId
  ) ?? false;
}
</script>

<style scoped>
.compare-item {
  display: flex;
  flex-direction: column;
  width: 267px;
}
.catalog-item{
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  width: 267px;
  background: #fff;
  padding: 17px 14px 22px 19px;
}
.catalog-item--name{
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
.top{
  display: flex;
  justify-content: space-between;
  align-items: start;
}
.remove{
  margin-right: 12px;
}
.img{
  margin-left: 19px;
  width: 167px;
  height: 124px;
  object-fit: cover;
}
.bottom{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price{
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: #2d2d2d;
}
.actions{
  display: flex;
  gap: 14px;
}
.characteristics{
  margin-top: 73px;
  display: flex;
  flex-direction: column;
  gap: 44px;
}
.characteristic-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}
.char-name {
  color: var(--gray-light);
}
.char-value {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #2d2d2d;
}
</style>
