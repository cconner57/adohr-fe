<script setup lang="ts">
import { ref } from 'vue'

import Footer from '@/components/common/footer/Footer.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { vScrollReveal } = useScrollReveal()

// Donation URLs (Online donation checkout temporarily disabled until Stripe integration)
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

const isZelleCopied = ref(false)
const copyZelle = async () => {
  try {
    await navigator.clipboard.writeText(ZELLE_EMAIL)
    isZelleCopied.value = true
    setTimeout(() => {
      isZelleCopied.value = false
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
        <h1>Help a rescue find a <em>home</em></h1>
        <p class="lead">
          ADOHR is volunteer-powered, so your donation goes directly to the animals: medical care,
          food, foster supplies, and the path to a forever family.
        </p>

        <div class="online-giving-notice" role="status">
          <span class="notice-badge">Coming Soon</span>
          <div class="notice-text">
            <strong>Online checkout is launching in October!</strong>
            <span> In the meantime, you can donate instantly with zero processing fees via Zelle below or by mailing a check.</span>
          </div>
        </div>
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
            <button
              type="button"
              class="sponsor-btn"
              disabled
              aria-disabled="true"
              title="Online checkout launching soon! Please donate via Zelle below."
            >
              Sponsor ${{ row.amount }} →
            </button>
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
            <button
              type="button"
              class="way-cta vip-cta"
              disabled
              aria-disabled="true"
              title="Online checkout launching soon! Please donate via Zelle below."
            >
              Join the Pack
            </button>
          </div>
        </div>

        <ul class="ways-grid" role="list">
          <li class="way-item">
            <article class="way-card">
              <h3>One-Time Gift</h3>
              <p>Make a direct, one-time contribution through PayPal to support an animal's immediate needs.</p>
              <button
                type="button"
                class="way-cta"
                disabled
                aria-disabled="true"
                title="Online checkout launching soon! Please donate via Zelle below."
              >
                Donate Online
              </button>
            </article>
          </li>
          <li class="way-item">
            <article class="way-card">
              <h3>Send via Zelle</h3>
              <p>Zelle transfers reach us with zero processing fees, so 100% of your gift goes directly to the animals.</p>
              <div class="zelle-box">
                <span class="way-detail">{{ ZELLE_EMAIL }}</span>
                <button
                  type="button"
                  class="copy-zelle-btn"
                  @click="copyZelle"
                  aria-label="Copy Zelle email to clipboard"
                >
                  {{ isZelleCopied ? '✓ Copied!' : 'Copy Zelle Email' }}
                </button>
              </div>
            </article>
          </li>
          <li class="way-item">
            <article class="way-card">
              <h3>Foster Supply Wishlist</h3>
              <p>Send needed food, kitten formula, litter, and supplies directly to our foster homes (online wishlists coming soon!).</p>
              <RouterLink to="/wishlist" class="way-cta">View Wishlist</RouterLink>
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
              <li>Donate to ADOHR via PayPal or Zelle.</li>
              <li>Log into your company giving portal (e.g. <em>Benevity, CyberGrants, YourCause, Bright Funds</em>).</li>
              <li>Search for <strong>A Dream of Home Rescue</strong> using our Tax ID below.</li>
              <li>Submit your receipt to double your gift!</li>
            </ol>
          </div>

          <div class="match-ein-box">
            <span class="ein-label">Nonprofit Tax ID / EIN:</span>
            <span class="ein-code">81-0780050</span>
            <button type="button" class="copy-btn" @click="copyEIN">
              {{ isCopied ? '✓ Copied to Clipboard!' : 'Copy EIN' }}
            </button>
            <p class="ein-sub">A Dream of Home Rescue, Inc. · Pasadena, CA</p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </main>
</template>

<style scoped src="./Donate.css"></style>

