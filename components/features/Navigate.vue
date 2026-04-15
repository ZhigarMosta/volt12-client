
<template>
  <nav class="navigate-breadcrumbs">
    <template v-for="(item, index) in items" :key="index">
      <NavigateItem :to="item.to" :text="item.text" />
      <span v-if="index < items.length - 1" class="separator">/</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface NavigateItem {
  to: string;
  text: string;
}

const props = defineProps<{
  items: NavigateItem[];
}>();
</script>

<style scoped>
.navigate-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 30px 0 25px 0;
}

.separator {
  color: var(--gray-light);
}
</style>