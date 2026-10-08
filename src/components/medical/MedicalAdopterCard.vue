<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { IAdopterPaymentInfo } from '@/models/common'

const props = defineProps<{
  adopter: IAdopterPaymentInfo
  petName?: string
  petPhotoUrl?: string
}>()

const emit = defineEmits<{
  'print-receipt': []
}>()

const r2BaseUrl = computed(() =>
  ((import.meta.env.VITE_R2_PUBLIC_URL as string) || 'https://pub-768b3a497dc648f2895152092bf57934.r2.dev').replace(
    /\/+$/,
    '',
  ),
)

const candidateUrls = computed(() => {
  const urls: string[] = []
  const fam = props.adopter.familyPhotoUrl?.trim()
  if (fam) {
    urls.push(fam)
    if (fam.includes('api.adoption-os.com') && r2BaseUrl.value) {
      urls.push(fam.replace(/^https?:\/\/api\.adoption-os\.com/, r2BaseUrl.value))
      urls.push(fam.replace(/^https?:\/\/api\.adoption-os\.com\/pets\//, `${r2BaseUrl.value}/`))
    }
  }
  return urls
})

const currentUrlIndex = ref(0)

const currentPhotoUrl = computed(() => {
  if (currentUrlIndex.value < candidateUrls.value.length) {
    return candidateUrls.value[currentUrlIndex.value]
  }
  return ''
})

const isPhotoError = computed(() => {
  return candidateUrls.value.length === 0 || currentUrlIndex.value >= candidateUrls.value.length
})

const shouldShowPhotoSection = computed(() => {
  return Boolean(props.adopter.familyPhotoUrl?.trim()) && !isPhotoError.value && Boolean(currentPhotoUrl.value)
})

const handleImageError = () => {
  if (currentUrlIndex.value < candidateUrls.value.length - 1) {
    currentUrlIndex.value += 1
  } else {
    currentUrlIndex.value = candidateUrls.value.length
  }
}

watch(
  () => props.adopter.familyPhotoUrl,
  () => {
    currentUrlIndex.value = 0
  },
)
</script>

<template>
  <article class="medical-section-card adopter-card">
    <div class="card-header">
      <div class="header-left">
        <div class="header-icon-wrap" aria-hidden="true">
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
        <div>
          <h2>Adopter &amp; Payment Record</h2>
          <p class="section-desc">
            Verified adoption file, contact records, and payment confirmation for {{ petName || 'your pet' }}.
          </p>
        </div>
      </div>
    </div>

    <!-- Adoption Family Photo -->
    <div
      v-if="shouldShowPhotoSection"
      class="family-photo-card"
    >
      <div class="family-photo-media">
        <img
          :key="currentPhotoUrl"
          :src="currentPhotoUrl"
          :alt="`${adopter.adopterName || 'Adopter'} forever family photo with ${petName || 'pet'}`"
          class="family-photo-img"
          loading="lazy"
          @error="handleImageError"
        />
      </div>

      <div class="family-photo-content">
        <h3 class="family-title">Welcome Home, {{ petName || 'Pet' }}!</h3>
        <p class="family-desc">
          Official adoption day portrait with {{ adopter.adopterName }}. Celebrating a new chapter of love, safety, and lifelong companionship.
        </p>
        <div v-if="adopter.paymentDate" class="family-meta">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Adoption Finalized &bull; {{ adopter.paymentDate }}</span>
        </div>

        <div v-if="adopter.contractUrl" class="family-contract">
          <a
            :href="adopter.contractUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="contract-link"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>View Signed Adoption Contract</span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Adopter & Payment Two-Column Overview -->
    <div class="adopter-grid">
      <!-- Section 1: Adopter Profile -->
      <div class="adopter-panel">
        <h3 class="panel-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Adopter Information</span>
        </h3>

        <div class="data-group">
          <div class="data-item">
            <span class="label">Adopter Name</span>
            <strong class="value highlight-name">{{ adopter.adopterName }}</strong>
          </div>

          <div class="data-item">
            <span class="label">Contact Email Address</span>
            <span class="value">{{ adopter.email }}</span>
          </div>

          <div class="data-item">
            <span class="label">Adoption Finalized</span>
            <span class="value">{{ adopter.paymentDate }}</span>
          </div>

          <div v-if="adopter.contractUrl" class="data-item">
            <span class="label">Adoption Contract</span>
            <a
              :href="adopter.contractUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="panel-contract-link"
            >
              <span>View Signed Contract</span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Section 2: Payment & Financial Status -->
      <div class="adopter-panel">
        <h3 class="panel-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <span>Payment Details</span>
        </h3>

        <div class="data-group">
          <div class="data-item">
            <span class="label">Adoption Fee</span>
            <div class="fee-badge-wrap">
              <strong class="value fee-amount">{{ adopter.adoptionFee }}</strong>
              <span class="status-badge paid">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{{ adopter.paymentStatus }}</span>
              </span>
            </div>
          </div>

          <div class="data-item">
            <span class="label">Payment Method</span>
            <span class="value">{{ adopter.paymentMethod }}</span>
          </div>

          <div class="data-item">
            <span class="label">Receipt Number</span>
            <strong class="value code-val">{{ adopter.receiptNumber }}</strong>
          </div>

          <div v-if="adopter.zelleConfirmationId" class="data-item">
            <span class="label">Zelle Confirmation ID</span>
            <strong class="value code-val">{{ adopter.zelleConfirmationId }}</strong>
          </div>
          <div v-else-if="adopter.transactionId" class="data-item">
            <span class="label">Transaction ID</span>
            <strong class="value code-val">{{ adopter.transactionId }}</strong>
          </div>

          <div class="data-item">
            <span class="label">Payment Date</span>
            <span class="value">{{ adopter.paymentDate }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Itemized Fee Schedule Breakdown -->
    <div v-if="adopter.itemizedFees && adopter.itemizedFees.length > 0" class="fee-breakdown-card">
      <h4 class="breakdown-title">Itemized Adoption &amp; Care Inclusions</h4>
      <ul class="breakdown-list">
        <li
          v-for="(item, idx) in adopter.itemizedFees"
          :key="idx"
          class="breakdown-row"
          :class="{ 'included-row': item.included }"
        >
          <span class="item-name">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{{ item.label }}</span>
          </span>
          <span class="item-cost" :class="{ free: item.included }">{{ item.amount }}</span>
        </li>
      </ul>

      <div class="breakdown-total">
        <span>Total Paid at Adoption</span>
        <strong class="total-figure">{{ adopter.adoptionFee }}</strong>
      </div>
    </div>

    <!-- Action & Verification Footer -->
    <div class="adopter-footer no-print">
      <div class="footer-note">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>Official ADOHR 501(c)(3) placement record. You can print or download the payment receipt for tax, registration, or veterinary purposes.</span>
      </div>

      <button
        class="print-receipt-action-btn no-print"
        type="button"
        title="Print Official Payment Receipt"
        aria-label="Print Payment Receipt"
        @click="emit('print-receipt')"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        <span>Print Payment Receipt</span>
      </button>
    </div>
  </article>
</template>

<style scoped src="./MedicalAdopterCard.css"></style>

