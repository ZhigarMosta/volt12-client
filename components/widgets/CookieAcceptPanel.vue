<template>
  <div v-if="isNotAccepted" class="cookie-panel">
    <p class="cookie-title">Сайт использует cookies</p>
    <p class="cookie-text">Сообщаем, что сайт использует файлы cookies</p>
    <div class="cookie-buttons">
      <UiButton variant="red" size="sm" @click="acceptCookies">Понятно</UiButton>
      <NuxtLink to="/privacy-policy" class="cookie-link">Подробнее</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const COOKIE_KEY = 'cookie-consent-expiry'
const oneMonth = 60 * 60 * 24 * 30 * 1000

const isNotAccepted = ref(false)

onMounted(() => {
  const expiry = localStorage.getItem(COOKIE_KEY)
  isNotAccepted.value = expiry ? Date.now() > Number(expiry) : true
})

const acceptCookies = () => {
  localStorage.setItem(COOKIE_KEY, String(Date.now() + oneMonth))
  isNotAccepted.value = false
}
</script>

<style scoped>
.cookie-panel {
  position: fixed;
  width: 392px;
  padding-left: 31px;
  padding-top: 26px;
  padding-bottom: 26px;
  background: var(--white);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 12;
  bottom: 40px;
  left: 40px;
}

.cookie-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.2;
  color: var(--black);
  margin: 0;
}

.cookie-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.4;
  color: var(--gray-dark);
  margin: 0;
}

.cookie-buttons {
  display: flex;
  align-items: center;
  gap: 21px;
}

.cookie-link {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  opacity: 0.7;
  transition: opacity 0.2s ease;
}
</style>