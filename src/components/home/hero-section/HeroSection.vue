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
        <p class="eyebrow hero-eyebrow">
          <span class="hero-eyebrow-main">Cat &amp; dog rescue</span>
          <span class="hero-eyebrow-divider"> · </span>
          <span class="hero-eyebrow-location">Southern California</span>
        </p>
        <h1>
          Connecting rescued pets with loving
          <span class="display-accent">forever&nbsp;homes</span>
        </h1>
        <p class="hero-lede">
          We rescue cats and dogs across Southern California, provide medical care and loving foster
          homes, and match them with families ready for a lifetime companion
        </p>
        <div class="hero-actions">
          <Button title="Meet the pets" color="blue" size="large" @click="handleAdopt" />
        </div>
      </div>

      <div class="hero-portrait">
        <div class="hero-duo-cards">
          <!-- Primary: Rescued puppy in lush greenery -->
          <div class="duo-card card-dog">
            <picture>
              <source type="image/webp" srcset="/images/hero-dog.webp" />
              <img
                src="/images/hero-dog.jpg"
                alt="Rescued puppy with Adopt Me collar resting in green grass, ready for adoption"
                width="800"
                height="800"
                fetchpriority="high"
              />
            </picture>
          </div>

          <!-- Secondary: Rescued tuxedo cat on purple blanket -->
          <div class="duo-card card-cat">
            <picture>
              <source type="image/webp" srcset="/images/hero-cat.webp" />
              <img
                src="/images/hero-cat.jpg"
                alt="Rescued tuxedo cat with bright yellow eyes on a soft purple mat, ready for adoption"
                width="600"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        </div>
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
  max-width: 13ch;
  margin-bottom: 1.5rem;
  line-height: 1.12;
}

.hero-lede {
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 46ch;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* Rounded hero portrait duo cards */
.hero-portrait {
  position: relative;
  justify-self: end;
  width: min(100%, 420px);
  aspect-ratio: 1 / 1.15;
}

.hero-duo-cards {
  position: relative;
  width: 100%;
  height: 100%;
}

.duo-card {
  position: absolute;
  border-radius: var(--radius-xl, 26px);
  overflow: hidden;
  background: var(--text-inverse);
  aspect-ratio: 1 / 1;

  picture {
    display: block;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
}

.card-dog {
  top: 0;
  right: 0;
  width: 76%;
  border: 2px solid var(--line-ink-strong, oklch(from var(--text-primary) l c h / 20%));
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
  transform: rotate(2deg);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

  img {
    object-position: center 30%;
  }
}

.card-cat {
  bottom: 0;
  left: 0;
  width: 68%;
  border: 4px solid var(--text-inverse);
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.22);
  transform: rotate(-2.5deg);
  z-index: 2;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

  img {
    object-position: center 70%;
  }
}

.hero-portrait:hover {
  .card-dog {
    transform: translateY(-4px) rotate(3.5deg);

    img {
      transform: scale(1.04);
    }
  }

  .card-cat {
    transform: translateY(-8px) rotate(-3.5deg);

    img {
      transform: scale(1.04);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-dog,
  .card-cat,
  .hero-portrait:hover .card-dog,
  .hero-portrait:hover .card-cat,
  .card-dog img,
  .card-cat img,
  .hero-portrait:hover .card-dog img,
  .hero-portrait:hover .card-cat img {
    transform: none;
    transition: none;
  }
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
}

@media (width <= 768px) {
  .hero-section {
    padding-top: calc(72px + var(--safe-top));
  }

  .hero-inner {
    padding-top: 0.5rem;
  }
}

@media (width <= 640px) {
  .hero-eyebrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    .hero-eyebrow-divider {
      display: none;
    }
  }
}
</style>
