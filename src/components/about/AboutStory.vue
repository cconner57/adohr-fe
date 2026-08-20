<template>
  <section class="story">
    <div class="content-wrapper">
      <div v-scroll-reveal class="reveal-left image-container">
        <div class="story-image-card">
          <img
            src="/images/about-story.jpg"
            alt="ADOHR team of veteran volunteers, fosters, and rescued pets together outdoors"
            width="600"
            height="450"
          />
        </div>
      </div>
      <div class="story-text reveal-right" v-scroll-reveal>
        <p class="eyebrow">Our story</p>
        <h2>A fresh start built on years of experience</h2>
        <p>
          While A Dream of Home Rescue (ADOHR) is a newly founded organization, our foundation is built 
          on years of hands-on experience in the Southern California rescue community. Our team of 
          veteran volunteers and fosters recently came together to launch this new chapter, driven by a 
          shared vision of a highly transparent, animal-first rescue.
        </p>
        <p>
          What began as a dedicated circle of passionate rescuers has blossomed into a growing 
          family of adopters and supporters. Together, we believe that compassion changes lives—both 
          animal and human.
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

  .story-image-card {
    display: block;
    position: relative;
    border-radius: var(--radius-xl, 24px);
    overflow: hidden;
    border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    box-shadow: var(--shadow-lg);
    background: var(--text-inverse);
  }

  img {
    display: block;
    width: 100%;
    max-width: 460px;
    height: auto;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .story-image-card:hover img {
    transform: scale(1.03);
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
