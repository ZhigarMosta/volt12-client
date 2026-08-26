<template>
  <!--
    Бейджи поверх изображения товара: скидка слева, метка справа.
    Родитель должен иметь position: relative. Когда нет ни скидки, ни метки —
    не рендерим ничего, чтобы не оставлять лишних отступов.
  -->
  <div v-if="showDiscount || label" class="product-badges">
    <span v-if="showDiscount" class="badge badge-discount">-{{ discountPercent }}%</span>
    <span v-if="label" class="badge badge-label" :title="label.name">{{ label.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductLabel } from '~/types/product';

const props = defineProps<{
  label?: ProductLabel | null;
  discountPercent?: number | null;
}>();

// Единственный источник процента — сервер; null означает «скидки нет»,
// на фронте ничего не пересчитываем.
const showDiscount = computed(() => props.discountPercent != null);
</script>

<style scoped>
.product-badges {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
  pointer-events: none;
}

.badge {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1;
  color: var(--white);
  padding: 5px 8px;
  border-radius: 8px;
  white-space: nowrap;
}

.badge-discount {
  background: var(--red);
  flex-shrink: 0;
}

/* Стиль метки один на все названия: контент-менеджер может завести любую.
   Длинные («ПОД ЗАКАЗ», «РЕКОМЕНДУЕМ») не должны ломать карточку — обрезаем
   с многоточием, полное название остаётся в title. */
.badge-label {
  background: var(--black);
  margin-left: auto;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
