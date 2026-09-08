<script setup lang="ts">
import { useRouter } from 'vue-router'

import MedicalVerificationGatekeeper from '@/components/medical/MedicalVerificationGatekeeper.vue'
import { useMedicalRecords } from '@/composables/useMedicalRecords'
import type { IMedicalVerificationForm } from '@/models/common'

const router = useRouter()
const { isVerifying, verificationError, verifyAccess } = useMedicalRecords()

const handleVerify = async (form: IMedicalVerificationForm) => {
  const result = await verifyAccess(null, form)
  if (result.success && result.petSlug) {
    router.push(`/pets/${result.petSlug}/medical`)
  }
}

const scrollToFaq = () => {
  const faqSection = document.getElementById('faq-section')
  if (faqSection) {
    faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="lookup-page">
    <div class="lookup-shell">
      <header class="lookup-hero">
        <span class="eyebrow">Adopted Pet Portal</span>
        <h1>Pet Medical Records &amp; Documents</h1>
        <p class="hero-sub">
          Enter your adoption application details below to verify access and view your pet's
          official veterinary history, rabies certificates, and downloadable PDF records.
        </p>
      </header>

      <div class="gatekeeper-wrap">
        <MedicalVerificationGatekeeper
          :isVerifying="isVerifying"
          :errorMessage="verificationError"
          @verify="handleVerify"
          @scroll-faq="scrollToFaq"
        />
      </div>

      <!-- FAQ & Info Section -->
      <section id="faq-section" class="info-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div class="faq-card">
            <div class="faq-header">
              <div class="faq-icon-wrap" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>How is access secured without an account?</h3>
            </div>
            <p>
              We protect medical privacy by requiring 5 verification points matching your adoption
              application (Pet Name, Adopter Last Name, Email, Phone Number, and Adoption Month &amp;
              Year) before revealing sensitive records.
            </p>
          </div>

          <div class="faq-card">
            <div class="faq-header">
              <div class="faq-icon-wrap" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3>What documents can I download?</h3>
            </div>
            <p>
              You can download rabies certificates, spay/neuter proof, complete immunization
              records, and intake veterinary summaries in standard PDF format.
            </p>
          </div>

          <div class="faq-card">
            <div class="faq-header">
              <div class="faq-icon-wrap" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3>What if my adoption was several years ago?</h3>
            </div>
            <p>
              Records for all pets adopted through ADOHR are archived. If you encounter any
              difficulties finding your pet, our adoption team can assist you at
              <a href="mailto:help@adohr.org">help@adohr.org</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped src="./MedicalRecordsLookup.css"></style>
