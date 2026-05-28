<template>
  <div class="about">
    <Navigate :items="breadcrumbsItems"/>
    <div class="title">
      <p class="about-text">О комании</p>
      <p class="title-text">Мастер 12 вольт</p>
    </div>
    <div class="info">
      <div class="text">
        <p class="description-text">
          Компания Мастер 12 вольт была основана в 1997 году. Мы специализируемся на продаже и установке
          автосигнализаций, электронных и механических противоугонных систем, противоугонной маркировке автомобиля,
          установке механических блокираторов - вобщем всём, что поможет сделать Ваш автомобиль более угоноустойчивым и
          не менее комфортным. Мы являемся официальным дилером компании AlarmTrade (сигнализации и иммобилайзеры Pandora
          и Pandect). У нас можно приобрести и установить бортовые компьютеры фирмы Multitronics, GSM/GPS маяки,
          парктроники, штатные мультимедийные головные устройства - в общем любое дополнительное оборудование для
          автомобиля. Кроме того, вы так-же можете обратится в наш сервис за ремонтом автомобиля. Услуги автоэлектрика,
          электронщика и мелкосрочный ремонт окажем вам с большим успехом.
        </p>
      </div>
      <div class="cards">
        <div class="card" v-for="(card, index) in cards" :key="index">
          <NuxtImg class="card-icon" :src="card.icon" :alt="card.text"/>
          <p class="card-count">{{ card.count }}</p>
          <p class="card-text">{{ card.text }}</p>
        </div>
      </div>
    </div>

    <section class="about-gallery">
      <Slider
          class="about-gallery-slider"
          :items="galleryImages"
          :breakpoints="sliderBreakpoints"
          :slide-component="AboutGallerySlide"
          :slide-props="gallerySlideProps"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import Slider from '~/components/features/Slider.vue';
import AboutGallerySlide from '~/components/shared/AboutGallerySlide.vue';
import type { AboutGalleryImage } from '~/types/about';

useHead({
  title: 'О нас — Мастер 12 Вольт',
});

const sliderBreakpoints = {
  0: {
    slidesPerView: 2,
    slidesPerGroup: 1,
    grid: {rows: 1},
    spaceBetween: 20,
  },
  744: {
    slidesPerView: 2,
    slidesPerGroup: 1,
    grid: {rows: 1},
    spaceBetween: 20,
  },
  1100: {
    slidesPerView: 3,
    slidesPerGroup: 1,
    grid: {rows: 1},
    spaceBetween: 20,
  },
};

const galleryImages: AboutGalleryImage[] = [
  {id: 1, src: '/images/about/gallery-1.jpg', alt: 'Фото 1'},
  {id: 2, src: '/images/about/gallery-2.jpg', alt: 'Фото 2'},
  {id: 3, src: '/images/about/gallery-3.jpg', alt: 'Фото 3'},
  {id: 4, src: '/images/about/gallery-4.jpg', alt: 'Фото 4'},
  {id: 5, src: '/images/about/gallery-5.jpg', alt: 'Фото 5'},
  {id: 6, src: '/images/about/gallery-6.jpg', alt: 'Фото 6'},
];

const gallerySlideProps = (item: AboutGalleryImage) => ({image: item});

const breadcrumbsItems = [
  {to: '/', text: 'Главная'},
  {to: '/about', text: 'О нас'},
];

const cards = [
  {icon: '/icons/user.svg', count: 12, text: 'Специалистов в штате'},
  {icon: '/icons/medal.svg', count: 1200, text: 'Года на работаем для Вас'},
  {icon: '/icons/car-signal.svg', count: 10000, text: 'Установлено сигнализаций'},
  {icon: '/icons/users.svg', count: 78, text: 'Обслужено клиентов'},
];
</script>

<style scoped>
.card-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  color: var(--gray);
}

.card-count {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: var(--gray);
}

.cards {
  width: 100%;
  max-width: 679px;
  height: 100%;
  box-shadow: 0 8px 15px 0 rgba(0, 0, 0, 0.09);
  background: linear-gradient(180deg, #ea0212 0%, #87040d 100%);
  border-radius: 16px;
  padding: 31px 85px 27px 85px;

  display: flex;
  justify-content: space-around;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info {
  container-type: inline-size;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 17px;
}

/* когда flex-wrap переносит .text и .cards в колонку — карточки сверху */
@container (max-width: 1224px) {
  .info .cards {
    order: -1;
    max-width: 100%;
  }

  .info .text {
    width: 100%;
  }

  .info .description-text {
    max-width: none;
  }
}

.description-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  opacity: 0.7;

  width: 100%;
  max-width: 536px;
}

.title-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 40px;
  color: var(--black);
}

.about-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--red);
}

.about {
  padding: 0 70px;
}

.about-gallery {
  margin-top: 50px;
  margin-bottom: 64px;
}

.about-gallery-slider {
  --slider-desktop-height: 302px;
  --slider-tablet-height: 240px;
  --slider-mobile-height: 148px;
}

.card-icon {
  display: block;
  width: 50px;
  height: 50px;
  object-fit: contain;
}

@media (max-width: 1100px) {
  .about {
    padding: 0 37px;
  }
  .cards{
    padding: 31px 72px 27px 72px;
  }
  .about-gallery {
    margin-top: 41px;
    margin-bottom: 55px;
  }
}

@media (max-width: 744px) {
  .about {
    padding: 0 20px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 16px;
    padding: 24px 20px;
    justify-content: unset;
  }
  .about-gallery {
    margin-top: 32px;
    margin-bottom: 47px;
  }
}
</style>
