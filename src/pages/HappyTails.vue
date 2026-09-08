<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import Footer from '@/components/common/footer/Footer.vue'
import SubmitHappyTailModal from '@/components/happy-tails/SubmitHappyTailModal.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useHappyTailsStore } from '@/stores/happyTails'
import { formatDate } from '@/utils/date'

const { vScrollReveal } = useScrollReveal()
const route = useRoute()

const happyTailsStore = useHappyTailsStore()
const { sortedItems, isLoading, error } = storeToRefs(happyTailsStore)

const currentFilter = ref<'all' | 'dog' | 'cat'>('all')
const isSubmitModalOpen = ref(false)

const filteredItems = computed(() => {
  if (currentFilter.value === 'all') return sortedItems.value
  return sortedItems.value.filter(item => item.species === currentFilter.value)
})

onMounted(() => {
  happyTailsStore.fetchHappyTails()
  if (route.query.submit === 'true') {
    isSubmitModalOpen.value = true
  }
})

watch(
  () => route.query.submit,
  (val) => {
    if (val === 'true') {
      isSubmitModalOpen.value = true
    }
  },
)
</script>

<template>
  <main class="happy-tails-page">
    <section class="hero">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">From rescue to home</p>
        <h1>Happy Tails</h1>
        <p class="lead">Celebrating the beautiful journeys of adopted pets and the loving families who gave them a second chance at life.</p>
        <button type="button" class="hero-submit-btn" @click="isSubmitModalOpen = true">
          🐾 Share Your Happy Tail
        </button>
      </div>
    </section>

    <section class="stats-bar">
      <div class="content-wrapper" v-scroll-reveal>
        <div class="stat">
          <span class="stat-number">5,243</span>
          <span class="stat-label">alumni and counting</span>
        </div>
      </div>
    </section>

    <section class="gallery-section" aria-live="polite">
      <div class="content-wrapper">
        <div class="filters" v-scroll-reveal>
          <button 
            :class="['filter-btn', { active: currentFilter === 'all' }]"
            @click="currentFilter = 'all'"
          >
            All Alumni
          </button>
          <button 
            :class="['filter-btn', { active: currentFilter === 'dog' }]"
            @click="currentFilter = 'dog'"
          >
            Dogs
          </button>
          <button 
            :class="['filter-btn', { active: currentFilter === 'cat' }]"
            @click="currentFilter = 'cat'"
          >
            Cats
          </button>
        </div>

        <div v-if="isLoading" class="skeleton-masonry">
          <div v-for="i in 6" :key="i" class="tail-card skeleton">
            <div class="skeleton-img"></div>
            <div class="tail-card__content">
              <div class="skeleton-title"></div>
              <div class="skeleton-meta"></div>
              <div class="skeleton-quote"></div>
            </div>
          </div>
        </div>
        
        <p v-else-if="error" class="status error">{{ error }}</p>
        
        <div v-else-if="filteredItems.length === 0" class="status empty">
          No happy tails found for this filter.
        </div>
        
        <div v-else class="masonry-grid">
          <article v-for="item in filteredItems" :key="item.id" class="tail-card" v-scroll-reveal>
            <div class="img-wrapper">
              <img :src="item.photoUrl" :alt="item.petName" loading="lazy" />
            </div>
            <div class="tail-card__content">
              <div class="header">
                <h2>{{ item.petName }}</h2>
                <span class="capsule">{{ item.species === 'dog' ? 'Dog' : 'Cat' }}</span>
              </div>
              <p class="meta">Adopted by {{ item.adoptersName }} · {{ formatDate(item.adoptedDate) }}</p>
              <blockquote class="testimonial">
                "{{ item.testimonial }}"
              </blockquote>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="content-wrapper" v-scroll-reveal>
        <h2>Your pet could be next</h2>
        <p>There are so many animals waiting for their forever homes. Start your journey today.</p>
        <router-link to="/adopt" class="cta-button">View Adoptable Pets</router-link>
      </div>
    </section>
  </main>
  
  <Footer />
  <SubmitHappyTailModal :isOpen="isSubmitModalOpen" @close="isSubmitModalOpen = false" />
</template>

<style scoped lang="css">
.happy-tails-page {
  min-height: 100vh;
  background: var(--text-inverse);
  color: var(--text-primary);

  .content-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--layout-padding-side);
    box-sizing: border-box;
  }
}

/* ── Hero ─────────────────────────────────────────────── */
.hero {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  padding: clamp(120px, 12vw, 160px) 0 clamp(40px, 6vw, 60px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-warning);
    margin-bottom: 12px;
  }

  h1 {
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    margin-bottom: 0.5rem;
    line-height: 1.1;
  }

  .lead {
    font-size: clamp(1.05rem, 2vw, 1.2rem);
    max-width: 680px;
    margin: 20px auto 0;
    line-height: 1.6;
    color: oklch(from var(--text-inverse) l c h / 88%);
  }

  .hero-submit-btn {
    all: unset;
    margin-top: 1.5rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: var(--color-warning);
    color: var(--text-primary);
    font-weight: 700;
    font-size: 1rem;
    padding: 10px 24px;
    border-radius: var(--radius-full);
    cursor: pointer;
    box-shadow: 0 4px 14px oklch(0% 0 0deg / 25%);
    transition: all 0.2s ease;

    &:hover {
      scale: 1.05;
      background-color: oklch(from var(--color-warning) 92% c h);
    }
  }
}

/* ── Stats Bar ────────────────────────────────────────── */
.stats-bar {
  background-color: var(--surface-secondary, oklch(from var(--text-primary) 98% 0 h));
  padding: 30px 0;
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  text-align: center;

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .stat-number {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1;
  }

  .stat-label {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }
}

/* ── Gallery Section ──────────────────────────────────── */
.gallery-section {
  padding: clamp(50px, 8vw, 80px) 0;

  .filters {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }

  .filter-btn {
    background: transparent;
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 20%));
    color: var(--text-secondary);
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-full, 99px);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--text-primary);
      color: var(--text-primary);
    }

    &.active {
      background: var(--text-primary);
      border-color: var(--text-primary);
      color: var(--text-inverse);
    }
  }

  .status {
    text-align: center;
    color: var(--text-secondary);
    font-size: 1.1rem;
    padding: 3rem 0;

    &.error {
      color: var(--color-danger);
    }
  }

  /* Masonry Grid */
  .masonry-grid {
    column-count: 3;
    column-gap: 1.5rem;
  }

  .skeleton-masonry {
    column-count: 3;
    column-gap: 1.5rem;
  }

  @media (width <= 900px) {
    .masonry-grid, .skeleton-masonry {
      column-count: 2;
    }
  }

  @media (width <= 600px) {
    .masonry-grid, .skeleton-masonry {
      column-count: 1;
    }
  }

  .tail-card {
    break-inside: avoid;
    margin-bottom: 1.5rem;
    background: var(--text-inverse);
    border-radius: var(--radius-lg);
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    overflow: hidden;
    box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.05));
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg, 0 10px 15px rgba(0,0,0,0.1));

      .img-wrapper img {
        transform: scale(1.05);
      }
    }

    .img-wrapper {
      width: 100%;
      overflow: hidden;
      aspect-ratio: 4 / 3;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
    }

    .tail-card__content {
      padding: 1.5rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      gap: 1rem;

      h2 {
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.015em;
        margin: 0;
      }

      .capsule {
        font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 4px 10px;
        background: var(--surface-secondary, oklch(from var(--text-primary) 96% 0 h));
        border-radius: var(--radius-full, 99px);
        color: var(--text-primary);
      }
    }

    .meta {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0 0 1.25rem;
      font-weight: 500;
    }

    .testimonial {
      margin: 0;
      padding-left: 1rem;
      border-left: 3px solid var(--color-warning);
      font-style: italic;
      line-height: 1.6;
      color: var(--text-primary);
      font-size: 1.05rem;
    }

    /* Skeleton Styles */
    &.skeleton {
      .skeleton-img {
        width: 100%;
        aspect-ratio: 4 / 3;
        background: var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
        animation: pulse 1.5s infinite;
      }

      .skeleton-title {
        height: 24px;
        width: 60%;
        background: var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
        margin-bottom: 0.5rem;
        animation: pulse 1.5s infinite;
      }

      .skeleton-meta {
        height: 14px;
        width: 80%;
        background: var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
        margin-bottom: 1.25rem;
        animation: pulse 1.5s infinite;
      }

      .skeleton-quote {
        height: 60px;
        width: 100%;
        background: var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
        border-left: 3px solid var(--line-ink);
        animation: pulse 1.5s infinite;
      }
    }
  }

  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.3; }
    100% { opacity: 0.6; }
  }
}

/* ── CTA Section ──────────────────────────────────────── */
.cta-section {
  background-color: var(--color-secondary);
  color: var(--text-inverse);
  padding: clamp(60px, 8vw, 100px) 0;
  text-align: center;

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }

  p {
    font-size: clamp(1.1rem, 2vw, 1.25rem);
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
    color: oklch(from var(--text-inverse) l c h / 90%);
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    background-color: var(--text-inverse);
    color: var(--color-secondary);
    font-weight: 700;
    font-size: 1.1rem;
    border-radius: var(--radius-full, 99px);
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
  }
}

/* Reveal hooks (global directive) */
:deep(.reveal) {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

:deep(.reveal.active) {
  opacity: 1;
  transform: translateY(0);
}
</style>
