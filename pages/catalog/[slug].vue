<template>
  <div class="catalog-page">
    <div v-if="pending" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error.message }}</div>
    <div v-else-if="!catalog" class="error">Каталог не найден</div>

    <template v-else>
      <Navigate :items="breadcrumbsItems" />
      <div class="sorts">
        <div class="header__search left-sort">
          <input
            v-model="searchQuery"
            class="header__search-input search_text"
            type="text"
            placeholder="Поиск по сайту"
          >
          <img class="header__search-icon" src="../../public/icons/search.svg" alt="search">
        </div>
        <div class="right-sort">
          <div class="sort-order-by">
            <button class="sort">
              <p class="sort-text">Акции</p>
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.07088 0.292915C7.68035 -0.097609 7.04719 -0.097609 6.65666 0.292915L0.292702 6.65688C-0.0978227 7.0474 -0.0978227 7.68057 0.292702 8.07109C0.683226 8.46161 1.31639 8.46161 1.70692 8.07109L7.36377 2.41424L13.0206 8.07109C13.4111 8.46161 14.0443 8.46161 14.4348 8.07109C14.8254 7.68057 14.8254 7.0474 14.4348 6.65688L8.07088 0.292915ZM7.36377 1.00012H8.36377V1.00002H7.36377H6.36377V1.00012H7.36377Z" fill="#B9B9B9" />
              </svg>
            </button>
            <button class="sort">
              <p class="sort-text">Акции</p>
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.07088 0.292915C7.68035 -0.097609 7.04719 -0.097609 6.65666 0.292915L0.292702 6.65688C-0.0978227 7.0474 -0.0978227 7.68057 0.292702 8.07109C0.683226 8.46161 1.31639 8.46161 1.70692 8.07109L7.36377 2.41424L13.0206 8.07109C13.4111 8.46161 14.0443 8.46161 14.4348 8.07109C14.8254 7.68057 14.8254 7.0474 14.4348 6.65688L8.07088 0.292915ZM7.36377 1.00012H8.36377V1.00002H7.36377H6.36377V1.00012H7.36377Z" fill="#B9B9B9" />
              </svg>
            </button>
            <button class="sort">
              <p class="sort-text">Акции</p>
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.07088 0.292915C7.68035 -0.097609 7.04719 -0.097609 6.65666 0.292915L0.292702 6.65688C-0.0978227 7.0474 -0.0978227 7.68057 0.292702 8.07109C0.683226 8.46161 1.31639 8.46161 1.70692 8.07109L7.36377 2.41424L13.0206 8.07109C13.4111 8.46161 14.0443 8.46161 14.4348 8.07109C14.8254 7.68057 14.8254 7.0474 14.4348 6.65688L8.07088 0.292915ZM7.36377 1.00012H8.36377V1.00002H7.36377H6.36377V1.00012H7.36377Z" fill="#B9B9B9" />
              </svg>
            </button>
          </div>
          <button class="mobile">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="8" fill="#E2000F" />
              <rect x="11" y="26.8889" width="11" height="2.44444" rx="1.22222" fill="#F8F8F8" />
              <rect x="11" y="20.7778" width="17.1111" height="2.44444" rx="1.22222" fill="#F8F8F8" />
              <rect x="11" y="14.6666" width="22" height="2.44444" rx="1.22222" fill="#F8F8F8" />
            </svg>
          </button>
        </div>
      </div>
      <FiltersBreadcrumbs
          :breadcrumbs="activeFiltersBreadcrumbs"
          @remove="removeFilter"
          @clear-all="clearAllFilters"
      />

      <div class="wrapper">
        <CatalogFilters
            class="catalog-filters"
            :loading="loadingFilters"
            :min-price="minPrice"
            :max-price="maxPrice"
            :catalog-characteristic-without-group="catalogCharacteristicWithoutGroup"
            :catalog-characteristic-with-group="catalogCharacteristicWithGroup"
            :selected-standalone-ids="selectedStandaloneIds"
            :selected-group-values="selectedGroupValues"
            :facets-counts="facetsCounts"
            @update:min-price="minPrice = $event"
            @update:max-price="maxPrice = $event"
            @update:standalone="selectedStandaloneIds = $event"
            @update:group="(groupId, value) => selectedGroupValues[groupId] = value"
            @filter-change="onFilterChange"
        />

        <div class="items-column">
          <div v-if="loadingItems" class="loading-overlay"></div>

          <div v-if="catalogItems.length === 0 && !loadingItems" class="no-items">Товары не найдены</div>

          <div class="products-grid">
            <template v-if="loadingItems">
              <div
                  v-for="i in limit"
                  :key="i"
                  class="skeleton-card"
              >
                <div class="skeleton-card-title" />
                <div class="skeleton-card-image" />
                <div class="skeleton-card-price" />
              </div>
            </template>
            <template v-else>
              <CatalogItem
                  v-for="item in catalogItems"
                  :key="item.id"
                  :images="item.catalogItemImages"
                  :title="item.name"
                  :subtitle="item.product_code"
                  :price="item.price"
              />
            </template>
          </div>

          <Pagination
              v-if="totalPages > 1"
              :current-page="currentPage"
              :total-pages="totalPages"
              @change-page="changePage"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Catalog, Product, Characteristic, CharacteristicGroup, CatalogItemsFilters, CatalogItemsResponse } from '~/types/product';
import { getCatalogs, getCatalogCharacteristics, getCatalogItems } from '~/services/productApi';

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;

const breadcrumbsItems = computed(() => [
  { to: '/', text: 'Главная' },
  { to: '/catalog', text: 'Каталог' }
]);

const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);
const searchQuery = ref<string>('');

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
const limit = ref(2);
const loadingItems = ref(false);
const loadingFilters = ref(false);

const debouncedTime = 600;

// Вспомогательные функции для работы с URL фильтрами
const parseFiltersFromUrl = () => {
  const query = route.query;
  const urlStandaloneIds: number[] = [];
  const urlGroupValues: Record<number, number[]> = {};
  let urlMinPrice: number | null = null;
  let urlMaxPrice: number | null = null;
  let urlSearchQuery: string = '';

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
  // Формат: filters[10]=1,2 (где 10 - ID группы)
  Object.entries(query).forEach(([key, value]) => {
    const groupMatch = key.match(/^filters\[(\d+)\]$/);
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

  // Парсим поисковый запрос
  // Формат: search=запрос
  if (query.search) {
    urlSearchQuery = query.search as string;
  }

  return {
    standaloneIds: urlStandaloneIds,
    groupValues: urlGroupValues,
    minPrice: urlMinPrice,
    maxPrice: urlMaxPrice,
    searchQuery: urlSearchQuery
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
      query[`filters[${groupId}]`] = values.join(',');
    }
  });

  // Добавляем цену
  if (minPrice.value !== null) {
    query['price_min'] = minPrice.value.toString();
  }
  if (maxPrice.value !== null) {
    query['price_max'] = maxPrice.value.toString();
  }

  // Добавляем поисковый запрос
  if (searchQuery.value) {
    query['search'] = searchQuery.value;
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

const { data: catalogsData, error: fetchError, pending } = await useAsyncData('catalogs', () => getCatalogs());

const error = computed(() => fetchError.value ? new Error(fetchError.value.message) : null);

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

  const filters: CatalogItemsFilters = {
    catalogId: catalog.value.id,
    limit: limit.value,
    page: currentPage.value,
    filterGroups: filterGroups.length > 0 ? filterGroups : undefined,
    price: Object.keys(priceFilter).length > 0 ? priceFilter : undefined,
    search: searchQuery.value || undefined
  };

  try {
    const response = await getCatalogItems(filters);

    catalogItems.value = response.items || [];

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
    catalogItems.value = [];
    totalItems.value = 0;
    loadingFilters.value = true;

    try {
      const characteristics = await getCatalogCharacteristics(newCatalog.id);

      catalogCharacteristicWithoutGroup.value = characteristics.without_group;
      catalogCharacteristicWithGroup.value = characteristics.with_group;

      // Парсим фильтры из URL после загрузки характеристик
      const { standaloneIds, groupValues, minPrice: urlMinPrice, maxPrice: urlMaxPrice, searchQuery: urlSearchQuery } = parseFiltersFromUrl();
      selectedStandaloneIds.value = standaloneIds;
      selectedGroupValues.value = groupValues;
      minPrice.value = urlMinPrice;
      maxPrice.value = urlMaxPrice;
      searchQuery.value = urlSearchQuery || '';

      // Парсим страницу из URL
      const urlPage = route.query.page ? parseInt(route.query.page as string, 10) : 1;
      currentPage.value = !isNaN(urlPage) && urlPage > 0 ? urlPage : 1;

      // Загружаем товары с фильтрами
      await fetchItems();

      loadingFilters.value = false;

      // Помечаем, что начальная загрузка завершена
      isInitialLoadComplete = true;
    } catch (error) {
      console.error(error);
      loadingFilters.value = false;
    }
  }
}, { immediate: true });

// Флаг для отслеживания, было ли изменение URL вызвано нашим router.push
let isUpdatingFromInternalChange = false;

// Флаг для отслеживания завершения начальной инициализации
let isInitialLoadComplete = false;

// Debounce функция для отложенного выполнения
const debounce = <T extends (...args: any[]) => Promise<any>>(fn: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};

// Функция для обновления URL и загрузки данных при изменении фильтров
const updateFiltersUrlAndFetch = async () => {
  // Обновляем URL при изменении фильтров или страницы
  const filterParams = buildUrlFilters();

  // Очищаем старые параметры фильтров в query
  const cleanQuery = { ...route.query };
  Object.keys(cleanQuery).forEach(key => {
    if (key.startsWith('filters[') || key === 'price_min' || key === 'price_max') {
      delete cleanQuery[key];
    }
  });

  isUpdatingFromInternalChange = true;
  await router.push({
    query: {
      ...cleanQuery,
      ...filterParams,
      page: currentPage.value > 1 ? currentPage.value.toString() : undefined
    }
  });

  // Загружаем данные после обновления URL
  await fetchItems();
};

// Debounced версия функции обновления фильтров (debouncedTime задержка)
const debouncedUpdateFiltersUrlAndFetch = debounce(updateFiltersUrlAndFetch, debouncedTime);

// Функция для обновления URL и загрузки данных при изменении цены
const updatePriceUrlAndFetch = async () => {
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

  isUpdatingFromInternalChange = true;
  await router.push({
    query: {
      ...cleanQuery,
      ...filterParams,
      page: undefined
    }
  });

  // Загружаем данные после обновления URL
  await fetchItems();
};

// Debounced версия функции обновления цены (debouncedTime задержка)
const debouncedUpdatePriceUrlAndFetch = debounce(updatePriceUrlAndFetch, debouncedTime);

// Функция для обновления URL и загрузки данных при изменении поискового запроса
const updateSearchUrlAndFetch = async () => {
  currentPage.value = 1;

  // Обновляем URL с поисковым запросом
  const cleanQuery = { ...route.query };
  Object.keys(cleanQuery).forEach(key => {
    if (key.startsWith('filters[') || key === 'price_min' || key === 'price_max' || key === 'search') {
      delete cleanQuery[key];
    }
  });

  isUpdatingFromInternalChange = true;
  await router.push({
    query: {
      ...cleanQuery,
      ...(searchQuery.value ? { search: searchQuery.value } : {}),
      page: undefined
    }
  });

  // Загружаем данные после обновления URL
  await fetchItems();
};

// Debounced версия функции поиска (debouncedTime задержка)
const debouncedUpdateSearchUrlAndFetch = debounce(updateSearchUrlAndFetch, debouncedTime);

// Watch для изменений в URL (back/forward navigation)
watch(() => route.query, async (newQuery, oldQuery) => {
  if (!oldQuery) return; // Пропускаем первую инициализацию

  // Если изменение вызвано нашим router.push, пропускаем
  if (isUpdatingFromInternalChange) {
    isUpdatingFromInternalChange = false;
    return;
  }

  // Проверяем, изменились ли фильтры, поиск или страница
  const oldFilters = Object.keys(oldQuery).filter(k => k.startsWith('filters[') || k === 'price_min' || k === 'price_max' || k === 'search');
  const newFilters = Object.keys(newQuery).filter(k => k.startsWith('filters[') || k === 'price_min' || k === 'price_max' || k === 'search');

  const filtersChanged = JSON.stringify(oldFilters.map(k => oldQuery[k])) !== JSON.stringify(newFilters.map(k => newQuery[k]));
  const pageChanged = newQuery.page !== oldQuery.page;
  const searchChanged = newQuery.search !== oldQuery.search;

  if (filtersChanged || pageChanged || searchChanged) {
    // Парсим новые фильтры из URL
    const { standaloneIds, groupValues, minPrice: urlMinPrice, maxPrice: urlMaxPrice, searchQuery: urlSearchQuery } = parseFiltersFromUrl();

    // Обновляем состояние фильтров
    selectedStandaloneIds.value = standaloneIds;
    selectedGroupValues.value = groupValues;
    minPrice.value = urlMinPrice;
    maxPrice.value = urlMaxPrice;
    searchQuery.value = urlSearchQuery || '';

    // Обновляем страницу из URL
    const urlPage = newQuery.page ? parseInt(newQuery.page as string, 10) : 1;
    if (!isNaN(urlPage) && urlPage > 0) {
      currentPage.value = urlPage;
    }

    // Загружаем товары с новыми фильтрами
    await fetchItems();
  }
}, { deep: true });

// Watch для отслеживания изменений фильтров и страницы — обновляет URL и загружает данные с debouncing
watch([selectedStandaloneIds, selectedGroupValues, currentPage], ([newStandalone, newGroups, newPage], [oldStandalone, oldGroups, oldPage]) => {
  // Пропускаем первую инициализацию и начальную загрузку
  if ((!oldStandalone && !oldGroups) || !isInitialLoadComplete) return;

  // Запускаем debounced функцию обновления URL и загрузки
  debouncedUpdateFiltersUrlAndFetch();
}, { deep: true });

// Watch для отслеживания изменений цены — обновляет URL и загружает данные с debouncing
watch([minPrice, maxPrice], ([newMin, newMax], [oldMin, oldMax]) => {
  // Пропускаем первую инициализацию и начальную загрузку
  if ((oldMin === undefined && oldMax === undefined) || !isInitialLoadComplete) return;

  // Пропускаем, если значения не изменились
  if (newMin === oldMin && newMax === oldMax) return;

  // Запускаем debounced функцию обновления URL и загрузки
  debouncedUpdatePriceUrlAndFetch();
}, { deep: true });

// Watch для отслеживания изменений поискового запроса — обновляет URL и загружает данные с debouncing
watch(searchQuery, () => {
  // Пропускаем начальную загрузку
  if (!isInitialLoadComplete) return;

  // Запускаем debounced функцию обновления URL и загрузки
  debouncedUpdateSearchUrlAndFetch();
});
</script>

<style scoped>
.search_text {
  @apply font-['NT_Somic'] font-medium text-[14px] content-center text-[#b9b9b9];
}
.sorts{
  display: flex;
  justify-content: space-between;

  margin-bottom: 20px;
}
.sort-order-by{
  flex-wrap: wrap;
  display: flex;
  gap: 12px;
}
.header__search-icon{
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
  @apply text-[#b9b9b9];
}

.sort{
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 150px;
  padding: 16px 20px;
  background: var(--gray);
  border-radius: 8px;
}
.sort-text{
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
}
.catalog-page {
  padding: 0 70px;
  margin-bottom: 62px;
}

.wrapper {
  display: flex;
  gap: 20px;
}

.items-column {
  flex: 1;
  position: relative;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(267px, 1fr));
  gap: 20px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.no-items {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.skeleton-card {
  width: 100%;
  max-width: 267px;
  border-radius: 16px;
  border: 1px solid rgba(185, 185, 185, 0.38);
  padding: 15px 17px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.skeleton-card-title {
  height: 14px;
  width: 60%;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #e8e8e8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-card-image {
  height: 138px;
  border-radius: 8px;
  background: linear-gradient(90deg, #e0e0e0 25%, #e8e8e8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-card-price {
  height: 20px;
  width: 80px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #e8e8e8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
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
.mobile{
  display: none;
}
@media (max-width: 1100px) {
  .mobile{
    display: block;
  }
  .right-sort{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .sorts{
    flex-direction: column;
    gap: 20px;
  }
  .header__search{
    width: 100%;
  }
  .catalog-filters{
    display: none;
  }

  .catalog-page {
    padding: 0 37px;
  }
}

@media (max-width: 744px) {
  .sort{
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: max-content;
    padding: 16px 20px;
    background: var(--gray);
    border-radius: 8px;
    gap: 8px;
  }
  .catalog-page {
    padding: 0 20px;
    margin-bottom: 58px;
  }
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 428px) {
  .products-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
