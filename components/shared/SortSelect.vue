<template>
  <div
      class="sort"
      @mouseenter="isOpen = true"
      @mouseleave="isOpen = false"
  >
    <div class="sort-view" :class="{ 'sort-border_off': isOpen }">
      <div class="sort-text-block">
        <p class="sort-text">{{ label }}</p>
        <p class="sort-text-select">{{ selectedLabel }}</p>
      </div>
      <svg
          v-if="showArrow"
          width="15"
          height="9"
          viewBox="0 0 15 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="{ 'sort-arrow-up': arrowUp, 'sort-arrow-down': arrowDown }"
      >
        <path
            d="M8.07088 0.292915C7.68035 -0.097609 7.04719 -0.097609 6.65666 0.292915L0.292702 6.65688C-0.0978227 7.0474 -0.0978227 7.68057 0.292702 8.07109C0.683226 8.46161 1.31639 8.46161 1.70692 8.07109L7.36377 2.41424L13.0206 8.07109C13.4111 8.46161 14.0443 8.46161 14.4348 8.07109C14.8254 7.68057 14.8254 7.0474 14.4348 6.65688L8.07088 0.292915ZM7.36377 1.00012H8.36377V1.00002H7.36377H6.36377V1.00012H7.36377Z"
            fill="var(--gray-light)"/>
      </svg>
    </div>
    <div class="sort-popover" :class="{ 'sort-popover_open': isOpen }">
      <div v-for="opt in availableOptions" :key="opt.value" class="sort-popover-content">
        <Divider class="sort-divider" width="160" height="1" color="var(--gray-light)" />
        <button class="sort-text-select" @click="select(opt.value)">
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface SortOption {
  value: string | number;
  label: string;
}

const props = defineProps<{
  label: string;
  options: SortOption[];
  modelValue?: string | number | null;
  showArrow?: boolean;
  arrowUp?: boolean;
  arrowDown?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null];
}>();

const isOpen = ref(false);

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue);
  return found ? found.label : (props.options[0]?.label ?? '');
});

const availableOptions = computed(() =>
    props.options.filter(o => o.value !== props.modelValue)
);

function select(value: string | number) {
  emit('update:modelValue', value);
  isOpen.value = false;
}
</script>

<style scoped>
.sort {
  position: relative;
}
.sort-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 195px;
  padding: 8px 17px;
  background: var(--gray);
  border-radius: 8px;
  cursor: pointer;
}
.sort-border_off {
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.sort-text-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sort-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 11px;
  color: var(--gray-light);
}
.sort-text-select {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
}
.sort-popover {
  padding: 0 20px 16px 20px;
  background: var(--gray);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  position: absolute;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 10;
  width: 195px;
}
.sort-popover.sort-popover_open {
  opacity: 1;
  visibility: visible;
}
.sort-divider {
  margin: 9px 0;
}
.sort-arrow-up {
  transform: rotate(0deg);
}
.sort-arrow-down {
  transform: rotate(180deg);
}
</style>
