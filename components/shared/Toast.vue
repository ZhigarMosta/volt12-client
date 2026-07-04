<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast" class="toast" :class="`toast--${toast.type}`" role="status">
        {{ toast.message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { toast } = useToast();
</script>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  top: 32px;
  transform: translateX(-50%);
  z-index: 2000;
  background: var(--red);
  color: var(--white);
  font-family: 'NT Somic', sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 14px 24px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-width: calc(100vw - 32px);
  text-align: center;
}

.toast--error {
  background: var(--white);
  color: var(--red);
  border: 1px solid var(--red);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px);
}
</style>
