<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
        :disabled="currentPage === 1"
        @click="$emit('change-page', currentPage - 1)"
        class="page-btn page-arrow"
    >
      <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.292793 8.07112C-0.0977311 7.6806 -0.0977311 7.04743 0.292793 6.65691L6.65675 0.292946C7.04728 -0.0975785 7.68044 -0.0975785 8.07097 0.292946C8.46149 0.68347 8.46149 1.31664 8.07097 1.70716L2.41411 7.36401L8.07097 13.0209C8.46149 13.4114 8.46149 14.0446 8.07097 14.4351C7.68044 14.8256 7.04728 14.8256 6.65675 14.4351L0.292793 8.07112ZM1 7.36401V8.36401H0.9999V7.36401V6.36401H1V7.36401Z" fill="black" />
      </svg>
    </button>

    <template v-for="page in visiblePages" :key="page">
      <button
          v-if="page === 'ellipsis'"
          class="page-btn page-ellipsis"
          disabled
      >
        …
      </button>
      <button
          v-else
          :class="['page-btn', { active: page === currentPage }]"
          @click="$emit('change-page', page as number)"
      >
        {{ page }}
      </button>
    </template>

    <button
        :disabled="currentPage === totalPages"
        @click="$emit('change-page', currentPage + 1)"
        class="page-btn page-arrow"
    >
      <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.07098 8.07112C8.4615 7.6806 8.4615 7.04743 8.07098 6.65691L1.70702 0.292946C1.31649 -0.0975785 0.683326 -0.0975785 0.292802 0.292946C-0.0977225 0.68347 -0.0977225 1.31664 0.292802 1.70716L5.94966 7.36401L0.292802 13.0209C-0.0977225 13.4114 -0.0977225 14.0446 0.292802 14.4351C0.683326 14.8256 1.31649 14.8256 1.70702 14.4351L8.07098 8.07112ZM7.36377 7.36401V8.36401H7.36387V7.36401V6.36401H7.36377V7.36401Z" fill="black" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

defineEmits<{
  'change-page': [page: number];
}>();

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const visiblePages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const pages: (number | string)[] = [];
  const isMobile = windowWidth.value <= 744;

  if(isMobile){
    if (total <= 3) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else if (current <= 2) {
      for (let i = 1; i <= 3; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = total - 2; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('ellipsis');
      pages.push(current);
      pages.push('ellipsis');
      pages.push(total);
    }
  } else {
    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('ellipsis');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('ellipsis');
      pages.push(total);
    }
  }


  return pages;
});
</script>

<style scoped>
.pagination {
  width: 100%;
  max-width: 576px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 60px auto 0 auto;
}

.page-btn {
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
  min-width: 45px;
  height: 40px;
  padding: 0 8px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  font-family: 'NT Somic', sans-serif;
  opacity: 0.5;
  transition: background 0.2s, color 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled):not(.active) {
  background: var(--gray-shimmer-light);
  opacity: 1;
}

.page-btn.active {
  opacity: 1;
  cursor: unset;
  position: relative;
}

.page-btn.active::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 45px;
  height: 0;
  border-bottom: 4px solid var(--red);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: unset;
}

.page-ellipsis {
  cursor: default;
  background: transparent;
  color: var(--gray-placeholder);
  font-size: 18px;
  letter-spacing: 1px;
}

.page-arrow svg {
  transition: fill 0.2s;
}

.page-arrow-right svg {
  transform: scaleX(-1);
}
</style>
