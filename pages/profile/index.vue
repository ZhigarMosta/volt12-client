<template>
  <div class="profile-page">
    <Navigate :items="breadcrumbsItems" />

    <template v-if="loading">
      <div class="skeleton">
        <div class="sk-title" />
        <div class="sk-menu" />
      </div>
    </template>

    <template v-else-if="isAuthenticated">
      <h1 class="profile-title">Личный кабинет</h1>
      <div class="profile-layout">
        <nav class="profile-menu">
        <NuxtLink to="/favorites" class="profile-menu__item">
          <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5332 1C8.00107 1.00003 9.40835 1.58057 10.4453 2.61328L10.4463 2.61523C10.6948 2.86192 11.011 3.16422 11.3916 3.52148L12.0762 4.16504L12.7607 3.52051C13.1401 3.16354 13.455 2.86147 13.7031 2.61523C14.7358 1.59131 16.1332 1.01366 17.5918 1.00977C19.0504 1.00588 20.4511 1.57632 21.4893 2.59473C22.527 3.61289 23.1191 4.99705 23.1377 6.44629C23.1562 7.89571 22.5993 9.29465 21.5879 10.3389L12.292 19.5996C12.2349 19.6565 12.1567 19.6895 12.0742 19.6895C11.9918 19.6894 11.9126 19.6565 11.8555 19.5996L2.55762 10.3379C1.54776 9.29964 0.988638 7.90802 1 6.46387C1.01069 5.10996 1.52319 3.80961 2.43359 2.80957L2.62109 2.61328C3.65807 1.58061 5.06535 1 6.5332 1Z" stroke="#2D2D2D" stroke-width="2"/>
          </svg>
          <span>Избранное</span>
        </NuxtLink>

        <Divider
            width="100%"
            height="2"
            color="var(--gray-light)"
        />

        <NuxtLink to="/orders" class="profile-menu__item">
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.25 22.5C8.625 22.5 6.30208 21.7033 4.28125 20.11C2.26042 18.5167 0.947917 16.48 0.34375 14C0.260417 13.6875 0.322917 13.4012 0.53125 13.1412C0.739583 12.8812 1.02083 12.73 1.375 12.6875C1.70833 12.6458 2.01042 12.7083 2.28125 12.875C2.55208 13.0417 2.73958 13.2917 2.84375 13.625C3.34375 15.5 4.375 17.0313 5.9375 18.2188C7.5 19.4062 9.27083 20 11.25 20C13.6875 20 15.7554 19.1512 17.4537 17.4537C19.1521 15.7562 20.0008 13.6883 20 11.25C19.9992 8.81167 19.1504 6.74417 17.4537 5.0475C15.7571 3.35083 13.6892 2.50167 11.25 2.5C9.8125 2.5 8.46875 2.83333 7.21875 3.5C5.96875 4.16667 4.91667 5.08333 4.0625 6.25H6.25C6.60417 6.25 6.90125 6.37 7.14125 6.61C7.38125 6.85 7.50083 7.14667 7.5 7.5C7.49917 7.85333 7.37917 8.15042 7.14 8.39125C6.90083 8.63208 6.60417 8.75167 6.25 8.75H1.25C0.895833 8.75 0.599167 8.63 0.36 8.39C0.120833 8.15 0.000833333 7.85333 0 7.5V2.5C0 2.14583 0.12 1.84917 0.36 1.61C0.6 1.37083 0.896667 1.25083 1.25 1.25C1.60333 1.24917 1.90042 1.36917 2.14125 1.61C2.38208 1.85083 2.50167 2.1475 2.5 2.5V4.1875C3.5625 2.85417 4.85958 1.82292 6.39125 1.09375C7.92292 0.364583 9.5425 0 11.25 0C12.8125 0 14.2762 0.297083 15.6412 0.89125C17.0062 1.48542 18.1938 2.28708 19.2038 3.29625C20.2138 4.30542 21.0158 5.49292 21.61 6.85875C22.2042 8.22458 22.5008 9.68833 22.5 11.25C22.4992 12.8117 22.2025 14.2754 21.61 15.6412C21.0175 17.0071 20.2154 18.1946 19.2038 19.2038C18.1921 20.2129 17.0046 21.015 15.6412 21.61C14.2779 22.205 12.8142 22.5017 11.25 22.5ZM12.5 10.75L15.625 13.875C15.8542 14.1042 15.9688 14.3958 15.9688 14.75C15.9688 15.1042 15.8542 15.3958 15.625 15.625C15.3958 15.8542 15.1042 15.9688 14.75 15.9688C14.3958 15.9688 14.1042 15.8542 13.875 15.625L10.375 12.125C10.25 12 10.1562 11.8596 10.0938 11.7037C10.0312 11.5479 10 11.3863 10 11.2188V6.25C10 5.89583 10.12 5.59917 10.36 5.36C10.6 5.12083 10.8967 5.00083 11.25 5C11.6033 4.99917 11.9004 5.11917 12.1413 5.36C12.3821 5.60083 12.5017 5.8975 12.5 6.25V10.75Z" fill="#2D2D2D"/>
          </svg>
          <span>История заказов</span>
        </NuxtLink>
      </nav>

        <div class="profile-info">
          <div class="profile-info__fields">
            <div
              class="profile-info__field"
              :class="{ 'profile-info__field--disabled': !isEmailVerified }"
              :title="!isEmailVerified ? 'Подтвердите почту, чтобы изменить имя' : ''"
            >
              <span class="profile-info__label">Имя</span>
              <input
                class="profile-info__input"
                v-model="editName"
                type="text"
                placeholder="Ваше имя"
                maxlength="255"
                :disabled="!isEmailVerified"
                @blur="saveField('name', editName)"
                @keydown.enter.prevent="saveField('name', editName)"
              />
            </div>
            <div class="profile-info__field">
              <span class="profile-info__label">Электронная почта</span>
              <span class="profile-info__value">{{ user?.email }}</span>
              <span v-if="isEmailVerified" class="profile-info__badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#4caf50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Почта подтверждена
              </span>
              <template v-if="user?.email_verified === false">
                <button
                  v-if="verifyState !== 'sent'"
                  class="profile-info__verify"
                  :disabled="verifyState === 'loading'"
                  @click="onVerifyEmail"
                >
                  {{ verifyState === 'loading' ? 'Отправка...' : 'Подтвердите почту' }}
                </button>
                <template v-else>
                  <div class="profile-info__code">
                    <input
                      class="profile-info__code-input"
                      v-model="codeInput"
                      type="text"
                      inputmode="numeric"
                      maxlength="6"
                      placeholder="Код из письма"
                      :disabled="codeState === 'loading'"
                      @keydown.enter.prevent="onConfirmCode"
                    />
                    <button
                      class="profile-info__verify"
                      :disabled="codeState === 'loading' || codeInput.length !== 6"
                      @click="onConfirmCode"
                    >
                      {{ codeState === 'loading' ? 'Проверка...' : 'Подтвердить' }}
                    </button>
                  </div>
                  <span v-if="codeState === 'error'" class="profile-info__verify-error">{{ codeError }}</span>
                  <button
                    class="profile-info__verify profile-info__verify--muted"
                    :disabled="verifyState === 'loading' || resendCooldown > 0"
                    @click="onVerifyEmail"
                  >
                    {{ resendCooldown > 0 ? `Отправить код повторно через ${resendCooldown}с` : 'Отправить код повторно' }}
                  </button>
                </template>
                <span v-if="verifyState === 'error'" class="profile-info__verify-error">{{ verifyError }}</span>
              </template>
            </div>
            <div
              class="profile-info__field"
              :class="{ 'profile-info__field--disabled': !isEmailVerified }"
              :title="!isEmailVerified ? 'Подтвердите почту, чтобы изменить телефон' : ''"
            >
              <span class="profile-info__label">Телефон</span>
              <input
                class="profile-info__input"
                v-model="editPhone"
                type="tel"
                placeholder="+7 (999) 999-99-99"
                maxlength="255"
                :disabled="!isEmailVerified"
                @blur="saveField('phone', editPhone)"
                @keydown.enter.prevent="saveField('phone', editPhone)"
              />
            </div>
            <div
              class="profile-info__field"
              :class="{ 'profile-info__field--disabled': !isEmailVerified }"
              :title="!isEmailVerified ? 'Подтвердите почту, чтобы изменить пароль' : ''"
            >
              <span class="profile-info__label">Пароль</span>

              <span v-if="!isEmailVerified" class="profile-info__value">••••••••</span>

              <button
                v-if="isEmailVerified && passwordStep === 'idle'"
                class="profile-info__verify"
                @click="passwordStep = 'form'"
              >
                Изменить пароль
              </button>

              <template v-if="isEmailVerified && passwordStep === 'form'">
                <input
                  class="profile-info__code-input profile-info__code-input--full"
                  v-model="newPassword"
                  type="password"
                  placeholder="Новый пароль"
                  :disabled="passwordState === 'loading'"
                />
                <input
                  class="profile-info__code-input profile-info__code-input--full"
                  v-model="newPasswordConfirm"
                  type="password"
                  placeholder="Повторите пароль"
                  :disabled="passwordState === 'loading'"
                  @keydown.enter.prevent="onRequestPasswordChange"
                />
                <span v-if="passwordFormError" class="profile-info__verify-error">{{ passwordFormError }}</span>
                <div class="profile-info__code">
                  <button
                    class="profile-info__verify"
                    :disabled="passwordState === 'loading'"
                    @click="onRequestPasswordChange"
                  >
                    {{ passwordState === 'loading' ? 'Отправка...' : 'Отправить код' }}
                  </button>
                  <button
                    class="profile-info__verify profile-info__verify--muted"
                    :disabled="passwordState === 'loading'"
                    @click="cancelPasswordChange"
                  >
                    Отмена
                  </button>
                </div>
              </template>

              <template v-if="isEmailVerified && passwordStep === 'code'">
                <span class="profile-info__hint">Код отправлен на {{ user?.email }}</span>
                <div class="profile-info__code">
                  <input
                    class="profile-info__code-input"
                    v-model="passwordCodeInput"
                    type="text"
                    inputmode="numeric"
                    maxlength="6"
                    placeholder="Код из письма"
                    :disabled="passwordState === 'loading'"
                    @keydown.enter.prevent="onConfirmPasswordChange"
                  />
                  <button
                    class="profile-info__verify"
                    :disabled="passwordState === 'loading' || passwordCodeInput.length !== 6"
                    @click="onConfirmPasswordChange"
                  >
                    {{ passwordState === 'loading' ? 'Проверка...' : 'Подтвердить' }}
                  </button>
                </div>
                <span v-if="passwordCodeError" class="profile-info__verify-error">{{ passwordCodeError }}</span>
                <button
                  class="profile-info__verify profile-info__verify--muted"
                  :disabled="passwordState === 'loading'"
                  @click="onResendPasswordCode"
                >
                  Отправить код повторно
                </button>
              </template>

              <span v-if="passwordStep === 'done'" class="profile-info__verify-sent">Пароль успешно изменён</span>
            </div>
          </div>
          <div class="profile-info__actions">
            <button class="profile-info__logout" @click="handleLogout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12H9" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Выйти
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <h1 class="profile-title">Личный кабинет</h1>
      <p class="profile-guest">
        <button class="profile-guest__link" @click="openAuthModal">Войдите</button>
        или
        <button class="profile-guest__link" @click="openAuthModal">зарегистрируйтесь</button>
        чтобы получить доступ к личному кабинету
      </p>
      <AuthModal v-model="showAuthModal" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { updateProfile, sendVerificationEmail, verifyEmail, requestPasswordChange, confirmPasswordChange } from '~/services/authApi';

useHead({ title: 'Личный кабинет — Мастер 12 Вольт' });

const { user, loading, isAuthenticated, logoutUser } = useAuth();
const { showAuthModal, openAuthModal } = useAuthModal();

const isEmailVerified = computed(() => user.value?.email_verified === true);

const breadcrumbsItems = [
  { to: '/', text: 'Главная' },
  { to: '/profile', text: 'Личный кабинет' },
];

const editName = ref('');
const editPhone = ref('');

watch(user, (u) => {
  if (u) {
    editName.value = u.name ?? '';
    editPhone.value = u.phone ?? '';
  }
}, { immediate: true });

async function saveField(field: 'name' | 'phone', value: string) {
  if (!user.value) return;
  if (!isEmailVerified.value) return;
  if (field === 'name' && value === user.value.name) return;
  if (field === 'phone' && value === (user.value.phone ?? '')) return;
  try {
    const updated = await updateProfile({ [field]: value });
    user.value = updated;
  } catch {}
}

async function handleLogout() {
  await logoutUser();
}

const verifyState = ref<'idle' | 'loading' | 'sent' | 'error'>('idle');
const verifyError = ref('');
const resendCooldown = ref(0);
let resendTimer: ReturnType<typeof setInterval> | null = null;

function startResendCooldown(seconds = 45) {
  resendCooldown.value = seconds;
  if (resendTimer) clearInterval(resendTimer);
  resendTimer = setInterval(() => {
    resendCooldown.value -= 1;
    if (resendCooldown.value <= 0 && resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
  }, 1000);
}

onUnmounted(() => {
  if (resendTimer) clearInterval(resendTimer);
});

async function onVerifyEmail() {
  verifyState.value = 'loading';
  verifyError.value = '';
  try {
    await sendVerificationEmail();
    verifyState.value = 'sent';
    codeInput.value = '';
    codeState.value = 'idle';
    codeError.value = '';
    startResendCooldown();
  } catch (e: any) {
    verifyError.value = e?.data?.error ?? 'Ошибка отправки';
    verifyState.value = 'error';
  }
}

const codeInput = ref('');
const codeState = ref<'idle' | 'loading' | 'error'>('idle');
const codeError = ref('');

async function onConfirmCode() {
  if (codeInput.value.length !== 6) return;
  codeState.value = 'loading';
  codeError.value = '';
  try {
    await verifyEmail(codeInput.value);
    if (user.value) user.value = { ...user.value, email_verified: true };
    verifyState.value = 'idle';
    codeInput.value = '';
    codeState.value = 'idle';
  } catch (e: any) {
    codeError.value = e?.data?.error ?? 'Неверный код';
    codeState.value = 'error';
  }
}

const passwordStep = ref<'idle' | 'form' | 'code' | 'done'>('idle');
const passwordState = ref<'idle' | 'loading' | 'error'>('idle');
const newPassword = ref('');
const newPasswordConfirm = ref('');
const passwordFormError = ref('');
const passwordCodeInput = ref('');
const passwordCodeError = ref('');

function cancelPasswordChange() {
  passwordStep.value = 'idle';
  newPassword.value = '';
  newPasswordConfirm.value = '';
  passwordFormError.value = '';
  passwordCodeInput.value = '';
  passwordCodeError.value = '';
}

async function onRequestPasswordChange() {
  passwordFormError.value = '';
  if (newPassword.value.length < 6) {
    passwordFormError.value = 'Пароль должен содержать минимум 6 символов';
    return;
  }
  if (newPassword.value !== newPasswordConfirm.value) {
    passwordFormError.value = 'Пароли не совпадают';
    return;
  }
  passwordState.value = 'loading';
  try {
    await requestPasswordChange(newPassword.value);
    passwordStep.value = 'code';
    passwordState.value = 'idle';
  } catch (e: any) {
    passwordFormError.value = e?.data?.error ?? 'Ошибка отправки';
    passwordState.value = 'error';
  }
}

async function onResendPasswordCode() {
  passwordCodeError.value = '';
  passwordState.value = 'loading';
  try {
    await requestPasswordChange(newPassword.value);
    passwordState.value = 'idle';
  } catch (e: any) {
    passwordCodeError.value = e?.data?.error ?? 'Ошибка отправки';
    passwordState.value = 'error';
  }
}

async function onConfirmPasswordChange() {
  if (passwordCodeInput.value.length !== 6) return;
  passwordCodeError.value = '';
  passwordState.value = 'loading';
  try {
    await confirmPasswordChange(passwordCodeInput.value);
    passwordStep.value = 'done';
    newPassword.value = '';
    newPasswordConfirm.value = '';
    passwordCodeInput.value = '';
    passwordState.value = 'idle';
  } catch (e: any) {
    passwordCodeError.value = e?.data?.error ?? 'Неверный код';
    passwordState.value = 'error';
  }
}
</script>

<style scoped>
.profile-page {
  padding: 0 70px 80px;
}

.profile-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 30px;
  color: var(--black);
  margin-bottom: 24px;
}

.profile-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 288px;
  border-radius: 16px;
  overflow: hidden;
  background: var(--gray);
  padding: 0 18px;
}

.profile-menu__item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--black);
  text-decoration: none;
  transition: background 0.15s;
}

.profile-menu__item svg {
  flex-shrink: 0;
}

.profile-guest {
  font-family: 'NT Somic', sans-serif;
  font-size: 15px;
  color: var(--black);
}

.profile-guest__link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: 'NT Somic', sans-serif;
  font-size: 15px;
  color: var(--red);
  text-decoration: underline;
}

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sk-title {
  height: 36px;
  width: 280px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.sk-menu {
  height: 180px;
  width: 344px;
  border-radius: 16px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.profile-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.profile-info {
  flex: 1;
  background: var(--gray);
  border-radius: 16px;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-info__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.profile-info__field {
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-info__label {
  font-family: 'NT Somic', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-light);
}

.profile-info__value {
  font-family: 'NT Somic', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--black);
}

.profile-info__badge {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'NT Somic', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #4caf50;
}

.profile-info__field--disabled {
  cursor: not-allowed;
}

.profile-info__field--disabled .profile-info__label,
.profile-info__field--disabled .profile-info__input {
  opacity: 0.6;
}

.profile-info__field--disabled .profile-info__input {
  cursor: not-allowed;
}

.profile-info__field--disabled:hover {
  background: var(--gray-lighter);
}

.profile-info__verify {
  margin-top: 4px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: 'NT Somic', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--red);
  text-decoration: underline;
  text-align: left;
}

.profile-info__verify:disabled {
  opacity: 0.6;
  cursor: default;
}

.profile-info__verify--muted {
  color: var(--gray-dark);
}

.profile-info__verify-sent {
  margin-top: 4px;
  font-family: 'NT Somic', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #4caf50;
}

.profile-info__code {
  margin-top: 6px;
  display: flex;
  gap: 8px;
}

.profile-info__code-input {
  width: 110px;
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  background: var(--gray);
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  outline: none;
}

.profile-info__code-input--full {
  width: 100%;
  margin-top: 4px;
}

.profile-info__hint {
  margin-top: 4px;
  font-family: 'NT Somic', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-dark);
}

.profile-info__verify-error {
  margin-top: 2px;
  font-family: 'NT Somic', sans-serif;
  font-size: 12px;
  color: var(--red);
}

.profile-info__input {
  font-family: 'NT Somic', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--black);
  background: none;
  border: none;
  outline: none;
  width: 100%;
  padding: 0;
}

.profile-info__actions {
  display: flex;
  gap: 16px;
}

.profile-info__logout {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  padding: 0;
}

.profile-info__logout:hover {
  opacity: 0.7;
}

@media (max-width: 1100px) {
  .profile-page {
    padding: 0 37px 60px;
  }

  .profile-layout {
    flex-direction: column;
  }

  .profile-menu {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 744px) {
  .profile-page {
    padding: 0 20px 60px;
  }

  .profile-info__fields {
    grid-template-columns: 1fr;
  }
}
</style>
