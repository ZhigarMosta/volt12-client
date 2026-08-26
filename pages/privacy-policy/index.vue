<template>
  <div class="privacy-policy">
    <!-- Нештатная ситуация: админов предупредили, что хотя бы одна страница должна быть опубликована -->
    <p v-if="pages.length === 0" class="empty-state">Раздел заполняется</p>

    <template v-else>
      <!-- Одинокая вкладка выглядит как недоделка — полосу табов рисуем от двух страниц -->
      <div v-if="pages.length > 1" class="tabs-scroll">
        <AnimatedTabs v-model="activeIndex" :tabs="tabNames" />
      </div>

      <div class="legal-text" v-html="activePage.text" @click="onTextClick" />

      <p v-if="editionDate" class="edition-date">Редакция от {{ editionDate }}</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { getLegalPages } from '~/services/legalApi';

// SSR обязателен: текст должен попадать в HTML-ответ для поисковика
const { data, error } = await useAsyncData('legal-pages', () => getLegalPages());
if (error.value) {
  // Фолбэка на старый вшитый текст нет — он удалён вместе с этой задачей
  throw createError({ statusCode: 500, statusMessage: 'Не удалось загрузить страницу', fatal: true });
}

const pages = computed(() => data.value ?? []);
const tabNames = computed(() => pages.value.map((p) => p.name));

const activeIndex = ref(0);
const activePage = computed(() => pages.value[activeIndex.value] ?? pages.value[0]);

// Хэш до сервера не доходит — SSR всегда отдаёт первый таб,
// прямая ссылка вида /privacy-policy#cookies отрабатывает на клиенте.
// Неизвестный или неопубликованный slug в items не найдётся — останется первый таб.
onMounted(() => {
  const slug = window.location.hash.slice(1);
  if (!slug) return;
  const index = pages.value.findIndex((p) => p.slug === slug);
  if (index > 0) activeIndex.value = index;
});

// replaceState вместо router.push: без скролла к началу и без новой записи
// в истории — «Назад» должна уводить со страницы, а не листать табы.
watch(activeIndex, () => {
  const slug = activePage.value?.slug;
  if (!slug) return;
  history.replaceState(history.state, '', `#${slug}`);
});

useSeo(() => ({
  title: `${activePage.value?.name ?? 'Политика конфиденциальности'} — Мастер 12 Вольт`,
}));

// Внешние ссылки — в новой вкладке с noopener. Контент-менеджер в редакторе
// про target/rel забудет, поэтому перехватываем клик на контейнере.
function onTextClick(e: MouseEvent) {
  const link = (e.target as HTMLElement).closest('a');
  if (!link) return;
  const href = link.getAttribute('href') ?? '';
  if (/^https?:\/\//i.test(href)) {
    e.preventDefault();
    window.open(href, '_blank', 'noopener');
  }
}

const MONTHS_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

// Форматируем из строки вручную: new Date('YYYY-MM-DD') трактуется как UTC-полночь,
// и toLocaleDateString мог бы дать разные даты на сервере и у клиента (гидрация)
const editionDate = computed(() => {
  const iso = activePage.value?.updated_at;
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return `${Number(m[3])} ${MONTHS_RU[Number(m[2]) - 1]} ${m[1]} г.`;
});
</script>

<style scoped>
.privacy-policy {
  padding: 0 70px;
  margin-top: 37px;
  margin-bottom: 88px;
}

/* Заголовки бывают длинные («Согласие на обработку персональных данных») —
   на узком экране полоса табов скроллится, а не переносит текст и не ломает сетку */
.tabs-scroll {
  overflow-x: auto;
  margin-bottom: 32px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.tabs-scroll::-webkit-scrollbar {
  display: none;
}

.empty-state {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: var(--gray-dark);
  padding: 40px 0;
}

.edition-date {
  margin-top: 32px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-light);
}

/* Стили под HTML из редактора: p/ol/ul — как в старой вшитой вёрстке,
   h2/h3/table/blockquote — на вырост, редактор их умеет.
   Из-за scoped до содержимого v-html достаём через :deep(). */
.legal-text :deep(p) {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-dark);
}

.legal-text :deep(ol),
.legal-text :deep(ul) {
  padding-left: 20px;
}

.legal-text :deep(ol li),
.legal-text :deep(ul li) {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-dark);
}

.legal-text :deep(a) {
  color: var(--red);
  text-decoration: underline;
}

.legal-text :deep(h2),
.legal-text :deep(h3) {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  color: var(--black);
  margin: 24px 0 12px;
}

.legal-text :deep(h2) {
  font-size: 20px;
}

.legal-text :deep(h3) {
  font-size: 16px;
}

.legal-text :deep(table) {
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  margin: 16px 0;
}

.legal-text :deep(th),
.legal-text :deep(td) {
  border: 1px solid var(--gray-border);
  padding: 8px 12px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-dark);
  text-align: left;
}

.legal-text :deep(blockquote) {
  border-left: 3px solid var(--gray-light);
  padding-left: 16px;
  margin: 16px 0;
}

@media (max-width: 1100px) {
  .privacy-policy {
    padding: 0 37px;
  }
}

@media (max-width: 744px) {
  .privacy-policy {
    padding: 0 16px;
    margin-top: 20px;
    margin-bottom: 100px;
  }

  .tabs-scroll {
    margin-bottom: 24px;
  }

  .legal-text :deep(p),
  .legal-text :deep(ol li),
  .legal-text :deep(ul li),
  .legal-text :deep(th),
  .legal-text :deep(td) {
    font-size: 13px;
  }

  .legal-text :deep(ol),
  .legal-text :deep(ul) {
    padding-left: 16px;
  }
}
</style>
