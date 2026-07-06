<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal">
        <button class="modal__close" @click="close">
          <svg width="14" height="14" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.537428 0H3.89635L7.01344 4.02444L10.1574 0H13.4626L8.67946 6.14257L14 13H10.6411L6.95969 8.26069L3.27831 13H0L5.32054 6.19552L0.537428 0Z" fill="#2D2D2D"/>
          </svg>
        </button>

        <template v-if="!success">
          <h3 class="modal__title">{{ title }}</h3>

          <form class="modal__form" @submit.prevent="onSubmit">
            <div class="modal__field">
              <label class="modal__label">Имя</label>
              <input v-model="name" class="modal__input" type="text" placeholder="Ваше имя" maxlength="255" required />
              <p v-if="nameError" class="modal__field-error">{{ nameError }}</p>
            </div>

            <div class="modal__field">
              <label class="modal__label">Телефон</label>
              <PhoneInput v-model="phone" class="modal__input" placeholder="+7 (999) 999-99-99" maxlength="18" required />
              <p v-if="phoneError" class="modal__field-error">{{ phoneError }}</p>
            </div>

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
              <p v-if="emailError" class="modal__field-error">{{ emailError }}</p>
            </div>

            <div class="modal__field">
              <label class="modal__label">Комментарий</label>
              <textarea v-model="message" class="modal__input modal__textarea" placeholder="Например, марка и модель авто" rows="3" />
            </div>

            <p v-if="formError" class="modal__error">{{ formError }}</p>

            <UiButton type="submit" variant="red" fullWidth :disabled="submitting || isRateLimited">
              {{ submitting ? 'Отправка...' : 'Записаться' }}
            </UiButton>
          </form>
        </template>

        <template v-else>
          <h3 class="modal__title">Заявка отправлена</h3>
          <p class="modal__hint">Письмо с подтверждением придёт на {{ email }}. Мы свяжемся с вами в ближайшее время.</p>
          <UiButton variant="red" fullWidth @click="close">Готово</UiButton>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { sendBooking, mapBookingFieldError, type BookingType } from '~/services/bookingApi';
import { isValidEmail, sanitizeEmailInput } from '~/utils/email';
import { isCompleteRuPhone } from '~/utils/phone';
import { useClientContactStore } from '~/stores/clientContact';

const props = defineProps<{ modelValue: boolean; type: BookingType }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const clientContact = useClientContactStore();

const TITLES: Record<BookingType, string> = {
  alarm_selection: 'Бесплатный подбор сигнализации',
  alarm_installation: 'Запись на установку сигнализации',
};

const title = computed(() => TITLES[props.type]);

const name = ref('');
const phone = ref('');
const email = ref('');
const message = ref('');

const nameError = ref('');
const phoneError = ref('');
const emailError = ref('');
const formError = ref('');

const submitting = ref(false);
const isRateLimited = ref(false);
const success = ref(false);

function close() {
  emit('update:modelValue', false);
}

function resetState() {
  name.value = '';
  phone.value = '';
  email.value = '';
  message.value = '';
  nameError.value = '';
  phoneError.value = '';
  emailError.value = '';
  formError.value = '';
  submitting.value = false;
  isRateLimited.value = false;
  success.value = false;
}

watch(() => props.modelValue, (open) => {
  if (open) {
    name.value = clientContact.name;
    phone.value = clientContact.phone;
    email.value = clientContact.email;
  } else {
    resetState();
  }
});

function validate(): boolean {
  phoneError.value = isCompleteRuPhone(phone.value) ? '' : 'Введите номер телефона';
  emailError.value = isValidEmail(email.value) ? '' : 'Введите корректный email';
  return !phoneError.value && !emailError.value;
}

function applyFieldErrors(codes: string[]) {
  nameError.value = '';
  phoneError.value = '';
  emailError.value = '';
  formError.value = '';

  for (const code of codes) {
    if (code === 'user_name is required') nameError.value = mapBookingFieldError(code);
    else if (code === 'user_phone is required') phoneError.value = mapBookingFieldError(code);
    else if (code === 'user_email is required' || code === 'user_email is invalid') emailError.value = mapBookingFieldError(code);
    else formError.value = mapBookingFieldError(code);
  }
}

async function onSubmit() {
  formError.value = '';
  if (!validate()) return;

  submitting.value = true;
  try {
    const result = await sendBooking({
      type: props.type,
      user_name: name.value.trim(),
      user_phone: phone.value.trim(),
      user_email: email.value.trim(),
      message: message.value.trim(),
    });

    if (result.ok) {
      success.value = true;
      return;
    }

    if (result.kind === 'validation') {
      applyFieldErrors(result.fieldErrors);
    } else if (result.kind === 'rate_limit') {
      formError.value = result.message;
      isRateLimited.value = true;
    } else {
      formError.value = result.message;
    }
  } finally {
    submitting.value = false;
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

.modal__title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--black);
  margin: 0 0 20px;
}

.modal__hint {
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  color: var(--gray-dark);
  margin: 0 0 24px;
  line-height: 1.4;
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

.modal__textarea {
  height: auto;
  padding: 12px 16px;
  resize: vertical;
  font-family: 'NT Somic', sans-serif;
}

.modal__input:focus {
  border-color: var(--red);
}

.modal__field-error {
  font-family: 'NT Somic', sans-serif;
  font-size: 12px;
  color: var(--red);
  margin: 0;
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
