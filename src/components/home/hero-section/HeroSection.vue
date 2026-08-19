<script setup lang="ts">
import { useRouter } from 'vue-router'

import { goToAdopt } from '../../../utils/navigate.ts'
import Button from '../../common/ui/Button.vue'

const router = useRouter()

function handleAdopt() {
  goToAdopt(router)
}
</script>

<template>
  <section class="hero-section">
    <div class="hero-inner">
      <div class="hero-copy">
        <p class="eyebrow hero-eyebrow">Cat &amp; dog rescue · Southern California</p>
        <h1>
          Every pet deserves a door that
          <span class="display-accent">opens&nbsp;home.</span>
        </h1>
        <p class="hero-lede">
          We rescue abandoned cats and dogs, heal them in foster homes, and match them with people
          ready to love them for life.
        </p>
        <div class="hero-actions">
          <Button title="Meet the pets" color="blue" size="large" @click="handleAdopt" />
        </div>
      </div>

      <div class="hero-portrait">
        <div class="arch">
          <img
            src="/images/hero.jpg"
            alt="A rescued dog looking up, ready for adoption"
            width="600"
            height="760"
            fetchpriority="high"
          />
        </div>
        <span class="sticker" aria-hidden="true">Rescued<br />&amp; ready</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.hero-section {
  background-color: var(--text-inverse);
  padding-top: calc(110px + var(--safe-top));
  overflow: hidden;
}

.hero-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 3rem) var(--layout-padding-side) clamp(3rem, 6vw, 5rem);
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
}

.hero-eyebrow {
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}

h1 {
  font-size: var(--font-size-h1);
  color: var(--text-primary);
  max-width: 12ch;
  margin-bottom: 1.5rem;
}

.hero-lede {
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 44ch;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* Signature: the pet-door arch */
.hero-portrait {
  position: relative;
  justify-self: end;
  width: min(100%, 420px);
}

.arch {
  border-radius: var(--radius-arch);
  overflow: hidden;
  border: 1.5px solid var(--line-ink-strong);
  box-shadow: var(--shadow-lg);
  aspect-ratio: 4 / 5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    transition: scale 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
}

.hero-portrait:hover .arch img {
  scale: 1.04;
}

.sticker {
  position: absolute;
  top: 8%;
  right: -1.25rem;
  rotate: 8deg;
  background-color: var(--color-warning);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9rem;
  line-height: 1.15;
  text-align: center;
  padding: 1.1rem 0.8rem;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--text-primary);
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-md);
}

@media (width <= 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  h1 {
    margin-inline: auto;
  }

  .hero-lede {
    margin-inline: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-portrait {
    justify-self: center;
    width: min(100%, 340px);
  }

  .sticker {
    right: -0.5rem;
  }
}
</style>
