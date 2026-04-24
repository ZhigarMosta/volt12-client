<template>
  <div class="tabs-container">
    <template v-if="loading">
      <div v-for="i in skeletonCount" :key="i" class="tab-item-skeleton">
        <div class="skeleton-text" />
      </div>
    </template>
    <template v-else>
      <div
          v-for="(tab, index) in tabs"
          :key="index"
          :ref="(el) => (tabRefs[index] = el)"
          class="tab-item"
          :class="{ 'is-active': modelValue === index && isReady }"
          @click="selectTab(index)"
      >
        {{ tab }}
      </div>
      <div
          class="tab-indicator"
          :class="{ 'animate-transition': isReady }"
          :style="indicatorStyle"
      ></div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  skeletonCount: { type: Number, default: 4 }
});

const emit = defineEmits(['update:modelValue']);

const tabRefs = ref([]);
const indicatorWidth = ref(0);
const indicatorLeft = ref(0);
const isReady = ref(false);

const indicatorStyle = computed(() => ({
  width: `${indicatorWidth.value}px`,
  transform: `translateX(${indicatorLeft.value}px)`,
}));

const selectTab = (index) => {
  emit('update:modelValue', index);
};

const updateIndicator = () => {
  const activeTabElement = tabRefs.value[props.modelValue];
  if (activeTabElement) {
    indicatorWidth.value = activeTabElement.offsetWidth;
    indicatorLeft.value = activeTabElement.offsetLeft;
  }
};

watch(() => props.modelValue, async () => {
  await nextTick();
  updateIndicator();
});

watch(() => props.tabs, async () => {
  await nextTick();
  updateIndicator();
}, { deep: true });

onMounted(async () => {
  await nextTick();
  updateIndicator();
  isReady.value = true;
  window.addEventListener('resize', updateIndicator);
});
</script>

<style scoped>
.tabs-container {
  position: relative;
  display: inline-flex;
  border: 1px solid rgba(var(--gray-light-rgb), 0.57);
  border-radius: 8px;
  user-select: none;
}

.tab-item {
  position: relative;
  z-index: 2;
  padding: 16.5px 44px;
  cursor: pointer;

  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);


  transition: color 0.2s ease;
  white-space: nowrap;
}

.tab-item.is-active {
  color: var(--white);
}

.tab-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: var(--red);
  border-radius: 8px;
  z-index: 1;
  margin-top: -1px;
  height: calc(100% + 2px);
}

.tab-indicator.animate-transition {
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.tab-item-skeleton {
  padding: 20px 44px;
}

.skeleton-text {
  width: 100px;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@media (max-width: 744px) {
  .tab-item {
    padding: 15px 20px;
    font-size: 12px;
  }
}
</style>
