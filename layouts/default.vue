<template>
  <div class="app-container">
    <header class="header">
      <div class="logo">
        <NuxtLink to="/">Volt12</NuxtLink>
      </div>
      <nav>
        <NuxtLink to="/">Главная</NuxtLink>
        <NuxtLink to="/catalog">Каталог</NuxtLink>
      </nav>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <p>&copy; 2026 Volt12 Shop. Все права защищены.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: sans-serif;
}

.header {
  background-color: #333;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header a {
  color: white;
  text-decoration: none;
  margin-left: 15px;
}

.header a.router-link-active {
  text-decoration: underline;
  color: #fbbf24; /* Активная ссылка */
}

.main {
  flex: 1; /* Растягиваем контент, чтобы прижать футер к низу */
  padding: 2rem;
  background-color: #f9f9f9;
}

.footer {
  background-color: #222;
  color: #ccc;
  text-align: center;
  padding: 1rem;
}
</style>
