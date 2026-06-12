<script setup lang="ts">
// TODO: replace with the real giving URLs before enabling the route.
const PAYPAL_URL = '#'
const ZELLE_EMAIL = 'donate@idohr.org'

const impactLedger = [
  { amount: 25, covers: 'Vaccinations and deworming for one rescue' },
  { amount: 60, covers: 'A microchip and registration for one pet' },
  { amount: 150, covers: 'Spay or neuter surgery for one cat or dog' },
  { amount: 300, covers: 'A full month of food and litter for a foster home' },
  { amount: 600, covers: 'Emergency medical care for one animal in crisis' },
]
</script>

<template>
  <main class="donate">
    <section class="hero">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">Every gift opens a door</p>
        <h1>Help a rescue find <em>home</em></h1>
        <p class="lead">
          IDOHR is volunteer-powered, so your donation goes directly to the animals: medical care,
          food, foster supplies, and the path to a forever family.
        </p>
      </div>
    </section>

    <section class="impact" aria-labelledby="impact-title">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">Where your gift goes</p>
        <h2 id="impact-title">The impact ledger</h2>
        <ul class="ledger">
          <li v-for="row in impactLedger" :key="row.amount" class="ledger-row">
            <span class="ledger-amount">${{ row.amount }}</span>
            <span class="ledger-covers">{{ row.covers }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="ways" aria-labelledby="ways-title">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">Ways to give</p>
        <h2 id="ways-title">Choose what works for you</h2>
        <div class="ways-grid">
          <article class="way-card">
            <h3>Give online</h3>
            <p>A one-time or monthly gift through PayPal. Monthly gifts keep foster homes stocked
              year-round.</p>
            <a class="way-cta" :href="PAYPAL_URL" target="_blank" rel="noopener noreferrer">
              Donate with PayPal
            </a>
          </article>
          <article class="way-card">
            <h3>Send via Zelle</h3>
            <p>Zelle transfers reach us with no processing fees, so 100% of your gift goes to the
              animals.</p>
            <p class="way-detail">{{ ZELLE_EMAIL }}</p>
          </article>
          <article class="way-card">
            <h3>Mail a check</h3>
            <p>Make checks payable to <strong>I Dream of Home Rescue</strong> and mail them to our
              PO box.</p>
            <p class="way-detail">PO Box 7612, La Verne, CA 91750</p>
          </article>
        </div>
        <p class="legal">
          IDOHR is a 501(c)(3) nonprofit · EIN: 81-0780050 · Donations are tax-deductible as
          allowed by law.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped lang="css">
.donate {
  width: 100%;
  overflow: hidden;
  background-color: var(--text-inverse);
  color: var(--text-primary);

  .content-wrapper {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
}

/* ── Hero ─────────────────────────────────────────────── */
.hero {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  padding: 170px var(--layout-padding-side) 70px;
  display: flex;
  justify-content: center;

  .content-wrapper {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .eyebrow {
    color: var(--color-warning);
  }

  h1 {
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.04;
    color: var(--text-inverse);
    text-wrap: balance;
    max-width: 16ch;

    em {
      font-style: italic;
      color: oklch(from var(--color-secondary) 78% 0.13 h);
    }
  }

  .lead {
    font-size: 1.2rem;
    max-width: 560px;
    margin-top: 20px;
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

/* ── Impact ledger ───────────────────────────────────── */
.impact {
  padding: 90px var(--layout-padding-side);
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

  .eyebrow {
    color: var(--color-secondary);
  }

  h2 {
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 1.75rem;
  }

  .ledger {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--line-ink-strong, oklch(from var(--text-primary) l c h / 32%));
  }

  .ledger-row {
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  }

  .ledger-amount {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 600;
    color: var(--color-secondary);
    width: 110px;
    flex-shrink: 0;
    text-align: right;
  }

  .ledger-covers {
    font-size: 1.1rem;
    line-height: 1.5;
    color: var(--text-secondary);
  }

  @media (width <= 430px) {
    .ledger-row {
      gap: 1rem;
    }

    .ledger-amount {
      width: 80px;
    }

    .ledger-covers {
      font-size: 1rem;
    }
  }
}

/* ── Ways to give ────────────────────────────────────── */
.ways {
  padding: 90px var(--layout-padding-side) 100px;

  .eyebrow {
    color: var(--color-secondary);
  }

  h2 {
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 1.75rem;
  }

  .ways-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  .way-card {
    background: var(--text-inverse);
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-md);

    h3 {
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: -0.01em;
      padding-bottom: 0.6rem;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    }

    p {
      line-height: 1.55;
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
    }

    .way-detail {
      margin-top: auto;
      margin-bottom: 0;
      font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      padding-top: 0.75rem;
      border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    }

    .way-cta {
      margin-top: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.7rem 1.4rem;
      background-color: var(--color-secondary);
      color: var(--text-inverse);
      font-weight: 700;
      border-radius: var(--radius-full);
      text-decoration: none;
      transition: background-color var(--transition-fast, 0.15s ease);

      &:hover {
        background-color: var(
          --color-secondary-strong,
          oklch(from var(--color-secondary) 40% c h)
        );
      }

      &:focus-visible {
        outline: 3px solid var(--color-secondary);
        outline-offset: 2px;
      }
    }
  }

  .legal {
    margin-top: 2.5rem;
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.85rem;
    letter-spacing: 0.02em;
    color: var(--text-secondary);
    padding-top: 1rem;
    border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  }

  @media (width <= 900px) {
    .ways-grid {
      grid-template-columns: 1fr;
    }
  }
}

/* Reveal hooks (global directive) */
:deep(.reveal) {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

:deep(.reveal.active) {
  opacity: 1;
  transform: translateY(0);
}
</style>
