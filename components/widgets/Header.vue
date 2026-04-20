<template>
  <header class="header">
    <div class="header__top">
      <p class="header__text">
        Официальный дилер Pandora
      </p>
      <div class="header__socials">
        <SocialIcons/>
        <p class="header__text">
          +7 (351) 77-66-224
        </p>
      </div>
    </div>
    <div class="header__middle">
      <div class="header__logo-nav">
        <NuxtLink to="/" class="header__logo-link">
          <img class="header__logo" src="../../public/icons/logo.webp" alt="logo">
        </NuxtLink>
        <nav class="header__nav">
          <NuxtLink to="/" class="header__nav-link header__text">О компании</NuxtLink>
          <div class="header__nav-services">
            <NuxtLink to="/" class="header__nav-link header__text">Услуги</NuxtLink>
            <img src="../../public/icons/linkArrow.svg" alt="arrow">
          </div>
          <NuxtLink to="/" class="header__nav-link header__text">Спецпредложения</NuxtLink>
          <NuxtLink to="/" class="header__nav-link header__text">Контакты</NuxtLink>
        </nav>
      </div>
      <div class="header__location">
        <img class="header__location-icon" src="../../public/icons/location.svg" alt="location">
        <p class="header__location-text header__text">Челябинск, Федорова 1А</p>
      </div>
      <button class="header__burger" @click="toggleMenu">
        <div class="header__burger-wrapper">
          <div class="header__hamburger-menu" :class="{ animate: isMenuOpen }"></div>
        </div>
      </button>
    </div>
    <div class="header__bottom">
      <button class="header__catalog">
        <img class="header__catalog-icon" src="../../public/icons/4squares.svg" alt="squares">
        <p class="header__catalog-text">Каталог</p>
      </button>
      <div class="header__search">
        <input class="header__search-input header__text" type="text" placeholder="Поиск по сайту">
        <img class="header__search-icon" src="../../public/icons/search.svg" alt="search">
      </div>
      <div class="header__actions">
        <NuxtLink to="/" class="header__action">
          <img class="header__action-icon" src="../../public/icons/compare.svg" alt="compare">
          <p class="header__text">Сравнение</p>
        </NuxtLink>
        <NuxtLink to="/" class="header__action">
          <img class="header__action-icon" src="../../public/icons/cart.svg" alt="cart">
          <p class="header__text">Корзина</p>
        </NuxtLink>
        <NuxtLink to="/" class="header__action header__action--profile">
          <img class="header__action-icon" src="../../public/icons/profile.svg" alt="profile">
          <p class="header__text">Войти</p>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Typography */
.header__text {
  @apply font-['NT_Somic'] font-medium text-[14px] content-center text-[var(--gray-light)];
}

/* Icons */
.header__action-icon {
  @apply h-[29px];
}

.header__location-icon,
.header__search-icon,
.header__catalog-icon {
  @apply w-[20px] h-[20px];
}

/* Top bar */
.header__top {
  @apply flex justify-between items-center h-[43px] px-[70px] bg-[var(--gray-bg)];
}

.header__socials {
  @apply flex gap-[18px];
}

.header__social-icons {
  @apply flex items-center gap-[7px];
}

/* Middle bar */
.header__middle {
  @apply flex justify-between items-center h-[81px] px-[70px] gap-[30px];
}

.header__logo-nav {
  @apply flex justify-between w-[812px];
}

.header__logo {
  @apply w-[258px] h-[51px];
}

.header__nav {
  @apply flex justify-between items-center w-[419px] gap-[25px];
}

.header__nav-services {
  @apply flex gap-[7px];
}

.header__location {
  @apply flex items-center w-full max-w-[195px];
}

.header__location-text {
  @apply text-[var(--red)] whitespace-nowrap ml-[14px];
}

/* Bottom bar */
.header__bottom {
  @apply flex px-[70px];
}

.header__catalog {
  @apply flex items-center justify-center gap-[12px] rounded-[8px] py-[16.5px] px-[21px] min-w-[126px] h-[51px] bg-[var(--red)];
}

.header__catalog-text {
  @apply font-['NT_Somic'] font-medium text-[14px] text-white;
}

.header__search {
  @apply flex justify-between items-center px-[26px] h-[51px] w-full rounded-[8px] bg-[var(--gray)] gap-[20px] ml-[20px] mr-[30px];
}

.header__search-input {
  @apply w-full;
}

.header__search-input::placeholder {
  @apply text-[var(--gray-light)];
}

.header__actions {
  @apply flex gap-[22px];
}

.header__action {
  @apply flex flex-col gap-[5px] content-center;
}

.header__action--profile {
  @apply ml-[10px];
}

/* Hamburger menu */
.header__burger {
  @apply hidden w-[36px] h-[36px] min-w-[36px] min-h-[36px] rounded-full bg-[var(--red)] border-none cursor-pointer items-center justify-center;
  -webkit-tap-highlight-color: transparent;
}

.header__burger-wrapper {
  @apply relative w-[18px] h-[18px] flex justify-center items-center;
}

.header__hamburger-menu,
.header__hamburger-menu::before,
.header__hamburger-menu::after {
  content: '';
  @apply absolute block w-[18px] h-[2px] rounded-[2px] bg-white;
}

.header__hamburger-menu {
  @apply transition-none;
  transition-delay: 300ms;
  transition-property: background-color;
}

.header__hamburger-menu.animate {
  @apply bg-transparent;
}

.header__hamburger-menu::before {
  @apply top-[-6px];
  transition: top 300ms 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
}

.header__hamburger-menu::after {
  @apply top-[6px];
  transition: top 300ms 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms cubic-bezier(0.23, 1, 0.32, 1);
}

.header__hamburger-menu.animate::before {
  @apply top-0;
  transform: rotate(45deg);
  transition: top 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms 300ms cubic-bezier(0.23, 1, 0.32, 1);
}

.header__hamburger-menu.animate::after {
  @apply top-0;
  transform: rotate(-45deg);
  transition: top 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms 300ms cubic-bezier(0.23, 1, 0.32, 1);
}

/* Media queries */
@media (max-width: 1100px) {
  .header__burger {
    @apply flex;
  }

  .header__top,
  .header__middle,
  .header__bottom {
    @apply px-[37px];
  }

  .header__text {
    @apply text-[12px];
  }

  .header__nav {
    @apply hidden;
  }

  .header__logo {
    @apply w-[183px] h-[36px];
  }
}

@media (max-width: 744px) {
  .header__top,
  .header__middle {
    @apply px-[20px];
  }

  .header__bottom,
  .header__location {
    @apply hidden;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>