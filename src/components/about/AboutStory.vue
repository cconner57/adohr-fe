<template>
  <section class="story">
    <div class="content-wrapper">
      <div v-scroll-reveal class="reveal-left image-container">
        <span class="arch-frame">
          <img
            src="/images/watercolor.jpeg"
            alt="ADOHR watercolor inspiration"
            width="600"
            height="466"
          />
        </span>
      </div>
      <div class="story-text reveal-right" v-scroll-reveal>
        <p class="eyebrow">Our story</p>
        <h2>It started with a dream — and a handful of fosters</h2>
        <p>
          ADOHR began in 2016 with a simple dream: to give every abandoned, neglected, and unwanted
          animal a safe place to call home. What started as a small circle of fosters has grown into
          a community of adopters, volunteers, and supporters who believe compassion changes
          lives—both animal and human.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.story {
  background-color: var(--text-inverse);
  display: flex;
  justify-content: center;
  padding: 90px var(--layout-padding-side);
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

  .content-wrapper {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
  }

  .image-container {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .arch-frame {
    display: block;
    position: relative;
    padding: 10px;
    border: 1px solid var(--line-ink-strong, oklch(from var(--text-primary) l c h / 32%));
    border-radius: var(--radius-arch, 999px 999px var(--radius-lg) var(--radius-lg));
  }

  img {
    display: block;
    width: 100%;
    max-width: 420px;
    height: auto;
    aspect-ratio: 5 / 6;
    object-fit: cover;
    border-radius: var(--radius-arch, 999px 999px var(--radius-lg) var(--radius-lg));
    box-shadow: var(--shadow-lg);
  }

  .story-text {
    flex: 1;
    max-width: 600px;

    .eyebrow {
      font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--color-secondary);
      margin-bottom: 12px;
    }

    h2 {
      font-size: clamp(1.8rem, 3.2vw, 2.6rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.12;
      text-wrap: balance;
    }

    p:not(.eyebrow) {
      font-size: 1.15rem;
      margin-top: 16px;
      line-height: 1.65;
      color: var(--text-secondary);
    }
  }

  @media (width <= 1024px) {
    .content-wrapper {
      flex-direction: column;
      gap: 40px;
      text-align: center;
    }

    .story-text {
      max-width: 100%;

      p:not(.eyebrow) {
        margin-left: auto;
        margin-right: auto;
        text-align: left;
      }
    }
  }
}
</style>
