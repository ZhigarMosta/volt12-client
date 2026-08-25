<template>
  <div class="skeleton-catalog-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-line"></div>
      <div class="skeleton-line skeleton-line--last"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-catalog-card {
  border: 1px solid rgba(var(--gray-light-rgb), 0.38);
  border-radius: 16px;
  width: 100%;
  height: 157px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 17px 21px 17px 18px;
}

.skeleton-image,
.skeleton-line {
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(var(--gray-light-rgb), 0.2) 25%, rgba(var(--gray-light-rgb), 0.1) 50%, rgba(var(--gray-light-rgb), 0.2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-image {
  width: 123px;
  height: 120px;
  flex-shrink: 0;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 7px;
  justify-content: center;
  flex: 1;
  min-width: 0;
}

.skeleton-line {
  width: 100%;
  height: 23px;
}

@media (max-width: 1100px) {
  .skeleton-catalog-card {
    height: 127px;
    padding: 16px 18px 16px 14px;
    gap: 10px;
  }

  .skeleton-image {
    width: 95px;
    height: 92px;
  }

  .skeleton-content {
    gap: 6px;
  }

  .skeleton-line {
    height: 18px;
  }

  .skeleton-line--last {
    height: 17px;
  }
}

@media (max-width: 744px) {
  .skeleton-catalog-card {
    padding: 16px 18px 16px 15px;
    gap: 11px;
  }

  .skeleton-image {
    width: 94px;
  }

  .skeleton-line {
    height: 17px;
    width: 74%;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
