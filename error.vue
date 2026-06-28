<template>
  <NuxtLayout>
    <div class="error-page">
      <p class="error-code">{{ error.statusCode || 500 }}</p>
      <h1 class="error-title">{{ title }}</h1>
      <p class="error-text">{{ description }}</p>
      <UiButton to="/" variant="red" size="lg" class="error-btn">
        На главную
      </UiButton>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const is404 = computed(() => props.error?.statusCode === 404);

const title = computed(() =>
  is404.value ? (props.error?.statusMessage || 'Страница не найдена') : 'Что-то пошло не так',
);

const description = computed(() =>
  is404.value
    ? 'Возможно, товар был удалён или ссылка указана неверно.'
    : 'Попробуйте обновить страницу или вернуться позже.',
);
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 20px;
  min-height: 40vh;
}

.error-code {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 120px;
  line-height: 1;
  color: var(--red);
}

.error-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: var(--black);
  margin-top: 16px;
}

.error-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: var(--black);
  opacity: 0.6;
  margin-top: 12px;
  max-width: 420px;
}

.error-btn {
  margin-top: 32px;
  max-width: 220px;
}

@media (max-width: 744px) {
  .error-code {
    font-size: 84px;
  }

  .error-title {
    font-size: 22px;
  }

  .error-page {
    padding: 80px 20px;
  }
}
</style>
