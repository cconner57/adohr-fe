<script setup lang="ts"></script>

<template>
  <section class="mission">
    <div class="mission-text">
      <p class="eyebrow mission-eyebrow">Our mission</p>
      <h4>Shelter, food, care, and love — until the right door opens.</h4>
      <p class="mission-copy">
        I Dream of Home Rescue (IDOHR) rescues abandoned, unwanted, and surrendered animals. While
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
        src="/images/watercolor.jpeg"
        alt="watercolor painting of dog and cat"
        width="600"
        height="466"
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
    width: min(100%, 380px);
    border-radius: var(--radius-arch);
    overflow: hidden;
    border: 1.5px solid oklch(from var(--text-inverse) l c h / 45%);
    box-shadow: var(--shadow-lg);

    img {
      width: 100%;
      height: 100%;
      aspect-ratio: 4 / 5;
      object-fit: cover;
    }
  }

  @media (width <= 900px) {
    grid-template-columns: 1fr;

    .image-container {
      justify-self: center;
      order: -1;
      width: min(100%, 300px);
    }
  }
}
</style>
