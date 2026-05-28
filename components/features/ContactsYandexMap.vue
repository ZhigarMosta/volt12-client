<template>
  <div class="contacts-map">
    <iframe
      class="contacts-map__iframe"
      title="Карта — Челябинск, Фёдорова 1А"
      src="https://yandex.ru/map-widget/v1/?ll=61.402517%2C55.134780&z=17&pt=61.402517%2C55.134780&l=map"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
  </div>
</template>

<style scoped>
.contacts-map {
  width: 100%;
  height: 252px;
  border-radius: 16px;
  overflow: hidden;
  background: var(--gray);
}

.contacts-map__iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

@media (max-width: 744px) {
  .contacts-map {
    height: 289px;
  }
}
</style>
