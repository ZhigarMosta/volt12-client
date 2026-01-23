  <template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>


<script setup lang="ts">
// Делаем запрос при загрузке страницы
const { data, error } = await useFetch('http://127.0.0.1:8000/volt12/hello')

// Если пришло, выводим в консоль браузера
if (data.value) {
  console.log('Ответ от Symfony:', data.value)
}

// Если ошибка - тоже выводим
if (error.value) {
  console.error('Ошибка при запросе:', error.value)
}
</script>