<script setup lang="ts">
import { useRouter } from 'vue-router'

import Button from '../common/ui/Button.vue'

const router = useRouter()

const goToDonate = () => {
  router.push('/donate')
}

const goToWishlist = () => {
  router.push('/wishlist')
}
</script>

<template>
  <section class="support-mission">
    <div class="content-wrapper">
      <div class="support-text" v-scroll-reveal>
        <p class="eyebrow">Support our work</p>
        <h2>Help us open more doors</h2>
        <p>
          We rely entirely on donations to provide shelter, medical care, and love to homeless pets
          in Southern California. Your support makes every rescue possible.
        </p>
        <div class="support-actions">
          <Button
            class="donate-button"
            title="Donate Now"
            @click="goToDonate"
            color="green"
            size="large"
          />
          <Button
            class="wishlist-button"
            title="Foster Supply Wishlist"
            variant="secondary"
            color="blue"
            size="large"
            @click="goToWishlist"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.support-mission {
  background-color: var(--text-inverse);
  color: var(--text-primary);
  padding: clamp(60px, 8vw, 100px) var(--layout-padding-side);
  display: flex;
  justify-content: center;
  text-align: center;
  border-top: 1.5px solid var(--line-ink);

  .content-wrapper {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-secondary);
    margin-bottom: 12px;
  }

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  p:not(.eyebrow) {
    font-size: 1.15rem;
    line-height: 1.6;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .support-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
}
</style>
