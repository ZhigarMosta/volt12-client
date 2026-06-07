<template>
  <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 1 ${height}`"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ marginTop: marginTop, display: 'block' }"
  >
    <line x1="0" :y1="getHalfHeight()" x2="1" :y2="getHalfHeight()" :stroke="color" :stroke-width="getHalfHeight() * 2" vector-effect="non-scaling-stroke"/>
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