<template>
  <div class="cookie-panel">
    <p class="cookie-title">Сайт использует cookies</p>
    <p class="cookie-text">Сообщаем, что сайт использует файлы cookies</p>
    <div class="cookie-buttons">
      <button class="cookie-button" type="button" @click="handleAccept">Понятно</button>
      <a href="https://volt12.ru/privacy-policy/" class="cookie-link">Подробнее</a>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['accept'])

const handleAccept = () => {
  emit('accept')
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
  z-index: 200;
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

.cookie-button {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  width: 151px;
  height: 38px;
  background: var(--red);
  color: var(--white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cookie-button:hover {
  background: var(--red-dark);
}

.cookie-link {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  opacity: 0.7;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.cookie-link:hover {
  opacity: 1;
}
</style>