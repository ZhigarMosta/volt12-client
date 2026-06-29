<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="modal">
        <button class="modal__close" @click="$emit('update:modelValue', false)">
          <svg width="14" height="14" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.537428 0H3.89635L7.01344 4.02444L10.1574 0H13.4626L8.67946 6.14257L14 13H10.6411L6.95969 8.26069L3.27831 13H0L5.32054 6.19552L0.537428 0Z" fill="#2D2D2D"/>
          </svg>
        </button>

        <div class="modal__tabs">
          <button class="modal__tab" :class="{ 'modal__tab--active': mode === 'login' }" @click="mode = 'login'">Войти</button>
          <button class="modal__tab" :class="{ 'modal__tab--active': mode === 'register' }" @click="mode = 'register'">Регистрация</button>
        </div>

        <form class="modal__form" @submit.prevent="onSubmit">
          <template v-if="mode === 'register'">
            <div class="modal__field">
              <label class="modal__label">Имя</label>
              <input v-model="name" class="modal__input" type="text" placeholder="Ваше имя" required />
            </div>
            <div class="modal__field">
              <label class="modal__label">Телефон</label>
              <input v-model="phone" class="modal__input" type="tel" placeholder="+7 (999) 999-99-99" />
            </div>
          </template>

          <div class="modal__field">
            <label class="modal__label">Email</label>
            <input v-model="email" class="modal__input" type="email" placeholder="example@mail.ru" required />
          </div>

          <div class="modal__field">
            <label class="modal__label">Пароль</label>
            <input v-model="password" class="modal__input" type="password" placeholder="••••••••" required />
          </div>

          <p v-if="error" class="modal__error">{{ error }}</p>

          <UiButton type="submit" variant="red" fullWidth :disabled="loading">
            {{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
          </UiButton>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const { loginUser, registerUser } = useAuth();

const mode = ref<'login' | 'register'>('login');
const name = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

watch(() => props.modelValue, (val) => {
  if (!val) {
    name.value = '';
    phone.value = '';
    email.value = '';
    password.value = '';
    error.value = '';
    loading.value = false;
  }
});

watch(mode, () => { error.value = ''; });

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    if (mode.value === 'login') {
      await loginUser(email.value, password.value);
    } else {
      await registerUser(name.value, email.value, password.value, phone.value || undefined);
    }
    emit('update:modelValue', false);
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Произошла ошибка';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal {
  position: relative;
  background: var(--white, #fff);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.16);
}

.modal__close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  line-height: 0;
}

.modal__tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 28px;
}

.modal__tab {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--gray-light);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-bottom: 2px solid transparent;
  padding-bottom: 4px;
  transition: color 0.2s, border-color 0.2s;
}

.modal__tab--active {
  color: var(--black);
  border-bottom-color: var(--red);
}

.modal__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal__label {
  font-family: 'NT Somic', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-light);
}

.modal__input {
  height: 48px;
  border: 1px solid rgba(185, 185, 185, 0.6);
  border-radius: 8px;
  padding: 0 16px;
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  color: var(--black);
  outline: none;
  transition: border-color 0.2s;
}

.modal__input:focus {
  border-color: var(--red);
}

.modal__error {
  font-family: 'NT Somic', sans-serif;
  font-size: 13px;
  color: var(--red);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .modal {
    margin: 0 16px;
    padding: 32px 24px;
  }
}
</style>
