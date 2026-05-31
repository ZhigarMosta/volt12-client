<template>
  <div class="checkout-page">
    <Navigate :items="breadcrumbsItems" />

    <h1 class="checkout-title">Детали оплаты</h1>

    <div class="checkout-layout">
      <!-- Form -->
      <form class="checkout-form" @submit.prevent="handleSubmit">

        <!-- Personal -->
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">Имя*</label>
            <input v-model="form.firstName" class="form-input" type="text" placeholder="Иван" required />
          </div>
          <div class="form-field">
            <label class="form-label">Фамилия*</label>
            <input v-model="form.lastName" class="form-input" type="text" placeholder="Иванов" required />
          </div>
        </div>

        <!-- Address -->
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">Адрес*</label>
            <input v-model="form.street" class="form-input" type="text" placeholder="Улица" />
          </div>
          <div class="form-field">
            <input v-model="form.house" class="form-input" type="text" placeholder="Дом" />
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
            <input v-model="form.city" class="form-input" type="text" placeholder="Челябинск" required />
          </div>
          <div class="form-field">
            <label class="form-label">Область/Район*</label>
            <input v-model="form.region" class="form-input" type="text" placeholder="Челябинск" required />
          </div>
        </div>
        <div class="form-row form-row--half">
          <div class="form-field">
            <label class="form-label">Почтовый индекс*</label>
            <input v-model="form.postalCode" class="form-input" type="text" placeholder="00000" required />
          </div>
        </div>

        <!-- Contacts -->
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">Телефон*</label>
            <input v-model="form.phone" class="form-input" type="tel" placeholder="+7(000)000-00-00" required />
          </div>
          <div class="form-field">
            <label class="form-label">Почта*</label>
            <input v-model="form.email" class="form-input" type="email" placeholder="example@mail.com" required />
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

      <!-- Order summary -->
      <aside class="order-summary">
        <h2 class="order-summary__title">Ваш заказ</h2>

        <ul class="order-summary__list">
          <li v-for="item in cartItems" :key="item.id" class="order-summary__item">
            <span class="order-summary__name">{{ item.name }} × {{ item.quantity }}</span>
            <span class="order-summary__price">{{ formatPrice(item.price * item.quantity) }}</span>
          </li>
        </ul>
        <div class="order-summary__divider" />
        <div class="order-summary__total-row">
          <span class="order-summary__total-label">Итого</span>
          <span class="order-summary__total-price">{{ formatPrice(totalPrice) }}</span>
        </div>
        <button
          class="submit-btn submit-btn--desktop"
          :disabled="submitting"
          @click="handleSubmit"
        >
          {{ submitting ? 'Оформление…' : 'Подтвердить заказ' }}
        </button>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { formatPrice } from '~/utils/format';
import { useCheckoutOrder, type CheckoutOrderItem } from '~/utils/useCheckoutOrder';

useHead({ title: 'Оформление заказа — Мастер 12 Вольт' });
const { user } = useAuth();

const breadcrumbsItems = [
  { to: '/', text: 'Главная' },
  { to: '/cart', text: 'Корзина' },
  { to: '/checkout', text: 'Оплата' },
];

const cartItems = ref<CheckoutOrderItem[]>([]);
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

function fillFormFromUser() {
  if (user.value?.name) form.firstName = user.value.name;
  if (user.value?.phone) form.phone = user.value.phone;
  if (user.value?.email) form.email = user.value.email;
}

onMounted(() => {
  const { orderItems } = useCheckoutOrder();
  cartItems.value = orderItems.value;
  fillFormFromUser();
});

watch(user, fillFormFromUser);

async function handleSubmit() {
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

/* Order summary */
.order-summary {
  flex: 0 0 373px;
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 8px;
  padding: 22px 26px 26px;
  background: #fff;
  box-sizing: border-box;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

.order-summary__title {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: var(--black);
  margin-bottom: 16px;
}


.order-summary__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-summary__item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.order-summary__name {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-summary__price {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  flex-shrink: 0;
}

.order-summary__divider {
  height: 1px;
  background: rgba(185, 185, 185, 0.38);
  margin: 16px 0;
}

.order-summary__total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-summary__total-label {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: var(--black);
}

.order-summary__total-price {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 24px;
  color: var(--red);
}

.submit-btn--desktop {
  margin-top: 20px;
}

/* Responsive */
@media (max-width: 1100px) {
  .checkout-form {
    flex: 1 1 0;
    min-width: 0;
    width: 100%;
  }

  .checkout-page {
    padding: 0 37px 80px;
  }

  .checkout-layout {
    flex-direction: column;
  }

  .order-summary {
    flex: none;
    width: 100%;
    position: static;
  }

  .submit-btn--desktop {
    display: none;
  }

  .submit-btn--mobile {
    display: flex;
  }

  .form-row--half {
    max-width: 100%;
  }
}

@media (max-width: 744px) {
  .checkout-page {
    padding: 0 20px 80px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-row--half {
    grid-template-columns: 1fr;
  }
}
</style>
