<template>
  <NuxtLink class="mobile-button" :to="props.to">
    <NuxtImg
      :src="icon"
      width="29"
      height="29"
      :alt="alt"
      class="mobile-button-icon"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.mobile-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>