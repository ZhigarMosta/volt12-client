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
  <ActionBackground class="action-background" right-image="/images/alarm-selection.png">
    <div class="left-side">
      <ActionTitle class="alarm-select-action-title">запишись на бесплатный подбор сигнализации к твоему авто</ActionTitle>
      <p class="alarm-select-description">наши специалисты подбирают охранные комплексы исходя из индивидуальных особенностей и слабых сторон модели автомобиля</p>
      <UiButton class="alarm-select-btn" variant="white" size="lg" :full-width="isMobile">Записаться</UiButton>
    </div>
  </ActionBackground>
</template>

<style scoped>
.alarm-select-btn {
  margin-top: 55px;
}
.alarm-select-action-title {
  margin-top: 18px;
}
.alarm-select-description {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  text-transform: lowercase;
  color: var(--gray);
  opacity: 0.7;
  max-width: 574px;
  margin-top: 18px;
}
.action-background{
  height: 360px;
}

.left-side{
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 75px 0 60px 55px;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

@media (max-width: 1100px) {
  .left-side{
    padding: 75px 55px 60px 55px;
    max-width: unset;
  }
  .alarm-select-btn {
    margin-top: 31px;
  }
  .alarm-select-action-title {
    margin-top: 14px;
  }
  .action-background{
    height: 100%;
    max-height: 434px;
  }
}
@media (max-width: 744px) {
  .left-side{
    padding: 47px 45px 47px 45px;
  }
  .alarm-select-btn {
    margin-top: 27px;
  }
  .alarm-select-action-title {
    margin-top: 15px;
  }
  .alarm-select-description {
    font-size: 12px;
  }
  .action-background{
    height: 100%;
    max-height: 450px;
  }
}
</style>