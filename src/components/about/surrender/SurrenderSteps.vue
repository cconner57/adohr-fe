<script setup lang="ts">
const {
  formStep,
  selectedAnimal,
  vertical = false,
} = defineProps<{
  formStep: number
  selectedAnimal: 'dog' | 'cat' | null
  vertical?: boolean
}>()
</script>

<template>
  <ol class="steps-container" :class="{ vertical }">
    <li
      class="step"
      :class="{ active: formStep >= 1 }"
      :aria-current="formStep === 1 ? 'step' : undefined"
    >
      <div class="step-number">1</div>
      <div class="step-label">Household</div>
    </li>
    <li
      class="step"
      :class="{ active: formStep >= 2 }"
      :aria-current="formStep === 2 ? 'step' : undefined"
    >
      <div class="step-number">2</div>
      <div class="step-label">Behavior</div>
    </li>
    <li
      class="step"
      :class="{ active: formStep >= 3 }"
      :aria-current="formStep === 3 ? 'step' : undefined"
    >
      <div class="step-number">3</div>
      <div class="step-label">Aggression</div>
    </li>
    <li
      class="step"
      v-if="selectedAnimal === 'cat'"
      :class="{ active: formStep >= 4 }"
      :aria-current="formStep === 4 ? 'step' : undefined"
    >
      <div class="step-number">4</div>
      <div class="step-label">Medical</div>
    </li>
    <li
      class="step"
      :class="{ active: formStep >= 5 }"
      :aria-current="formStep === (selectedAnimal === 'cat' ? 5 : 4) ? 'step' : undefined"
    >
      <div class="step-number">{{ selectedAnimal === 'cat' ? 5 : 4 }}</div>
      <div class="step-label">Feeding</div>
    </li>
    <li
      class="step"
      :class="{ active: formStep >= 6 }"
      :aria-current="formStep === (selectedAnimal === 'cat' ? 6 : 5) ? 'step' : undefined"
    >
      <div class="step-number">{{ selectedAnimal === 'cat' ? 6 : 5 }}</div>
      <div class="step-label">Other</div>
    </li>
  </ol>
</template>

<style scoped lang="css">
.steps-container {
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 20px;
  align-items: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 16px;
    left: 27px;
    right: 27px;
    height: 1px;
    background-color: var(--line-ink-strong, oklch(from var(--text-primary) l c h / 32%));
    z-index: 0;
  }

  @media (width <= 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding-left: 16px;

    &::before {
      display: none;
    }
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex-shrink: 0;
    margin: 0 12px;

    @media (width <= 600px) {
      flex-direction: row;
      margin: 0;
      gap: 12px;
      width: 100%;
    }

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

      @media (width <= 600px) {
        margin-bottom: 0;
      }
    }

    .step-label {
      font-size: 0.75rem;
      text-align: center;
      white-space: nowrap;
      color: var(--text-secondary);

      @media (width <= 600px) {
        font-size: 1rem;
        font-weight: 500;
      }
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

@media (width >= 901px) {
  .steps-container.vertical {
    flex-direction: column;
    align-items: stretch;
    max-width: none;
    margin: 0;

    &::before {
      inset: 16px auto 16px 16px;
      width: 1px;
      height: auto;
    }

    .step {
      flex-direction: row;
      align-items: center;
      gap: 14px;
      margin: 0;
      padding: 9px 0;

      .step-number {
        margin-bottom: 0;
        flex-shrink: 0;
      }

      .step-label {
        font-size: 0.9rem;
        white-space: normal;
        text-align: left;
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .steps-container .step .step-number {
    transition: none;
  }
}
</style>
