<template>
  <section class="hero" v-scroll-reveal>
    <div class="content-wrapper">
      <p class="eyebrow">Est. 2016 · Southern California</p>
      <h1>The people behind <em>the door</em></h1>
      <p class="lead">
        I Dream of Home Rescue (IDOHR) is a volunteer-powered nonprofit helping homeless cats and
        dogs heal, thrive, and find loving homes across Southern California.
      </p>
    </div>
  </section>
</template>

<style scoped lang="css">
.hero {
  padding: 170px var(--layout-padding-side) 70px;
  color: var(--text-inverse);
  background-color: var(--color-primary);
  display: flex;
  justify-content: center;

  .content-wrapper {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-warning);
    margin-bottom: 14px;
  }

  h1 {
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.04;
    color: var(--text-inverse);
    text-wrap: balance;
    max-width: 14ch;

    em {
      font-style: italic;
      color: oklch(from var(--color-secondary) 78% 0.13 h);
    }
  }

  .lead {
    font-size: 1.2rem;
    max-width: 560px;
    margin-top: 20px;
    font-weight: 400;
    line-height: 1.6;
    color: oklch(from var(--text-inverse) l c h / 88%);
  }

  @media (width >= 321px) and (width <= 430px) {
    padding: 120px var(--layout-padding-side) 50px;

    .lead {
      font-size: 1.05rem;
    }
  }
}
</style>
