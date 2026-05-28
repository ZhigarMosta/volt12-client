<template>
  <div class="contacts-page">
    <Navigate :items="breadcrumbsItems" />

    <section class="contacts-info" aria-label="Контактная информация">
      <article class="contacts-info__item">
        <img class="contacts-info__icon" src="/icons/location.svg" alt="" width="50" height="50">
        <h2 class="contacts-info__title">АДРЕС</h2>
        <p class="contacts-info__text">
          г. Челябинск<br>
          Федорова, 1А
        </p>
      </article>

      <article class="contacts-info__item">
        <img class="contacts-info__icon" src="/icons/phone.svg" alt="" width="48" height="48">
        <h2 class="contacts-info__title">ТЕЛЕФОНЫ</h2>
        <p class="contacts-info__text">
          <a href="tel:+73517766224">+7 (351) 77-66-224</a><br>
          <a href="tel:+73512782473">+7 (351) 27-82-473</a>
        </p>
      </article>

      <article class="contacts-info__item">
        <img class="contacts-info__icon" src="/icons/mail.svg" alt="" width="45" height="45">
        <h2 class="contacts-info__title">ПОЧТА</h2>
        <p class="contacts-info__text">
          <a href="mailto:mastervolt12@yandex.ru">mastervolt12@yandex.ru</a>
        </p>
      </article>

      <article class="contacts-info__item">
        <img class="contacts-info__icon" src="/icons/vk.svg" alt="" width="52" height="52">
        <h2 class="contacts-info__title">МЫ В ВК</h2>
        <p class="contacts-info__text">
          <a href="https://vk.com" target="_blank" rel="noopener noreferrer">Мастер 12 Вольт</a>
        </p>
      </article>
    </section>

    <ContactsYandexMap class="contacts-map-block" />

    <section class="contacts-content">
      <div class="contacts-faq">
        <h2 class="contacts-faq__heading">Часто задаваемые вопросы (FAQ)</h2>
        <div class="contacts-faq__list">
          <div
            v-for="(item, index) in faqItems"
            :key="index"
            class="contacts-faq__item"
            :class="{ 'contacts-faq__item--open': openFaqIndex === index }"
          >
            <button
              type="button"
              class="contacts-faq__question"
              :aria-expanded="openFaqIndex === index"
              @click="toggleFaq(index)"
            >
              <span>{{ item.question }}</span>
              <span class="contacts-faq__arrow" aria-hidden="true" />
            </button>
            <div v-show="openFaqIndex === index" class="contacts-faq__answer">
              {{ item.answer }}
            </div>
          </div>
        </div>
      </div>

      <form class="contacts-form" @submit.prevent="submitForm">
        <p class="contacts-form__subtitle">Не нашли ответа на свой вопрос?</p>
        <h2 class="contacts-form__title">Оставьте заявку на консультацию</h2>

        <label class="contacts-form__field">
          <span class="contacts-form__label">Ваше имя*</span>
          <input
            v-model="form.name"
            class="contacts-form__input"
            type="text"
            name="name"
            placeholder="Иван"
            autocomplete="name"
            required
          >
        </label>

        <label class="contacts-form__field">
          <span class="contacts-form__label">Электронная почта</span>
          <input
            v-model="form.email"
            class="contacts-form__input"
            type="email"
            name="email"
            placeholder="example@mail.com"
            autocomplete="email"
            required
          >
        </label>

        <label class="contacts-form__field">
          <span class="contacts-form__label">Номер телефона*</span>
          <input
            v-model="form.phone"
            class="contacts-form__input"
            type="tel"
            name="phone"
            placeholder="+7(xxx)-xxx-xx-xx"
            autocomplete="tel"
            required
          >
        </label>

        <label class="contacts-form__field">
          <span class="contacts-form__label">Комментарий</span>
          <input
            v-model="form.comment"
            class="contacts-form__input"
            type="text"
            name="comment"
            placeholder="Напишите ваш вопрос"
            required
          >
        </label>

        <label class="contacts-form__consent">
          <input v-model="form.consent" class="contacts-form__checkbox" type="checkbox" required name="consent">
          <span class="contacts-form__consent-text">
            Я даю согласие на
            <NuxtLink to="/privacy-policy">обработку персональных данных</NuxtLink>
            в соответствии с
            <NuxtLink to="/privacy-policy">Политикой конфиденциальности</NuxtLink>.
          </span>
        </label>

        <p v-if="submitError" class="contacts-form__error" role="alert">{{ submitError }}</p>
        <p v-if="submitSuccess" class="contacts-form__success" role="status">Заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>

        <button class="contacts-form__submit" type="submit" :disabled="submitting">
          {{ submitting ? 'Отправка…' : 'Отправить заявку' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { sendFeedback } from '~/services/feedbackApi';
import { useClientContactStore } from '~/stores/clientContact';

useHead({
  title: 'Контакты — Мастер 12 Вольт',
});

const clientContact = useClientContactStore();
const { user } = useAuth();

const breadcrumbsItems = [
  { to: '/', text: 'Главная' },
  { to: '/contacts', text: 'Контакты' },
];

const faqItems = [
  {
    question: 'Вы производите установку штатных головных устройств?',
    answer:
      'Наша компания занимается не только установкой, но также и продажей штатных головных устройств. Также можем установить ваше головное устройство.',
  },
  {
    question: 'Вы производите установку штатных головных устройств?',
    answer:
      'Наша компания занимается не только установкой, но также и продажей штатных головных устройств. Также можем установить ваше головное устройство.',
  },
  {
    question: 'Вы производите установку штатных головных устройств?',
    answer:
      'Наша компания занимается не только установкой, но также и продажей штатных головных устройств. Также можем установить ваше головное устройство.',
  },
  {
    question: 'Вы производите установку штатных головных устройств?',
    answer:
      'Наша компания занимается не только установкой, но также и продажей штатных головных устройств. Также можем установить ваше головное устройство.',
  },
  {
    question: 'Вы производите установку штатных головных устройств?',
    answer:
      'Наша компания занимается не только установкой, но также и продажей штатных головных устройств. Также можем установить ваше головное устройство.',
  },
  {
    question: 'Вы производите установку штатных головных устройств?',
    answer:
      'Наша компания занимается не только установкой, но также и продажей штатных головных устройств. Также можем установить ваше головное устройство.',
  },
];

const openFaqIndex = ref(0);
const submitting = ref(false);
const submitError = ref('');
const submitSuccess = ref(false);

const form = reactive({
  name: '',
  email: '',
  phone: '',
  comment: '',
  consent: false,
});

function applyClientContactToForm() {
  if (clientContact.name) form.name = clientContact.name;
  if (clientContact.email) form.email = clientContact.email;
  if (clientContact.phone) form.phone = clientContact.phone;
}

watch(user, (authUser) => {
  if (authUser) {
    clientContact.setFromUser(authUser);
    applyClientContactToForm();
  }
}, { immediate: true });

onMounted(() => {
  applyClientContactToForm();
});

function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index;
}

async function submitForm() {
  submitError.value = '';
  submitSuccess.value = false;
  submitting.value = true;

  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const comment = form.comment.trim();

  try {
    await sendFeedback({
      type: 'contacts',
      user_name: name,
      user_phone: phone,
      user_email: email,
      description: comment,
    });

    clientContact.setFromForm({ name, email, phone });
    submitSuccess.value = true;
    form.comment = '';
  } catch (e: unknown) {
    submitError.value = e instanceof Error ? e.message : 'Не удалось отправить заявку';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.contacts-page {
  padding: 0 70px 88px;
}

.contacts-map-block {
  margin-top: 32px;
}

.contacts-info {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 8px;
}

.contacts-info__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.contacts-info__icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 6px;
}

.contacts-info__title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 700;
  font-size: 30px;
  line-height: 1.2;
  color: var(--black);
  margin: 0 0 8px;
}

.contacts-info__text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
  color: var(--black);
  margin: 0;
}

.contacts-info__text a {
  color: inherit;
  text-decoration: none;
}

.contacts-info__text a:hover {
  color: var(--red);
}

.contacts-content {
  display: grid;
  grid-template-columns: minmax(0, 541px) minmax(0, 673px);
  justify-content: space-between;
  gap: 25px;
  align-items: start;
  margin-top: 48px;
}

.contacts-faq__heading {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--black);
  margin: 0 0 24px;
}

.contacts-faq__list {
  display: flex;
  flex-direction: column;
}

.contacts-faq__item {
  border-bottom: 1px solid var(--gray-border);
}

.contacts-faq__item:first-child {
  border-top: none;
}

.contacts-faq__question {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
}

.contacts-faq__arrow {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  margin-top: 4px;
  border-right: 2px solid var(--black);
  border-bottom: 2px solid var(--black);
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}

.contacts-faq__item--open .contacts-faq__arrow {
  transform: rotate(-135deg);
  margin-top: 8px;
}

.contacts-faq__answer {
  padding: 0 0 20px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.45;
  color: var(--black);
  opacity: 0.7;
  max-width: 451px;
}

.contacts-form {
  padding: 40px 54px 48px;
  border-radius: 16px;
  background: linear-gradient(180deg, #ea0212 0%, #87040d 100%);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.09);
}

.contacts-form__subtitle {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray);
  margin: 0 0 4px;
}

.contacts-form__title {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: var(--gray);
  margin: 0 0 28px;
}

.contacts-form__field {
  display: block;
  margin-bottom: 20px;
}

.contacts-form__label {
  display: block;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 8px;
}

.contacts-form__input {
  width: 100%;
  height: 51px;
  padding: 16px 26px;
  border: 0;
  border-radius: 8px;
  background: rgba(248, 248, 248, 0.5);
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--white);
  outline: none;
  box-sizing: border-box;
}

.contacts-form__input::placeholder {
  color: var(--white);
  opacity: 0.95;
}

.contacts-form__consent {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin: 8px 0 24px;
  cursor: pointer;
}

.contacts-form__checkbox {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
  accent-color: var(--white);
}

.contacts-form__consent-text {
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 1.35;
  color: var(--gray);
}

.contacts-form__consent-text :deep(a) {
  color: var(--gray);
  text-decoration: underline;
}

.contacts-form__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  padding: 10px 31px;
  border: 0;
  border-radius: 8px;
  background: var(--white);
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.contacts-form__submit:hover:not(:disabled) {
  opacity: 0.9;
}

.contacts-form__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.contacts-form__error {
  margin: 0 0 12px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #fff;
}

.contacts-form__success {
  margin: 0 0 12px;
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--gray);
}

@media (max-width: 1100px) {
  .contacts-page {
    padding: 0 37px 80px;
  }

  .contacts-info {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .contacts-info__title {
    font-size: 24px;
  }

  .contacts-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contacts-form {
    padding: 36px 34px 40px;
  }

  .contacts-faq__question {
    max-width: none;
  }
}

@media (max-width: 744px) {
  .contacts-page {
    padding: 0 20px 100px;
  }

  .contacts-info {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 40px;
    column-gap: 16px;
  }

  .contacts-info__title {
    font-size: 22px;
  }

  .contacts-map-block {
    margin-top: 24px;
  }

  .contacts-content {
    margin-top: 36px;
    gap: 32px;
  }

  .contacts-form {
    padding: 32px 29px 36px;
  }

  .contacts-form__submit {
    width: 100%;
    min-width: 0;
  }

  .contacts-faq__answer {
    max-width: none;
  }
}
</style>
