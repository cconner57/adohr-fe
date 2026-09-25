<template>
  <section class="story">
    <div class="content-wrapper">
      <div v-scroll-reveal class="reveal-left image-container">
        <div class="story-image-card">
          <picture>
            <source type="image/webp" srcset="/images/about-story.webp" />
            <img
              src="/images/about-story.jpg"
              alt="Two bonded rescue cats cuddling closely together"
              width="720"
              height="960"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </div>
      <div class="story-text reveal-right" v-scroll-reveal>
        <p class="eyebrow">Our story</p>
        <h2>A fresh start built on years of experience</h2>
        <p>
          A Dream of Home Rescue may be a newer name, but our roots in Southern California rescue
          run deep. We are a close-knit group of longtime volunteers, fosters, and animal advocates
          who came together with a simple promise: to put animals first, every single day, with
          complete openness and honesty.
        </p>
        <p>
          Every pet who enters our care is treated like family from the very start. With the help of
          our amazing foster homes, dedicated adopters, and kind supporters, we get to watch second
          chances turn into lifelong happy endings. We believe with all our hearts that compassion
          changes lives, both animal and human.
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
  padding: clamp(64px, 8vw, 96px) var(--layout-padding-side);
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

  .content-wrapper {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: clamp(2.5rem, 5vw, 4rem);
  }

  .image-container {
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }

  .story-image-card {
    display: block;
    position: relative;
    border-radius: var(--radius-xl, 24px);
    overflow: hidden;
    border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    box-shadow: var(--shadow-lg);
    background: var(--text-inverse);
    width: 100%;
    max-width: 380px;
  }

  picture {
    display: block;
    width: 100%;
    height: 100%;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .story-image-card:hover img {
    transform: scale(1.03);
  }

  .story-text {
    flex: 1;
    max-width: 580px;

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

    .image-container {
      justify-content: center;
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
