<script setup lang="ts">
import { RouterLink } from 'vue-router'

const stories = [
  {
    id: 1,
    name: 'Buster',
    image: '/images/mission.png',
    quote: '"Buster is the best thing that ever happened to our family. He brings so much joy every single day!"',
    family: 'The Smith Family',
  },
  {
    id: 2,
    name: 'Luna',
    image: '/images/watercolor.jpeg',
    quote: '"We came in looking for a dog, but Luna chose us. She has made our house feel like a real home."',
    family: 'Sarah & Mark',
  },
  {
    id: 3,
    name: 'Oliver',
    image: '/images/hero.jpg',
    quote: '"Oliver was so shy when we first fostered him, but now he rules the house and our hearts!"',
    family: 'Jessica T.',
  },
]
</script>

<template>
  <div class="success-stories">
    <header class="stories-header">
      <div class="header-left">
        <p class="eyebrow">Happy Tails</p>
        <h2>Success <span class="display-accent">stories</span></h2>
      </div>
      <RouterLink to="/happy-tails" class="view-all-link">
        View all alumni stories →
      </RouterLink>
    </header>

    <div class="stories-list">
      <article v-for="story in stories" :key="story.id" class="story-card">
        <div class="story-image-wrap">
          <img :src="story.image" :alt="`${story.name} with ${story.family}`" class="story-img" />
        </div>
        <div class="story-content">
          <h3>{{ story.name }}</h3>
          <p class="quote">{{ story.quote }}</p>
          <p class="family">— {{ story.family }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped lang="css">
.success-stories {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  width: 100%;
}

.stories-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', monospace;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-secondary);
    letter-spacing: 0.1em;
  }

  h2 {
    font-size: var(--font-size-h2);
    color: var(--text-primary);
  }

  .view-all-link {
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--color-secondary);
    text-decoration: none;
    padding-bottom: 4px;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;

    &:hover {
      border-bottom-color: var(--color-secondary);
      transform: translateX(2px);
    }
  }
}

.stories-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.25rem, 2.5vw, 2rem);
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  .story-card {
    background: var(--text-inverse);
    border-radius: var(--radius-lg);
    border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 14%));
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }
  }
}

.story-image-wrap {
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 14%));

  .story-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  &:hover .story-img {
    transform: scale(1.04);
  }
}

.story-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;

  h3 {
    font-size: 1.35rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }

  .quote {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-secondary);
    font-style: italic;
    margin-bottom: 1.25rem;
    flex: 1;
  }

  .family {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--color-secondary);
    margin-top: auto;
  }
}
</style>
