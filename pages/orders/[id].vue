<template>
  <div class="order-page">
    <Navigate :items="breadcrumbsItems" />

    <div v-if="loading" class="order-skeleton">
      <div class="sk-header" />
      <div class="sk-body">
        <div class="sk-col">
          <div v-for="i in 4" :key="i" class="sk-line" />
        </div>
        <div class="sk-col">
          <div v-for="i in 3" :key="i" class="sk-item-row" />
        </div>
      </div>
    </div>

    <template v-else-if="order">
      <div class="order-header">
        <div class="order-header__left">
          <h1 class="order-title">Заказ #{{ order.id }}</h1>
          <span class="order-date">от {{ formatDate(order.created_at) }}</span>
        </div>
        <span class="order-status" :class="`order-status--${order.status}`">{{ statusLabel(order.status) }}</span>
      </div>

      <div class="order-layout">
        <!-- Details -->
        <div class="order-details">
          <p class="section-title">Информация о покупателе</p>
          <div class="detail-row">
            <span class="detail-label">Имя</span>
            <span class="detail-value">{{ order.first_name }} {{ order.last_name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Телефон</span>
            <span class="detail-value">{{ order.phone }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value">{{ order.email }}</span>
          </div>

          <p class="section-title">Адрес доставки</p>
          <div class="detail-row">
            <span class="detail-label">Город</span>
            <span class="detail-value">{{ order.city }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Область / район</span>
            <span class="detail-value">{{ order.region }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Индекс</span>
            <span class="detail-value">{{ order.postal_code }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Улица</span>
            <span class="detail-value">{{ order.street }}, д. {{ order.house }}<template v-if="order.entrance">, подъезд {{ order.entrance }}</template><template v-if="order.apartment">, кв. {{ order.apartment }}</template></span>
          </div>
          <div v-if="order.comment" class="detail-row">
            <span class="detail-label">Примечание</span>
            <span class="detail-value">{{ order.comment }}</span>
          </div>
        </div>

        <!-- Items -->
        <div class="order-items">
          <p class="section-title">Товары</p>
          <div class="item-list">
            <NuxtLink v-for="item in order.items" :key="item.catalog_item_id" :to="`/product/${item.slug}`" class="item-row">
              <img
                v-if="item.image"
                :src="`${apiBase}/${item.image.img_link}`"
                :alt="item.image.alt || item.name"
                class="item-img"
              />
              <div v-else class="item-img item-img--placeholder" />
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-qty">{{ item.quantity }} шт. × {{ formatPrice(item.price) }}</span>
              </div>
              <span class="item-total">{{ formatPrice(item.price * item.quantity) }}</span>
            </NuxtLink>
          </div>
          <div class="order-total">
            <span>Итого</span>
            <span class="order-total__price">{{ formatPrice(order.total_price) }}</span>
          </div>
        </div>
      </div>
    </template>

    <EmptyState
      v-else-if="!loading"
      title="Заказ не найден"
      subtitle="Возможно, он был удалён или вы перешли по неверной ссылке"
      button-text="К заказам"
      :on-click="() => router.push('/orders')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { getOrder, type OrderFull } from '~/services/orderApi';
import { formatPrice } from '~/utils/format';

const route = useRoute();
const router = useRouter();
const { isAuthenticated, loading: authLoading } = useAuth();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase as string;

const orderId = Number(route.params.id);

const order = ref<OrderFull | null>(null);
const loading = ref(true);

const breadcrumbsItems = computed(() => [
  { to: '/', text: 'Главная' },
  { to: '/profile', text: 'Личный кабинет' },
  { to: '/orders', text: 'История заказов' },
  { to: `/orders/${orderId}`, text: order.value ? `Заказ #${order.value.id}` : '...' },
]);

useHead({ title: computed(() => order.value ? `Заказ #${order.value.id} — Мастер 12 Вольт` : 'Заказ') });

onMounted(() => {
  watch(authLoading, async (isLoading) => {
    if (isLoading) return;
    if (!isAuthenticated.value) {
      router.push('/');
      return;
    }
    try {
      order.value = await getOrder(orderId);
    } catch {
      order.value = null;
    } finally {
      loading.value = false;
    }
  }, { immediate: true });
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}
</script>

<style scoped>
.order-page {
  padding: 0 70px 80px;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 12px;
}

.order-header__left {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.order-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 30px;
  color: var(--black);
}

.order-date {
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  color: var(--gray-light);
}

.order-status {
  font-family: 'NT Somic', sans-serif;
  font-weight: 600;
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 20px;
}

.order-status--new { background: #e3f2fd; color: #1565c0; }
.order-status--processing { background: #fff3e0; color: #e65100; }
.order-status--shipped { background: #f3e5f5; color: #6a1b9a; }
.order-status--delivered { background: #e8f5e9; color: #2e7d32; }
.order-status--cancelled { background: #ffebee; color: #c62828; }

.order-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: flex-start;
}

.section-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--black);
  margin-bottom: 16px;
}

.section-title:not(:first-child) {
  margin-top: 24px;
}

.detail-row {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(185, 185, 185, 0.25);
}

.detail-label {
  font-family: 'NT Somic', sans-serif;
  font-size: 13px;
  color: var(--gray-light);
  min-width: 140px;
  flex-shrink: 0;
}

.detail-value {
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  color: var(--black);
  font-weight: 500;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s;
}

.item-row:hover {
  background: #f0f0f0;
}

.item-img {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: contain;
  flex-shrink: 0;
}

.item-img--placeholder {
  background: rgba(185, 185, 185, 0.2);
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.item-name {
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-qty {
  font-family: 'NT Somic', sans-serif;
  font-size: 12px;
  color: var(--gray-light);
}

.item-total {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: var(--black);
  flex-shrink: 0;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px;
  border-top: 2px solid rgba(185, 185, 185, 0.38);
  font-family: 'NT Somic', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--black);
}

.order-total__price {
  font-size: 22px;
  font-weight: 700;
}

/* Skeleton */
.order-skeleton {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sk-header {
  height: 48px;
  border-radius: 10px;
  max-width: 360px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

.sk-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.sk-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sk-line {
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

.sk-item-row {
  height: 72px;
  border-radius: 10px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

@keyframes sk-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (max-width: 1100px) {
  .order-page { padding: 0 37px 60px; }
  .order-layout { grid-template-columns: 1fr; gap: 24px; }
  .sk-body { grid-template-columns: 1fr; }
}

@media (max-width: 744px) {
  .order-page { padding: 0 20px 60px; }
  .order-title { font-size: 22px; }
}
</style>
