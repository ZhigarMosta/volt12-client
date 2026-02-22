<template>
  <component
      :is="to ? 'NuxtLink' : 'button'"
      :to="to"
      class="ui-btn"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
defineProps<{
  to?: string
}>()
</script>

<style scoped>
.ui-btn {
  background: #333;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: inline-block;
  font-family: inherit;
  font-size: 1rem;
}

.ui-btn:hover {
  background: #444;
}
</style>
