<script setup lang="ts">

</script>

<template>
  <footer class="footer">
    <div class="footer__grid">
      <div class="footer__block footer__block--a">
        <NuxtLink to="/" class="footer__logo-link">
          <img class="footer__logo" src="../../public/icons/logo.webp" alt="logo">
        </NuxtLink>
      </div>
      <div class="footer__block footer__block--b">
        <p class="block_title">Полезная информация</p>
        <NuxtLink to="/" class="block_text">О компании</NuxtLink>
        <NuxtLink to="/" class="block_text">Контакты</NuxtLink>
        <NuxtLink to="/catalog" class="block_text">Каталог</NuxtLink>
        <NuxtLink to="/" class="block_text">Услуги</NuxtLink>
        <NuxtLink to="/" class="block_text">Работа у нас</NuxtLink>
      </div>
      <div class="footer__block footer__block--c"><!--   TODO наверное нужно эту информацию тоже тянуть с бэкенда    -->
        <p class="block_title">Защита от угона</p>
        <NuxtLink to="/" class="block_text">Установка сигнализаций</NuxtLink>
        <NuxtLink to="/" class="block_text">Установка иммобилайзера</NuxtLink>
        <NuxtLink to="/" class="block_text">Установка механических блокираторов</NuxtLink>
        <NuxtLink to="/" class="block_text">Установка замка капота</NuxtLink>
        <NuxtLink to="/" class="block_text">Ремонт брелоков автосигнализаций</NuxtLink>
        <NuxtLink to="/" class="block_text">Нанесение противоугонной маркировки</NuxtLink>
        <NuxtLink to="/" class="block_text">Спецпредложения</NuxtLink>
      </div>
      <div class="footer__block footer__block--d">
        <p class="block_title">Связаться с нами</p>
        <p class="block_text">Челябинск, Фёдорова 1А</p>
        <p class="block_text">mastervolt12@yandex.ru</p>
        <p class="block_text">+7 (351) 77-66-224</p>
        <SocialIcons class="social"/>
      </div>
    </div>
    <div class="footer_last">
      <p class="footer_text">
        Политика конфиденциальности
      </p>
      <p class="footer_text">
        Согласие на обработку персональных данных
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer_text{
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-light);
}
.footer_last{
  height: 58px;
  background: var(--gray);
  display: flex;
  align-items: center;
  gap: 40px;
  padding-left: 90px;
  margin-top: 43px;
}
.social {
  margin-top: 20px;
}

.block_title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--red);
  white-space: nowrap
}

.block_text {
  @apply text-ellipsis line-clamp-2;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray-light);
}

.footer__logo {
  min-width: 258px;
  height: 51px;
}


.footer__grid {
  @apply w-full px-[90px];
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  column-gap: 60px;
  width: 85%;
}

.footer__block {
  @apply w-fit;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 100%;
}


/* Планшет: 2x2 [a b / d c] */
@media (max-width: 1100px) {

  .footer_last{
    padding-left: 37px;
    margin-top: 25px;
  }

  .footer__block {
    white-space: nowrap
  }

  .footer :deep(.social-link) {
    width: 26px;
    height: 26px;
  }

  .footer :deep(.social-link svg) {
    width: 26px;
    height: 26px;
  }

  .footer__logo {
    min-width: 179px;
    height: 35px;
  }

  .footer__grid {
    @apply grid-cols-2 px-[37px];
    grid-template-areas:
      'a b'
      'd c';
  }

  .footer__block {
    @apply w-fit;
  }

  .footer__block--a {
    grid-area: a;
  }

  .footer__block--b {
    grid-area: b;
  }

  .footer__block--c {
    grid-area: c;
    margin-top: 32px;
  }

  .footer__block--d {
    grid-area: d;
    margin-top: -94px;
  }
}

/* Мобилка: 1 колонка [a d b c] */
@media (max-width: 744px) {
  .footer__grid {
    @apply grid-cols-1 gap-y-[20px] pl-[20px];
    grid-template-areas:
      'a'
      'd'
      'b'
      'c';
  }

  .footer__block--a,
  .footer__block--b,
  .footer__block--c {
    @apply m-0;
  }

  .footer__block--d {
    margin-top: 0;
  }

  .footer__grid {
    row-gap: 37px;
  }

  .social {
    margin-top: 8px;
  }

  .footer_text{
    font-size: 12px;
  }

  .footer_last{
    height: 64px;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    margin-top: 35px;
  }
}
</style>