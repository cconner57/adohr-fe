<script setup lang="ts"></script>

<template>
  <section class="mission">
    <div class="mission-text">
      <p class="eyebrow mission-eyebrow">Our mission</p>
      <h4>Shelter, food, care, and love — until the right door opens.</h4>
      <p class="mission-copy">
        A Dream of Home Rescue (ADOHR) rescues abandoned, unwanted, and surrendered animals. While
        we search for loving homes, we give them what every animal deserves: shelter, food,
        veterinary care, and love. We also advocate for pet adoption, spaying, neutering, and
        responsible pet care.
      </p>
      <ul class="mission-list">
        <li>Vaccinations, microchipping &amp; spay/neuter</li>
        <li>Medical treatment &amp; behavioral support</li>
        <li>Adopter education &amp; lifetime support</li>
      </ul>
    </div>
    <div class="image-container">
      <img
        src="/images/mission-care.jpg"
        alt="A loving foster caregiver caring for a rescued dog and cat in a warm home"
        width="600"
        height="450"
      />
    </div>
  </section>
</template>

<style scoped lang="css">
.mission {
  width: 100%;
  background-color: var(--color-primary);
  color: var(--text-inverse);
  border-radius: calc(var(--radius-lg) * 2);
  border: 1.5px solid var(--text-primary);
  padding: clamp(2rem, 5vw, 4.5rem);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);

  .mission-eyebrow {
    color: var(--color-warning);
    margin-bottom: 1rem;
  }

  h4 {
    font-size: var(--font-size-h3);
    color: var(--text-inverse);
    margin-bottom: 1.25rem;
    max-width: 22ch;
  }

  .mission-copy {
    font-size: 1.05rem;
    line-height: 1.65;
    color: oklch(from var(--text-inverse) l c h / 85%);
    max-width: 56ch;
    margin-bottom: 1.5rem;
  }

  .mission-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;

    li {
      position: relative;
      padding: 0.75rem 0 0.75rem 1.9rem;
      border-top: 1px solid oklch(from var(--text-inverse) l c h / 18%);
      color: var(--text-inverse);
      font-weight: 500;

      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--color-warning);
        font-weight: 700;
      }
    }
  }

  .image-container {
    justify-self: end;
    width: min(100%, 420px);
    border-radius: var(--radius-xl, 24px);
    overflow: hidden;
    border: 1.5px solid oklch(from var(--text-inverse) l c h / 35%);
    box-shadow: var(--shadow-xl);
    background: var(--text-inverse);

    img {
      width: 100%;
      height: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &:hover img {
      transform: scale(1.03);
    }
  }

  @media (width <= 900px) {
    grid-template-columns: 1fr;

    .image-container {
      justify-self: center;
      order: -1;
      width: min(100%, 340px);
    }
  }
}
</style>
