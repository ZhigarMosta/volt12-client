<template>
  <label class="wrapper-input">
    <input
        type="checkbox"
        :value="value"
        :checked="isChecked"
        @change="handleChange"
    >
    <p class="filter-text">{{ name }}<span class="count-badge">({{ count }})</span></p>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  name: string
  count?: number
  modelValue?: number[] // Массив выбранных ID
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
  change: [event: Event]
}>()

// Вычисляем, выбран ли текущий чекбокс
const isChecked = computed(() => {
  return props.modelValue?.includes(props.value) || false
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const currentValue = target.checked

  let newValue = [...(props.modelValue || [])]

  if (currentValue) {
    // Добавляем ID в массив, если его там нет
    if (!newValue.includes(props.value)) {
      newValue.push(props.value)
    }
  } else {
    // Удаляем ID из массива
    newValue = newValue.filter(id => id !== props.value)
  }

  // Обновляем v-model
  emit('update:modelValue', newValue)

  // Эмитим событие change для родителя
  emit('change', event)
}
</script>

<style scoped>
.wrapper-input {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 20px;
}

.count-badge {
  margin-left: 13px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--gray-light);
}

.filter-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--black);
}
</style>
