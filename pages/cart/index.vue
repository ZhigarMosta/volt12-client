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
            :in-favorite="isFavorite(item.catalogItemId)"
            :in-compare="isInCompare(item.catalogItemId)"
            @toggle="toggleSelect(item.id)"
            @increase="increaseQty(item.id)"
            @decrease="decreaseQty(item.id)"
            @remove="removeItem(item.id)"
            @toggle-favorite="toggleFavorite(item.catalogItemId)"
            @toggle-compare="toggleCompare(item.catalogItemId)"
          />
        </div>

        <OrderSummary
          ref="orderSummaryRef"
          title="Сумма корзины"
          :subtitle="selectedCountLabel"
          :total="totalPrice"
          button-text="Оформить заказ"
          @click="goToCheckout"
        />
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
import { useFavorites } from '~/utils/favorites';
import { addToFavorites, removeFromFavorites } from '~/services/favoritesApi';
import { addToCompare, removeFromCompare } from '~/services/productApi';
import { useCheckoutOrder } from '~/utils/useCheckoutOrder';
import type OrderSummary from '~/components/features/OrderSummary.vue';

useSeo(() => ({ title: 'Корзина — Мастер 12 Вольт', noindex: true }));

const router = useRouter();

const breadcrumbsItems = [
  { to: '/', text: 'Главная' },
  { to: '/cart', text: 'Корзина' },
];

const { isAuthenticated } = useAuth();
const { items, loading, load, removeItem, removeItems, increaseQty, decreaseQty } = useCart(isAuthenticated);
const { items: favoriteItems, load: loadFavorites } = useFavorites();

const orderSummaryRef = ref<InstanceType<typeof OrderSummary> | null>(null);

const favoriteIds = computed(() => new Set(favoriteItems.value.map((f) => f.catalogItemId)));

function isFavorite(catalogItemId: number): boolean {
  return favoriteIds.value.has(catalogItemId);
}

async function toggleFavorite(catalogItemId: number) {
  if (favoriteIds.value.has(catalogItemId)) {
    try { await removeFromFavorites(catalogItemId); await loadFavorites(); } catch {}
  } else {
    try { await addToFavorites(catalogItemId); await loadFavorites(); } catch {}
  }
}

const compareIds = ref<Set<number>>(new Set());

function isInCompare(catalogItemId: number): boolean {
  return compareIds.value.has(catalogItemId);
}

async function toggleCompare(catalogItemId: number) {
  if (compareIds.value.has(catalogItemId)) {
    compareIds.value.delete(catalogItemId);
    compareIds.value = new Set(compareIds.value);
    if (!isAuthenticated.value) {
      try {
        const stored = localStorage.getItem('compare');
        const ids: number[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem('compare', JSON.stringify(ids.filter((id) => id !== catalogItemId)));
      } catch {}
      return;
    }
    try { await removeFromCompare(catalogItemId); } catch {}
  } else {
    compareIds.value.add(catalogItemId);
    compareIds.value = new Set(compareIds.value);
    if (!isAuthenticated.value) {
      try {
        const stored = localStorage.getItem('compare');
        const ids: number[] = stored ? JSON.parse(stored) : [];
        if (!ids.includes(catalogItemId)) localStorage.setItem('compare', JSON.stringify([...ids, catalogItemId]));
      } catch {}
      return;
    }
    try { await addToCompare(catalogItemId); } catch {}
  }
}

onMounted(async () => {
  await Promise.all([load(), loadFavorites()]);
  selectedIds.value = items.value.map((i) => i.id);

  if (!isAuthenticated.value) {
    try {
      const stored = localStorage.getItem('compare');
      const ids: number[] = stored ? JSON.parse(stored) : [];
      compareIds.value = new Set(ids);
    } catch {}
  }
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

function goToCheckout() {
  if (!isAuthenticated.value) {
    const { openAuthModal } = useAuthModal();
    openAuthModal();
    return;
  }

  const { saveOrder } = useCheckoutOrder();
  const toSave = selectedItems.value.length > 0 ? selectedItems.value : items.value;
  saveOrder(
    toSave.map((i) => ({
      id: i.id,
      catalogItemId: i.catalogItemId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }))
  );
  router.push('/checkout');
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
