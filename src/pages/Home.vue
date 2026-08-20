<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import PetSmartEventBanner from '@/components/adopt/events/PetSmartEventBanner.vue'
import Footer from '@/components/common/footer/Footer.vue'
import BannerButton from '@/components/common/ui/BannerButton.vue'
import HeroSection from '@/components/home/hero-section/HeroSection.vue'
import Impact from '@/components/home/impact/Impact.vue'
import Mission from '@/components/home/mission/Mission.vue'
import AdoptionSpotlight from '@/components/home/spotlight/AdoptionSpotlight.vue'
import SuccessStories from '@/components/home/success-stories/SuccessStories.vue'
import { usePets } from '@/composables/usePets.ts'
import { useScrollReveal } from '@/composables/useScrollReveal.ts'

const router = useRouter()

const { spotlightPets, loading, error, fetchSpotlight } = usePets()
const { vScrollReveal } = useScrollReveal()

onMounted(() => {
  fetchSpotlight()
})
</script>

<template>
  <div class="container">
    <!-- 1. Hero Section -->
    <HeroSection />

    <main id="main-content">
      <!-- 2. Weekend Events Band -->
      <section class="events-band" aria-label="Weekend Adoption Events">
        <div class="content-wrapper" v-scroll-reveal>
          <PetSmartEventBanner :showFilterButton="false" variant="dark" />
        </div>
      </section>

      <!-- 3. Adoption Spotlight Section -->
      <section class="section spotlight-section" aria-label="Adoption Spotlight">
        <div class="content-wrapper" v-scroll-reveal>
          <AdoptionSpotlight :pets="spotlightPets" :loading="loading" :error="error" />
        </div>
      </section>

      <!-- Divider between Spotlight & Mission -->
      <div class="section-divider-wrapper" aria-hidden="true" v-scroll-reveal>
        <div class="section-divider">
          <span class="divider-line"></span>
          <span class="divider-icon">🐾</span>
          <span class="divider-line"></span>
        </div>
      </div>

      <!-- 4. Our Mission Section -->
      <section class="section mission-section" aria-label="Our Mission">
        <div class="content-wrapper" v-scroll-reveal>
          <Mission />
        </div>
      </section>

      <!-- 5. Success Stories Section -->
      <section class="section success-stories-section" aria-label="Success Stories">
        <div class="content-wrapper" v-scroll-reveal>
          <SuccessStories />
        </div>
      </section>

      <!-- 6. Impact & Ways to Help Section -->
      <section class="section impact-section" aria-label="Impact and Actions">
        <div class="content-wrapper">
          <div v-scroll-reveal>
            <Impact />
          </div>

          <!-- Divider between Stats and Ways to Help buttons -->
          <div class="impact-action-divider" aria-hidden="true" v-scroll-reveal>
            <span class="divider-line"></span>
            <span class="divider-pill">Ways to get involved</span>
            <span class="divider-line"></span>
          </div>

          <section class="call-to-action" aria-label="Ways to help" v-scroll-reveal>
            <BannerButton
              imgSrc="/images/paw.svg"
              title="Adopt a pet"
              subtitle="Find your perfect companion"
              color="blue"
              @click="() => router.push('/adopt')"
              class="hover-scale"
            />
            <BannerButton
              imgSrc="/images/hand.svg"
              title="Foster a pet"
              subtitle="Provide temporary care and save a life"
              color="purple"
              @click="() => router.push('/foster')"
              class="hover-scale"
            />
            <BannerButton
              imgSrc="/images/heart.svg"
              title="Donate"
              subtitle="Help us rescue more animals"
              color="green"
              @click="() => router.push('/donate')"
              class="hover-scale"
            />
          </section>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped lang="css">
.container {
  width: 100%;
  background-color: var(--text-inverse);
}

:deep(.reveal) {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    transition: opacity 0.8s ease;
  }
}

:deep(.reveal.active) {
  opacity: 1;
  transform: translateY(0);

  @media (prefers-reduced-motion: reduce) {
    transform: none;
  }
}

:deep(.hover-scale) {
  transition: transform 0.3s ease;
}

:deep(.hover-scale:hover) {
  transform: scale(1.03);
}

.content-wrapper {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 var(--layout-padding-side);
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 5vw, 64px);
}

.events-band {
  width: 100%;
  background: linear-gradient(180deg, oklch(from var(--color-primary) 92% 0.04 h), oklch(from var(--color-primary) 86% 0.06 h));
  border-block: 2px solid var(--line-ink, oklch(from var(--text-primary) l c h / 20%));
  padding: clamp(36px, 5vw, 56px) 0;
  box-shadow: inset 0 2px 10px oklch(from var(--text-primary) l c h / 8%);
}

.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.spotlight-section {
  padding: clamp(56px, 8vw, 96px) 0 clamp(48px, 6vw, 72px);
}

.mission-section {
  padding: clamp(32px, 5vw, 56px) 0 clamp(56px, 8vw, 88px);
}

.success-stories-section {
  background-color: oklch(from var(--text-primary) 98% 0.01 70deg);
  border-block: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
  padding: clamp(64px, 8vw, 100px) 0;
}

.impact-section {
  background-color: var(--text-inverse);
  padding: clamp(64px, 8vw, 100px) 0 clamp(80px, 10vw, 120px);
}

.section-divider-wrapper {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 var(--layout-padding-side);

  .section-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;

    .divider-line {
      flex: 1;
      height: 1.5px;
      background: var(--line-ink, oklch(from var(--text-primary) l c h / 14%));
    }

    .divider-icon {
      font-size: 1.25rem;
      opacity: 0.6;
      user-select: none;
    }
  }
}

.impact-action-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0.5rem 0;

  .divider-line {
    flex: 1;
    height: 1.5px;
    background: var(--line-ink, oklch(from var(--text-primary) l c h / 14%));
  }

  .divider-pill {
    padding: 6px 18px;
    border-radius: var(--radius-full);
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-secondary);
    background: oklch(from var(--text-primary) l c h / 4%);
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    white-space: nowrap;
    margin: 0 1.25rem;
  }
}

.call-to-action {
  display: flex;
  gap: clamp(20px, 4vw, 48px);
  width: 100%;
  justify-content: flex-start;

  & > * {
    flex: 1;
  }

  @media (width <= 768px) {
    flex-direction: column;
  }
}
</style>
