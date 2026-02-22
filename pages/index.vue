<template>
  <div>
    <h1>Добро пожаловать в Volt12</h1>
    <p>Лучший магазин электроники и компонентов.</p>
    <div style="margin-top: 20px;">
      <NuxtLink to="/catalog" class="btn">Перейти в каталог</NuxtLink>
    </div>

    <div style="display: flex; gap: 20px; padding: 20px;">

      <TestCard
          title="Перейти в каталог"
          button-text="В каталог"
          link="/catalog"
      >
        Это тестовая карточка, которая ведет в раздел каталога.
      </TestCard>

      <TestCard
          title="Акция"
          button-text="Подробнее"
      >
        Скидки 50% на все товары до конца недели!
      </TestCard>

    </div>
  </div>
</template>

<style scoped>
.btn {
  background: #333;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
}
</style>

<script defer>

</script>