<script setup lang="ts">
import Button from '@/components/common/ui/Button.vue'

const handleGoHome = () => {
  window.location.href = '/'
}
</script>

<template>
  <div class="not-found-container">
    <div class="content">
      <img src="/images/404.jpeg" alt="404 Not Found" class="not-found-image" />
      <h1>Oops! Page Not Found</h1>
      <p>The page you are looking for might have been removed or is temporarily unavailable.</p>
      <Button @click="handleGoHome" title="Return Home" color="orange" size="large" />
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-primary);
  padding: 2rem;
  padding-top: 8rem;
  text-align: center;
}

@media (width <= 768px) {
  .not-found-container {
    padding-top: 6rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.not-found-image {
  max-width: min(100%, 360px);
  height: auto;
  border-radius: var(--radius-arch, 999px 999px var(--radius-lg) var(--radius-lg));
  box-shadow: var(--shadow-lg);
  margin-bottom: 1rem;
  margin-top: 2rem;
}

h1 {
  color: var(--text-inverse);
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
}

p {
  color: oklch(from var(--text-inverse) l c h / 88%);
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0 0 1rem;
  line-height: 1.55;
}
</style>
