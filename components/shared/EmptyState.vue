<template>
  <div class="empty-state">
    <p class="empty-title">{{ title }}</p>
    <p class="empty-subtitle">{{ subtitle }}</p>
    <button v-if="buttonText" class="empty-btn" @click="onClick">{{ buttonText }}</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  buttonText?: string
  onClick?: () => void
}>()
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 40px;
}
.empty-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
}
.empty-subtitle {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--gray-light);
  margin-top: 8px;
}
.empty-btn {
  border-radius: 8px;
  padding: 4px 21px 8px;
  background: var(--red);
  margin-top: 28px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--white);
  border: none;
  cursor: pointer;
}
</style>
