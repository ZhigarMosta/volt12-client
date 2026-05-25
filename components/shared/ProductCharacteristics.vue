<template>
  <div class="characteristics-list">
    <div
        v-for="characteristic in characteristics"
        :key="characteristic.id"
        class="characteristic-row"
    >
      <span class="characteristic-name">{{ characteristic.name }}:</span>
      <span class="characteristic-leader" aria-hidden="true"/>
      <span class="characteristic-value">{{ characteristic.exist ? 'Да' : 'Нет' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductCharacteristic } from '~/types/product';

defineProps<{
  characteristics: ProductCharacteristic[];
}>();
</script>

<style scoped>
.characteristics-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.characteristic-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
}

.characteristic-name {
  flex-shrink: 0;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: normal;
  color: var(--gray-light, #b9b9b9);
  white-space: nowrap;
}

.characteristic-leader {
  flex: 1;
  min-width: 8px;
  border-bottom: 1px dotted rgba(185, 185, 185, 0.6);
  margin-bottom: 3px;
}

.characteristic-value {
  flex-shrink: 0;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: normal;
  color: var(--black, #2d2d2d);
  white-space: nowrap;
}
</style>
