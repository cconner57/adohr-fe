<script setup lang="ts">
import { ref } from 'vue'

import Footer from '@/components/common/footer/Footer.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const { vScrollReveal } = useScrollReveal()

const DONATION_PORTAL_URL = 'https://adoption-os.com/donate/adohr'
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

interface IImpactLedgerItem {
  id: string
  amount: number
  title: string
  covers: string
}

const impactLedger: IImpactLedgerItem[] = [
  {
    id: 'vaccines',
    amount: 25,
    title: 'Vaccines & Deworming',
    covers: 'Initial vaccines and preventive care for a new rescue',
  },
  {
    id: 'microchip',
    amount: 60,
    title: 'Microchip & Registration',
    covers: 'Lifetime microchip to keep a pet safe and identifiable',
  },
  {
    id: 'spay_neuter',
    amount: 150,
    title: 'Spay or Neuter Surgery',
    covers: 'Complete surgery and recovery care for one cat or dog',
  },
  {
    id: 'foster_care',
    amount: 300,
    title: 'Month of Foster Care',
    covers: 'A full month of food, litter, and supplies for a foster home',
  },
  {
    id: 'emergency_vet',
    amount: 500,
    title: 'Emergency Vet Care',
    covers: 'Urgent medical care and treatment for an animal in crisis',
  },
]

const getCareItemDonationUrl = (item: IImpactLedgerItem): string => {
  return `${DONATION_PORTAL_URL}?item=${encodeURIComponent(item.id)}&amount=${item.amount}&mode=one_time`
}

const getMonthlyDonationUrl = (amount = 25): string => {
  return `${DONATION_PORTAL_URL}?mode=monthly&amount=${amount}`
}

const getOneTimeDonationUrl = (): string => {
  return `${DONATION_PORTAL_URL}?mode=one_time`
}
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
      </div>
    </section>

    <section class="trust-banner">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="legal">
          ADOHR is a 501(c)(3) nonprofit · EIN: <strong>81-0780050</strong> · Donations are tax-deductible as allowed by law.
        </p>
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
            <p>Monthly gifts provide steady, life-saving support for foster supplies, medical care, and rescue emergencies.</p>
          </div>
          <div class="vip-action">
            <a
              :href="getMonthlyDonationUrl(25)"
              target="_blank"
              rel="noopener noreferrer"
              class="way-cta vip-cta"
            >
              Join the Pack
            </a>
          </div>
        </div>

        <ul class="ways-grid" role="list">
          <li class="way-item">
            <article class="way-card">
              <h3>One-Time Gift</h3>
              <p>Make a direct, secure donation to help cover food, shelter, and medical care for an animal in need.</p>
              <a
                :href="getOneTimeDonationUrl()"
                target="_blank"
                rel="noopener noreferrer"
                class="way-cta"
              >
                Donate Online
              </a>
            </article>
          </li>
          <li class="way-item">
            <article class="way-card">
              <h3>Send via Zelle</h3>
              <p>Donate with zero processing fees so 100% of your gift goes straight to animal care.</p>
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
              <p>Send needed food, kitten formula, litter, and supplies directly to our foster homes.</p>
              <RouterLink to="/wishlist" class="way-cta">View Wishlist</RouterLink>
            </article>
          </li>
        </ul>
      </div>
    </section>

    <!-- Sponsor Line-Item Vet Care -->
    <section class="impact" aria-labelledby="impact-title">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">Targeted impact</p>
        <h2 id="impact-title">Sponsor a Care Item</h2>
        <p class="section-lead">Directly fund a rescue animal's medical care or foster essentials:</p>
        <ul class="ledger">
          <li v-for="row in impactLedger" :key="row.id" class="ledger-row">
            <div class="ledger-left">
              <span class="ledger-amount">${{ row.amount }}</span>
              <div class="ledger-info">
                <strong>{{ row.title }}</strong>
                <span class="ledger-covers">{{ row.covers }}</span>
              </div>
            </div>
            <a
              :href="getCareItemDonationUrl(row)"
              target="_blank"
              rel="noopener noreferrer"
              class="sponsor-btn"
              :aria-label="`Sponsor ${row.title} for $${row.amount}`"
            >
              Sponsor ${{ row.amount }} →
            </a>
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
              <li>Donate to ADOHR online or via Zelle.</li>
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

