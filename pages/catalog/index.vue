<template>
  <div class="catalogs-container">
    <div v-if="pending">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error.message }}</div>

    <div v-else class="list catalog-list">
      <div
          v-for="catalog in catalogs"
          :key="catalog.id"
          @click="openCatalog(catalog.id)"
          :class="['list-item', { active: currentCatalogId === catalog.id }]"
      >
        {{ catalog.name }}
      </div>
    </div>

    <div v-if="currentCatalogId" class="wrapper">
      <div class="filters-column">
        <h3>Фильтры</h3>

        <div v-if="catalogCharacteristicWithoutGroup.length">
          <h4>Общие</h4>
          <div v-for="characteristic in catalogCharacteristicWithoutGroup" :key="characteristic.id" class="filter-item">
            <label>
              <input
                  type="checkbox"
                  :value="characteristic.id"
                  v-model="selectedStandaloneIds"
                  @change="onFilterChange"
              >
              {{ characteristic.name }}
            </label>
          </div>
        </div>

        <div
            v-for="(characteristics, groupName) in catalogCharacteristicWithGroup"
            :key="groupName"
            class="filter-group"
        >
          <h4>{{ groupName }}</h4>

          <div
              v-if="selectedGroupValues[groupName]"
              @click="clearGroup(groupName)"
              class="reset-link"
          >
            Сбросить выбор
          </div>

          <div v-for="characteristic in characteristics" :key="characteristic.id" class="filter-item">
            <label>
              <input
                  type="radio"
                  :name="'group_' + groupName"
                  :value="characteristic.id"
                  v-model="selectedGroupValues[groupName]"
                  @change="onFilterChange"
              >
              {{ characteristic.name }}
            </label>
          </div>
        </div>
      </div>

      <div class="items-column">
        <h3>Товары ({{ totalItems }})</h3>

        <div v-if="loadingItems" class="loading-overlay">Обновление...</div>

        <div v-if="catalogItems.length === 0 && !loadingItems">Товары не найдены</div>

        <div v-for="item in catalogItems" :key="item.id" class="product-card">
          <strong>{{ item.name }}</strong>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Catalog { id: number; name: string; }
interface Characteristic { id: number; name: string; }

const { data: catalogs, error, pending } = await useFetch<Catalog[]>('http://127.0.0.1:8000/volt12/catalogs');

const catalogItems = ref<any[]>([]);
const catalogCharacteristicWithoutGroup = ref<Characteristic[]>([]);
const catalogCharacteristicWithGroup = ref<Record<string, Characteristic[]>>({});

const currentCatalogId = ref<number | null>(null);

const selectedStandaloneIds = ref<number[]>([]);
const selectedGroupValues = ref<Record<string, number | null>>({});

const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const limit = ref(1);
const loadingItems = ref(false);

const fetchItems = async () => {
  if (currentCatalogId.value === null) return;

  loadingItems.value = true;

  const allSelectedIds = [
    ...selectedStandaloneIds.value,
    ...Object.values(selectedGroupValues.value).filter(id => id !== null && id !== undefined)
  ];

  try {
    const response: any = await $fetch('http://127.0.0.1:8000/volt12/catalog_items', {
      method: 'POST',
      body: {
        catalogId: currentCatalogId.value,
        characteristicIds: allSelectedIds,
        page: currentPage.value,
        limit: limit.value
      }
    });

    if (response.items) {
      catalogItems.value = response.items;
    } else {
      catalogItems.value = Array.isArray(response) ? response : [];
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
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchItems();
}

const clearGroup = (groupName: string) => {
  selectedGroupValues.value[groupName] = null;
  onFilterChange();
}

const openCatalog = async (catalogId: number) => {
  currentCatalogId.value = catalogId;

  selectedStandaloneIds.value = [];
  selectedGroupValues.value = {};
  currentPage.value = 1;
  catalogItems.value = [];
  totalItems.value = 0;

  try {
    const characteristicRes: any = await $fetch('http://127.0.0.1:8000/volt12/catalog_characteristics', {
      method: 'POST',
      body: { catalogId: catalogId }
    });

    catalogCharacteristicWithoutGroup.value = characteristicRes.without_group;
    catalogCharacteristicWithGroup.value = characteristicRes.with_group;

    await fetchItems();

  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.wrapper { display: flex; gap: 20px; margin-top: 20px; }
.filters-column { width: 300px; border-right: 1px solid #ccc; padding-right: 15px; }
.items-column { flex: 1; }
.catalogs-container { padding: 20px; }
.catalog-list { display: flex; flex-wrap: wrap; border-bottom: 2px solid #eee; margin-bottom: 20px; }
.list-item { padding: 8px 15px; cursor: pointer; border-radius: 4px; margin-right: 5px; }
.list-item:hover { background-color: #f0f0f0; }
.list-item.active { background-color: #007bff; color: white; }
.filter-group { margin-top: 20px; padding-bottom: 10px; border-bottom: 1px dashed #eee; }
.filter-item { margin-top: 5px; }
h4 { margin: 0 0 10px 0; font-size: 16px; color: #333; }
label { cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; }
.reset-link { font-size: 12px; color: #dc3545; cursor: pointer; margin-bottom: 5px; text-decoration: underline; }
.reset-link:hover { text-decoration: none; }

.product-card {
  padding: 10px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  border-radius: 4px;
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
  color: #666;
  font-style: italic;
  margin-bottom: 10px;
}
</style>
