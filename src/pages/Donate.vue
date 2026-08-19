<script setup lang="ts">
// Donation URLs
const PAYPAL_URL = 'https://www.paypal.com/donate'
const ZELLE_EMAIL = 'donate@adohr.org'

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
          ADOHR is volunteer-powered, so your donation goes directly to the animals: medical care,
          food, foster supplies, and the path to a forever family.
        </p>
      </div>
    </section>

    <section class="trust-banner">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="legal">
          ADOHR is a 501(c)(3) nonprofit · EIN: 81-0780050 · Donations are tax-deductible as allowed
          by law.
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
        <div class="vip-card">
          <div class="vip-content">
            <span class="vip-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Monthly Rescue Pack
            </span>
            <h3>Become a Monthly Supporter</h3>
            <p>Join a dedicated group of recurring donors who keep our foster homes stocked year-round. Monthly gifts provide predictable, life-saving funds for animals needing emergency care.</p>
          </div>
          <div class="vip-action">
            <a class="way-cta vip-cta" :href="PAYPAL_URL" target="_blank" rel="noopener noreferrer">
              Join the Pack
            </a>
          </div>
        </div>

        <ul class="ways-grid" role="list">
          <li class="way-item">
            <article class="way-card">
              <h3>One-Time Gift</h3>
              <p>
                Make a direct, one-time contribution through PayPal to support an animal's immediate needs.
              </p>
              <a class="way-cta" :href="PAYPAL_URL" target="_blank" rel="noopener noreferrer">
                Donate Online
              </a>
            </article>
          </li>
          <li class="way-item">
            <article class="way-card">
              <h3>Send via Zelle</h3>
              <p>
                Zelle transfers reach us with no processing fees, so 100% of your gift goes to the
                animals.
              </p>
              <p class="way-detail">{{ ZELLE_EMAIL }}</p>
            </article>
          </li>
          <li class="way-item">
            <article class="way-card">
              <h3>Mail a check</h3>
              <p>
                Make checks payable to <strong>A Dream of Home Rescue</strong> and mail them to our
                PO box.
              </p>
              <p class="way-detail">PO Box 5543, Pasadena, CA 91107</p>
            </article>
          </li>
        </ul>
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
  padding: clamp(120px, 12vw, 150px) var(--layout-padding-side) clamp(40px, 6vw, 70px);
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
    padding: 110px var(--layout-padding-side) 40px;

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

  .vip-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-warning);
    color: var(--text-primary);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    margin-bottom: 2rem;
    gap: 2rem;
    box-shadow: var(--shadow-lg);
    
    .vip-content {
      flex: 1;
      max-width: 600px;
      
      .vip-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        background-color: var(--text-primary);
        color: var(--color-warning);
        padding: 6px 12px;
        border-radius: var(--radius-full);
        margin-bottom: 1rem;
        
        svg { margin-top: -2px; }
      }
      
      h3 {
        font-size: 1.8rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 0.75rem;
      }
      
      p {
        font-size: 1.1rem;
        line-height: 1.5;
        color: var(--text-primary);
        opacity: 0.9;
        margin: 0;
      }
    }
    
    .vip-action {
      flex-shrink: 0;
      
      .vip-cta {
        display: inline-flex;
        background-color: var(--text-primary);
        color: var(--color-warning) !important;
        font-size: 1.1rem;
        font-weight: 700;
        padding: 14px 28px;
        border-radius: var(--radius-full);
        text-decoration: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      }
    }

    @media (width <= 800px) {
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
      
      .vip-action {
        width: 100%;
        .vip-cta { width: 100%; justify-content: center; }
      }
    }
  }

  .ways-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .way-item {
    display: flex;
  }

  .way-card {
    flex: 1 1 0;
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
        background-color: var(--color-secondary-strong, oklch(from var(--color-secondary) 40% c h));
      }

      &:focus-visible {
        outline: 3px solid var(--color-secondary);
        outline-offset: 2px;
      }
    }
  }

  .legal {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.85rem;
    letter-spacing: 0.02em;
    color: var(--text-secondary);
  }
}

.trust-banner {
  padding: 24px var(--layout-padding-side);
  background-color: var(--surface-secondary, oklch(from var(--text-primary) 98% 0 h));
  text-align: center;
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

  .legal {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin: 0;
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
