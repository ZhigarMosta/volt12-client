<template>
  <div class="fav-item">
    <label class="item-checkbox-wrap">
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
      <NuxtImg
        v-if="item.images.length"
        class="item-image"
        :src="item.images[activeIndex].url"
        :alt="item.images[activeIndex].alt || item.name"
      />
      <img
        v-else
        class="item-image"
        src="/icons/outOfStock.svg"
        :alt="item.name"
      />
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
      <p class="item-price">{{ formatPrice(item.price) }}</p>
      <div @click.stop>
        <UiButton
          class="item-cart-btn"
          variant="red"
          vertical-spacing="compact"
          full-width
          @click="emit('add-to-cart')"
        >
          В корзину
        </UiButton>
      </div>
    </div>

    <div class="item-actions">
      <button class="action-btn" title="Удалить из избранного" @click="emit('remove')">
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.9375 5.90625H18.5625V4.78125C18.5625 3.60047 17.5933 2.8125 16.5938 2.8125H10.4062C9.40672 2.8125 8.4375 3.60047 8.4375 4.78125V5.90625H5.0625C4.44609 5.90625 3.9375 6.41484 3.9375 7.03125C3.9375 7.64766 4.44609 8.15625 5.0625 8.15625H5.625V21.375C5.625 22.6189 6.63609 23.625 7.875 23.625H19.125C20.3689 23.625 21.375 22.6189 21.375 21.375V8.15625H21.9375C22.5539 8.15625 23.0625 7.64766 23.0625 7.03125C23.0625 6.41484 22.5539 5.90625 21.9375 5.90625ZM10.6875 4.78125C10.6875 4.84453 10.6875 4.78125 10.6875 4.78125H16.3125C16.3125 4.78125 16.3125 4.84453 16.3125 4.78125V5.90625H10.6875V4.78125ZM19.125 21.375H7.875V8.15625H19.125V21.375Z" fill="#2D2D2D"/>
          <path d="M10.6875 10.6875C10.0711 10.6875 9.5625 11.1961 9.5625 11.8125V18.5625C9.5625 19.1789 10.0711 19.6875 10.6875 19.6875C11.3039 19.6875 11.8125 19.1789 11.8125 18.5625V11.8125C11.8125 11.1961 11.3039 10.6875 10.6875 10.6875Z" fill="#2D2D2D"/>
          <path d="M16.3125 10.6875C15.6961 10.6875 15.1875 11.1961 15.1875 11.8125V18.5625C15.1875 19.1789 15.6961 19.6875 16.3125 19.6875C16.9289 19.6875 17.4375 19.1789 17.4375 18.5625V11.8125C17.4375 11.1961 16.9289 10.6875 16.3125 10.6875Z" fill="#2D2D2D"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FavoriteItem } from '~/types/favorite';
import { formatPrice } from '~/utils/format';

const props = defineProps<{
  item: FavoriteItem;
  checked: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  remove: [];
  'add-to-cart': [];
}>();

const activeIndex = ref(0);
const imageStage = ref<HTMLElement | null>(null);

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

function handleMove(e: MouseEvent) { updateIndexFromX(e.clientX); }
function handleTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) updateIndexFromX(e.touches[0].clientX);
}
function handleLeave() { activeIndex.value = 0; }
</script>

<style scoped>
.fav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 8px;
  padding: 16px 22px;
  min-height: 167px;
  box-sizing: border-box;
  background: #fff;
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
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.dots {
  position: absolute;
  bottom: 6px;
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
  gap: 8px;
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

.item-price {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
}

.item-cart-btn {
  max-width: 160px;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
  align-self: flex-start;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.action-btn:hover {
  opacity: 1;
}

@media (max-width: 1100px) {
  .item-image-stage {
    width: 130px;
    height: 108px;
  }
}

@media (max-width: 744px) {
  .fav-item {
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

  .item-cart-btn {
    max-width: 100%;
  }
}
</style>
