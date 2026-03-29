<template>
  <div class="catalog-page">
    <div v-if="pending" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error.message }}</div>
    <div v-else-if="!catalog" class="error">Каталог не найден</div>

    <template v-else>
      <H2 class="h2">{{ catalog.name }}</H2>

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
              v-for="(characteristics, groupName) in catalogCharacteristicWithGroup"
              :key="groupName"
              class="filter-group characteristic-with-groups"
          >
            <p class="filter-text filter-group">{{ groupName }} </p>
            <div v-for="characteristic in characteristics" :key="characteristic.id" class="filter-item">
              <FilterCheckbox
                  :name="characteristic.name"
                  :count="facetsCounts[characteristic.id] || 0"
                  :value="characteristic.id"
                  :checked="selectedGroupValues[groupName]?.includes(characteristic.id)"
                  @change="onGroupCheckboxChange(groupName, characteristic.id, $event)"
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
import type { Catalog, Product, Characteristic } from '~/types/product';

const route = useRoute();
const slug = route.params.slug as string;

const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);

const facetsCounts = ref<Record<number, number>>({});

const catalog = ref<Catalog | null>(null);
const catalogItems = ref<Product[]>([]);
const catalogCharacteristicWithoutGroup = ref<Characteristic[]>([]);
const catalogCharacteristicWithGroup = ref<Record<string, Characteristic[]>>({});

const selectedStandaloneIds = ref<number[]>([]);
const selectedGroupValues = ref<Record<string, number[]>>({});

const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(10);
const loadingItems = ref(false);

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

  try {
    const response: any = await $fetch('http://127.0.0.1:8000/volt12/catalog_items', {
      method: 'POST',
      body: {
        catalogId: catalog.value.id,
        filterGroups: filterGroups,
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

const onFilterChange = () => {
  currentPage.value = 1;
  fetchItems();
};

const onGroupCheckboxChange = (groupName: string, characteristicId: number, event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!selectedGroupValues.value[groupName]) {
    selectedGroupValues.value[groupName] = [];
  }

  if (target.checked) {
    if (!selectedGroupValues.value[groupName].includes(characteristicId)) {
      selectedGroupValues.value[groupName].push(characteristicId);
    }
  } else {
    selectedGroupValues.value[groupName] = selectedGroupValues.value[groupName].filter(
        id => id !== characteristicId
    );
  }

  onFilterChange();
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchItems();
};

const clearGroup = (groupName: string) => {
  selectedGroupValues.value[groupName] = [];
  onFilterChange();
};

watch(() => catalog.value, async (newCatalog) => {
  if (newCatalog) {
    selectedStandaloneIds.value = [];
    selectedGroupValues.value = {};
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

      await fetchItems();
    } catch (error) {
      console.error(error);
    }
  }
}, { immediate: true });
</script>

<style scoped>
.catalog-page {
  padding: 20px;
}

.h2 {
  margin-bottom: 29px;
}

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
