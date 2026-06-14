<template>
  <div class="h-search" :class="[variant === 'mobile' ? 'h-search--mobile' : 'h-search--desktop']">
    <div class="h-search__field" :class="{ 'h-search__field--focused': isActive }">
      <svg class="h-search__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M14 14l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <input
        ref="inputEl"
        v-model="query"
        type="text"
        class="h-search__input"
        :placeholder="placeholder"
        @focus="onFocus"
        @keydown.esc="close"
      />
      <button
        v-if="query"
        class="h-search__clear"
        type="button"
        aria-label="Очистить"
        @click="clearQuery"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Overlay (затемнение всей страницы) -->
    <Teleport to="body">
      <Transition name="h-search-overlay">
        <div
          v-if="overlayVisible"
          class="h-search__overlay"
          @click="close"
        />
      </Transition>
    </Teleport>

    <!-- Dropdown с результатами -->
    <Transition name="h-search-dropdown">
      <div v-if="dropdownVisible" class="h-search__dropdown">
        <div v-if="loading" class="h-search__state">Поиск…</div>

        <template v-else-if="results.length">
          <NuxtLink
            v-for="item in results"
            :key="`${item.type}-${item.id}`"
            :to="routeFor(item)"
            class="h-search__item"
            @click="close"
          >
            <div class="h-search__item-img">
              <img v-if="imgFor(item)" :src="imgFor(item)" :alt="item.name" />
            </div>
            <div class="h-search__item-text">
              <div class="h-search__item-name">{{ item.name }}</div>
              <div class="h-search__item-type">
                {{ item.type === 'product' ? 'Товар' : 'Услуга' }}
              </div>
            </div>
          </NuxtLink>
        </template>

        <div v-else-if="query.trim().length >= 2" class="h-search__state">
          Ничего не найдено
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { searchMenu, extractImgUrl, type SearchItem } from '~/services/catalogMenuApi';

withDefaults(
  defineProps<{
    placeholder?: string;
    variant?: 'desktop' | 'mobile';
  }>(),
  {
    placeholder: 'Поиск по сайту',
    variant: 'desktop',
  }
);

const emit = defineEmits<{
  navigate: [];
}>();

const inputEl = ref<HTMLInputElement | null>(null);
const query = ref('');
const results = ref<SearchItem[]>([]);
const loading = ref(false);
const isFocused = ref(false);

let debounceId: ReturnType<typeof setTimeout> | null = null;
let abortController: AbortController | null = null;

const isActive = computed(() => isFocused.value || query.value.length > 0);

const dropdownVisible = computed(
  () => isFocused.value && query.value.trim().length >= 2
);

const overlayVisible = computed(() => dropdownVisible.value);

function routeFor(item: SearchItem): string {
  return item.type === 'product' ? `/product/${item.slug}` : `/services/${item.slug}`;
}

function imgFor(item: SearchItem): string {
  return extractImgUrl(item.img_link);
}

function onFocus() {
  isFocused.value = true;
}

function close() {
  isFocused.value = false;
  emit('navigate');
}

function clearQuery() {
  query.value = '';
  results.value = [];
  inputEl.value?.focus();
}

async function runSearch(name: string) {
  if (abortController) abortController.abort();
  if (!name.trim() || name.trim().length < 2) {
    results.value = [];
    loading.value = false;
    return;
  }
  abortController = new AbortController();
  loading.value = true;
  try {
    results.value = await searchMenu(name, abortController.signal);
  } catch (e: any) {
    if (e?.name !== 'AbortError') {
      results.value = [];
    }
  } finally {
    loading.value = false;
  }
}

watch(query, (val) => {
  if (debounceId) clearTimeout(debounceId);
  debounceId = setTimeout(() => runSearch(val), 300);
});

function onDocClick(e: MouseEvent) {
  const target = e.target as Node;
  const root = inputEl.value?.closest('.h-search');
  if (root && !root.contains(target)) {
    isFocused.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onDocClick);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocClick);
  if (debounceId) clearTimeout(debounceId);
  if (abortController) abortController.abort();
});

defineExpose({
  focus: () => inputEl.value?.focus(),
  clear: clearQuery,
});
</script>

<style scoped>
.h-search {
  position: relative;
  width: 100%;
}

/* Input field */
.h-search__field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 51px;
  background: var(--gray);
  border-radius: 8px;
  position: relative;
  z-index: 1001;
  transition: background 0.18s;
}

.h-search--mobile .h-search__field {
  height: 48px;
  border-radius: 10px;
  background: #f4f4f4;
}

.h-search__field--focused {
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.h-search__icon {
  flex-shrink: 0;
  color: var(--gray-light);
}

.h-search__field--focused .h-search__icon {
  color: var(--black);
}

.h-search__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  min-width: 0;
}

.h-search__input::placeholder {
  color: var(--gray-light);
}

.h-search__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  color: var(--black);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.h-search__clear:hover {
  background: rgba(0, 0, 0, 0.15);
}

/* Overlay */
.h-search__overlay {
  position: fixed;
  inset: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.45);
}

.h-search-overlay-enter-active,
.h-search-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.h-search-overlay-enter-from,
.h-search-overlay-leave-to {
  opacity: 0;
}

/* Dropdown */
.h-search__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 1001;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  max-height: min(70vh, 480px);
  overflow-y: auto;
  padding: 8px;
}

.h-search-dropdown-enter-active,
.h-search-dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.h-search-dropdown-enter-from,
.h-search-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Item */
.h-search__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s;
}

.h-search__item:hover {
  background: #f6f6f6;
}

.h-search__item-img {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.h-search__item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.h-search__item-text {
  flex: 1;
  min-width: 0;
}

.h-search__item-name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: var(--black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.h-search__item-type {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: var(--gray-light);
  margin-top: 2px;
}

/* States */
.h-search__state {
  padding: 16px;
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  color: var(--gray-light);
  text-align: center;
}
</style>
