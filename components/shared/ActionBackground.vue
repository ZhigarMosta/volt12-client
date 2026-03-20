<script setup lang="ts">
defineProps<{
  rightImage?: string
}>()
</script>

<template>
  <div class="action-background">
    <div class="action-background__container">
      <slot/>
      <img 
        v-if="rightImage" 
        :src="rightImage" 
        alt="action-background-image"
        class="action-background__image"
      >
    </div>
  </div>
</template>

<style scoped>
.action-background{
  width: 100%;
  height: 100%;
  background-image: url("/images/action-background.svg");
  border-radius: 16px;
}

@media (min-width: 1440px) {
  .action-background{
    width: 100%;
    height: 100%;
    background-image: url("/images/action-background.svg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.action-background__container{
  display: flex;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.action-background__image {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 438px;
  width: auto;
  object-fit: cover;
}

@media (max-width: 1100px) {
  .action-background__image {
    display: none;
  }
}
</style>