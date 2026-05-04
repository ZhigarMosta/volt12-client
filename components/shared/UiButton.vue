<template>
  <NuxtLink
      v-if="to"
      :to="to"
      :class="btnClass"
  >
    <slot />
  </NuxtLink>
  <button
      v-else
      :class="btnClass"
      @click="handleClick"
  >
    <slot />
  </button> 
</template>

<script setup lang="ts">

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}

const props = withDefaults(defineProps<{
  to?: string
  variant?: 'red' | 'white'
  size?: 'sm' | 'lg'
  fullWidth?: boolean
  verticalSpacing?: 'default' | 'compact'
}>(), {
  verticalSpacing: 'default'
})

const btnClass = computed(() => [
  'ui-btn',
  `ui-btn--${props.variant}`,
  `ui-btn--${props.size}`,
  `ui-btn--${props.verticalSpacing}`,
  { 'ui-btn--full': props.fullWidth }
])
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
  background: var(--red);
  color: var(--gray);
}

.ui-btn--red:hover {
  background: var(--red-dark);
  color: var(--gray);
}

.ui-btn--white {
  background: var(--white);
  color: var(--black);
}

.ui-btn--white:hover {
  background: var(--gray-border);
  color: var(--black);
}

.ui-btn--sm {
  padding-left: 31px;
  padding-right: 31px;
}

.ui-btn--lg {
  padding-left: 68px;
  padding-right: 68px;
}

.ui-btn--full {
  width: 100%;
}

.ui-btn--default {
  padding-top: 10px;
  padding-bottom: 10px;
}

.ui-btn--compact {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
