<script setup lang="ts">
// Skeleton placeholder for PetItem matching exact card proportions and elements
</script>

<template>
  <div class="pet-skeleton" aria-hidden="true">
    <div class="skeleton-img">
      <div class="skeleton-fav"></div>
    </div>
    <div class="skeleton-info">
      <div class="skeleton-title"></div>
      <div class="skeleton-capsules">
        <div class="skeleton-capsule skeleton-capsule--sm"></div>
        <div class="skeleton-capsule skeleton-capsule--md"></div>
        <div class="skeleton-capsule skeleton-capsule--lg"></div>
      </div>
      <div class="skeleton-btn"></div>
    </div>
  </div>
</template>

<style scoped lang="css">
.pet-skeleton {
  display: flex;
  flex-direction: column;
  width: 280px;
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  background-color: var(--color-white, #ffffff);
  border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  box-shadow: var(--shadow-sm);
  transition: translate var(--transition-slow);

  .skeleton-img {
    position: relative;
    width: 100%;
    height: 220px;
    flex-shrink: 0;
    overflow: hidden;
    background: linear-gradient(
      110deg,
      hsl(from var(--color-gray-50, #f7f7f8) h s 94%) 8%,
      hsl(from var(--color-gray-50, #f7f7f8) h s 88%) 18%,
      hsl(from var(--color-gray-50, #f7f7f8) h s 94%) 33%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;

    .skeleton-fav {
      position: absolute;
      top: 0.65rem;
      right: 0.65rem;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full, 9999px);
      background-color: oklch(from var(--text-inverse) 95% c h / 88%);
      border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 15%));
    }
  }

  .skeleton-info {
    display: flex;
    flex-direction: column;
    padding: 14px 20px 18px;
    flex: 1;
    overflow: hidden;
    border-top: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    background-color: var(--color-white, #ffffff);
  }

  .skeleton-title {
    width: 52%;
    height: 26px;
    border-radius: var(--radius-sm, 6px);
    margin-bottom: 10px;
    background: linear-gradient(
      110deg,
      oklch(from var(--text-primary) l c h / 8%) 8%,
      oklch(from var(--text-primary) l c h / 14%) 18%,
      oklch(from var(--text-primary) l c h / 8%) 33%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
  }

  .skeleton-capsules {
    display: flex;
    gap: 6px;
    margin-bottom: 16px;

    .skeleton-capsule {
      height: 22px;
      border-radius: var(--radius-full, 9999px);
      border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 15%));
      background: linear-gradient(
        110deg,
        oklch(from var(--text-primary) l c h / 4%) 8%,
        oklch(from var(--text-primary) l c h / 9%) 18%,
        oklch(from var(--text-primary) l c h / 4%) 33%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s linear infinite;

      &.skeleton-capsule--sm {
        width: 44px;
      }

      &.skeleton-capsule--md {
        width: 52px;
      }

      &.skeleton-capsule--lg {
        width: 70px;
      }
    }
  }

  .skeleton-btn {
    width: 100%;
    height: 44px;
    border-radius: var(--radius-full, 9999px);
    margin-top: auto;
    background: linear-gradient(
      110deg,
      oklch(from var(--color-secondary) 55% 0.12 h / 30%) 8%,
      oklch(from var(--color-secondary) 55% 0.12 h / 50%) 18%,
      oklch(from var(--color-secondary) 55% 0.12 h / 30%) 33%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
  }

  @media (width >= 1025px) and (width <= 1440px) {
    width: 250px;
  }

  @media (width >= 1441px) {
    width: 270px;
  }

  @media (width <= 440px) {
    width: 100%;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
</style>
