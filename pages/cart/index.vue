<template>
  <div class="cart-page">
    <Navigate :items="breadcrumbsItems" />

    <div class="cart-header">
      <h1 class="cart-title">Корзина</h1>
      <span v-if="items.length" class="cart-count">{{ countLabel }}</span>
    </div>

    <div v-if="loading" class="cart-skeleton">
      <div class="sk-topbar" />
      <div v-for="i in 3" :key="i" class="sk-item" />
    </div>

    <template v-else-if="items.length">
      <div class="cart-topbar">
        <label class="select-all">
          <input
            type="checkbox"
            class="checkbox"
            :checked="allSelected"
            @change="toggleSelectAll"
          />
          <span class="select-all-label">Выбрать все</span>
        </label>
        <button
          class="delete-selected"
          :disabled="selectedIds.length === 0"
          @click="deleteSelected"
        >
          Удалить выбранное
        </button>
      </div>

      <div class="cart-content">
        <div class="cart-items">
          <CartItemCard
            v-for="item in items"
            :key="item.id"
            :item="item"
            :checked="selectedIds.includes(item.id)"
            @toggle="toggleSelect(item.id)"
            @increase="increaseQty(item.id)"
            @decrease="decreaseQty(item.id)"
            @remove="removeItem(item.id)"
          />
        </div>

        <aside class="cart-summary">
          <h2 class="summary-title">Сумма корзины</h2>
          <p class="summary-selected">{{ selectedCountLabel }}</p>
          <div class="summary-divider"></div>
          <div class="summary-row">
            <span class="summary-total-label">Итого</span>
            <span class="summary-total-price">{{ formatPrice(totalPrice) }}</span>
          </div>
          <button class="checkout-btn">Оформить заказ</button>
        </aside>
      </div>
    </template>

    <EmptyState
      v-else-if="!loading"
      title="Корзина пуста"
      subtitle="Добавьте товары из каталога"
      button-text="В каталог"
      :on-click="goToCatalog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '~/utils/cart';

useHead({ title: 'Корзина — Мастер 12 Вольт' });

const router = useRouter();

const breadcrumbsItems = [
  { to: '/', text: 'Главная' },
  { to: '/cart', text: 'Корзина' },
];

const { items, loading, load, removeItem, removeItems, increaseQty, decreaseQty } = useCart();

onMounted(async () => {
  await load();
  selectedIds.value = items.value.map((i) => i.id);
});

watch(items, (newItems) => {
  selectedIds.value = selectedIds.value.filter((id) =>
    newItems.some((i) => i.id === id)
  );
});

const selectedIds = ref<number[]>([]);

const allSelected = computed(
  () => items.value.length > 0 && selectedIds.value.length === items.value.length
);
const someSelected = computed(
  () => selectedIds.value.length > 0 && selectedIds.value.length < items.value.length
);
const selectedItems = computed(() =>
  items.value.filter((i) => selectedIds.value.includes(i.id))
);
const totalPrice = computed(() =>
  selectedItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

const countLabel = computed(() => {
  const n = items.value.length;
  const forms = ['товар', 'товара', 'товаров'];
  const mod10 = n % 10;
  const mod100 = n % 100;
  let form: string;
  if (mod100 >= 11 && mod100 <= 14) form = forms[2];
  else if (mod10 === 1) form = forms[0];
  else if (mod10 >= 2 && mod10 <= 4) form = forms[1];
  else form = forms[2];
  return `${n} ${form}`;
});

const selectedCountLabel = computed(() => {
  const n = selectedItems.value.length;
  if (n === 0) return 'Нет выбранных товаров';
  const forms = ['товар', 'товара', 'товаров'];
  const mod10 = n % 10;
  const mod100 = n % 100;
  let form: string;
  if (mod100 >= 11 && mod100 <= 14) form = forms[2];
  else if (mod10 === 1) form = forms[0];
  else if (mod10 >= 2 && mod10 <= 4) form = forms[1];
  else form = forms[2];
  return `Выбран ${n} ${form}`;
});

function toggleSelect(id: number) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((i) => i !== id);
  } else {
    selectedIds.value = [...selectedIds.value, id];
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = items.value.map((i) => i.id);
  }
}

function deleteSelected() {
  const ids = [...selectedIds.value];
  removeItems(ids);
  selectedIds.value = [];
}

function goToCatalog() {
  router.push('/catalog');
}
</script>

<style scoped>
.cart-page {
  padding: 0 70px 80px;
}

/* Header */
.cart-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 22px;
}

.cart-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: var(--black);
}

.cart-count {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--red);
}

/* Top bar */
.cart-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--gray-bg, #f8f8f8);
  border-radius: 8px;
  height: 62px;
  padding: 0 26px;
  margin-bottom: 16px;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.select-all-label {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--black);
}

.delete-selected {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--red);
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.delete-selected:disabled {
  opacity: 0.4;
  cursor: default;
}

/* Checkbox */
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

/* Content layout */
.cart-content {
  display: flex;
  gap: 21px;
  align-items: flex-start;
}

/* Items list */
.cart-items {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

/* Summary */
.cart-summary {
  flex: 0 0 373px;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 8px;
  padding: 22px 24px 30px 24px;
  background: #fff;
  box-sizing: border-box;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

.summary-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: var(--black);
}

.summary-selected {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--black);
  opacity: 0.7;
  margin-top: 3px;
}

.summary-divider {
  height: 1px;
  background: #e0e0e0;
  margin-top: 16px;
  margin-bottom: 7px;
}

.summary-row {
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

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  margin-top: 17px;
  background: var(--red);
  border: none;
  border-radius: 8px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #f8f8f8;
  cursor: pointer;
  transition: opacity 0.2s;
}

.checkout-btn:hover {
  opacity: 0.9;
}

/* Skeleton */
.cart-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sk-topbar {
  height: 62px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

.sk-item {
  height: 167px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

@keyframes sk-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Responsive */
@media (max-width: 1100px) {
  .cart-page {
    padding: 0 37px 60px;
  }

  .cart-summary {
    width: 100%;
    max-width: 380px;
    height: 100%;
    max-height: max-content;
    padding: 19px 22px 27px 22px;
  }
  .cart-content {
    flex-direction: column;
  }
}

@media (max-width: 744px) {
  .cart-page {
    padding: 0 20px 60px;
  }

  .cart-summary {
    max-width: 100%;
  }

  .summary-total-price {
    font-size: 24px;
  }
}
</style>
