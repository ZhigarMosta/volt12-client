<template>
  <div class="price-input-container">
    <span class="input-prefix">{{ prefix }}</span>
    <input
        type="number"
        v-model="internalValue"
        :placeholder="placeholder"
        class="price-input"
        @keydown="onKeydown"
        :max="MAX_INT"
        :min="MIN_INT"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null
  },
  prefix: {
    type: String,
    default: 'От'
  },
  placeholder: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['update:modelValue']);
const MAX_INT = 2147483647;
const MIN_INT = 0;
const internalValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    if (newValue === '' || newValue === null) {
      emit('update:modelValue', null);
      return;
    }
    let numVal = Number(newValue);
    if (numVal < MIN_INT) numVal = MIN_INT;
    if (numVal > MAX_INT) numVal = MAX_INT;
    emit('update:modelValue', numVal);
  }
});

const onKeydown = (event: KeyboardEvent) => {
  const invalidChars = ['e', 'E', '+', '-', '.'];
  if (invalidChars.includes(event.key)) {
    event.preventDefault();
  }
};
</script>

<style scoped>
.price-input,.input-prefix{
  font-family: 'NT Somic', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--black);
}
.price-input{
  width: 100%;
  max-width: 106px;
}
.price-input:focus {
  outline: none;
}
.price-input::placeholder{
  color: #afafaf;
}
.price-input-container{
  display: flex;
  gap: 11px;
  padding: 0 11px;
  align-items: center;

  border: 1px solid var(--gray-light);
  border-radius: 8px;
  width: 100%;
  max-width: 147px;
  height: 51px;
}
</style>