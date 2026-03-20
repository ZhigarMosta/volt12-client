<template>
  <component
      :is="to ? 'NuxtLink' : 'button'"
      :to="to"
      :class="['ui-btn', `ui-btn--${variant}`, `ui-btn--${size}`, { 'ui-btn--full': fullWidth }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
defineProps<{
  to?: string
  variant?: 'red' | 'white'
  size?: 'sm' | 'lg'
  fullWidth?: boolean
}>()
</script>

<style scoped>
.ui-btn {
  text-decoration: none;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: inline-block;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  transition: background 200ms, color 200ms;
}

.ui-btn--red {
  background: #e2000f;
  color: #f8f8f8;
}

.ui-btn--red:hover {
  background: #c40713;
  color: #f8f8f8;
}

.ui-btn--white {
  background: #fff;
  color: #2d2d2d;
}

.ui-btn--white:hover {
  background: #ddd;
  color: #2d2d2d;
}

.ui-btn--sm {
  padding: 10px 31px;
}

.ui-btn--lg {
  padding: 10px 68px;
}

.ui-btn--full {
  width: 100%;
}
</style>
