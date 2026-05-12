<template>
  <label class="wrapper-input" @click="select">
    <div class="radio-circle">
      <div v-if="isSelected" class="radio-dot" />
    </div>
    <p class="filter-text">{{ name }}</p>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string
  name: string
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isSelected = computed(() => {
  return props.modelValue === props.value
})

const select = () => {
  emit('update:modelValue', props.value)
}
</script>

<style scoped>
.wrapper-input {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  height: 20px;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 1px solid var(--gray-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.radio-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--red);
}

.filter-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--black);
  white-space: nowrap;
}
</style>
