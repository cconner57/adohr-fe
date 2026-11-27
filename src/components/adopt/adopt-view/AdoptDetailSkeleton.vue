<script setup lang="ts">
</script>

<template>
  <div class="detail-skeleton" aria-busy="true" aria-label="Loading pet profile...">
    <div class="detail-skeleton__media-col">
      <div class="detail-skeleton__photo shimmer"></div>
      <div class="detail-skeleton__actions-card">
        <div class="detail-skeleton__btn detail-skeleton__btn--primary shimmer"></div>
        <div class="detail-skeleton__actions-row">
          <div class="detail-skeleton__btn shimmer"></div>
          <div class="detail-skeleton__btn shimmer"></div>
        </div>
      </div>
    </div>

    <div class="detail-skeleton__info-card">
      <div class="detail-skeleton__eyebrow shimmer"></div>
      <div class="detail-skeleton__title shimmer"></div>
      <div class="detail-skeleton__capsules">
        <div class="detail-skeleton__capsule shimmer"></div>
        <div class="detail-skeleton__capsule shimmer"></div>
        <div class="detail-skeleton__capsule shimmer"></div>
      </div>
      <div class="detail-skeleton__rows">
        <div v-for="n in 6" :key="n" class="detail-skeleton__row">
          <div class="detail-skeleton__label shimmer"></div>
          <div class="detail-skeleton__value shimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.detail-skeleton {
  display: flex;
  gap: 30px;
  width: 100%;

  @media (width <= 1024px) {
    flex-direction: column;
  }
}

.detail-skeleton__media-col {
  flex: 3;
  width: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (width <= 1024px) {
    width: 100%;
    flex: auto;
  }
}

.detail-skeleton__photo {
  width: 100%;
  height: 440px;
  border-radius: var(--radius-lg, 16px);
  border: 1px solid oklch(from var(--text-inverse) l c h / 18%);

  @media (width <= 1024px) {
    height: 400px;
  }

  @media (width <= 480px) {
    height: 320px;
  }
}

.detail-skeleton__actions-card {
  background-color: var(--text-inverse);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  box-shadow: var(--shadow-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (width <= 640px) {
    padding: 16px;
  }
}

.detail-skeleton__actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (width <= 440px) {
    display: flex;
    flex-direction: column;
  }
}

.detail-skeleton__btn {
  height: 44px;
  border-radius: var(--radius-full, 9999px);
}

.detail-skeleton__btn--primary {
  width: 100%;
}

.detail-skeleton__info-card {
  flex: 4;
  min-width: 0;
  background-color: var(--text-inverse);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  box-shadow: var(--shadow-md);
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (width <= 640px) {
    padding: 24px;
  }
}

.detail-skeleton__eyebrow {
  width: 140px;
  height: 14px;
  border-radius: var(--radius-sm, 6px);
}

.detail-skeleton__title {
  width: 55%;
  height: 40px;
  border-radius: var(--radius-sm, 6px);
}

.detail-skeleton__capsules {
  display: flex;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
}

.detail-skeleton__capsule {
  width: 76px;
  height: 28px;
  border-radius: var(--radius-full, 9999px);
}

.detail-skeleton__rows {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

.detail-skeleton__row {
  display: flex;
  align-items: center;
  gap: 24px;
}

.detail-skeleton__label {
  width: 140px;
  height: 14px;
  border-radius: var(--radius-sm, 6px);
  flex-shrink: 0;

  @media (width <= 440px) {
    width: 96px;
  }
}

.detail-skeleton__value {
  flex: 1;
  max-width: 220px;
  height: 16px;
  border-radius: var(--radius-sm, 6px);
}

.shimmer {
  background: linear-gradient(
    110deg,
    oklch(from var(--text-primary) l c h / 6%) 8%,
    oklch(from var(--text-primary) l c h / 13%) 18%,
    oklch(from var(--text-primary) l c h / 6%) 33%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
}

@keyframes shimmer {
  to {
    background-position-x: -200%;
  }
}
</style>
