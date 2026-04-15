<template>
  <div class="filters-column">
    <template v-if="loading">
      <div class="skeleton-title" />
      <div class="skeleton-price-row">
        <div class="skeleton-input" />
        <div class="skeleton-input" />
      </div>
      <div class="skeleton-divider" />
      <div class="skeleton-checkboxes">
        <div v-for="i in 4" :key="i" class="skeleton-checkbox-row">
          <div class="skeleton-checkbox" />
          <div class="skeleton-text" />
        </div>
      </div>
    </template>
    <template v-else>
      <p class="filter-text filter-group">Цена</p>
      <div class="price-inputs">
        <InputNumber
            :model-value="localMinPrice"
            @update:model-value="localMinPrice = $event"
            prefix="От"
            placeholder="0 руб"
        />
        <InputNumber
            :model-value="localMaxPrice"
            @update:model-value="localMaxPrice = $event"
            prefix="До"
            placeholder="0 руб"
        />
      </div>
      <Divider
          v-if="catalogCharacteristicWithoutGroup.length"
          width="292"
          height="1"
          color="#B9B9B9"
      />
      <div v-if="catalogCharacteristicWithoutGroup.length" class="characteristic-without-groups">
        <div
            v-for="(characteristic, index) in catalogCharacteristicWithoutGroup"
            :key="characteristic.id"
            class="filter-item"
        >
          <FilterCheckbox
              :name="characteristic.name"
              :count="facetsCounts[characteristic.id] || 0"
              :value="characteristic.id"
              :model-value="selectedStandaloneIds"
              @update:model-value="$emit('update:standalone', $event)"
              @change="$emit('filter-change')"
          />
          <Divider
              v-if="index < catalogCharacteristicWithoutGroup.length - 1"
              width="292"
              height="1"
              color="#B9B9B9"
          />
        </div>
      </div>
      <Divider
          v-if="catalogCharacteristicWithGroup.length"
          width="292"
          height="1"
          color="#B9B9B9"
          margin-top="24px"
      />
      <div
          v-for="(group, groupIndex) in catalogCharacteristicWithGroup"
          :key="group.id"
          class="filter-group characteristic-with-groups"
      >
        <p class="filter-text filter-group">{{ group.name }} </p>
        <div
            v-for="(characteristic, index) in group.items"
            :key="characteristic.id"
            class="filter-item"
        >
          <FilterCheckbox
              :name="characteristic.name"
              :count="facetsCounts[characteristic.id] || 0"
              :value="characteristic.id"
              :model-value="selectedGroupValues[group.id] || []"
              @update:model-value="$emit('update:group', group.id, $event)"
              @change="$emit('filter-change')"
          />
        </div>
        <Divider
            v-if="groupIndex < catalogCharacteristicWithGroup.length - 1"
            width="292"
            height="1"
            color="#B9B9B9"
            margin-top="24px"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Characteristic, CharacteristicGroup } from '~/types/product';

const props = defineProps<{
  loading?: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  catalogCharacteristicWithoutGroup: Characteristic[];
  catalogCharacteristicWithGroup: CharacteristicGroup[];
  selectedStandaloneIds: number[];
  selectedGroupValues: Record<number, number[]>;
  facetsCounts: Record<number, number>;
}>();

const emit = defineEmits<{
  'update:minPrice': [value: number | null];
  'update:maxPrice': [value: number | null];
  'update:standalone': [value: number[]];
  'update:group': [groupId: number, value: number[]];
  'filter-change': [];
}>();

const localMinPrice = computed({
  get: () => props.minPrice,
  set: (value) => emit('update:minPrice', value)
});

const localMaxPrice = computed({
  get: () => props.maxPrice,
  set: (value) => emit('update:maxPrice', value)
});
</script>

<style scoped>
.filters-column {
  border-radius: 8px;
  width: 330px;
  background: var(--gray);
  padding: 17px 15px;
  height: max-content;
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

/* Skeleton */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-title {
  height: 18px;
  width: 60px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e0e0e0 25%, #e8e8e8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 18px;
}

.skeleton-price-row {
  display: flex;
  gap: 5px;
  margin-bottom: 24px;
}

.skeleton-input {
  flex: 1;
  height: 40px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e0e0e0 25%, #e8e8e8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-divider {
  height: 1px;
  background: #e0e0e0;
  margin-bottom: 24px;
}

.skeleton-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.skeleton-checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skeleton-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  flex-shrink: 0;
  background: linear-gradient(90deg, #e0e0e0 25%, #e8e8e8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  height: 15px;
  width: 60%;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #e8e8e8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
