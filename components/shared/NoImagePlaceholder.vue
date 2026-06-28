<template>
  <div
      class="no-image"
      :style="{ borderRadius: radius }"
      role="img"
      :aria-label="label || 'Изображение отсутствует'"
  >
    <svg
        class="no-image__icon"
        :width="iconSize"
        :height="iconSize"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 16.5L8.5 11L12.5 15M14 13.5L16.5 11L21 15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="8.5" cy="9" r="1.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3.5 3.5L20.5 20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span v-if="label" class="no-image__text" :style="{ fontSize: labelSize }">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
      /** Подпись под иконкой. Пустая строка — без подписи. */
      label?: string;
      /** Размер иконки, px. */
      iconSize?: number;
      /** Размер шрифта подписи (любая CSS-величина). */
      labelSize?: string;
      /** Скругление углов (любая CSS-величина). */
      radius?: string;
    }>(),
    {
      label: 'Нет фото',
      iconSize: 32,
      labelSize: '13px',
      radius: '12px',
    },
);
</script>

<style scoped>
/* Размер берётся от класса места использования (см. комментарий в template).
   Здесь только внешний вид. Селектор с [role="img"] (атрибут всегда на корне)
   повышает специфичность, чтобы layout-свойства класса места использования
   (например, display:block у .item-image в корзине) не ломали центрирование. */
.no-image[role="img"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--gray-light, #b9b9b9);
  background:
      repeating-linear-gradient(
          -45deg,
          var(--gray-bg, #f5f5f5),
          var(--gray-bg, #f5f5f5) 10px,
          transparent 10px,
          transparent 20px
      ),
      var(--white, #fff);
}

.no-image__icon {
  flex-shrink: 0;
  opacity: 0.9;
}

.no-image__text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  color: var(--gray-light, #b9b9b9);
  text-align: center;
}
</style>
