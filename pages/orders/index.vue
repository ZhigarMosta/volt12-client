<template>
  <div class="orders-page">
    <Navigate :items="breadcrumbsItems" />

    <div class="orders-header">
      <h1 class="orders-title">История заказов</h1>
      <span v-if="meta && meta.total > 0" class="orders-count">{{ meta.total }} {{ pluralize(meta.total) }}</span>
    </div>

    <div v-if="loading" class="orders-skeleton">
      <div v-for="i in 3" :key="i" class="sk-item" />
    </div>

    <template v-else-if="orders.length">
      <div class="orders-list">
        <NuxtLink
          v-for="order in orders"
          :key="order.id"
          :to="`/orders/${order.id}`"
          class="order-card"
        >
          <!-- Top row: id + date + status -->
          <div class="order-card__top">
            <div class="order-card__id-wrap">
              <span class="order-card__id">Заказ #{{ order.id }}</span>
              <span class="order-card__date">{{ formatDate(order.created_at) }}</span>
            </div>
            <span class="order-card__badge" :class="`order-card__badge--${order.status}`">{{ statusLabel(order.status) }}</span>
          </div>

          <!-- Body: address + meta -->
          <div class="order-card__body">
            <div class="order-card__address">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0C3.69 0 1 2.69 1 6C1 10.5 7 16 7 16C7 16 13 10.5 13 6C13 2.69 10.31 0 7 0ZM7 8C5.9 8 5 7.1 5 6C5 4.9 5.9 4 7 4C8.1 4 9 4.9 9 6C9 7.1 8.1 8 7 8Z" fill="#B9B9B9"/>
              </svg>
              <span class="order-card__address-text">{{ formatAddress(order) }}</span>
            </div>

            <div class="order-card__meta">
              <span class="order-card__count">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="5" height="5" rx="1" stroke="#B9B9B9" stroke-width="1.5"/>
                  <rect x="8" y="1" width="5" height="5" rx="1" stroke="#B9B9B9" stroke-width="1.5"/>
                  <rect x="1" y="8" width="5" height="5" rx="1" stroke="#B9B9B9" stroke-width="1.5"/>
                  <rect x="8" y="8" width="5" height="5" rx="1" stroke="#B9B9B9" stroke-width="1.5"/>
                </svg>
                {{ order.items_count }} {{ pluralizeItems(order.items_count) }}
              </span>
            </div>
          </div>

          <!-- Bottom row: price + arrow -->
          <div class="order-card__bottom">
            <span class="order-card__price">{{ formatPrice(order.total_price) }}</span>
            <svg class="order-card__arrow" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L1 13" stroke="#B9B9B9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </NuxtLink>
      </div>

      <Pagination
        v-if="meta && meta.pages > 1"
        :current-page="currentPage"
        :total-pages="meta.pages"
        @change-page="loadPage"
      />
    </template>

    <EmptyState
      v-else-if="!loading"
      title="Заказов пока нет"
      subtitle="Оформите первый заказ из каталога"
      button-text="В каталог"
      :on-click="() => router.push('/catalog')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getOrders, type OrderListItem, type OrderListMeta } from '~/services/orderApi';
import { formatPrice } from '~/utils/format';

useHead({ title: 'История заказов — Мастер 12 Вольт' });

const router = useRouter();
const { isAuthenticated, loading: authLoading } = useAuth();

const breadcrumbsItems = [
  { to: '/', text: 'Главная' },
  { to: '/profile', text: 'Личный кабинет' },
  { to: '/orders', text: 'История заказов' },
];

const orders = ref<OrderListItem[]>([]);
const meta = ref<OrderListMeta | null>(null);
const loading = ref(true);
const currentPage = ref(1);

onMounted(() => {
  watch(authLoading, (isLoading) => {
    if (isLoading) return;
    if (!isAuthenticated.value) {
      router.push('/');
    } else {
      loadPage(1);
    }
  }, { immediate: true });
});

async function loadPage(page: number) {
  loading.value = true;
  try {
    const res = await getOrders(page);
    orders.value = res.orders;
    meta.value = res.meta;
    currentPage.value = page;
  } catch {
    orders.value = [];
  } finally {
    loading.value = false;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatAddress(order: OrderListItem) {
  const parts = [order.city, order.region, order.street, `д. ${order.house}`];
  if (order.entrance) parts.push(`подъезд ${order.entrance}`);
  if (order.apartment) parts.push(`кв. ${order.apartment}`);
  return parts.join(', ');
}

function pluralize(n: number) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'заказов';
  if (mod10 === 1) return 'заказ';
  if (mod10 >= 2 && mod10 <= 4) return 'заказа';
  return 'заказов';
}

function pluralizeItems(n: number) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'товаров';
  if (mod10 === 1) return 'товар';
  if (mod10 >= 2 && mod10 <= 4) return 'товара';
  return 'товаров';
}

// статусы соответствуют админ-панели: new / processing / done
const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  done: 'Выполнен',
};

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}
</script>

<style scoped>
.orders-page {
  padding: 0 70px 80px;
}

.orders-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 24px;
}

.orders-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 30px;
  color: var(--black);
}

.orders-count {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--red);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Card */
.order-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 24px;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  background: #fff;
  text-decoration: none;
  transition: box-shadow 0.15s, border-color 0.15s;
}

.order-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  border-color: rgba(185, 185, 185, 0.6);
}

/* Top */
.order-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.order-card__id-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.order-card__id {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--black);
}

.order-card__date {
  font-family: 'NT Somic', sans-serif;
  font-size: 13px;
  color: var(--gray-light);
}

.order-card__badge {
  font-family: 'NT Somic', sans-serif;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

.order-card__badge--new { background: #e3f2fd; color: #1565c0; }
.order-card__badge--processing { background: #fff3e0; color: #e65100; }
.order-card__badge--done { background: #e8f5e9; color: #2e7d32; }

/* Divider */
.order-card__top {
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(185, 185, 185, 0.25);
}

/* Body */
.order-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.order-card__address {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  flex: 1;
  min-width: 0;
}

.order-card__address svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.order-card__address-text {
  font-family: 'NT Somic', sans-serif;
  font-size: 13px;
  color: #6b6b6b;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-card__meta {
  flex-shrink: 0;
}

.order-card__count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'NT Somic', sans-serif;
  font-size: 13px;
  color: #6b6b6b;
}

/* Bottom */
.order-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid rgba(185, 185, 185, 0.25);
}

.order-card__price {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--black);
}

/* Skeleton */
.orders-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sk-item {
  height: 130px;
  border-radius: 16px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

@keyframes sk-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (max-width: 1100px) {
  .orders-page { padding: 0 37px 60px; }
}

@media (max-width: 744px) {
  .orders-page { padding: 0 20px 60px; }

  .order-card { padding: 16px; }

  .order-card__address-text {
    white-space: normal;
  }
}
</style>
