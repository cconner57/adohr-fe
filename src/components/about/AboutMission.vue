<template>
  <section class="mission">
    <div class="content-wrapper">
      <div v-scroll-reveal class="mission-text">
        <p class="eyebrow">Our mission</p>
        <h2>One tail, one paw, one heart at a time</h2>
        <p>
          We rescue, rehabilitate, and rehome animals in need—one tail, one paw, one heart at a
          time. Every animal receives medical care, a safe foster home, love-based socialization,
          and a path to a forever family.
        </p>
        <ul class="ticks">
          <li>Vaccinations, microchipping, and spay/neuter</li>
          <li>Medical treatment and behavioral support</li>
          <li>Adopter education and lifetime support</li>
        </ul>
      </div>
      <div class="image-wrapper reveal-delay-200" v-scroll-reveal>
        <div class="mission-image-card">
          <picture>
            <source type="image/webp" srcset="/images/about-mission.webp" />
            <img
              src="/images/about-mission.jpg"
              alt="Rescued black cat sitting comfortably and looking at the camera"
              class="mission-image"
              width="546"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.mission {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  display: flex;
  justify-content: center;
  padding: clamp(64px, 8vw, 96px) var(--layout-padding-side);

  .content-wrapper {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(2.5rem, 5vw, 4rem);
  }

  .mission-text {
    flex: 1;
    max-width: 580px;
  }

  .image-wrapper {
    display: flex;
    justify-content: flex-end;
    flex: 1;
  }

  .mission-image-card {
    display: block;
    position: relative;
    border-radius: var(--radius-xl, 24px);
    overflow: hidden;
    border: 1.5px solid oklch(100% 0 0deg / 24%);
    box-shadow: var(--shadow-xl);
    background: var(--text-inverse);
    width: 100%;
    max-width: 350px;
    aspect-ratio: 4 / 5;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-warning);
    margin-bottom: 12px;
  }

  h2 {
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.12;
    color: var(--text-inverse);
    text-wrap: balance;
  }

  p:not(.eyebrow) {
    font-size: 1.15rem;
    margin-top: 16px;
    font-weight: 400;
    line-height: 1.65;
    color: oklch(from var(--text-inverse) l c h / 88%);
  }

  picture {
    display: block;
    width: 100%;
    height: 100%;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
    transition: transform 0.4s ease;
  }

  .mission-image-card:hover img {
    transform: scale(1.03);
  }

  .ticks {
    list-style: none;
    padding: 16px 0 0;
    margin: 16px 0 0;
    border-top: 1px solid oklch(from var(--text-inverse) l c h / 22%);
    font-weight: 400;
    color: var(--text-inverse);

    li {
      position: relative;
      padding-left: 30px;
      margin: 10px 0;

      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        top: 1px;
        width: 20px;
        height: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: 800;
        color: var(--color-neutral);
        background: var(--color-warning);
        border-radius: var(--radius-full);
      }
    }
  }

  @media (width <= 1024px) {
    .content-wrapper {
      flex-direction: column;
      gap: 40px;
      text-align: center;
    }

    .mission-text {
      max-width: 100%;

      p:not(.eyebrow),
      .ticks {
        margin-left: auto;
        margin-right: auto;
        text-align: left;
      }

      .ticks {
        display: inline-block;
      }
    }

    .image-wrapper {
      justify-content: center;
      margin: 0 auto;
    }
  }
}
</style>
