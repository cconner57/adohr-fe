<script setup lang="ts">
import Candid from '@/components/common/candid-award/Candid.vue'
</script>

<template>
  <section class="transparency">
    <div class="content-wrapper">
      <div class="awards" v-scroll-reveal>
        <a
          href="https://www.guidestar.org/profile/81-0780050"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View ADOHR Candid profile"
        >
          <Candid type="Gold" year="2024" class="award-item" />
        </a>
        <a
          href="https://www.guidestar.org/profile/81-0780050"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View ADOHR Candid profile"
        >
          <Candid type="Gold" year="2023" class="award-item" style="transition-delay: 0.1s" />
        </a>
        <a
          href="https://www.guidestar.org/profile/81-0780050"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View ADOHR Candid profile"
        >
          <Candid type="Silver" year="2022" class="award-item" style="transition-delay: 0.2s" />
        </a>
      </div>
      <div class="notice reveal-left" v-scroll-reveal>
        <p class="eyebrow">Accountability</p>
        <h2>Transparency</h2>
        <p>
          ADOHR is a 501(c)(3) nonprofit. Donations are tax-deductible as allowed by law. We publish
          annual updates and operate with financial transparency.
        </p>
        <p class="small mono">EIN: 81-0780050 · PO Box 5543, Pasadena, CA 91107</p>
        <p class="small">
          Candid Seals recognize nonprofit transparency and profile completeness.
          <a
            class="candid-link-row"
            href="https://app.candid.org/profile/9498927/i-dream-of-home-rescue-inc-81-0780050"
            target="_blank"
            rel="noopener noreferrer"
          >
            View our Candid profile
          </a>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.transparency {
  color: var(--text-primary);
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
  }

  p:not(.eyebrow) {
    font-size: 1.15rem;
    max-width: 600px;
    margin-top: 16px;
    line-height: 1.65;
    color: var(--text-secondary);
  }

  .notice {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex: 1;

    .small {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-top: 14px;

      &.mono {
        font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
        letter-spacing: 0.02em;
        padding-top: 14px;
        border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      }

      a {
        color: var(--color-secondary);
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      .candid-link-row {
        display: block;
        margin-top: 6px;
      }
    }
  }

  .awards {
    display: flex;
    gap: 3rem;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  @media (width <= 1024px) {
    .content-wrapper {
      flex-direction: column;
      gap: 40px;
      text-align: center;
    }

    .awards {
      order: -1;
      margin-bottom: 2rem;
    }

    .notice {
      text-align: center;
      align-items: center;
      max-width: 100%;

      p {
        margin-left: auto;
        margin-right: auto;
      }
    }
  }

  @media (width >= 321px) and (width <= 430px) {
    .awards {
      flex-direction: column;
      gap: 3.5rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }
}

:deep(.award-item) {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

:deep(.active .award-item) {
  opacity: 1;
  transform: translateY(0);
}
</style>
