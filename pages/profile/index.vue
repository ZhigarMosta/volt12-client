<template>
  <div class="profile-page">
    <template v-if="loading">
      <div class="profile-loader">Загрузка...</div>
    </template>
    <template v-else-if="isAuthenticated">
      <div class="profile-cabinet">
        <h2>Личный кабинет</h2>
        <p>Добро пожаловать, {{ user?.name }}!</p>
      </div>
    </template>
    <template v-else>
      <div class="profile-auth">
        <div class="auth-tabs">
          <button
              :class="{ active: authTab === 'login' }"
              @click="authTab = 'login'"
          >Вход</button>
          <button
              :class="{ active: authTab === 'register' }"
              @click="authTab = 'register'"
          >Регистрация</button>
        </div>

        <form v-if="authTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <input v-model="loginEmail" type="email" placeholder="Email" required />
          <input v-model="loginPassword" type="password" placeholder="Пароль" required />
          <button type="submit">Войти</button>
          <p v-if="authError" class="auth-error">{{ authError }}</p>
        </form>

        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <input v-model="regName" type="text" placeholder="Имя" required />
          <input v-model="regEmail" type="email" placeholder="Email" required />
          <input v-model="regPhone" type="tel" placeholder="Телефон (опционально)" />
          <input v-model="regPassword" type="password" placeholder="Пароль" required />
          <button type="submit">Зарегистрироваться</button>
          <p v-if="authError" class="auth-error">{{ authError }}</p>
        </form>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { user, loading, isAuthenticated, loginUser, registerUser } = useAuth();
const router = useRouter();

const authTab = ref<'login' | 'register'>('login');
const authError = ref('');

const loginEmail = ref('');
const loginPassword = ref('');
const regName = ref('');
const regEmail = ref('');
const regPhone = ref('');
const regPassword = ref('');

async function handleLogin() {
  authError.value = '';
  try {
    await loginUser(loginEmail.value, loginPassword.value);
    router.push('/profile');
  } catch (e: any) {
    authError.value = e?.data?.error || 'Ошибка входа';
  }
}

async function handleRegister() {
  authError.value = '';
  try {
    await registerUser(regName.value, regEmail.value, regPassword.value, regPhone.value || undefined);
    router.push('/profile');
  } catch (e: any) {
    authError.value = e?.data?.error || 'Ошибка регистрации';
  }
}
</script>

<style scoped>
.profile-page {
  padding: 40px 70px;
  max-width: 500px;
  margin: 0 auto;
}

.profile-loader {
  text-align: center;
  font-size: 18px;
}

.profile-cabinet {
  text-align: center;
}

.auth-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.auth-tabs button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  background: var(--gray);
  color: var(--gray-light);
}

.auth-tabs button.active {
  background: var(--red);
  color: white;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth-form input {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--gray-border);
  font-size: 14px;
}

.auth-form button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: var(--red);
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.auth-error {
  color: var(--red);
  font-size: 14px;
  text-align: center;
}
</style>
