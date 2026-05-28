<template>
  <div class="app-container">
    <Header />

    <main class="main">
      <slot />
    </main>
    <CookieAcceptPanel />
    <Footer />
    <MobileButtonBar />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: sans-serif;
  max-width: 1440px;
  margin: 0 auto;
}

.main {
  flex: 1;
}
</style>