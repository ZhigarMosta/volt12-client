<template>
  <div class="checkout-page">
    <Navigate :items="breadcrumbsItems" />

    <h1 class="checkout-title">Детали оплаты</h1>

    <div class="checkout-layout" v-if="!orderLoaded || cartItems.length">
      <!-- Form -->
      <form class="checkout-form" @submit.prevent="handleSubmit">

        <!-- Personal -->
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">Имя*</label>
            <div v-if="authLoading" class="sk-input-field" />
            <template v-else>
              <input v-model="form.firstName" class="form-input" :class="{ 'form-input--error': errors.firstName }" type="text" placeholder="Иван" @input="clearError('firstName')" />
              <span v-if="errors.firstName" class="field-error">{{ errors.firstName }}</span>
            </template>
          </div>
          <div class="form-field">
            <label class="form-label">Фамилия*</label>
            <input v-model="form.lastName" class="form-input" :class="{ 'form-input--error': errors.lastName }" type="text" placeholder="Иванов" @input="clearError('lastName')" />
            <span v-if="errors.lastName" class="field-error">{{ errors.lastName }}</span>
          </div>
        </div>

        <!-- Address -->
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">Адрес*</label>
            <input v-model="form.street" class="form-input" type="text" placeholder="Улица" />
          </div>
          <div class="form-field">
            <input v-model="form.house" class="form-input input-home" type="text" placeholder="Дом" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <input v-model="form.entrance" class="form-input" type="text" placeholder="Подъезд" />
          </div>
          <div class="form-field">
            <input v-model="form.apartment" class="form-input" type="text" placeholder="Квартира" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">Населённый пункт*</label>
            <input v-model="form.city" class="form-input" :class="{ 'form-input--error': errors.city }" type="text" placeholder="Челябинск" @input="clearError('city')" />
            <span v-if="errors.city" class="field-error">{{ errors.city }}</span>
          </div>
          <div class="form-field">
            <label class="form-label">Область/Район*</label>
            <input v-model="form.region" class="form-input" :class="{ 'form-input--error': errors.region }" type="text" placeholder="Челябинск" @input="clearError('region')" />
            <span v-if="errors.region" class="field-error">{{ errors.region }}</span>
          </div>
        </div>
        <div class="form-row form-row--half">
          <div class="form-field">
            <label class="form-label">Почтовый индекс*</label>
            <input v-model="form.postalCode" class="form-input" :class="{ 'form-input--error': errors.postalCode }" type="text" placeholder="00000" @input="clearError('postalCode')" />
            <span v-if="errors.postalCode" class="field-error">{{ errors.postalCode }}</span>
          </div>
        </div>

        <!-- Contacts -->
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">Телефон*</label>
            <div v-if="authLoading" class="sk-input-field" />
            <template v-else>
              <input v-model="form.phone" class="form-input" :class="{ 'form-input--error': errors.phone }" type="tel" placeholder="+7(000)000-00-00" @input="clearError('phone')" />
              <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
            </template>
          </div>
          <div class="form-field">
            <label class="form-label">Почта*</label>
            <div v-if="authLoading" class="sk-input-field" />
            <template v-else>
              <input v-model="form.email" class="form-input" :class="{ 'form-input--error': errors.email }" type="email" placeholder="example@mail.com" @input="clearError('email')" />
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </template>
          </div>
        </div>

        <!-- Details -->
        <p class="form-section-label">Детали</p>
        <div class="form-field">
          <label class="form-label">Примечание к заказу</label>
          <textarea
            v-model="form.comment"
            class="form-input form-textarea"
            placeholder="Ваш комментарий"
          />
        </div>

        <!-- Submit (mobile only — desktop uses sidebar button) -->
        <button
          type="submit"
          class="submit-btn submit-btn--mobile"
          :disabled="submitting"
        >
          {{ submitting ? 'Оформление…' : 'Подтвердить заказ' }}
        </button>

        <p v-if="submitError" class="form-error">{{ submitError }}</p>
        <p v-if="submitSuccess" class="form-success">Заказ успешно оформлен! Мы свяжемся с вами.</p>
      </form>

      <OrderSummary
        title="Ваш заказ"
        :items="cartItems"
        :total="totalPrice"
        :button-text="submitting ? 'Оформление…' : 'Подтвердить заказ'"
        :disabled="submitting"
        :loading="!orderLoaded || authLoading"
        class="checkout-summary"
        @click="handleSubmit"
      />
    </div>

    <EmptyState
      v-if="orderLoaded && !cartItems.length"
      title="Нет данных для оформления"
      subtitle="Выберите нужные товары"
      button-text="В корзину"
      :on-click="goToCart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useCheckoutOrder, type CheckoutOrderItem } from '~/utils/useCheckoutOrder';

useHead({ title: 'Оформление заказа — Мастер 12 Вольт' });
const breadcrumbsItems = [
  { to: '/', text: 'Главная' },
  { to: '/cart', text: 'Корзина' },
  { to: '/checkout', text: 'Оплата' },
];

const { user, loading: authLoading } = useAuth();

const cartItems = ref<CheckoutOrderItem[]>([]);
const orderLoaded = ref(false);

const totalPrice = computed(() =>
  cartItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

const form = reactive({
  firstName: '',
  lastName: '',
  street: '',
  house: '',
  entrance: '',
  apartment: '',
  city: '',
  region: '',
  postalCode: '',
  phone: '',
  email: '',
  comment: '',
});

const submitting = ref(false);
const submitError = ref('');
const submitSuccess = ref(false);
const router = useRouter();
type FormKey = keyof typeof form;
const errors = reactive<Partial<Record<FormKey, string>>>({});

function clearError(field: FormKey) {
  delete errors[field];
}

function validate(): boolean {
  const e: Partial<Record<FormKey, string>> = {};
  if (!form.firstName.trim()) e.firstName = 'Введите имя';
  if (!form.lastName.trim()) e.lastName = 'Введите фамилию';
  if (!form.city.trim()) e.city = 'Введите населённый пункт';
  if (!form.region.trim()) e.region = 'Введите область или район';
  if (!form.postalCode.trim()) e.postalCode = 'Введите почтовый индекс';
  if (!form.phone.trim()) e.phone = 'Введите номер телефона';
  if (!form.email.trim()) {
    e.email = 'Введите email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    e.email = 'Некорректный email';
  }
  Object.assign(errors, e);
  return Object.keys(e).length === 0;
}

function fillFormFromUser() {
  if (user.value?.name) form.firstName = user.value.name;
  if (user.value?.phone) form.phone = user.value.phone;
  if (user.value?.email) form.email = user.value.email;
}

watch(user, fillFormFromUser);

async function handleSubmit() {
  if (!validate()) return;
  if (submitting.value) return;
  submitting.value = true;
  submitError.value = '';
  try {
    // TODO: подключить API оформления заказа
    await new Promise((r) => setTimeout(r, 500));
    submitSuccess.value = true;
  } catch (e: any) {
    submitError.value = e?.message ?? 'Не удалось оформить заказ';
  } finally {
    submitting.value = false;
  }
}

function goToCart() {
  router.push('/cart');
}

onMounted(() => {
  const { orderItems } = useCheckoutOrder();
  cartItems.value = orderItems.value;
  orderLoaded.value = true;
  fillFormFromUser();
});
</script>

<style scoped>
.checkout-page {
  padding: 0 70px 80px;
}

.checkout-title {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: var(--black);
  margin-bottom: 32px;
}

/* Layout */
.checkout-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.checkout-form {
  flex: 1 1 0;
  min-width: 0;
}

/* Form */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row--half {
  grid-template-columns: 1fr;
  max-width: calc(50% - 8px);
}

.form-section-label {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: var(--black);
  margin: 24px 0 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #afafaf;
}

.form-input {
  height: 51px;
  padding: 0 16px;
  background: #f8f8f8;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 8px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  outline: none;
  box-sizing: border-box;
  width: 100%;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--red);
}

.form-input--error {
  border-color: #e53935;
}

.field-error {
  font-family: 'NT Somic', sans-serif;
  font-size: 12px;
  line-height: 1;
  color: #e53935;
  margin-top: -4px;
}

.form-input::placeholder {
  color: #afafaf;
}

.form-textarea {
  height: 120px;
  padding: 14px 16px;
  resize: vertical;
}

.form-error {
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  color: var(--red);
  margin-top: 12px;
}

.form-success {
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  color: #22a844;
  margin-top: 12px;
}

/* Submit buttons */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  background: var(--red);
  border: none;
  border-radius: 8px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #f8f8f8;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 24px;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn--mobile {
  display: none;
}


.input-home{
  margin-top: 29px;
}

/* Responsive */
@media (max-width: 1100px) {
  .checkout-form {
    width: 100%;
  }

  .checkout-page {
    padding: 0 37px 80px;
  }

  .checkout-layout {
    flex-direction: column;
  }
  .checkout-summary {
    width: 100%;
  }
}

@media (max-width: 744px) {
  .checkout-page {
    padding: 0 20px 80px;
  }
  .input-home{
    margin-top: 0;
  }
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-row--half {
    grid-template-columns: 1fr;
  }
}

/* Skeleton */
.sk-input-field {
  height: 51px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    var(--gray-shimmer) 25%,
    var(--gray-shimmer-light) 50%,
    var(--gray-shimmer) 75%
  );
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}

@keyframes sk-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
</style>
