<template>
  <aside class="order-summary">

    <!-- Skeleton -->
    <template v-if="loading">
      <div class="sk-title" />
      <div class="sk-subtitle" />
      <div class="sk-divider" />
      <div v-for="i in 3" :key="i" class="sk-item-row" />
      <div class="sk-divider" />
      <div class="sk-total" />
      <div class="sk-btn" />
    </template>

    <!-- Content -->
    <template v-else>
      <h2 class="summary-title">{{ title }}</h2>
      <p v-if="subtitle" class="summary-subtitle">{{ subtitle }}</p>

      <template v-if="items && items.length">
        <ul class="summary-list">
          <li v-for="item in items" :key="item.id" class="summary-list__item">
            <span class="summary-list__name">{{ item.name }} × {{ item.quantity }}</span>
            <span class="summary-list__price">{{ formatPrice(item.price * item.quantity) }}</span>
          </li>
        </ul>
      </template>

      <div class="summary-divider" />

      <div class="summary-total-row">
        <span class="summary-total-label">Итого</span>
        <span class="summary-total-price">{{ formatPrice(total) }}</span>
      </div>

      <UiButton
        ref="btnRef"
        variant="red"
        :full-width="true"
        vertical-spacing="default"
        class="summary-btn"
        :disabled="disabled"
        @click="emit('click')"
      >
        {{ buttonText }}
      </UiButton>
    </template>

  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatPrice } from '~/utils/format';

export interface SummaryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const props = withDefaults(defineProps<{
  title: string;
  subtitle?: string;
  items?: SummaryItem[];
  total: number;
  buttonText: string;
  loading?: boolean;
  disabled?: boolean;
}>(), {
  loading: false,
  disabled: false,
});

const emit = defineEmits<{ click: [] }>();

const btnRef = ref<InstanceType<typeof import('~/components/shared/UiButton.vue').default> | null>(null);

defineExpose({
  get buttonEl(): HTMLElement | null {
    return (btnRef.value as any)?.$el ?? null;
  },
});
</script>

<style scoped>
.order-summary {
  flex: 0 0 373px;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 8px;
  padding: 22px 24px 30px;
  background: #fff;
  box-sizing: border-box;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

/* Skeleton */
.sk-title {
  height: 36px;
  width: 60%;
  border-radius: 6px;
  margin-bottom: 8px;
}

.sk-subtitle {
  height: 18px;
  width: 75%;
  border-radius: 4px;
  margin-bottom: 4px;
}

.sk-divider {
  height: 1px;
  margin: 16px 0;
}

.sk-item-row {
  height: 18px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.sk-total {
  height: 36px;
  width: 80%;
  border-radius: 6px;
  margin-bottom: 4px;
}

.sk-btn {
  height: 46px;
  border-radius: 8px;
  margin-top: 17px;
}

.sk-title,
.sk-subtitle,
.sk-item-row,
.sk-total,
.sk-btn,
.sk-divider {
  background: linear-gradient(
    90deg,
    var(--gray-shimmer) 25%,
    var(--gray-shimmer-light) 50%,
    var(--gray-shimmer) 75%
  );
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

@keyframes sk-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

/* Title */
.summary-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: var(--black);
  margin: 0;
}

.summary-subtitle {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--black);
  opacity: 0.7;
  margin: 3px 0 0;
}

/* Items list */
.summary-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-list__item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.summary-list__name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-list__price {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  flex-shrink: 0;
}

/* Divider */
.summary-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 16px 0 7px;
}

/* Total */
.summary-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-total-label {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: var(--black);
}

.summary-total-price {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: var(--red);
}

/* Button */
.summary-btn {
  margin-top: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 14px !important;
  padding-bottom: 14px !important;
}
</style>
