<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import { useNewsStore } from '@/stores/news'
import { formatDate } from '@/utils/date'

const newsStore = useNewsStore()
const { sortedItems, isLoading, error } = storeToRefs(newsStore)

onMounted(() => {
  newsStore.fetchNews()
})
</script>

<template>
  <main class="news-page">
    <section class="hero">
      <div class="content-wrapper">
        <p class="eyebrow">Dispatches from the rescue</p>
        <h1>IDOHR News</h1>
        <p>Updates from rescue operations, events, and community milestones.</p>
      </div>
    </section>

    <section class="news-list">
      <div class="content-wrapper">
        <p v-if="isLoading" class="status">Loading updates...</p>
        <p v-else-if="error" class="status error">{{ error }}</p>

        <article v-for="item in sortedItems" :key="item.id" class="news-card">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" loading="lazy" />
          <div class="news-card__content">
            <p class="meta">{{ item.category }} · {{ formatDate(item.publishedAt) }}</p>
            <h2>{{ item.title }}</h2>
            <p class="excerpt">{{ item.excerpt }}</p>
            <p>{{ item.body }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped lang="css">
.news-page {
  min-height: 100vh;
  background: var(--text-inverse);

  .content-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--layout-padding-side);
    box-sizing: border-box;
  }

  .hero {
    padding: 160px 0 60px;
    background-color: var(--color-primary);
    color: var(--text-inverse);

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
      font-size: clamp(2.2rem, 5vw, 3.6rem);
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
    }

    p:not(.eyebrow) {
      font-size: 1.1rem;
      max-width: 680px;
      line-height: 1.6;
      color: oklch(from var(--text-inverse) l c h / 88%);
    }
  }

  .news-list {
    padding: 50px 0 80px;
  }

  .status {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-bottom: 1rem;

    &.error {
      color: var(--color-danger);
    }
  }

  .news-card {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
    background: var(--text-inverse);
    border-radius: var(--radius-lg);
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    overflow: hidden;
    margin-bottom: 1.25rem;
    box-shadow: var(--shadow-md);
    padding: 1.25rem;

    img {
      width: 100%;
      height: 100%;
      min-height: 220px;
      object-fit: cover;
      border-radius: var(--radius-arch, 999px 999px var(--radius-lg) var(--radius-lg));
    }

    .news-card__content {
      padding: 0.25rem 0;
      color: var(--text-primary);

      .meta {
        font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--color-secondary);
        font-weight: 600;
      }

      h2 {
        margin: 0.4rem 0 0.6rem;
        font-size: 1.45rem;
        font-weight: 800;
        letter-spacing: -0.015em;
      }

      .excerpt {
        font-weight: 700;
        padding-bottom: 0.6rem;
        margin-bottom: 0.6rem;
        border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      }

      p {
        line-height: 1.6;
        color: var(--text-secondary);
      }
    }
  }

  @media (width <= 768px) {
    .hero {
      padding: 130px 0 36px;
    }

    .news-card {
      grid-template-columns: 1fr;

      img {
        min-height: 180px;
        max-height: 240px;
      }
    }
  }
}
</style>
