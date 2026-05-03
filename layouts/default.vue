<template>
  <div class="app-container">
    <Header />

    <main class="main">
      <slot />
    </main>

    <Footer />
    <div class="mobile-button-bar-container">
      <MobileButtonBar @open-search="handleOpenSearch" />
    </div>
  </div>
</template>

<script setup>
const handleOpenSearch = () => {
  // логика открытия поиска
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: sans-serif;
}

.main {
  flex: 1;
}

.mobile-button-bar-container {
  display: none;
}

@media (max-width: 744px) {
  .mobile-button-bar-container {
    display: block;
  }
  
  .main {
    padding-bottom: 67px;
  }
}
</style>