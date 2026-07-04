<template>
  <input
    ref="inputRef"
    type="tel"
    inputmode="numeric"
    autocomplete="tel"
    :value="modelValue"
    v-bind="$attrs"
    @input="onInput"
    @keydown="onKeydown"
    @focus="onFocus"
  />
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { formatRuPhone } from '~/utils/phone';

defineOptions({ inheritAttrs: false });

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string]; input: [] }>();

const inputRef = ref<HTMLInputElement | null>(null);

const ALLOWED_KEYS = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'Enter'];

function digitsBeforeCaret(value: string, caret: number): number {
  return value.slice(0, caret).replace(/\D/g, '').length;
}

function caretForDigitCount(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return Math.min(formatted.length, 2);
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
      if (count === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const caret = target.selectionStart ?? target.value.length;
  const digitsBefore = digitsBeforeCaret(target.value, caret);
  const formatted = formatRuPhone(target.value);

  emit('update:modelValue', formatted);
  emit('input');

  nextTick(() => {
    if (!inputRef.value) return;
    const pos = caretForDigitCount(formatted, digitsBefore);
    inputRef.value.setSelectionRange(pos, pos);
  });
}

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (ALLOWED_KEYS.includes(e.key)) return;
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
}

function onFocus(e: FocusEvent) {
  if (props.modelValue) return;
  const formatted = formatRuPhone('7');
  emit('update:modelValue', formatted);
  nextTick(() => {
    const target = e.target as HTMLInputElement;
    target.setSelectionRange(formatted.length, formatted.length);
  });
}
</script>
