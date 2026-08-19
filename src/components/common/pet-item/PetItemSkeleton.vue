<script setup lang="ts">
// Skeleton placeholder for PetItem
</script>

<template>
  <div class="pet-skeleton" aria-hidden="true">
    <div class="skeleton-img"></div>
    <div class="skeleton-body">
      <div class="skeleton-tags">
        <div class="skeleton-pill"></div>
        <div class="skeleton-pill"></div>
        <div class="skeleton-pill"></div>
      </div>
      <div class="skeleton-title"></div>
      <div class="skeleton-desc"></div>
      <div class="skeleton-btn"></div>
    </div>
  </div>
</template>

<style scoped lang="css">
.pet-skeleton {
  width: 240px;
  background-color: var(--text-inverse);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);

  .skeleton-img {
    width: 100%;
    aspect-ratio: 4/5;
    background: linear-gradient(
      90deg,
      oklch(from var(--text-primary) l c h / 6%) 0%,
      oklch(from var(--text-primary) l c h / 12%) 50%,
      oklch(from var(--text-primary) l c h / 6%) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .skeleton-tags {
      display: flex;
      gap: 6px;

      .skeleton-pill {
        width: 45px;
        height: 18px;
        border-radius: var(--radius-full);
        background-color: oklch(from var(--text-primary) l c h / 8%);
      }
    }

    .skeleton-title {
      width: 60%;
      height: 22px;
      border-radius: var(--radius-sm);
      background-color: oklch(from var(--text-primary) l c h / 10%);
    }

    .skeleton-desc {
      width: 90%;
      height: 14px;
      border-radius: var(--radius-sm);
      background-color: oklch(from var(--text-primary) l c h / 6%);
    }

    .skeleton-btn {
      width: 100%;
      height: 36px;
      border-radius: var(--radius-md);
      background-color: oklch(from var(--text-primary) l c h / 8%);
      margin-top: 0.5rem;
    }
  }

  @media (width <= 440px) {
    width: 100%;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
