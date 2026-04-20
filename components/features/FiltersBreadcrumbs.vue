<template>
  <div v-if="breadcrumbs.length > 0 || loading" class="filters-breadcrumbs">
    <template v-if="loading">
      <div class="skeleton-title" />
      <div class="skeleton-pill" />
      <div class="skeleton-pill" />
      <div class="skeleton-pill" />
    </template>
    <template v-else>
      <span class="breadcrumbs-title">Примененные фильтры</span>
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
          ><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M0.3 0H2.175L3.915 2.28L5.67 0H7.515L4.845 3.48L7.815 7.365H5.94L3.885 4.68L1.83 7.365H0L2.97 3.51L0.3 0Z"
                  fill="#2D2D2D"/>
            </svg>
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
  background: var(--gray-lighter);
  border-radius: 8px;
}

.breadcrumbs-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
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
  gap: 10px;
  padding: 8px 10px 8px 20px;
  background: var(--white);
  border: 1px solid var(--gray-light);
  border-radius: 100px;
}

.breadcrumb-label {
  white-space: nowrap;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--black);
}

.breadcrumb-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: var(--gray-shimmer);
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: var(--gray-dark);
  transition: background 0.2s;
}

.breadcrumb-remove:hover {
  background: var(--gray-hover);
}

.clear-all-filters {
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: var(--error);
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
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-pill {
  height: 28px;
  width: 80px;
  border-radius: 16px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
