<template>
  <div class="app-container">
    <Header />

    <main class="main">
      <slot />
    </main>

    <Footer />
    <MobileButtonBar @open-search="handleOpenSearch" />
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
</style>