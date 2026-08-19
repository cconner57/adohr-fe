<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentStep: number
    steps: string[]
    vertical?: boolean
  }>(),
  { vertical: false },
)

const currentLabel = computed(() => props.steps[props.currentStep] ?? '')
</script>

<template>
  <nav class="steps-wrapper" :class="{ vertical: props.vertical }" aria-label="Form progress">
    <p class="sr-only" aria-live="polite">
      Step {{ currentStep + 1 }} of {{ steps.length }}: {{ currentLabel }}
    </p>

    <!-- Mobile: Segmented Progress + Current Step Label Only -->
    <div class="steps-mobile" aria-hidden="true">
      <div class="steps-mobile-segments">
        <div
          v-for="(_, idx) in steps"
          :key="idx"
          class="step-segment"
          :class="{ active: currentStep >= idx }"
        />
      </div>
      <div class="steps-mobile-info">
        <h3 class="steps-mobile-name">{{ currentLabel }}</h3>
      </div>
    </div>

    <!-- Desktop: numbered stepper (horizontal by default, vertical rail variant) -->
    <ol class="steps-container" :style="{ '--steps-count': String(props.steps.length) }">
      <div class="line" aria-hidden="true" />
      <li
        v-for="(stepLabel, idx) in props.steps"
        :key="stepLabel"
        class="step"
        :class="{ active: props.currentStep >= idx, completed: props.currentStep > idx }"
        :aria-current="props.currentStep === idx ? 'step' : undefined"
      >
        <div class="step-number">
          <svg
            v-if="props.currentStep > idx"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span v-else>{{ idx + 1 }}</span>
        </div>
        <div class="step-label">{{ stepLabel }}</div>
      </li>
    </ol>
  </nav>
</template>

<style scoped lang="css">
.steps-wrapper {
  width: 100%;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* ── Mobile Segments ────────────────────────────────── */
.steps-mobile {
  display: none;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.steps-mobile-segments {
  display: flex;
  width: 100%;
  gap: 6px;
  height: 4px;
}

.step-segment {
  flex: 1;
  height: 100%;
  background: var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  border-radius: var(--radius-full);
  transition: background-color 0.35s ease;

  &.active {
    background: var(--color-secondary);
  }
}

.steps-mobile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.steps-mobile-name {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--text-primary);
  margin: 0;
}

/* ── Desktop stepper (horizontal default) ───────────── */
.steps-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 20px;
  align-items: center;
  position: relative;
  gap: 8px;
  list-style: none;
  padding: 0;

  & .line {
    position: absolute;
    top: 15px;
    left: calc(100% / (var(--steps-count) * 2));
    right: calc(100% / (var(--steps-count) * 2));
    height: 1px;
    background-color: var(--line-ink-strong, oklch(from var(--text-primary) l c h / 32%));
    z-index: 1;
    width: auto !important;
    max-width: none;
    min-width: 0;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    flex: 1;
    min-width: 0;

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background-color: var(--text-inverse);
      border: 1px solid var(--line-ink-strong, oklch(from var(--text-primary) l c h / 32%));
      color: var(--text-secondary);
      font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
      z-index: 5;
      transition:
        background-color 0.25s ease,
        border-color 0.25s ease,
        color 0.25s ease;
    }

    .step-label {
      font-size: 0.875rem;
      text-align: center;
      line-height: 1.3;
      color: var(--text-secondary);
    }

    &.active {
      .step-number {
        background-color: var(--color-secondary);
        border-color: var(--color-secondary);
        color: var(--text-inverse);
      }

      .step-label {
        color: var(--text-primary);
        font-weight: 600;
      }
    }
  }
}

/* ── Vertical rail variant (desktop only) ───────────── */
@media (width >= 901px) {
  .steps-wrapper.vertical {
    .steps-container {
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      gap: 0;
      margin: 0;

      & .line {
        inset: 16px auto 16px 15px;
        width: 1px !important;
        height: auto;
      }

      .step {
        flex-direction: row;
        align-items: center;
        gap: 14px;
        flex: none;
        padding: 9px 0;

        .step-number {
          margin-bottom: 0;
          flex-shrink: 0;
        }

        .step-label {
          text-align: left;
          font-size: 0.9rem;
        }
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .step-segment,
  .step .step-number {
    transition: none;
  }
}

@media (width <= 600px) {
  .steps-mobile {
    display: flex;
  }

  .steps-container {
    display: none;
  }
}
</style>
