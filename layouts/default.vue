<template>
  <div class="app-container">
    <Header />

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <p>&copy; 2026 Volt12 Shop. Все права защищены.</p>
    </footer>
  </div>
</template>

<script setup>
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

.footer {
  background-color: #222;
  color: #ccc;
  text-align: center;
  padding: 1rem;
}
</style>
