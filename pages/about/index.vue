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
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'О нас — Мастер 12 Вольт',
});

const breadcrumbsItems = [
  {to: '/', text: 'Главная'},
  {to: '/about', text: 'О нас'},
];

const cards = [
  {icon: '/icons/user.svg', count: 12, text: 'Специалистов в штате'},
  {icon: '/icons/medal.svg', count: 12, text: 'Года на работаем для Вас'},
  {icon: '/icons/car-signal.svg', count: 12, text: 'Установлено сигнализаций'},
  {icon: '/icons/users.svg', count: 12, text: 'Обслужено клиентов'},
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
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;

  margin-top: 17px;
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
}

@media (max-width: 744px) {
  .about {
    padding: 0 20px;
  }
}
</style>
