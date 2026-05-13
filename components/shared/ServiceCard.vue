<template>
  <div class="service-card">
    <NuxtImg v-if="imgSrc" :src="imgSrc" class="service-img" :alt="name" />
    <div v-else class="service-img-placeholder" />
    <div class="service-content">
      <div class="service-info">
        <p class="service-name">{{ name }}</p>
        <p v-if="shortDescription" class="service-desc">{{ shortDescription }}</p>
      </div>
      <UiButton class="more" variant="red" size="sm">Подробней</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string
  shortDescription?: string | null
  imgLink?: string | null
}>();

const config = useRuntimeConfig();

const imgSrc = computed(() => {
  if (!props.imgLink) return null;
  if (/^https?:\/\//i.test(props.imgLink)) return props.imgLink;
  return `${config.public.apiBase}/${props.imgLink}`;
});
</script>

<style scoped>
.service-card {
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  height: 415px;
}
.service-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
.service-img-placeholder {
  width: 100%;
  height: 170px;
}
.service-content{
  padding: 12px 14px 18px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.service-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.service-name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: var(--black);
}
.service-desc {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  opacity: 0.7;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.more{
  width: 140px;
  height: 38px;
  margin-top: 10px;
}
</style>
