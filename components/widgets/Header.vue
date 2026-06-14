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
          <NuxtLink to="/about" class="header__nav-link header__text">О компании</NuxtLink>
          <NuxtLink to="/services" class="header__nav-link header__text">Услуги</NuxtLink>
          <NuxtLink to="/contacts" class="header__nav-link header__text">Контакты</NuxtLink>
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
      <div
        class="header__catalog-search"
        @mouseleave="onCatalogLeave"
      >
        <NuxtLink to="/catalog" class="header__catalog" @mouseenter="onCatalogEnter">
          <img class="header__catalog-icon" src="../../public/icons/4squares.svg" alt="squares">
          <p class="header__catalog-text">Каталог</p>
        </NuxtLink>

        <HeaderSearch class="header__search-wrap" variant="desktop" />

        <Transition @mouseleave="onCatalogLeave" name="catalog-fade">
          <div v-if="showCatalogMenu" class="catalog-menu">
            <div class="catalog-menu__categories">
              <div
                v-for="cat in catalogCategories"
                :key="cat.title"
                class="catalog-menu__category"
              >
                <NuxtLink :to="`/catalog/${cat.slug}`" class="catalog-menu__category-title">{{ cat.title }}</NuxtLink>
                <ul class="catalog-menu__sub-list">
                  <li v-for="sub in cat.items" :key="sub.id">
                    <NuxtLink :to="`/catalog/${cat.slug}/${sub.slug}`" class="catalog-menu__link">{{ sub.name }}</NuxtLink>
                  </li>
                </ul>
              </div>
            </div>

            <div class="catalog-menu__divider" />

            <div class="catalog-menu__services">
              <p class="catalog-menu__services-title">Услуги</p>
              <ul class="catalog-menu__services-list">
                <li v-for="service in services" :key="service.label">
                  <NuxtLink :to="service.to" class="catalog-menu__link">{{ service.label }}</NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </Transition>
      </div>
      <div class="header__actions">
        <NuxtLink to="/compare" class="header__action">
          <img class="header__action-icon" src="../../public/icons/compare.svg" alt="compare">
          <p class="header__text">Сравнение</p>
        </NuxtLink>
        <NuxtLink to="/cart" class="header__action">
          <img class="header__action-icon" src="../../public/icons/cart.svg" alt="cart">
          <p class="header__text">Корзина</p>
        </NuxtLink>
        <div
            class="header__profile-wrapper"
            @mouseenter="showProfileMenu = true"
            @mouseleave="showProfileMenu = false"
        >
          <template v-if="loading">
            <div class="header__action header__action--profile header__action--skeleton">
              <img class="header__action-icon" src="../../public/icons/profile.svg" alt="profile">
              <div class="sk-name" />
            </div>
          </template>
          <button v-else-if="!isAuthenticated" class="header__action header__action--profile header__action--btn" @click="showAuthModal = true">
            <img class="header__action-icon" src="../../public/icons/profile.svg" alt="profile">
            <p class="header__text">Войти</p>
          </button>
          <template v-else>
            <NuxtLink to="/profile" class="header__action header__action--profile">
              <img class="header__action-icon" src="../../public/icons/profile.svg" alt="profile">
              <p class="header__text">Кабинет</p>
            </NuxtLink>
            <Transition name="fade">
              <div v-if="showProfileMenu" class="header__profile-dropdown">
                <button @click="handleLogout" class="header__dropdown-item">Выйти</button>
                <NuxtLink to="/favorites" class="header__dropdown-item">Избранное</NuxtLink>
              </div>
            </Transition>
          </template>
        </div>

        <AuthModal v-model="showAuthModal" />
      </div>
    </div>
  </header>

  <!-- Mobile fullscreen menu -->
  <Teleport to="body">
    <Transition name="mm">
      <div v-if="isMenuOpen" class="mm">
        <!-- Top bar -->
        <header class="mm__top">
          <NuxtLink to="/" class="mm__logo-link" @click="isMenuOpen = false">
            <img class="mm__logo" src="../../public/icons/logo.webp" alt="logo">
          </NuxtLink>

          <button class="mm__close" aria-label="Закрыть" @click="isMenuOpen = false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </header>

        <!-- Search -->
        <div class="mm__search-wrap">
          <HeaderSearch variant="mobile" @navigate="isMenuOpen = false" />
        </div>

        <!-- Scrollable body -->
        <div class="mm__body">
          <!-- Catalog tiles -->
          <section class="mm__section">
            <h2 class="mm__section-title">Каталог</h2>
            <div class="mm__tiles">
              <NuxtLink
                v-for="cat in catalogCategories"
                :key="cat.title"
                :to="`/catalog/${cat.slug}`"
                class="mm__tile"
                @click="isMenuOpen = false"
              >
                <span class="mm__tile-title">{{ cat.title }}</span>
                <span class="mm__tile-count">{{ cat.items.length }} товаров</span>
                <span class="mm__tile-arrow">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </NuxtLink>
            </div>
          </section>

          <!-- Services list -->
          <section class="mm__section">
            <h2 class="mm__section-title">Услуги</h2>
            <ul class="mm__services">
              <li v-for="service in services" :key="service.label">
                <NuxtLink :to="service.to" class="mm__service" @click="isMenuOpen = false">
                  <span>{{ service.label }}</span>
                </NuxtLink>
              </li>
            </ul>
          </section>

          <!-- Bottom links -->
          <nav class="mm__nav">
            <NuxtLink to="/about" class="mm__nav-link" @click="isMenuOpen = false">О компании</NuxtLink>
            <NuxtLink to="/contacts" class="mm__nav-link" @click="isMenuOpen = false">Контакты</NuxtLink>
          </nav>

          <!-- Contacts footer -->
          <div class="mm__contacts">
            <a href="tel:+73517766224" class="mm__phone">+7 (351) 77-66-224</a>
            <p class="mm__address">Челябинск, Федорова 1А</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
  @apply flex justify-between items-center w-[260px] gap-[25px];
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

/* .header__catalog styles moved to bottom (button variant) */

.header__catalog-text {
  @apply font-['NT_Somic'] font-medium text-[14px] text-white;
}

.header__search-wrap {
  flex: 1;
  min-width: 0;
  margin-left: 20px;
}

.header__actions {
  @apply flex gap-[22px];
}

.header__action {
  @apply flex flex-col gap-[5px] content-center;
}

.header__action--profile {
  width: 60px;
  align-items: center;
}

.header__action--btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  align-items: center;
}

.header__action--skeleton {
  pointer-events: none;
  align-items: center;
  gap: 10px;
}

.sk-name {
  width: 52px;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f4f4f4 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

@keyframes sk-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.header__profile-wrapper {
  position: relative;
}

.header__profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 150px;
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
  z-index: 100;
}

.header__dropdown-item {
  font-family: 'NT Somic', sans-serif;
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  color: var(--black);
}

.header__dropdown-item:hover {
  background: var(--gray);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

/* Catalog + search container — same width as mega menu */
.header__catalog-search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  margin-right: 30px;
}

/* Mega menu — spans full width of catalog button + search */
.catalog-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  gap: 0;
  background: #fff;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  padding: 28px 32px;
  box-sizing: border-box;
}

.catalog-menu__categories {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px 32px;
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 transparent;
}

.catalog-menu__category-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--black);
  margin-bottom: 10px;
  text-decoration: none;
  display: block;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.catalog-menu__category-title:hover {
  color: var(--red);
}

.catalog-menu__category{
  width: 209px;
}

.catalog-menu__sub-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.catalog-menu__link {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: #666;
  text-decoration: none;
  transition: color 0.15s;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.catalog-menu__link:hover {
  color: var(--red);
}

.catalog-menu__divider {
  width: 1px;
  background: #e8e8e8;
  margin: 0 28px;
  flex-shrink: 0;
}

.catalog-menu__services {
  flex: 0 0 220px;
  min-width: 0;
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 transparent;
}

.catalog-menu__services-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--black);
  margin-bottom: 10px;
}

.catalog-menu__services-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.catalog-menu__services-list .catalog-menu__link {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1100px) {
  .catalog-menu {
    flex-direction: column;
    padding: 20px 22px;
  }

  .catalog-menu__categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 24px;
    max-height: 260px;
  }

  .catalog-menu__divider {
    width: auto;
    height: 1px;
    margin: 18px 0;
  }

  .catalog-menu__services {
    flex: none;
    max-height: 200px;
  }

  .catalog-menu__services-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 16px;
  }
}

/* Transition */
.catalog-fade-enter-active,
.catalog-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.catalog-fade-enter-from,
.catalog-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
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

/* ─── Mobile menu (fullscreen, right) ─── */
.mm {
  position: fixed;
  top: var(--header-top-h, 43px);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1002;
  background: #fff;
  display: flex;
  flex-direction: column;
  font-family: 'NT Somic', sans-serif;
}

/* Top bar */
.mm__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.mm__logo-link {
  display: flex;
}

.mm__logo {
  height: 36px;
  width: auto;
}

.mm__close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f4;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--black);
  transition: background 0.15s, color 0.15s;
}

.mm__close:hover {
  background: var(--red);
  color: #fff;
}

/* Search */
.mm__search-wrap {
  margin: 16px 20px 0;
  flex-shrink: 0;
}

/* Body */
.mm__body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px 32px;
}

/* Sections */
.mm__section {
  margin-bottom: 28px;
}

.mm__section-title {
  font-weight: 700;
  font-size: 22px;
  color: var(--black);
  margin: 0 0 14px;
}

/* Catalog tiles 2×3 */
.mm__tiles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.mm__tile {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;
  min-height: 96px;
  padding: 14px 36px 14px 14px;
  background: #f6f6f6;
  border-radius: 12px;
  text-decoration: none;
  color: var(--black);
  transition: background 0.18s, color 0.18s, transform 0.18s;
}

.mm__tile:hover,
.mm__tile:active {
  background: var(--red);
  color: #fff;
  transform: translateY(-1px);
}

.mm__tile-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.25;
}

.mm__tile-count {
  font-weight: 500;
  font-size: 12px;
  opacity: 0.6;
}

.mm__tile-arrow {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  color: inherit;
  transition: background 0.18s;
}

.mm__tile:hover .mm__tile-arrow,
.mm__tile:active .mm__tile-arrow {
  background: rgba(255, 255, 255, 0.2);
}

/* Services */
.mm__services {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.mm__service {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 0;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  text-decoration: none;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.15s;
}

.mm__service:hover {
  color: var(--red);
}

.mm__service-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--red);
  flex-shrink: 0;
}

/* Nav links */
.mm__nav {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
  margin-bottom: 24px;
}

.mm__nav-link {
  padding: 14px 0;
  font-weight: 600;
  font-size: 15px;
  color: var(--black);
  text-decoration: none;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.15s;
}

.mm__nav-link:hover {
  color: var(--red);
}

/* Contacts footer */
.mm__contacts {
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.mm__phone {
  display: block;
  font-weight: 700;
  font-size: 18px;
  color: var(--red);
  text-decoration: none;
  margin-bottom: 4px;
}

.mm__address {
  font-weight: 500;
  font-size: 13px;
  color: #888;
  margin: 0;
}

/* Slide-in from right */
.mm-enter-active,
.mm-leave-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.mm-enter-from,
.mm-leave-to {
  transform: translateX(100%);
  opacity: 0.6;
}

/* Catalog button as button (keep same look) */
.header__catalog {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 8px;
  padding: 16.5px 21px;
  min-width: 126px;
  height: 51px;
  background: var(--red);
  border: none;
  cursor: pointer;
  text-decoration: none;
}
</style>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue';
import { getCatalogMenu } from '~/services/catalogMenuApi';

const { isAuthenticated, user, loading, logoutUser } = useAuth();
const { showAuthModal } = useAuthModal();

const isMenuOpen = ref(false);
const showProfileMenu = ref(false);
const showCatalogMenu = ref(false);

let catalogHoverActive = false;

function onCatalogEnter() {
  catalogHoverActive = true;
  showCatalogMenu.value = true;
}

function onCatalogLeave() {
  catalogHoverActive = false;
  showCatalogMenu.value = false;
}

const { data: catalogMenuData } = await useAsyncData('catalog-menu', getCatalogMenu);

const catalogCategories = computed(() =>
  (catalogMenuData.value?.catalogs ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((cat) => ({
      title: cat.name,
      slug: cat.slug,
      items: cat.items.slice().sort((a, b) => a.position - b.position),
    }))
);

const services = computed(() =>
  (catalogMenuData.value?.services ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((s) => ({ label: s.name, to: `/services/${s.slug}` }))
);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLogout = async () => {
  await logoutUser();
  showProfileMenu.value = false;
};

watch(isMenuOpen, (open) => {
  if (typeof document === 'undefined') return;
  if (open) {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>