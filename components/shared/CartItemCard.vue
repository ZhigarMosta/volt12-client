<template>
  <div class="cart-item" @click="goToProduct">
    <label class="item-checkbox-wrap" @click.stop>
      <input
        type="checkbox"
        class="checkbox"
        :checked="checked"
        @change="emit('toggle')"
      />
    </label>

    <div
      class="item-image-stage"
      ref="imageStage"
      @mousemove="handleMove"
      @mouseleave="handleLeave"
      @touchmove="handleTouchMove"
    >
      <ImageWithSkeleton
        v-if="item.images.length"
        class="item-image"
        :src="item.images[activeIndex]?.url"
        :alt="item.images[activeIndex]?.alt || item.name"
        :title="item.images[activeIndex]?.title || item.name"
      />
      <NoImagePlaceholder v-else class="item-image" />
      <div class="dots" v-if="item.images.length > 1">
        <span
          v-for="(_, idx) in item.images"
          :key="idx"
          class="dot"
          :class="{ active: idx === activeIndex }"
        />
      </div>
    </div>

    <div class="item-info">
      <p class="item-name">{{ item.name }}</p>
      <div class="item-qty" @click.stop>
        <button class="qty-btn" @click="emit('decrease')">−</button>
        <span class="qty-value">{{ item.quantity }}</span>
        <button class="qty-btn" @click="emit('increase')">+</button>
      </div>
      <p class="item-price">{{ formatPrice(item.price * item.quantity) }}</p>
    </div>

    <div class="item-actions" @click.stop>
      <button
        class="action-btn"
        :class="{ 'action-btn--active': inCompare }"
        :title="inCompare ? 'Убрать из сравнения' : 'Добавить в сравнение'"
        @click="emit('toggle-compare')"
      >
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M17.68 0.00455729C19.5294 0.0982503 21 1.62738 21 3.5V17.5L20.9954 17.68C20.9048 19.4697 19.4697 20.9048 17.68 20.9954L17.5 21H3.5C1.62738 21 0.0982502 19.5294 0.00455729 17.68L0 17.5V3.5C2.25493e-07 1.567 1.567 5.63724e-08 3.5 0H17.5L17.68 0.00455729ZM3.5 1.75C2.5335 1.75 1.75 2.5335 1.75 3.5V17.5C1.75 18.4665 2.5335 19.25 3.5 19.25H4.95833V5.83333C4.95833 5.35008 5.35008 4.95833 5.83333 4.95833C6.31658 4.95833 6.70833 5.35008 6.70833 5.83333V19.25H9.625V11.6667C9.625 11.1834 10.0168 10.7917 10.5 10.7917C10.9832 10.7917 11.375 11.1834 11.375 11.6667V19.25H14.2917V9.33333C14.2917 8.85008 14.6834 8.45833 15.1667 8.45833C15.6499 8.45833 16.0417 8.85008 16.0417 9.33333V19.25H17.5C18.4665 19.25 19.25 18.4665 19.25 17.5V3.5C19.25 2.5335 18.4665 1.75 17.5 1.75H3.5Z"
                :fill="inCompare ? 'var(--red)' : '#2D2D2D'"/>
        </svg>
      </button>
      <button
        class="action-btn"
        :class="{ 'action-btn--active': inFavorite }"
        :title="inFavorite ? 'Убрать из избранного' : 'В избранное'"
        @click="emit('toggle-favorite')"
      >
        <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.5332 1C8.00107 1.00003 9.40835 1.58057 10.4453 2.61328L10.4463 2.61523C10.6948 2.86192 11.011 3.16422 11.3916 3.52148L12.0762 4.16504L12.7607 3.52051C13.1401 3.16354 13.455 2.86147 13.7031 2.61523C14.7358 1.59131 16.1332 1.01366 17.5918 1.00977C19.0504 1.00588 20.4511 1.57632 21.4893 2.59473C22.527 3.61289 23.1191 4.99705 23.1377 6.44629C23.1562 7.89571 22.5993 9.29465 21.5879 10.3389L12.292 19.5996C12.2349 19.6565 12.1567 19.6895 12.0742 19.6895C11.9918 19.6894 11.9126 19.6565 11.8555 19.5996L2.55762 10.3379C1.54776 9.29964 0.988638 7.90802 1 6.46387C1.01069 5.10996 1.52319 3.80961 2.43359 2.80957L2.62109 2.61328C3.65807 1.58061 5.06535 1 6.5332 1Z"
            :stroke="inFavorite ? 'var(--red)' : '#2D2D2D'"
            :fill="inFavorite ? 'var(--red)' : 'none'"
            stroke-width="2"
          />
        </svg>
      </button>
      <button class="action-btn" title="Удалить" @click="emit('remove')">
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.875 4.5C7.875 3.90326 8.11205 3.33097 8.53401 2.90901C8.95597 2.48705 9.52826 2.25 10.125 2.25H16.875C17.4717 2.25 18.044 2.48705 18.466 2.90901C18.8879 3.33097 19.125 3.90326 19.125 4.5V6.75H23.625C23.9234 6.75 24.2095 6.86853 24.4205 7.0795C24.6315 7.29048 24.75 7.57663 24.75 7.875C24.75 8.17337 24.6315 8.45952 24.4205 8.6705C24.2095 8.88147 23.9234 9 23.625 9H22.4224L21.447 22.6597C21.4066 23.2274 21.1526 23.7587 20.7361 24.1465C20.3197 24.5344 19.7717 24.75 19.2026 24.75H7.79625C7.22716 24.75 6.6792 24.5344 6.26275 24.1465C5.84629 23.7587 5.59228 23.2274 5.55187 22.6597L4.57875 9H3.375C3.07663 9 2.79048 8.88147 2.5795 8.6705C2.36853 8.45952 2.25 8.17337 2.25 7.875C2.25 7.57663 2.36853 7.29048 2.5795 7.0795C2.79048 6.86853 3.07663 6.75 3.375 6.75H7.875V4.5ZM10.125 6.75H16.875V4.5H10.125V6.75ZM6.83325 9L7.79738 22.5H19.2038L20.1679 9H6.83325ZM11.25 11.25C11.5484 11.25 11.8345 11.3685 12.0455 11.5795C12.2565 11.7905 12.375 12.0766 12.375 12.375V19.125C12.375 19.4234 12.2565 19.7095 12.0455 19.9205C11.8345 20.1315 11.5484 20.25 11.25 20.25C10.9516 20.25 10.6655 20.1315 10.4545 19.9205C10.2435 19.7095 10.125 19.4234 10.125 19.125V12.375C10.125 12.0766 10.2435 11.7905 10.4545 11.5795C10.6655 11.3685 10.9516 11.25 11.25 11.25ZM15.75 11.25C16.0484 11.25 16.3345 11.3685 16.5455 11.5795C16.7565 11.7905 16.875 12.0766 16.875 12.375V19.125C16.875 19.4234 16.7565 19.7095 16.5455 19.9205C16.3345 20.1315 16.0484 20.25 15.75 20.25C15.4516 20.25 15.1655 20.1315 14.9545 19.9205C14.7435 19.7095 14.625 19.4234 14.625 19.125V12.375C14.625 12.0766 14.7435 11.7905 14.9545 11.5795C15.1655 11.3685 15.4516 11.25 15.75 11.25Z" fill="#2D2D2D" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CartItem } from '~/types/cart';
import { formatPrice } from '~/utils/format';

const props = defineProps<{
  item: CartItem;
  checked: boolean;
  inFavorite?: boolean;
  inCompare?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  increase: [];
  decrease: [];
  remove: [];
  'toggle-favorite': [];
  'toggle-compare': [];
}>();

const activeIndex = ref(0);
const imageStage = ref<HTMLElement | null>(null);

function goToProduct() {
  if (!props.item.slug) return;
  navigateTo(`/product/${props.item.slug}`);
}

function updateIndexFromX(clientX: number) {
  const imgs = props.item.images;
  if (imgs.length <= 1) return;
  const rect = imageStage.value?.getBoundingClientRect();
  if (!rect) return;
  const x = clientX - rect.left;
  let idx = Math.floor((x / rect.width) * imgs.length);
  idx = Math.max(0, Math.min(imgs.length - 1, idx));
  activeIndex.value = idx;
}

function handleMove(e: MouseEvent) {
  updateIndexFromX(e.clientX);
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) updateIndexFromX(e.touches[0].clientX);
}

function handleLeave() {
  activeIndex.value = 0;
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 8px;
  padding: 16px 22px;
  min-height: 167px;
  box-sizing: border-box;
  background: #fff;
  cursor: pointer;
}

.item-checkbox-wrap {
  flex-shrink: 0;
  cursor: pointer;
  align-self: flex-start;
}

.checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 1px solid #b9b9b9;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
}

.checkbox:checked {
  background: var(--red);
  border-color: var(--red);
}

.checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 8px;
  height: 12px;
  border: 2px solid #fff;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.item-image-stage {
  flex-shrink: 0;
  width: 176px;
  height: 146px;
  position: relative;
  cursor: default;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.dots {
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 4px;
  pointer-events: none;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(185, 185, 185, 0.6);
  transition: background 0.2s;
}

.dot.active {
  background: var(--red);
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: inherit;
}

.item-name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-qty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--red);
  border-radius: 8px;
  width: 115px;
  height: 40px;
  padding: 6px 10px;
  flex-shrink: 0;
}

.qty-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: white;
  line-height: 1;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-value {
  text-align: center;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: white;
}

.item-price {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

@media (max-width: 1100px) {
  .item-image-stage {
    width: 130px;
    height: 108px;
  }
}

@media (max-width: 744px) {
  .cart-item {
    flex-wrap: wrap;
    padding: 12px 16px;
    gap: 12px;
  }

  .item-image-stage {
    width: 100px;
    height: 83px;
  }

  .item-name {
    white-space: normal;
  }
}
@media (max-width: 420px) {
  .item-price {
    font-size: 15px;
    white-space: nowrap;
  }
  .item-qty {
    width: 70px;
  }
  .qty-value {
    font-size: 15px;
  }
}
</style>
