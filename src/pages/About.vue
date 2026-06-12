<script setup lang="ts">
import AboutFAQ from '@/components/about/AboutFAQ.vue'
import AboutHero from '@/components/about/AboutHero.vue'
import AboutLocations from '@/components/about/AboutLocations.vue'
import AboutMission from '@/components/about/AboutMission.vue'
import AboutStory from '@/components/about/AboutStory.vue'
import AboutTransparency from '@/components/about/AboutTransparency.vue'
import SurrenderCat from '@/components/about/surrender/SurrenderCat.vue'
</script>

<template>
  <main class="about">
    <AboutHero />
    <AboutStory />
    <AboutMission />
    <AboutTransparency />
    <AboutLocations />

    <section class="faq-section">
      <div class="content-wrapper">
        <AboutFAQ />
      </div>
    </section>
  </main>
  <SurrenderCat />
</template>

<style scoped lang="css">
.about {
  width: 100%;
  overflow: hidden;
  color: var(--text-primary);

  .content-wrapper {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .faq-section {
    background-color: var(--text-inverse);
    display: flex;
    justify-content: center;
    padding: 0;
  }
}

:deep(.reveal) {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

:deep(.reveal.active) {
  opacity: 1;
  transform: translateY(0);
}

:deep(.reveal-left) {
  transform: translateX(-30px);
}

:deep(.reveal-right) {
  transform: translateX(30px);
}

:deep(.reveal-left.active),
:deep(.reveal-right.active) {
  transform: translateX(0);
}

:deep(.reveal-delay-200.active) {
  transition-delay: 0.2s;
}
</style>
