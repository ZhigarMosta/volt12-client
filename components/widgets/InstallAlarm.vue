<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 744
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <ActionBackground right-image="/images/install-alarm.png">
    <div class="left-side">
      <ActionTitle>Установка сигнавлизации с автозапуском</ActionTitle>
      <UiButton variant="white" size="lg" :full-width="isMobile">Записаться</UiButton>
    </div>
  </ActionBackground>
</template>

<style scoped>
.action-background{
  height: 247px;
}

.left-side{
  width: 100%;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  padding: 50px 0 50px 55px;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

@media (max-width: 744px) {
  .left-side{
    padding: 50px 55px;
    max-width: unset;
  }
}
</style>