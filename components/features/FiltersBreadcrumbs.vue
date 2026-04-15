<template>
  <div v-if="breadcrumbs.length > 0 || loading" class="filters-breadcrumbs">
    <template v-if="loading">
      <div class="skeleton-title" />
      <div class="skeleton-pill" />
      <div class="skeleton-pill" />
      <div class="skeleton-pill" />
    </template>
    <template v-else>
      <span class="breadcrumbs-title">Фильтры:</span>
      <div class="breadcrumbs-list">
        <span
            v-for="breadcrumb in breadcrumbs"
            :key="breadcrumb.key + '-' + breadcrumb.value + '-' + breadcrumb.groupId"
            class="breadcrumb-item"
        >
          <span class="breadcrumb-label">{{ breadcrumb.label }}</span>
          <button
              class="breadcrumb-remove"
              @click="$emit('remove', breadcrumb.key, breadcrumb.value, breadcrumb.groupId)"
              aria-label="Удалить фильтр"
          >
            ×
          </button>
        </span>
      </div>
      <button class="clear-all-filters" @click="$emit('clear-all')">
        Очистить все
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
type Breadcrumb = {
  key: string;
  value: number | null;
  groupId: number | null;
  label: string;
};

defineProps<{
  breadcrumbs: Breadcrumb[];
  loading?: boolean;
}>();

defineEmits<{
  remove: [key: string, value: number | null, groupId: number | null];
  'clear-all': [];
}>();
</script>

<style scoped>
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
}

/* Skeleton */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-title {
  height: 14px;
  width: 70px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #e8e8e8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-pill {
  height: 28px;
  width: 80px;
  border-radius: 16px;
  background: linear-gradient(90deg, #e0e0e0 25%, #e8e8e8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
