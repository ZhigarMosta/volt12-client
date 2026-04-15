

<template>
  <NuxtLink :to="to" class="navigate-item">
    {{text}}
  </NuxtLink>
</template>

<script setup lang="ts">

const props = defineProps<{
  text: string;
  to: string;
}>();
</script>

<style scoped>
.navigate-item{
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-light);
}
</style>