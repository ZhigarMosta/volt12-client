<template>
  <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="success ? 'Заявка принята' : 'Купить в один клик'">
        <button class="modal__close" type="button" aria-label="Закрыть" @click="close">
          <svg width="14" height="14" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.537428 0H3.89635L7.01344 4.02444L10.1574 0H13.4626L8.67946 6.14257L14 13H10.6411L6.95969 8.26069L3.27831 13H0L5.32054 6.19552L0.537428 0Z" fill="#2D2D2D"/>
          </svg>
        </button>

        <template v-if="!success">
          <h3 class="modal__title">Купить в один клик</h3>
          <p class="modal__hint">
            Заполните форму — менеджер перезвонит, подтвердит заказ и уточнит доставку.
          </p>

          <div class="modal__scroll">
            <div class="product">
              <ImageWithSkeleton
                  v-if="imageUrl"
                  :src="imageUrl"
                  class="product__img"
                  :alt="product.name"
                  loading="eager"
              />
              <NoImagePlaceholder v-else class="product__img" label="" :icon-size="24" radius="8px" />
              <div class="product__info">
                <p class="product__name">{{ product.name }}</p>
                <p class="product__price">{{ formatPrice(product.price) }}</p>
              </div>
            </div>

            <form id="quick-order-form" class="modal__form" @submit.prevent="onSubmit">
              <div class="modal__field">
                <label class="modal__label">Количество</label>
                <div class="qty">
                  <button class="qty__btn" type="button" aria-label="Уменьшить" @click="changeQuantity(-1)">−</button>
                  <input
                      v-model="quantityInput"
                      class="qty__value"
                      type="text"
                      inputmode="numeric"
                      aria-label="Количество"
                      @blur="normalizeQuantity"
                  />
                  <button class="qty__btn" type="button" aria-label="Увеличить" @click="changeQuantity(1)">+</button>
                </div>
                <p v-if="errors.quantity" class="modal__field-error">{{ errors.quantity }}</p>
              </div>

              <div class="modal__field">
                <label class="modal__label">Имя</label>
                <input v-model="name" class="modal__input" type="text" placeholder="Ваше имя" maxlength="255" />
                <p v-if="errors.name" class="modal__field-error">{{ errors.name }}</p>
              </div>

              <div class="modal__field">
                <label class="modal__label">Телефон</label>
                <PhoneInput v-model="phone" class="modal__input" placeholder="+7 (999) 999-99-99" maxlength="18" />
                <p v-if="errors.phone" class="modal__field-error">{{ errors.phone }}</p>
              </div>

              <div class="modal__field">
                <label class="modal__label">Email</label>
                <input
                    v-model="email"
                    class="modal__input"
                    type="email"
                    placeholder="example@mail.ru"
                    maxlength="255"
                    @input="email = sanitizeEmailInput(email)"
                />
                <p v-if="errors.email" class="modal__field-error">{{ errors.email }}</p>
              </div>

              <div class="modal__field">
                <label class="modal__label">Комментарий</label>
                <textarea
                    v-model="comment"
                    class="modal__input modal__textarea"
                    placeholder="Например, перезвоните после 18:00"
                    maxlength="1000"
                    rows="3"
                />
                <p v-if="errors.comment" class="modal__field-error">{{ errors.comment }}</p>
              </div>

              <div class="modal__field">
                <label class="agree">
                  <input v-model="agree" class="agree__input" type="checkbox" />
                  <span class="agree__box" aria-hidden="true">
                    <svg v-if="agree" width="12" height="10" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 12L5.3375 5.85086L0.2625 0H3.55833L7.175 4.17591L10.6167 0H13.7667L8.60417 5.85086L14 12H10.7042L6.825 7.52581L3.2375 12H0Z" fill="var(--red)"/>
                    </svg>
                  </span>
                  <span class="agree__text">
                    Согласен с
                    <NuxtLink to="/privacy-policy" target="_blank" class="agree__link">политикой обработки персональных данных</NuxtLink>
                  </span>
                </label>
                <p v-if="errors.agree" class="modal__field-error">{{ errors.agree }}</p>
              </div>
            </form>
          </div>

          <div class="modal__footer">
            <p v-if="errors.form" class="modal__error">{{ errors.form }}</p>
            <UiButton
                type="submit"
                form="quick-order-form"
                variant="red"
                full-width
                :disabled="!agree || submitting"
            >
              {{ submitting ? 'Отправка...' : 'Отправить заявку' }}
            </UiButton>
          </div>
        </template>

        <template v-else>
          <h3 class="modal__title">Заявка принята</h3>
          <p class="modal__hint">
            Номер заказа <span class="order-id">#{{ orderId }}</span>. Менеджер перезвонит для подтверждения
            и уточнит детали доставки.
          </p>
          <UiButton variant="red" full-width @click="close">Готово</UiButton>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { sendQuickOrder, mapQuickOrderError, type QuickOrderField } from '~/services/quickOrderApi';
import { isValidEmail, sanitizeEmailInput } from '~/utils/email';
import { extractPhoneDigits } from '~/utils/phone';
import { formatPrice } from '~/utils/format';
import { useClientContactStore } from '~/stores/clientContact';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;
const MAX_NAME_LENGTH = 255;
const MAX_COMMENT_LENGTH = 1000;

const props = withDefaults(
    defineProps<{
      modelValue: boolean;
      /** Товар со страницы — данные из detail, дополнительных запросов не делаем. */
      product: { id: number; name: string; price: number; imgLink: string | null };
      /** Стартовое количество: если на странице есть счётчик корзины — его значение. */
      initialQuantity?: number;
    }>(),
    { initialQuantity: 1 },
);
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const clientContact = useClientContactStore();
const { user } = useAuth();
const { showToast } = useToast();
const config = useRuntimeConfig();

const imageUrl = computed(() => {
  if (!props.product.imgLink) return '';
  const base = (config.public.apiBase as string).replace(/\/+$/, '');
  return `${base}/${props.product.imgLink.replace(/^\/+/, '')}`;
});

const quantityInput = ref(String(MIN_QUANTITY));
const name = ref('');
const phone = ref('');
const email = ref('');
const comment = ref('');
const agree = ref(false);

const submitting = ref(false);
const success = ref(false);
const orderId = ref<number | null>(null);

type FieldErrors = Partial<Record<QuickOrderField, string>>;
const errors = ref<FieldErrors>({});

const quantity = computed(() => {
  const parsed = Number.parseInt(quantityInput.value, 10);
  return Number.isNaN(parsed) ? NaN : parsed;
});

function close() {
  emit('update:modelValue', false);
}

/** Данные аккаунта, как в полном оформлении заказа: имя, телефон, email. */
function fillFromUser(onlyEmpty = false) {
  if (user.value?.name && (!onlyEmpty || !name.value.trim())) name.value = user.value.name;
  if (user.value?.phone && (!onlyEmpty || !phone.value.trim())) phone.value = user.value.phone;
  if (user.value?.email && (!onlyEmpty || !email.value.trim())) email.value = user.value.email;
}

function resetForm() {
  quantityInput.value = String(clampQuantity(props.initialQuantity));
  // Гостю подставляем то, что он вводил в других формах, авторизованному — данные аккаунта
  name.value = clientContact.name;
  phone.value = clientContact.phone;
  email.value = clientContact.email;
  fillFromUser();
  comment.value = '';
  agree.value = false;
  errors.value = {};
  submitting.value = false;
  success.value = false;
  orderId.value = null;
}

function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return MIN_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(value)));
}

function changeQuantity(delta: number) {
  quantityInput.value = String(clampQuantity((Number.isNaN(quantity.value) ? MIN_QUANTITY : quantity.value) + delta));
  errors.value.quantity = '';
}

function normalizeQuantity() {
  quantityInput.value = String(clampQuantity(quantity.value));
}

// Окно каждый раз открывается с чистой формой (кроме префилла контактов).
// Отдельного запроса ради окна не делаем — страница товара уже знает про пользователя.
watch(() => props.modelValue, (open) => {
  if (open) resetForm();
});

// /auth/me отвечает асинхронно и может прийти уже после открытия окна —
// тогда дозаполняем только пустые поля, чтобы не перебить набранное вручную.
watch(user, () => {
  if (!props.modelValue || success.value) return;
  fillFromUser(true);
});

watch(() => props.initialQuantity, (value) => {
  if (props.modelValue || success.value) return;
  quantityInput.value = String(clampQuantity(value));
});

function validate(): boolean {
  const next: FieldErrors = {};

  const trimmedName = name.value.trim();
  if (trimmedName.length < 2) next.name = 'Введите имя (минимум 2 символа)';
  else if (trimmedName.length > MAX_NAME_LENGTH) next.name = 'Имя не должно быть длиннее 255 символов';

  const digits = extractPhoneDigits(phone.value);
  if (digits.length !== 11 || !['7', '8'].includes(digits[0])) next.phone = 'Введите номер телефона';

  const trimmedEmail = email.value.trim();
  if (!isValidEmail(trimmedEmail) || trimmedEmail.length > 255) next.email = 'Введите корректный email';

  if (comment.value.trim().length > MAX_COMMENT_LENGTH) next.comment = 'Комментарий не должен быть длиннее 1000 символов';

  const qty = quantity.value;
  if (!Number.isInteger(qty) || qty < MIN_QUANTITY || qty > MAX_QUANTITY) next.quantity = 'Укажите количество от 1 до 99';

  if (!agree.value) next.agree = 'Нужно согласие на обработку данных';

  errors.value = next;
  return Object.keys(next).length === 0;
}

/** Ошибок в ответе может быть несколько — раскладываем все сразу. */
function applyServerErrors(codes: string[]) {
  const next: FieldErrors = {};
  for (const code of codes) {
    const { field, message } = mapQuickOrderError(code);
    next[field] = message;
  }
  errors.value = next;
}

async function onSubmit() {
  if (submitting.value) return;
  if (!validate()) return;

  submitting.value = true;
  try {
    const result = await sendQuickOrder({
      catalog_item_id: props.product.id,
      quantity: quantity.value,
      name: name.value.trim(),
      // Телефон отправляем с маской — бэкенд приводит к +7XXXXXXXXXX сам
      phone: phone.value.trim(),
      email: email.value.trim(),
      comment: comment.value.trim() || undefined,
      agree_policy: agree.value,
    });

    if (result.ok) {
      clientContact.setFromForm({ name: name.value.trim(), email: email.value.trim(), phone: phone.value.trim() });
      orderId.value = result.orderId;
      success.value = true;
      return;
    }

    if (result.kind === 'validation') {
      applyServerErrors(result.fieldErrors);
      return;
    }

    if (result.kind === 'not_found') {
      showToast(result.message, 'error');
      close();
      return;
    }

    errors.value = { form: result.message };
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
  padding: 16px;
  overflow-y: auto;
  z-index: 1001;
}

.modal {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--white, #fff);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 440px;
  /* Клавиатура на мобильном съедает половину высоты — контент скроллится внутри,
     заголовок и кнопка отправки остаются на виду. */
  max-height: calc(100dvh - 32px);
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
  margin: 0 0 8px;
  padding-right: 24px;
}

.modal__hint {
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  color: var(--gray-dark);
  margin: 0 0 20px;
  line-height: 1.4;
}

.order-id {
  font-weight: 700;
  color: var(--black);
}

.modal__scroll {
  overflow-y: auto;
  margin: 0 -4px;
  padding: 0 4px;
}

.product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(185, 185, 185, 0.4);
  border-radius: 12px;
  margin-bottom: 20px;
}

.product__img {
  width: 64px;
  height: 56px;
  flex-shrink: 0;
  object-fit: contain;
}

.product__info {
  min-width: 0;
}

.product__name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  margin: 0 0 4px;
}

.product__price {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--black);
  margin: 0;
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

.modal__textarea {
  height: auto;
  padding: 12px 16px;
  resize: vertical;
  font-family: 'NT Somic', sans-serif;
}

.qty {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 132px;
  height: 48px;
  border: 1px solid rgba(185, 185, 185, 0.6);
  border-radius: 8px;
  padding: 0 8px;
}

.qty__btn {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: var(--black);
}

.qty__value {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  text-align: center;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: var(--black);
}

.agree {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
}

.agree__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.agree__box {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: 1px solid var(--gray-light);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agree__input:focus-visible + .agree__box {
  border-color: var(--red);
}

.agree__text {
  font-family: 'NT Somic', sans-serif;
  font-size: 13px;
  line-height: 1.4;
  color: var(--gray-dark);
}

.agree__link {
  color: var(--red);
  text-decoration: underline;
}

.modal__footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
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
  margin: 0;
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
    padding: 32px 20px 24px;
  }
}
</style>
