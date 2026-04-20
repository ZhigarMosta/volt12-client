<template>
  <h2 class="action-title">
    <slot/>
  </h2>
</template>

<style scoped>
.action-title{
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: var(--white);
  text-transform: uppercase
}
@media (max-width: 744px) {
  .action-title {
    font-size: 20px;
  }
}
</style>
<script setup lang="ts">
</script>