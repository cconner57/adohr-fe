<script setup lang="ts">
import { useRouter } from 'vue-router'

import Button from '@/components/common/ui/Button.vue'

const router = useRouter()

const goToSurrenderForm = () => {
  router.push('/surrender')
}
</script>

<template>
  <section class="surrender-cat-section" aria-labelledby="surrender-heading">
    <div class="content-wrapper" v-scroll-reveal>
      <p class="eyebrow">A hard decision, handled with care</p>
      <h2 id="surrender-heading">Surrender Pet</h2>
      <p class="description">
        If you need to surrender your pet, we understand this can be a difficult decision. Please fill
        out our surrender form to help us find the best solution for your pet.
      </p>
      <Button
        class="surrender-button"
        title="Fill Out Surrender Form"
        @click="goToSurrenderForm"
        theme="secondary"
        size="large"
      />
    </div>
  </section>
</template>

<style scoped lang="css">
.surrender-cat-section {
  text-align: center;
  background-color: var(--color-primary);
  padding: clamp(64px, 8vw, 96px) var(--layout-padding-side);
  display: flex;
  justify-content: center;

  .content-wrapper {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-warning, #f2b33d);
    margin-bottom: 12px;
  }

  h2 {
    font-size: clamp(2rem, 3.6vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-inverse);
    text-align: center;
    margin: 0 0 12px;
  }

  .description {
    font-size: 1.15rem;
    color: oklch(from var(--text-inverse) l c h / 95%);
    margin-bottom: 36px;
    text-align: center;
    font-weight: 400;
    line-height: 1.6;
    max-width: 580px;
  }

  .surrender-button {
    margin-bottom: 0;
  }

  :deep(.surrender-button) {
    background-color: var(--color-secondary, #e0571f) !important;
    color: var(--text-inverse, #ffffff) !important;
    border: 1.5px solid transparent !important;
    box-shadow: 0 4px 14px oklch(0% 0 0 / 25%) !important;
    font-weight: 700 !important;
  }

  :deep(.surrender-button:hover:not(:disabled)) {
    background-color: #c94a15 !important;
    box-shadow: 0 6px 18px oklch(0% 0 0 / 35%) !important;
    translate: 0 -2px !important;
  }

  :deep(.surrender-button:active:not(:disabled)) {
    translate: 0 0 !important;
    box-shadow: 0 2px 6px oklch(0% 0 0 / 25%) !important;
  }

  :deep(.surrender-button:focus-visible) {
    outline: 2px solid var(--text-inverse, #ffffff) !important;
    outline-offset: 3px !important;
  }
}
</style>
