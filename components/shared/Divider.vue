<template>
  <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ marginTop: marginTop }"
  >
    <path :d="`M0 ${getHalfHeight()}H${width}`" :stroke="color" :stroke-width="strokeWidth"/>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  width: number | string
  height: number | string
  color: string
  strokeWidth?: number
  marginTop?: string
}>()

const getHalfHeight = () => {
  const heightValue = typeof props.height === 'number' ? props.height : parseFloat(props.height)
  return heightValue / 2
}
</script>