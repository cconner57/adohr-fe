<script setup lang="ts">
import { useRouter } from 'vue-router'

import Button from '../../common/ui/Button.vue'

const router = useRouter()

const goToSurrenderForm = () => {
  router.push('/surrender')
}
</script>

<template>
  <div class="surrender-cat-section">
    <p class="eyebrow">A hard decision, handled with care</p>
    <h2>Surrender Pet</h2>
    <p class="description">
      If you need to surrender your pet, we understand this can be a difficult decision. Please fill
      out our surrender form to help us find the best solution for your pet.
    </p>
    <Button
      class="surrender-button"
      title="Fill Out Surrender Form"
      @click="goToSurrenderForm"
      color="purple"
      size="medium"
    />
  </div>
</template>

<style scoped lang="css">
.surrender-cat-section {
  text-align: center;
  background-color: var(--color-primary);
  padding: 90px var(--layout-padding-side);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.eyebrow {
  font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-warning);
  margin-bottom: 12px;
}

h2 {
  font-size: clamp(1.9rem, 3.4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-inverse);
  text-align: center;
  margin: 0 0 10px;
}

.description {
  font-size: 1.15rem;
  color: oklch(from var(--text-inverse) l c h / 88%);
  margin-bottom: 36px;
  text-align: center;
  font-weight: 400;
  line-height: 1.6;
  max-width: 560px;
}

.surrender-button {
  margin-bottom: 0;
}
</style>
