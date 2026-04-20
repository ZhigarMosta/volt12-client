<template>
  <div class="tabs-container">
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: Number, default: 0 }
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
</style>
