<template>
  <div class="catalog-page">
    <div v-if="pending" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error.message }}</div>
    <div v-else-if="!catalog" class="error">Каталог не найден</div>

    <template v-else>
      <H2 class="h2">{{ catalog.name }}</H2>

<!--      &lt;!&ndash; Хлебные крошки фильтров &ndash;&gt;-->
<!--      <div v-if="activeFiltersBreadcrumbs.length > 0" class="filters-breadcrumbs">-->
<!--        <span class="breadcrumbs-title">Фильтры:</span>-->
<!--        <div class="breadcrumbs-list">-->
<!--          <span-->
<!--              v-for="(breadcrumb, index) in activeFiltersBreadcrumbs"-->
<!--              :key="breadcrumb.key + '-' + breadcrumb.value + '-' + breadcrumb.groupId"-->
<!--              class="breadcrumb-item"-->
<!--          >-->
<!--            <span class="breadcrumb-label">{{ breadcrumb.label }}</span>-->
<!--            <button-->
<!--                class="breadcrumb-remove"-->
<!--                @click="removeFilter(breadcrumb.key, breadcrumb.value, breadcrumb.groupId)"-->
<!--                aria-label="Удалить фильтр"-->
<!--            >-->
<!--              ×-->
<!--            </button>-->
<!--          </span>-->
<!--        </div>-->
<!--        <button class="clear-all-filters" @click="clearAllFilters">-->
<!--          Очистить все-->
<!--        </button>-->
<!--      </div>-->

      <div class="wrapper">
        <div class="filters-column">
          <p class="filter-text filter-group">Цена</p>
          <div class="price-inputs">
            <InputNumber
                v-model="minPrice"
                prefix="От"
                placeholder="0 руб"
            />
            <InputNumber
                v-model="maxPrice"
                prefix="До"
                placeholder="0 руб"
            />
          </div>
          <Divider
              width="292"
              height="1"
              color="#B9B9B9"
          />
          <div v-if="catalogCharacteristicWithoutGroup.length" class="characteristic-without-groups">
            <div v-for="characteristic in catalogCharacteristicWithoutGroup" :key="characteristic.id" class="filter-item">
              <FilterCheckbox
                  :name="characteristic.name"
                  :count="facetsCounts[characteristic.id] || 0"
                  :value="characteristic.id"
                  v-model="selectedStandaloneIds"
                  @change="onFilterChange"
              />
              <Divider
                  width="292"
                  height="1"
                  color="#B9B9B9"
              />
            </div>
          </div>
          <Divider
              width="292"
              height="1"
              color="#B9B9B9"
              margin-top="24px"
          />
          <div
              v-for="group in catalogCharacteristicWithGroup"
              :key="group.id"
              class="filter-group characteristic-with-groups"
          >
            <p class="filter-text filter-group">{{ group.name }} </p>
            <div v-for="characteristic in group.items" :key="characteristic.id" class="filter-item">
              <FilterCheckbox
                  :name="characteristic.name"
                  :count="facetsCounts[characteristic.id] || 0"
                  :value="characteristic.id"
                  :model-value="selectedGroupValues[group.id] || []"
                  @update:model-value="selectedGroupValues[group.id] = $event"
                  @change="onFilterChange"
              />
            </div>
            <Divider
                width="292"
                height="1"
                color="#B9B9B9"
                margin-top="24px"
            />
          </div>
        </div>

        <div class="items-column">
          <div v-if="loadingItems" class="loading-overlay">Обновление...</div>

          <div v-if="catalogItems.length === 0 && !loadingItems" class="no-items">Товары не найдены</div>

          <div class="products-grid">
            <CatalogItem
                v-for="item in catalogItems"
                :key="item.id"
                :images="item.catalogItemImages"
                :title="item.name"
                :subtitle="item.product_code"
                :price="item.price"
            />
          </div>

          <div v-if="totalPages > 1" class="pagination">
            <button
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                class="page-btn"
            >
              &laquo;
            </button>

            <span class="page-info">
               Стр. {{ currentPage }} из {{ totalPages }}
            </span>

            <button
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
                class="page-btn"
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Catalog, Product, Characteristic, CharacteristicGroup } from '~/types/product';

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;

const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);

const facetsCounts = ref<Record<number, number>>({});

const catalog = ref<Catalog | null>(null);
const catalogItems = ref<Product[]>([]);
const catalogCharacteristicWithoutGroup = ref<Characteristic[]>([]);
const catalogCharacteristicWithGroup = ref<CharacteristicGroup[]>([]);

const selectedStandaloneIds = ref<number[]>([]);
const selectedGroupValues = ref<Record<number, number[]>>({});

const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);
const loadingItems = ref(false);

// Вспомогательные функции для работы с URL фильтрами
const parseFiltersFromUrl = () => {
  const query = route.query;
  const urlStandaloneIds: number[] = [];
  const urlGroupValues: Record<number, number[]> = {};
  let urlMinPrice: number | null = null;
  let urlMaxPrice: number | null = null;

  // Парсим standalone фильтры (обычные характеристики)
  // Формат: filters[standalone]=101,102
  const standaloneParam = query['filters[standalone]'];
  if (standaloneParam) {
    if (typeof standaloneParam === 'string') {
      urlStandaloneIds.push(...standaloneParam.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id)));
    } else if (Array.isArray(standaloneParam)) {
      standaloneParam.forEach(param => {
        if (typeof param === 'string') {
          urlStandaloneIds.push(...param.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id)));
        }
      });
    }
  }

  // Парсим групповые фильтры (характеристики в группах)
  // Формат: filters[group_10]=1,2 (где 10 - ID группы)
  Object.entries(query).forEach(([key, value]) => {
    const groupMatch = key.match(/^filters\[group_(\d+)\]$/);
    if (groupMatch && value) {
      const groupId = parseInt(groupMatch[1], 10);
      if (!isNaN(groupId)) {
        if (typeof value === 'string') {
          urlGroupValues[groupId] = value.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        } else if (Array.isArray(value)) {
          urlGroupValues[groupId] = value.flatMap(v =>
              typeof v === 'string' ? v.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id)) : []
          );
        }
      }
    }
  });

  // Парсим цену
  // Формат: price_min=1000, price_max=5000
  if (query.price_min) {
    const parsed = parseInt(query.price_min as string, 10);
    if (!isNaN(parsed)) {
      urlMinPrice = parsed;
    }
  }
  if (query.price_max) {
    const parsed = parseInt(query.price_max as string, 10);
    if (!isNaN(parsed)) {
      urlMaxPrice = parsed;
    }
  }

  return {
    standaloneIds: urlStandaloneIds,
    groupValues: urlGroupValues,
    minPrice: urlMinPrice,
    maxPrice: urlMaxPrice
  };
};

const buildUrlFilters = () => {
  const query: Record<string, string> = {};

  // Добавляем standalone фильтры (сортируем по убыванию)
  if (selectedStandaloneIds.value.length > 0) {
    const sortedIds = [...selectedStandaloneIds.value].sort((a, b) => b - a);
    query['filters[standalone]'] = sortedIds.join(',');
  }

  // Добавляем групповые фильтры (по ID группы)
  Object.entries(selectedGroupValues.value).forEach(([groupId, values]) => {
    if (values.length > 0) {
      query[`filters[group_${groupId}]`] = values.join(',');
    }
  });

  // Добавляем цену
  if (minPrice.value !== null) {
    query['price_min'] = minPrice.value.toString();
  }
  if (maxPrice.value !== null) {
    query['price_max'] = maxPrice.value.toString();
  }

  return query;
};

const updateUrlFilters = () => {
  const filterParams = buildUrlFilters();

  router.push({
    query: {
      ...route.query,
      ...filterParams,
      page: currentPage.value > 1 ? currentPage.value.toString() : undefined
    }
  });
};

// Вычисляемое свойство для хлебных крошек фильтров
const activeFiltersBreadcrumbs = computed(() => {
  const breadcrumbs: Array<{ key: string; value: number | null; groupId: number | null; label: string }> = [];

  // Добавляем фильтр по минимальной цене
  if (minPrice.value !== null) {
    breadcrumbs.push({
      key: 'minPrice',
      value: null,
      groupId: null,
      label: `От ${minPrice.value} ₽`
    });
  }

  // Добавляем фильтр по максимальной цене
  if (maxPrice.value !== null) {
    breadcrumbs.push({
      key: 'maxPrice',
      value: null,
      groupId: null,
      label: `До ${maxPrice.value} ₽`
    });
  }

  // Добавляем standalone фильтры
  selectedStandaloneIds.value.forEach(id => {
    const characteristic = catalogCharacteristicWithoutGroup.value.find(c => c.id === id);
    if (characteristic) {
      breadcrumbs.push({
        key: 'standalone',
        value: id,
        groupId: null,
        label: characteristic.name
      });
    }
  });

  // Добавляем групповые фильтры
  Object.entries(selectedGroupValues.value).forEach(([groupIdStr, values]) => {
    const groupId = parseInt(groupIdStr, 10);
    const group = catalogCharacteristicWithGroup.value.find(g => g.id === groupId);
    if (group) {
      values.forEach(id => {
        const characteristic = group.items.find(c => c.id === id);
        if (characteristic) {
          breadcrumbs.push({
            key: `group_${groupId}`,
            value: id,
            groupId: groupId,
            label: `${group.name}: ${characteristic.name}`
          });
        }
      });
    }
  });

  return breadcrumbs;
});

const removeFilter = (key: string, value: number | null, groupId: number | null = null) => {
  if (key === 'standalone' && value !== null) {
    selectedStandaloneIds.value = selectedStandaloneIds.value.filter(id => id !== value);
  } else if (key.startsWith('group_') && groupId !== null && value !== null) {
    selectedGroupValues.value[groupId] = (selectedGroupValues.value[groupId] || []).filter(id => id !== value);
  } else if (key === 'minPrice') {
    minPrice.value = null;
  } else if (key === 'maxPrice') {
    maxPrice.value = null;
  }
  currentPage.value = 1;
  // Не вызываем updateUrlFilters здесь, так как watch отследит изменение и обновит URL
};

const clearAllFilters = () => {
  selectedStandaloneIds.value = [];
  selectedGroupValues.value = {};
  currentPage.value = 1;
  // Не вызываем updateUrlFilters здесь, так как watch отследит изменение и обновит URL
};

const { data: catalogsData, error: fetchError, pending } = await useFetch<Catalog[]>('http://127.0.0.1:8000/volt12/catalogs');

const error = ref<Error | null>(null);

watchEffect(() => {
  if (fetchError.value) {
    error.value = fetchError.value;
  }
});

watchEffect(() => {
  if (catalogsData.value) {
    catalog.value = catalogsData.value.find(c => c.slug === slug) || null;
  }
});

const fetchItems = async () => {
  if (!catalog.value) return;

  loadingItems.value = true;

  const groupedFilters = Object.values(selectedGroupValues.value).filter(group => group.length > 0);
  const standaloneFilters = selectedStandaloneIds.value.map(id => [id]);
  const filterGroups = [...groupedFilters, ...standaloneFilters];

  // Формируем фильтр цены
  const priceFilter: { min?: number; max?: number } = {};
  if (minPrice.value !== null) {
    priceFilter.min = minPrice.value;
  }
  if (maxPrice.value !== null) {
    priceFilter.max = maxPrice.value;
  }

  try {
    const response: any = await $fetch('http://127.0.0.1:8000/volt12/catalog_items', {
      method: 'POST',
      body: {
        catalogId: catalog.value.id,
        filterGroups: filterGroups,
        price: Object.keys(priceFilter).length > 0 ? priceFilter : null,
        page: currentPage.value,
        limit: limit.value
      }
    });

    if (response.items) {
      catalogItems.value = response.items;
    } else {
      catalogItems.value = [];
    }

    if (response.facets) {
      facetsCounts.value = response.facets;
    } else {
      facetsCounts.value = {};
    }

    if (response.meta) {
      totalItems.value = response.meta.total_items;
      totalPages.value = response.meta.total_pages;
      currentPage.value = response.meta.current_page;
    }

  } catch (e) {
    console.error(e);
  } finally {
    loadingItems.value = false;
  }
};

// Обработчик изменения фильтров - просто сбрасываем страницу на 1
// Watch автоматически обновит URL при изменении selectedStandaloneIds или selectedGroupValues
const onFilterChange = () => {
  currentPage.value = 1;
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  // Watch автоматически обновит URL при изменении currentPage
};

const clearGroup = (groupId: number) => {
  selectedGroupValues.value[groupId] = [];
  onFilterChange();
};

// Watch для каталога - инициализация фильтров из URL
watch(() => catalog.value, async (newCatalog) => {
  if (newCatalog) {
    currentPage.value = 1;
    catalogItems.value = [];
    totalItems.value = 0;

    try {
      const characteristicRes: any = await $fetch('http://127.0.0.1:8000/volt12/catalog_characteristics', {
        method: 'POST',
        body: { catalogId: newCatalog.id }
      });

      catalogCharacteristicWithoutGroup.value = characteristicRes.without_group;
      catalogCharacteristicWithGroup.value = characteristicRes.with_group;

      // Парсим фильтры из URL после загрузки характеристик
      const { standaloneIds, groupValues, minPrice: urlMinPrice, maxPrice: urlMaxPrice } = parseFiltersFromUrl();
      selectedStandaloneIds.value = standaloneIds;
      selectedGroupValues.value = groupValues;
      minPrice.value = urlMinPrice;
      maxPrice.value = urlMaxPrice;

      // Загружаем товары с фильтрами
      await fetchItems();
    } catch (error) {
      console.error(error);
    }
  }
}, { immediate: true });

// Watch для изменений в URL (back/forward navigation)
watch(() => route.query, async (newQuery, oldQuery) => {
  if (!oldQuery) return; // Пропускаем первую инициализацию

  // Проверяем, изменились ли фильтры или страница
  const oldFilters = Object.keys(oldQuery).filter(k => k.startsWith('filters[') || k === 'price_min' || k === 'price_max');
  const newFilters = Object.keys(newQuery).filter(k => k.startsWith('filters[') || k === 'price_min' || k === 'price_max');

  const filtersChanged = JSON.stringify(oldFilters.map(k => oldQuery[k])) !== JSON.stringify(newFilters.map(k => newQuery[k]));
  const pageChanged = newQuery.page !== oldQuery.page;

  if (filtersChanged || pageChanged) {
    // Парсим новые фильтры из URL
    const { standaloneIds, groupValues, minPrice: urlMinPrice, maxPrice: urlMaxPrice } = parseFiltersFromUrl();

    // Обновляем состояние фильтров
    selectedStandaloneIds.value = standaloneIds;
    selectedGroupValues.value = groupValues;
    minPrice.value = urlMinPrice;
    maxPrice.value = urlMaxPrice;

    // Обновляем страницу из URL
    const urlPage = newQuery.page ? parseInt(newQuery.page as string, 10) : 1;
    if (!isNaN(urlPage) && urlPage > 0) {
      currentPage.value = urlPage;
    }

    // Загружаем товары с новыми фильтрами
    await fetchItems();
  }
}, { deep: true });

// Watch для отслеживания изменений фильтров и страницы для обновления URL
watch([selectedStandaloneIds, selectedGroupValues, currentPage], ([newStandalone, newGroups, newPage], [oldStandalone, oldGroups, oldPage]) => {
  // Пропускаем первую инициализацию
  if (!oldStandalone && !oldGroups) return;

  // Обновляем URL при изменении фильтров или страницы
  const filterParams = buildUrlFilters();

  // Очищаем старые параметры фильтров в query
  const cleanQuery = { ...route.query };
  Object.keys(cleanQuery).forEach(key => {
    if (key.startsWith('filters[') || key === 'price_min' || key === 'price_max') {
      delete cleanQuery[key];
    }
  });

  router.push({
    query: {
      ...cleanQuery,
      ...filterParams,
      page: newPage > 1 ? newPage.toString() : undefined
    }
  });
}, { deep: true });

// Watch для отслеживания изменений цены
watch([minPrice, maxPrice], ([newMin, newMax], [oldMin, oldMax]) => {
  // Пропускаем первую инициализацию
  if (oldMin === undefined && oldMax === undefined) return;

  currentPage.value = 1;

  // Обновляем URL с новыми параметрами цены
  const filterParams = buildUrlFilters();

  // Очищаем старые параметры фильтров в query
  const cleanQuery = { ...route.query };
  Object.keys(cleanQuery).forEach(key => {
    if (key.startsWith('filters[') || key === 'price_min' || key === 'price_max') {
      delete cleanQuery[key];
    }
  });

  router.push({
    query: {
      ...cleanQuery,
      ...filterParams,
      page: undefined
    }
  });

  fetchItems();
}, { deep: true });
</script>

<style scoped>
.catalog-page {
  padding: 20px;
}

.h2 {
  margin-bottom: 29px;
}

/* Хлебные крошки фильтров
.filters-breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.breadcrumbs-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  margin-right: 5px;
}

.breadcrumbs-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 13px;
  color: var(--black);
  font-family: 'NT Somic', sans-serif;
}

.breadcrumb-label {
  white-space: nowrap;
}

.breadcrumb-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: #666;
  transition: background 0.2s;
}

.breadcrumb-remove:hover {
  background: #d0d0d0;
}

.clear-all-filters {
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: #dc3545;
  font-size: 13px;
  cursor: pointer;
  font-family: 'NT Somic', sans-serif;
  text-decoration: underline;
  transition: opacity 0.2s;
}

.clear-all-filters:hover {
  opacity: 0.8;
}*/

.wrapper {
  display: flex;
  gap: 20px;
}

.filters-column {
  border-radius: 8px;
  width: 330px;
  background: var(--gray);
  padding: 17px 15px 32px 15px;
}

.items-column {
  flex: 1;
  position: relative;
}

.filter-item:last-child .divider,
.filter-group:last-child .divider {
  display: none;
}

.characteristic-with-groups {
  margin-top: 24px;
}

.characteristic-without-groups {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--black);
}

.filter-group {
  margin-bottom: 18px;
}

.price-inputs {
  display: flex;
  gap: 5px;
  margin-bottom: 24px;
}

.filter-item {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.no-items {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.page-btn {
  padding: 5px 15px;
  cursor: pointer;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: bold;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-style: italic;
  z-index: 10;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #666;
}

.error {
  padding: 40px;
  text-align: center;
  color: #dc3545;
}

@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
  }

  .filters-column {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
</style>
