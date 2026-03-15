<script setup lang="ts">
defineProps<{
  image: string;
  name: string;
  description: string;
  to: string;
}>();
</script>
<template>
  <NuxtLink class="preview-card" :to="to">
    <svg class="preview-card__ellipse" viewBox="0 0 372 139" fill="none"  preserveAspectRatio="none"
         xmlns="http://www.w3.org/2000/svg">
      <path
          d="M0 1.4031C0 -1.02866 1.97134 -3 4.4031 -3H367.597C370.029 -3 372 -1.02866 372 1.4031C372 77.3958 310.396 139 234.403 139H137.597C61.6042 139 0 77.3958 0 1.4031Z"
          fill="url(#paint0_radial_289_3320)"/>
      <path
          d="M33 0.47287C33 -1.44514 34.5549 -3 36.4729 -3H329.527C331.445 -3 333 -1.44514 333 0.472868C333 60.4107 284.411 109 224.473 109H141.527C81.5893 109 33 60.4107 33 0.47287Z"
          fill="#EBEBEB"/>
      <defs>
        <radialGradient id="paint0_radial_289_3320" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(186 68) rotate(90) scale(71 186)">
          <stop stop-color="white"/>
          <stop offset="1" stop-color="#EBEBEB"/>
        </radialGradient>
      </defs>
    </svg>

    <div class="preview-card__content">
      <img class="preview-card__img" :src="image" :alt="name">
      <div class="preview-card__content-text">
        <p class="preview-card__name-text">
          {{ name }}
        </p>
        <p class="preview-card__name-description"> {{ description }} </p>
        <p class="preview-card__more"> Подробнее </p>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.preview-card__name-description {
  margin-top: 4px;
  min-height: 32px;
}

.preview-card__more {
  margin-top: 20px;
  margin-bottom: 22px;
}

.preview-card__content-text {
  margin-left: 30px;
  max-width: 242px;
}

.preview-card__name-description, .preview-card__more {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: var(--black);
  opacity: 0.7;
  letter-spacing: 0;
  line-height: 100%;
}

.preview-card__name-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
  letter-spacing: 0;
  line-height: 100%;
  height: 26px;
}

.preview-card {
  position: relative;
  border-radius: 16px;
  max-width: 420px;
  max-height: 288px;
  background: var(--gray-bg);
}

.preview-card__ellipse {
  position: absolute;
  left: 16px;
  z-index: 1;
  width: calc(100% - 16px);
  height: auto;
  max-width: 372px;
}

.preview-card__content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.preview-card__img {
  margin-left: auto;
}

@media (max-width: 1100px) {
  .preview-card__img {
    max-width: 205px;
  }

  .preview-card__ellipse {
    left: 0;
    width: 100%;
    max-width: unset;
    height: 116px;
    border-radius: 16px 16px 0 0;
  }
}
@media (max-width: 744px) {
  .preview-card__img {
    max-width: 158px;
  }

  .preview-card__ellipse {
    height: 90px;
  }
  .preview-card__img {
    margin: auto;
  }
  .preview-card__content-text {
    margin-left: 17px;
  }
}
</style>
