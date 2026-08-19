<script setup lang="ts">
import { ref } from 'vue'

import { useScrollReveal } from '@/composables/useScrollReveal'

const { vScrollReveal } = useScrollReveal()

// Donation URLs
const PAYPAL_URL = 'https://www.paypal.com/donate'
const ZELLE_EMAIL = 'donate@adohr.org'

const isCopied = ref(false)
const copyEIN = async () => {
  try {
    await navigator.clipboard.writeText('81-0780050')
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  } catch (err) {
    console.error('Clipboard copy failed', err)
  }
}

const impactLedger = [
  { amount: 25, title: 'Intake Vaccines & Deworming', covers: 'Essential initial vaccines and preventative deworming for one rescue' },
  { amount: 60, title: 'Microchip & Registration', covers: 'A lifetime-registered microchip ensuring the pet can always find their way home' },
  { amount: 150, title: 'Spay or Neuter Surgery', covers: 'Full spay or neuter surgery plus post-operative medication' },
  { amount: 300, title: 'Month of Foster Food & Care', covers: 'A full month of premium food, litter, and supplies for a volunteer foster home' },
  { amount: 500, title: 'Emergency & Specialty Vet Care', covers: 'Urgent medical care, diagnostics, or specialized treatment for an animal in crisis' },
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
          ADOHR is a 501(c)(3) nonprofit · EIN: <strong>81-0780050</strong> · Donations are tax-deductible as allowed by law.
        </p>
      </div>
    </section>

    <!-- Sponsor Line-Item Vet Care -->
    <section class="impact" aria-labelledby="impact-title">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">Targeted impact</p>
        <h2 id="impact-title">Sponsor a Care Item</h2>
        <p class="section-lead">Choose a direct medical or foster care milestone to sponsor today:</p>
        <ul class="ledger">
          <li v-for="row in impactLedger" :key="row.amount" class="ledger-row">
            <div class="ledger-left">
              <span class="ledger-amount">${{ row.amount }}</span>
              <div class="ledger-info">
                <strong>{{ row.title }}</strong>
                <span class="ledger-covers">{{ row.covers }}</span>
              </div>
            </div>
            <a class="sponsor-btn" :href="PAYPAL_URL" target="_blank" rel="noopener noreferrer">
              Sponsor ${{ row.amount }} →
            </a>
          </li>
        </ul>
      </div>
    </section>

    <!-- Ways to Give -->
    <section class="ways" aria-labelledby="ways-title">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">Ways to give</p>
        <h2 id="ways-title">Choose what works for you</h2>
        <div class="vip-card">
          <div class="vip-content">
            <span class="vip-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
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
              <p>Make a direct, one-time contribution through PayPal to support an animal's immediate needs.</p>
              <a class="way-cta" :href="PAYPAL_URL" target="_blank" rel="noopener noreferrer">Donate Online</a>
            </article>
          </li>
          <li class="way-item">
            <article class="way-card">
              <h3>Send via Zelle</h3>
              <p>Zelle transfers reach us with zero processing fees, so 100% of your gift goes directly to the animals.</p>
              <p class="way-detail">{{ ZELLE_EMAIL }}</p>
            </article>
          </li>
          <li class="way-item">
            <article class="way-card">
              <h3>Mail a Check</h3>
              <p>Make checks payable to <strong>A Dream of Home Rescue</strong> and mail them to our Pasadena PO box.</p>
              <p class="way-detail">PO Box 5543, Pasadena, CA 91107</p>
            </article>
          </li>
        </ul>
      </div>
    </section>

    <!-- In-House Employer Match Guide -->
    <section class="employer-match" aria-labelledby="match-title">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">Double your impact</p>
        <h2 id="match-title">Employer Donation Matching</h2>
        <p class="match-lead">
          Thousands of companies (Apple, Disney, Google, Microsoft, Boeing, Kaiser Permanente, Amgen, Netflix, etc.) match employee donations dollar-for-dollar.
        </p>

        <div class="match-card">
          <div class="match-info">
            <h3>How to Request a Match:</h3>
            <ol class="match-steps">
              <li>Donate to ADOHR via PayPal, Zelle, or Check.</li>
              <li>Log into your company giving portal (e.g. <em>Benevity, CyberGrants, YourCause, Bright Funds</em>).</li>
              <li>Search for <strong>A Dream of Home Rescue</strong> using our Tax ID below.</li>
              <li>Submit your receipt to double your gift!</li>
            </ol>
          </div>

          <div class="match-ein-box">
            <span class="ein-label">Nonprofit Tax ID / EIN:</span>
            <span class="ein-code">81-0780050</span>
            <button type="button" class="copy-btn" @click="copyEIN">
              {{ isCopied ? '✓ Copied to Clipboard!' : '📋 Copy EIN' }}
            </button>
            <p class="ein-sub">A Dream of Home Rescue, Inc. · Pasadena, CA</p>
          </div>
        </div>
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
    padding: 0 var(--layout-padding-side);
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

  .section-lead {
    font-size: 1.05rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .hero {
    padding: clamp(120px, 12vw, 150px) 0 clamp(40px, 6vw, 60px);
    text-align: center;
    background-color: var(--color-primary);
    color: var(--text-inverse);

    .eyebrow { color: var(--color-warning); }
    h1 {
      font-size: clamp(2.4rem, 6vw, 4.5rem);
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
      line-height: 1.1;
      em { font-style: italic; color: var(--color-warning); }
    }
    .lead {
      font-size: clamp(1.05rem, 2vw, 1.25rem);
      max-width: 640px;
      margin: 0 auto;
      line-height: 1.6;
      color: oklch(from var(--text-inverse) l c h / 90%);
    }
  }

  .trust-banner {
    padding: 16px 0;
    background-color: oklch(from var(--color-secondary) 96% 0.04 h);
    text-align: center;
    border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    .legal {
      font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .impact {
    padding: clamp(60px, 8vw, 90px) 0;
    border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    h2 { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; margin-bottom: 0.5rem; }

    .ledger {
      list-style: none; padding: 0; margin: 0;
      border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .ledger-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
      background-color: var(--text-inverse);
      transition: background-color 0.2s ease;
      &:last-child { border-bottom: none; }
      &:hover { background-color: oklch(from var(--color-primary-weak) l c h / 30%); }

      .ledger-left {
        display: flex; align-items: center; gap: 1.5rem;
        @media (max-width: 640px) { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
      }
      .ledger-amount {
        font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
        font-size: 1.35rem; font-weight: 800; color: var(--color-primary); min-width: 80px;
      }
      .ledger-info {
        display: flex; flex-direction: column; gap: 2px;
        strong { font-size: 0.95rem; color: var(--text-primary); }
        .ledger-covers { font-size: 0.85rem; color: var(--text-secondary); }
      }
      .sponsor-btn {
        padding: 8px 16px; font-size: 0.85rem; font-weight: 700; color: var(--text-inverse);
        background-color: var(--color-primary); border-radius: var(--radius-full); text-decoration: none;
        white-space: nowrap; transition: transform 0.15s ease, background-color 0.15s ease;
        &:hover { background-color: var(--color-secondary); transform: translateY(-1px); }
      }
    }
  }

  .ways {
    padding: clamp(60px, 8vw, 90px) 0;
    border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    h2 { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; margin-bottom: 2rem; }

    .vip-card {
      background: linear-gradient(135deg, oklch(from var(--color-primary) 25% c h), oklch(from var(--color-primary) 18% c h));
      color: var(--text-inverse); border-radius: var(--radius-lg); padding: 2.5rem;
      display: flex; justify-content: space-between; align-items: center; gap: 2rem;
      box-shadow: var(--shadow-lg); margin-bottom: 2.5rem;
      @media (max-width: 768px) { flex-direction: column; align-items: flex-start; }

      .vip-badge {
        display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px;
        background: oklch(100% 0 0deg / 15%); border-radius: var(--radius-full);
        font-size: 0.78rem; font-weight: 700; color: var(--color-warning); margin-bottom: 0.75rem;
      }
      h3 { font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-inverse); }
      p { font-size: 0.95rem; color: oklch(100% 0 0deg / 85%); line-height: 1.5; max-width: 580px; }
      .vip-cta {
        background-color: var(--color-warning); color: var(--color-primary); font-weight: 800;
        padding: 0.9rem 1.8rem; border-radius: var(--radius-full); text-decoration: none; white-space: nowrap;
        &:hover { background-color: #fff; }
      }
    }

    .ways-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; list-style: none; padding: 0; margin: 0;
      @media (max-width: 800px) { grid-template-columns: 1fr; }
    }
    .way-card {
      background: var(--text-inverse); border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      border-radius: var(--radius-lg); padding: 1.75rem; display: flex; flex-direction: column; box-shadow: var(--shadow-sm); height: 100%;
      h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 0.75rem; }
      p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem; }
      .way-detail { font-family: ui-monospace, 'SF Mono', monospace; font-size: 0.85rem; font-weight: 700; color: var(--color-primary); margin-top: auto; }
      .way-cta {
        margin-top: auto; padding: 0.7rem 1.2rem; background-color: var(--color-secondary); color: var(--text-inverse);
        font-weight: 700; border-radius: var(--radius-full); text-decoration: none; text-align: center;
        &:hover { background-color: var(--color-primary); }
      }
    }
  }

  .employer-match {
    padding: clamp(60px, 8vw, 90px) 0;
    h2 { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; margin-bottom: 0.5rem; }
    .match-lead { font-size: 1.05rem; color: var(--text-secondary); max-width: 700px; margin-bottom: 2rem; }

    .match-card {
      display: grid; grid-template-columns: 1.4fr 1fr; gap: 2rem; background: var(--text-inverse);
      border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%)); border-radius: var(--radius-lg);
      padding: 2rem; box-shadow: var(--shadow-md);
      @media (max-width: 768px) { grid-template-columns: 1fr; }

      .match-steps {
        padding-left: 1.25rem; font-size: 0.92rem; color: var(--text-primary); line-height: 1.6;
        li { margin-bottom: 0.5rem; }
      }

      .match-ein-box {
        background: oklch(from var(--color-primary) 96% 0.04 h); border: 1.5px dashed var(--color-primary);
        border-radius: var(--radius-md); padding: 1.5rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px;

        .ein-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-secondary); letter-spacing: 0.1em; }
        .ein-code { font-family: ui-monospace, 'SF Mono', monospace; font-size: 1.8rem; font-weight: 900; color: var(--color-primary); }
        .copy-btn {
          background-color: var(--color-primary); color: var(--text-inverse); border: none; padding: 8px 18px;
          border-radius: var(--radius-full); font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.15s ease;
          &:hover { background-color: var(--color-secondary); transform: scale(1.03); }
        }
        .ein-sub { font-size: 0.78rem; color: var(--text-secondary); margin-top: 4px; }
      }
    }
  }
}
</style>
