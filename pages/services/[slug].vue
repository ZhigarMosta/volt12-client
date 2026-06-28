<template>
  <div class="service-detail">
    <template v-if="pending">
      <div class="detail-wrapper">
        <div class="sk-title"/>
        <div class="detail-context">
          <div class="sk-image"/>
          <div class="sk-text">
            <div class="sk-line"/>
            <div class="sk-line"/>
            <div class="sk-line sk-line--short"/>
          </div>
        </div>
      </div>
    </template>
    <div v-else-if="error" class="error">Ошибка: {{ error.message }}</div>
    <div v-else-if="!service" class="error">Услуга не найдена</div>

    <template v-else>
      <Navigate :items="breadcrumbsItems"/>

      <div class="detail-wrapper">
        <h1 class="detail-title">{{ service.name }}</h1>
        <div class="detail-context">
          <NuxtImg v-if="imgSrc" :src="imgSrc" :alt="service.img_alt || service.name" :title="service.img_title || service.name" class="service-image"/>
          <div v-if="service.description" class="detail-description" v-html="service.description"></div>
        </div>
      </div>

      <div v-if="visibleRelated.length > 0" class="related-wrapper">
        <h2 class="related-title">Похожие услуги</h2>
        <div class="related-grid">
          <ServiceCard
              v-for="item in visibleRelated"
              :key="item.id"
              :slug="item.slug"
              :name="item.name"
              :img-link="item.img_link"
              :img-alt="item.img_alt"
              :img-title="item.img_title"
              :short-description="item.short_description"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from 'vue';
import type {Service, RelatedService} from '~/types/product';
import {getServiceBySlug} from '~/services/productApi';

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const service = ref<Service | null>(null);
const related = ref<RelatedService[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);

const breadcrumbsItems = computed(() => [
  {to: '/', text: 'Главная'},
  {to: '/services', text: 'Услуги'}
]);

const config = useRuntimeConfig();
const imgSrc = computed(() => {
  if (!service.value?.img_link) return null;
  if (/^https?:\/\//i.test(service.value.img_link)) return service.value.img_link;
  return `${config.public.apiBase}/${service.value.img_link}`;
});

const windowWidth = ref(0);

const visibleRelated = computed(() => {
  const w = windowWidth.value;
  let limit = 4;
  if (w < 744) {
    limit = 1;
  } else if (w < 1100) {
    limit = 2;
  }
  return related.value.slice(0, limit);
});

function onResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(async () => {
  windowWidth.value = window.innerWidth;
  window.addEventListener('resize', onResize);
  try {
    const result = await getServiceBySlug(slug.value);
    if (result) {
      service.value = result.service;
      related.value = result.related;
    }
  } catch (e: any) {
    error.value = e;
  } finally {
    pending.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
@keyframes sk-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.sk-breadcrumbs {
  display: flex;
  gap: 12px;
  margin-bottom: 36px;
}

.sk-breadcrumb {
  height: 14px;
  width: 80px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

.sk-breadcrumb:nth-child(2) {
  width: 60px;
}

.sk-breadcrumb:nth-child(3) {
  width: 100px;
}

.sk-title {
  height: 32px;
  width: 40%;
  border-radius: 6px;
  margin-bottom: 24px;
  margin-top: 95px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

.sk-image {
  float: right;
  width: 400px;
  height: 335px;
  border-radius: 16px;
  margin: 0 0 20px 65px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

.sk-text {
  overflow: hidden;
}

.sk-line {
  height: 16px;
  width: 100%;
  border-radius: 6px;
  margin-bottom: 14px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

.sk-line--short {
  width: 60%;
}

.service-detail {
  padding: 0 70px;
  margin-bottom: 62px;
}

.error {
  padding: 40px;
  text-align: center;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: var(--error);
}

.detail-wrapper {
  width: 100%;
}

.detail-context {
  width: 100%;
  overflow: hidden;
}

.detail-description {
  font-family: 'NT Somic', sans-serif;
}

.service-image {
  float: right;
  border-radius: 16px;
  height: 335px;
  width: auto;
  object-fit: cover;
  margin: 0 0 20px 65px;
}

.detail-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: var(--black);
  margin-bottom: 10px;
}

.related-wrapper {
  margin-top: 35px;
}

.related-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
  margin-bottom: 20px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1100px) {
  .service-image {
    float: none;
    height: 253px;
    max-width: 100%;
    width: 100%;
    margin: 0;
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 744px) {
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
.detail-description table {
  border-collapse: collapse;
  width: 100%;
}

.detail-description th,
.detail-description td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: left;
  vertical-align: top;
}

.detail-description figure {
  width: 100%;
}

.detail-description figure img {
  max-width: 100%;
  height: auto;
}

.detail-description h1,
.detail-description h2,
.detail-description h3,
.detail-description h4 {
  font-family: 'NT Somic', sans-serif;
}

.detail-description p {
  font-family: 'NT Somic', sans-serif;
}

.detail-description a {
  color: var(--red);
  text-decoration: underline;
}

.detail-description img {
  max-width: 100%;
  height: auto;
}
</style>
