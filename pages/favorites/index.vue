<template>
  <div class="fav-page">
    <Navigate :items="breadcrumbsItems" />

    <div class="fav-header">
      <h1 class="fav-title">Избранное</h1>
      <span v-if="items.length" class="fav-count">{{ countLabel }}</span>
    </div>

    <div v-if="loading" class="fav-skeleton">
      <div class="sk-topbar" />
      <div v-for="i in 3" :key="i" class="sk-item" />
    </div>

    <template v-else-if="items.length">
      <div class="fav-topbar">
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

      <div class="fav-items">
        <FavoriteItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          :checked="selectedIds.includes(item.id)"
          @toggle="toggleSelect(item.id)"
          @remove="removeItem(item.id)"
          @add-to-cart="addItemToCart(item.catalogItemId)"
        />
      </div>
    </template>

    <EmptyState
      v-else-if="!loading"
      title="Избранное пусто"
      subtitle="Добавьте товары из каталога"
      button-text="В каталог"
      :on-click="goToCatalog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFavorites } from '~/utils/favorites';
import { addToCart } from '~/services/cartApi';

useHead({ title: 'Избранное — Мастер 12 Вольт' });

const router = useRouter();

const breadcrumbsItems = [
  { to: '/', text: 'Главная' },
  { to: '/favorites', text: 'Избранное' },
];

const { items, loading, load, removeItem, removeItems } = useFavorites();

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

const selectedItems = computed(() =>
  items.value.filter((i) => selectedIds.value.includes(i.id))
);

const countLabel = computed(() => {
  const n = items.value.length;
  const mod10 = n % 10;
  const mod100 = n % 100;
  let form: string;
  if (mod100 >= 11 && mod100 <= 14) form = 'товаров';
  else if (mod10 === 1) form = 'товар';
  else if (mod10 >= 2 && mod10 <= 4) form = 'товара';
  else form = 'товаров';
  return `${n} ${form}`;
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

async function addItemToCart(catalogItemId: number) {
  try {
    await addToCart(catalogItemId);
  } catch {}
}

function goToCatalog() {
  router.push('/catalog');
}
</script>

<style scoped>
.fav-page {
  padding: 0 70px 80px;
}

.fav-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 22px;
}

.fav-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: var(--black);
}

.fav-count {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--red);
}

/* Top bar */
.fav-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f8f8;
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

/* Items list */
.fav-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Skeleton */
.fav-skeleton {
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

@media (max-width: 1100px) {
  .fav-page {
    padding: 0 37px 60px;
  }
}

@media (max-width: 744px) {
  .fav-page {
    padding: 0 20px 60px;
  }
}
</style>
