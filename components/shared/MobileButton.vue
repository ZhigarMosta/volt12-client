<template>
  <button class="mobile-button" type="button" @click="handleClick">
    <NuxtImg
      :src="icon"
      width="29"
      height="29"
      :alt="alt"
      class="mobile-button-icon"
    />
  </button>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Icon'
  },
  to: {
    type: String,
    default: ''
  }
})

const router = useRouter()

const handleClick = () => {
  if (props.to) {
    router.push(props.to)
  }
}
</script>

<style scoped>
.mobile-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>