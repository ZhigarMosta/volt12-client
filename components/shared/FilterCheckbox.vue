<template>
  <label class="wrapper-input" @click="toggle">
    <div class="checkbox-box">
      <svg v-if="isChecked" width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 12L5.3375 5.85086L0.2625 0H3.55833L7.175 4.17591L10.6167 0H13.7667L8.60417 5.85086L14 12H10.7042L6.825 7.52581L3.2375 12H0Z" fill="var(--red)" />
      </svg>
    </div>
    <p class="filter-text">{{ name }}<span class="count-badge">({{ count }})</span></p>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: number
  name: string
  count?: number
  modelValue?: number[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
  change: [event: Event]
}>()

const isChecked = computed(() => {
  return props.modelValue?.includes(props.value) || false
})

const toggle = () => {
  let newValue = [...(props.modelValue || [])]

  if (isChecked.value) {
    newValue = newValue.filter(id => id !== props.value)
  } else {
    if (!newValue.includes(props.value)) {
      newValue.push(props.value)
    }
  }

  emit('update:modelValue', newValue)

  emit('change', new Event('change'))
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

.checkbox-box {
  width: 20px;
  height: 20px;
  border: 1px solid var(--gray-light);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
