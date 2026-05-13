<template>
  <div class="services-page">
    <div v-if="error" class="error">Ошибка: {{ error.message }}</div>

    <template v-else>
      <Navigate :items="breadcrumbsItems" />

      <div class="sorts">
        <template v-if="loading">
          <div class="skeleton-search left-sort" />
          <div class="right-sort">
            <div class="sort-order-by">
              <div class="skeleton-sort" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="top-bur">
            <div class="header__search left-sort">
              <input
                  v-model="searchQuery"
                  class="header__search-input search_text"
                  type="text"
                  placeholder="Поиск по услугам"
                  @input="onSearchInput"
              >
              <img class="header__search-icon" src="/icons/search.svg" alt="search">
            </div>
            <div class="right-sort">
              <div class="sort-order-by">
                <SortSelect
                    label="Категория"
                    :options="groupSortOptions"
                    :model-value="selectedGroupId ?? ''"
                    @update:model-value="selectGroup"
                />
              </div>
            </div>
          </div>
        </template>
      </div>

      <EmptyState
          v-if="items.length === 0 && !loadingItems"
          title="Ничего не найдено"
          subtitle="Попробуйте изменить критерии поиска"
      />

      <div v-else class="services-grid" :class="{ loading: loadingItems }">
        <template v-if="loadingItems">
          <div v-for="i in limit" :key="i" class="skeleton-card">
            <div class="skeleton-img" />
            <div class="skeleton-name" />
            <div class="skeleton-desc" />
          </div>
        </template>
        <template v-else>
          <ServiceCard
              v-for="item in items"
              :key="item.id"
              :name="item.name"
              :short-description="item.short_description"
              :img-link="item.img_link"
          />
        </template>
      </div>

      <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="changePage"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import type { Service, ServiceGroup } from '~/types/product';
import { getServices } from '~/services/productApi';

const route = useRoute();
const router = useRouter();

const breadcrumbsItems = computed(() => [
  { to: '/', text: 'Главная' },
  { to: '/services', text: 'Услуги' }
]);

const items = ref<Service[]>([]);
const groups = ref<ServiceGroup[]>([]);
const loadingItems = ref(true);
const loading = ref(true);
const error = ref<Error | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(12);
const selectedGroupId = ref<number | null>(null);
const searchQuery = ref('');
const currentSort = ref<string | number>('');
const sortOptions = [
  { value: '', label: 'По умолчанию' },
  { value: 'name', label: 'По названию' },
];

const groupSortOptions = computed(() => {
  const opts: { value: string | number; label: string }[] = [{ value: '', label: 'Все услуги' }];
  groups.value.forEach(g => {
    opts.push({ value: g.id, label: `${g.name} (${g.service_count})` });
  });
  return opts;
});

onMounted(() => {
  if (route.query.group) selectedGroupId.value = Number(route.query.group);
  if (route.query.search) searchQuery.value = route.query.search as string;
  if (route.query.page) currentPage.value = Number(route.query.page);
  fetchServices().finally(() => { loading.value = false; });
});

let isUpdatingFromInternalChange = false;

function syncUrl() {
  isUpdatingFromInternalChange = true;
  const query: Record<string, string> = {};
  if (selectedGroupId.value !== null) query.group = String(selectedGroupId.value);
  if (searchQuery.value) query.search = searchQuery.value;
  if (currentPage.value > 1) query.page = String(currentPage.value);
  router.push({ query });
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    syncUrl();
    fetchServices();
  }, 600);
}

function selectSort(value: string | number | null) {
  currentSort.value = value ?? '';
  syncUrl();
  fetchServices();
}

function selectGroup(value: string | number | null) {
  selectedGroupId.value = value === '' || value === null ? null : Number(value);
  currentPage.value = 1;
  syncUrl();
  fetchServices();
}

function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  syncUrl();
  fetchServices();
}

watch(() => route.query, () => {
  if (isUpdatingFromInternalChange) {
    isUpdatingFromInternalChange = false;
    return;
  }
  selectedGroupId.value = route.query.group ? Number(route.query.group) : null;
  searchQuery.value = (route.query.search as string) ?? '';
  currentPage.value = route.query.page ? Number(route.query.page) : 1;
  fetchServices();
});

async function fetchServices() {
  loadingItems.value = true;
  error.value = null;
  try {
    const result = await getServices({
      service_group_id: selectedGroupId.value,
      search: searchQuery.value,
      page: currentPage.value,
      limit: limit.value,
    });
    items.value = result.items;
    groups.value = result.groups;
    totalPages.value = result.meta.total_pages;
  } catch (e: any) {
    error.value = e;
  } finally {
    loadingItems.value = false;
  }
}
</script>

<style scoped>
.services-page {
  padding: 0 70px;
  margin-bottom: 62px;
}

.search_text {
  @apply font-['NT_Somic'] font-medium text-[14px] content-center text-[var(--gray-light)];
}
.sorts {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
  margin-top: 36px;
}
.header__search-icon {
  @apply w-[20px] h-[20px];
}
.header__search {
  @apply flex justify-between items-center px-[26px] h-[51px] rounded-[8px] bg-[var(--gray)] gap-[20px];
  width: 307px;
}
.header__search-input {
  @apply w-full;
}
.header__search-input::placeholder {
  @apply text-[var(--gray-light)];
}

.right-sort {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sort-order-by {
  flex-wrap: wrap;
  display: flex;
  gap: 12px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.services-grid.loading {
  opacity: 0.6;
  pointer-events: none;
}

.skeleton-search {
  height: 51px;
  width: 307px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
  flex-shrink: 0;
}
.skeleton-sort {
  height: 45px;
  width: 195px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

@keyframes sk-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton-card {
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}
.skeleton-img {
  height: 180px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}
.skeleton-name {
  height: 16px;
  width: 60%;
  margin: 16px 14px 0 19px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}
.skeleton-desc {
  height: 13px;
  width: 80%;
  margin: 8px 14px 22px 19px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

.error {
  padding: 40px;
  text-align: center;
  color: var(--error);
}
.top-bur{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
@media (max-width: 1100px) {
  .services-page {
    padding: 0 37px;
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 744px) {
  .services-page {
    padding: 0 20px;
    margin-bottom: 58px;
  }
  .header__search {
    width: 100%;
  }
  .services-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  .top-bur{
    flex-direction: column;
    gap: 13px;
  }
}
</style>
