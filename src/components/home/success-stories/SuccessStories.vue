<script setup lang="ts">
const stories = [
  {
    id: 1,
    name: 'Buster',
    image: '/images/success-1.jpg',
    quote: '"Buster is the best thing that ever happened to our family. He brings so much joy every single day!"',
    family: 'The Smith Family'
  },
  {
    id: 2,
    name: 'Luna',
    image: '/images/success-2.jpg',
    quote: '"We came in looking for a dog, but Luna chose us. She has made our house feel like a real home."',
    family: 'Sarah & Mark'
  },
  {
    id: 3,
    name: 'Oliver',
    image: '/images/success-3.jpg',
    quote: '"Oliver was so shy when we first fostered him, but now he rules the house and our hearts!"',
    family: 'Jessica T.'
  }
]
</script>

<template>
  <div class="success-stories">
    <header class="stories-header">
      <p class="eyebrow">Happy Tails</p>
      <h2>Success <span class="display-accent">stories</span></h2>
    </header>

    <div class="stories-list">
      <article v-for="story in stories" :key="story.id" class="story-card">
        <div class="story-image-placeholder">
           <div class="fallback-img"></div>
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
  flex-direction: column;
  gap: 0.625rem;

  .eyebrow {
    color: var(--color-secondary);
  }

  h2 {
    font-size: var(--font-size-h2);
    color: var(--text-primary);
  }
}

.stories-list {
  display: flex;
  justify-content: space-between;
  gap: clamp(1rem, 2vw, 2rem);
  width: 100%;
  padding: 8px 4px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  .story-card {
    flex: 1 1 0;
    min-width: 280px;
    max-width: 340px;
    background: var(--color-white);
    border-radius: var(--radius-lg);
    border: 1.5px solid var(--line-ink);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}

@media (width <= 1140px) {
  .stories-list {
    justify-content: flex-start;
  }
}

.story-image-placeholder {
  width: 100%;
  height: 200px;
  background-color: var(--color-gray-50);
  border-bottom: 1px solid var(--line-ink);
  
  .fallback-img {
    width: 100%;
    height: 100%;
    background-color: var(--color-primary-weak);
    mask: url('/images/paw.svg') no-repeat center center;
    mask-size: 80px 80px;
  }
}

.story-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;

  h3 {
    font-size: 1.4rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }

  .quote {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-secondary);
    font-style: italic;
    margin-bottom: 1.5rem;
    flex: 1;
  }

  .family {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-secondary);
    margin-top: auto;
  }
}
</style>
