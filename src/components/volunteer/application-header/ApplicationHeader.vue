<script setup lang="ts">
const { headerTitle, headerText } = defineProps<{
  headerTitle: string
  headerText?: string
}>()
</script>

<template>
  <header class="form-header">
    <svg
      width="64"
      height="64"
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Paw icon"
      class="header-icon"
    >
      <g fill="var(--color-secondary)">
        <ellipse cx="28" cy="44" rx="11" ry="14" />
        <ellipse cx="100" cy="44" rx="11" ry="14" />
        <ellipse cx="52" cy="28" rx="11" ry="14" />
        <ellipse cx="76" cy="28" rx="11" ry="14" />
        <path
          d="M64 56 c-20 0-36 15-36 32 c0 11 9 20 22 20h28 c13 0 22-9 22-20 c0-17-16-32-36-32z"
        />
      </g>
    </svg>

    <p class="form-eyebrow">Application</p>
    <h1 id="form-title">{{ headerTitle }} <span class="title-accent">application</span></h1>
  </header>

  <p v-if="headerText" class="lede">
    {{ headerText }}
  </p>
</template>

<style scoped lang="css">
.form-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  text-align: center;

  & .form-eyebrow {
    font-family: var(--font-mono);
    font-size: 0.74rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  & h1 {
    font-size: clamp(2rem, 4.5vw, 3.25rem);
    line-height: 1.05;
    color: var(--text-primary);
  }

  & .title-accent {
    font-style: italic;
    font-weight: 600;
    color: var(--color-secondary);
  }

  & .header-icon {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
  }

  @media (width <= 440px) {
    margin-bottom: 1rem;

    & .header-icon {
      width: 44px;
      height: 44px;
    }
  }
}

.lede {
  color: var(--text-secondary);
  margin: 14px auto 22px;
  font-size: 1.05rem;
  line-height: 1.65;
  max-width: 760px;
  user-select: none;
  font-weight: 400;
  text-align: center;

  @media (width <= 440px) {
    font-size: 1rem;
    margin: 8px 0 14px;
  }
}
</style>
