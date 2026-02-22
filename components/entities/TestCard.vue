<template>
  <div class="test-card">
    <h3>{{ title }}</h3>
    <p class="description">
      <slot>Здесь какое-то описание карточки...</slot>
    </p>

    <div class="actions">
      <UiButton :to="link">
        {{ buttonText }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Заголовок карточки'
  },
  buttonText: {
    type: String,
    default: 'Нажать'
  },
  link: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.test-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  max-width: 300px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h3 {
  margin: 0;
  color: #333;
}

.description {
  color: #666;
  line-height: 1.5;
}

.actions {
  margin-top: auto;
}
</style>
