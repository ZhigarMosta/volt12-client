<template>
  <div class="skeleton-catalog-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-name"></div>
      <div class="skeleton-count"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-catalog-card {
  border: 1px solid rgba(185, 185, 185, 0.38);
  border-radius: 16px;
  width: 100%;
  height: 157px;
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 27px 0 0 18px;
}

.skeleton-image {
  width: 121px;
  height: 101px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  flex: 1;
  min-width: 0;
}

.skeleton-name {
  width: 60%;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-count {
  width: 40%;
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--gray-shimmer) 25%, var(--gray-shimmer-light) 50%, var(--gray-shimmer) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>