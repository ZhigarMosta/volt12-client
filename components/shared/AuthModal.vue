<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="modal">
        <button class="modal__close" @click="$emit('update:modelValue', false)">
          <svg width="14" height="14" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.537428 0H3.89635L7.01344 4.02444L10.1574 0H13.4626L8.67946 6.14257L14 13H10.6411L6.95969 8.26069L3.27831 13H0L5.32054 6.19552L0.537428 0Z" fill="#2D2D2D"/>
          </svg>
        </button>

        <template v-if="forgotStep === 'none'">
          <div class="modal__tabs">
            <button class="modal__tab" :class="{ 'modal__tab--active': mode === 'login' }" @click="mode = 'login'">Войти</button>
            <button class="modal__tab" :class="{ 'modal__tab--active': mode === 'register' }" @click="mode = 'register'">Регистрация</button>
          </div>

          <form class="modal__form" @submit.prevent="onSubmit">
            <template v-if="mode === 'register'">
              <div class="modal__field">
                <label class="modal__label">Имя</label>
                <input v-model="name" class="modal__input" type="text" placeholder="Ваше имя" maxlength="255" required />
              </div>
              <div class="modal__field">
                <label class="modal__label">Телефон</label>
                <PhoneInput v-model="phone" class="modal__input" placeholder="+7 (999) 999-99-99" maxlength="18" />
              </div>
            </template>

            <div class="modal__field">
              <label class="modal__label">Email</label>
              <input
                v-model="email"
                class="modal__input"
                type="email"
                placeholder="example@mail.ru"
                maxlength="255"
                required
                @input="email = sanitizeEmailInput(email)"
              />
            </div>

            <div class="modal__field">
              <label class="modal__label">Пароль</label>
              <input v-model="password" class="modal__input" type="password" placeholder="••••••••" required />
            </div>

            <button
              v-if="mode === 'login'"
              type="button"
              class="modal__link"
              @click="openForgotPassword"
            >
              Забыли пароль?
            </button>

            <p v-if="error" class="modal__error">{{ error }}</p>

            <UiButton type="submit" variant="red" fullWidth :disabled="loading">
              {{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
            </UiButton>
          </form>
        </template>

        <template v-else-if="forgotStep === 'email'">
          <h3 class="modal__title">Восстановление пароля</h3>
          <form class="modal__form" @submit.prevent="onForgotSubmit">
            <div class="modal__field">
              <label class="modal__label">Email</label>
              <input
                v-model="forgotEmail"
                class="modal__input"
                type="email"
                placeholder="example@mail.ru"
                maxlength="255"
                required
                @input="forgotEmail = sanitizeEmailInput(forgotEmail)"
              />
            </div>

            <p v-if="forgotError" class="modal__error">{{ forgotError }}</p>

            <UiButton type="submit" variant="red" fullWidth :disabled="forgotLoading">
              {{ forgotLoading ? 'Отправка...' : 'Отправить код' }}
            </UiButton>
            <button type="button" class="modal__link" @click="backToLogin">Назад ко входу</button>
          </form>
        </template>

        <template v-else-if="forgotStep === 'reset'">
          <h3 class="modal__title">Восстановление пароля</h3>
          <p class="modal__hint">Если email зарегистрирован и подтверждён — письмо с кодом отправлено на {{ forgotEmail }}</p>
          <form class="modal__form" @submit.prevent="onResetSubmit">
            <div class="modal__field">
              <label class="modal__label">Код из письма</label>
              <input
                v-model="resetCode"
                class="modal__input"
                type="text"
                inputmode="numeric"
                maxlength="4"
                placeholder="0000"
                required
              />
            </div>
            <div class="modal__field">
              <label class="modal__label">Новый пароль</label>
              <input v-model="resetPasswordValue" class="modal__input" type="password" placeholder="••••••••" required />
            </div>
            <div class="modal__field">
              <label class="modal__label">Повторите пароль</label>
              <input v-model="resetPasswordConfirm" class="modal__input" type="password" placeholder="••••••••" required />
            </div>

            <p v-if="resetError" class="modal__error">{{ resetError }}</p>

            <UiButton type="submit" variant="red" fullWidth :disabled="resetLoading">
              {{ resetLoading ? 'Сохранение...' : 'Сбросить пароль' }}
            </UiButton>
            <button type="button" class="modal__link" @click="forgotStep = 'email'">Отправить код повторно</button>
          </form>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { forgotPassword, resetPassword } from '~/services/authApi';
import { isValidEmail, sanitizeEmailInput } from '~/utils/email';

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

const { showToast } = useToast();

const forgotStep = ref<'none' | 'email' | 'reset'>('none');
const forgotEmail = ref('');
const forgotError = ref('');
const forgotLoading = ref(false);
const resetCode = ref('');
const resetPasswordValue = ref('');
const resetPasswordConfirm = ref('');
const resetError = ref('');
const resetLoading = ref(false);

function resetForgotState() {
  forgotStep.value = 'none';
  forgotEmail.value = '';
  forgotError.value = '';
  forgotLoading.value = false;
  resetCode.value = '';
  resetPasswordValue.value = '';
  resetPasswordConfirm.value = '';
  resetError.value = '';
  resetLoading.value = false;
}

function openForgotPassword() {
  forgotEmail.value = email.value;
  forgotStep.value = 'email';
  forgotError.value = '';
}

function backToLogin() {
  resetForgotState();
  mode.value = 'login';
}

watch(() => props.modelValue, (val) => {
  if (!val) {
    name.value = '';
    phone.value = '';
    email.value = '';
    password.value = '';
    error.value = '';
    loading.value = false;
    resetForgotState();
  }
});

watch(mode, () => { error.value = ''; });

async function onSubmit() {
  error.value = '';
  if (!isValidEmail(email.value)) {
    error.value = 'Некорректный email';
    return;
  }
  loading.value = true;
  try {
    if (mode.value === 'login') {
      await loginUser(email.value, password.value);
    } else {
      await registerUser(name.value, email.value, password.value, phone.value || undefined);
    }
    emit('update:modelValue', false);
  } catch (e: any) {
    error.value = e?.data?.error ?? e?.message ?? 'Произошла ошибка';
  } finally {
    loading.value = false;
  }
}

async function onForgotSubmit() {
  forgotError.value = '';
  if (!isValidEmail(forgotEmail.value)) {
    forgotError.value = 'Некорректный email';
    return;
  }
  forgotLoading.value = true;
  try {
    await forgotPassword(forgotEmail.value);
    forgotStep.value = 'reset';
  } catch (e: any) {
    forgotError.value = e?.data?.error ?? e?.message ?? 'Произошла ошибка';
  } finally {
    forgotLoading.value = false;
  }
}

async function onResetSubmit() {
  resetError.value = '';
  if (resetCode.value.length !== 4) {
    resetError.value = 'Введите код из 4 цифр';
    return;
  }
  if (resetPasswordValue.value.length < 6) {
    resetError.value = 'Пароль должен содержать минимум 6 символов';
    return;
  }
  if (resetPasswordValue.value !== resetPasswordConfirm.value) {
    resetError.value = 'Пароли не совпадают';
    return;
  }
  resetLoading.value = true;
  try {
    await resetPassword(forgotEmail.value, resetCode.value, resetPasswordValue.value);
    resetForgotState();
    mode.value = 'login';
    emit('update:modelValue', false);
    showToast('Пароль успешно изменён');
  } catch (e: any) {
    resetError.value = e?.data?.error ?? e?.message ?? 'Произошла ошибка';
  } finally {
    resetLoading.value = false;
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

.modal__title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--black);
  margin: 0 0 20px;
}

.modal__hint {
  font-family: 'NT Somic', sans-serif;
  font-size: 13px;
  color: var(--gray-dark);
  margin: -12px 0 16px;
}

.modal__link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  align-self: flex-start;
  font-family: 'NT Somic', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--red);
  text-decoration: underline;
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
