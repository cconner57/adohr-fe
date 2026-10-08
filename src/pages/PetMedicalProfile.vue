<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

import Capsules from '@/components/common/ui/Capsules.vue'
import Spinner from '@/components/common/ui/Spinner.vue'
import MedicalAdopterCard from '@/components/medical/MedicalAdopterCard.vue'
import MedicalDiagnosticsCard from '@/components/medical/MedicalDiagnosticsCard.vue'
import MedicalDietCard from '@/components/medical/MedicalDietCard.vue'
import MedicalDocumentsList from '@/components/medical/MedicalDocumentsList.vue'
import MedicalIdentificationCard from '@/components/medical/MedicalIdentificationCard.vue'
import MedicalMedicationsCard from '@/components/medical/MedicalMedicationsCard.vue'
import MedicalPaymentReceiptModal from '@/components/medical/MedicalPaymentReceiptModal.vue'
import MedicalVerificationGatekeeper from '@/components/medical/MedicalVerificationGatekeeper.vue'
import { useMedicalRecords } from '@/composables/useMedicalRecords'
import type {
  IMedicalDocument,
  IMedicalVerificationForm,
  IPetMedicalPortalData,
} from '@/models/common'
import { calculateAge } from '@/utils/date'
import {
  buildAdopterPaymentInfo,
  type IVerifiedAdopterSession,
} from '@/utils/medicalAdopter'
import {
  buildCareTimeline,
  buildDiagnosticTests,
  buildDietInfo,
  buildIdentificationInfo,
  buildMedicationsList,
  buildPhysicalTraitCapsules,
  buildProceduresList,
  buildVaccineRecords,
  resolvePetPhotoCandidates,
} from '@/utils/medicalParser'

const route = useRoute()
const router = useRouter()
const {
  isVerifying,
  verificationError,
  isVerifiedForPet,
  getVerifiedToken,
  getVerifiedAdopterSession,
  verifyAccess,
  fetchMedicalRecords,
  clearVerification,
} = useMedicalRecords()

const isLoading = ref(true)
const isVerified = ref(false)
const portalData = ref<IPetMedicalPortalData | null>(null)
const isReceiptModalOpen = ref(false)
const verifiedSession = ref<IVerifiedAdopterSession | null>(null)

const slug = computed(() => String(route.params.slug ?? '').trim())

const petName = computed(() => {
  if (portalData.value?.name) return portalData.value.name
  const raw = slug.value
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Pet'
})

const petSpecies = computed(() => {
  const sp = portalData.value?.species
  return typeof sp === 'string' && sp.trim() ? sp.trim() : 'Cat'
})

const petSex = computed(() => {
  const sx = portalData.value?.sex
  return typeof sx === 'string' && sx.trim() ? sx.trim() : ''
})

const petDob = computed(() => {
  const d = portalData.value?.dob || portalData.value?.dateOfBirth
  return typeof d === 'string' && d.trim() ? d.trim() : ''
})

const petAge = computed(() => {
  if (!petDob.value) return ''
  const calculated = calculateAge(petDob.value)
  return calculated === '-' ? '' : calculated
})

const isImgError = ref(false)
const currentPhotoIndex = ref(0)
const candidatePetPhotoUrls = computed(() => resolvePetPhotoCandidates(portalData.value))

const petPhotoUrl = computed(() => {
  if (currentPhotoIndex.value < candidatePetPhotoUrls.value.length) {
    return candidatePetPhotoUrls.value[currentPhotoIndex.value]
  }
  return ''
})

const handlePetImgError = () => {
  if (currentPhotoIndex.value < candidatePetPhotoUrls.value.length - 1) {
    currentPhotoIndex.value += 1
  } else {
    isImgError.value = true
  }
}

watch(candidatePetPhotoUrls, () => {
  currentPhotoIndex.value = 0
  isImgError.value = false
})

const documents = computed<IMedicalDocument[]>(() => {
  const docs = portalData.value?.medical?.documents ?? portalData.value?.documents
  return Array.isArray(docs) ? docs : []
})

const vaccineRecords = computed(() => buildVaccineRecords(portalData.value))
const careTimeline = computed(() => buildCareTimeline(portalData.value, vaccineRecords.value))
const physicalTraits = computed(() => buildPhysicalTraitCapsules(portalData.value))
const identInfo = computed(() => buildIdentificationInfo(portalData.value))
const diagnosticTests = computed(() => buildDiagnosticTests(portalData.value))
const dietInfo = computed(() => buildDietInfo(portalData.value))
const medicationsList = computed(() => buildMedicationsList(portalData.value))
const proceduresList = computed(() => buildProceduresList(portalData.value))
const healthSummary = computed(() => portalData.value?.medical?.healthSummary || null)
const adopterInfo = computed(() =>
  buildAdopterPaymentInfo(portalData.value, verifiedSession.value),
)

const isFosterToAdopt = computed(() => {
  if (typeof portalData.value?.fosterToAdopt === 'boolean') return portalData.value.fosterToAdopt
  if (typeof portalData.value?.adoption?.fosterToAdopt === 'boolean') return portalData.value.adoption.fosterToAdopt
  if (typeof adopterInfo.value?.fosterToAdopt === 'boolean') return adopterInfo.value.fosterToAdopt
  const placementType = (portalData.value?.placementType || portalData.value?.adoptionType || '').toLowerCase().trim()
  if (placementType.includes('foster') || placementType === 'fta') return true
  const contractUrl = (portalData.value?.contractUrl || '').toLowerCase().trim()
  if (contractUrl.includes('foster') || contractUrl.includes('fta')) return true
  return false
})

const petStatus = computed(() => {
  return isFosterToAdopt.value ? 'Foster-to-Adopt' : 'Adopted'
})

watch(isReceiptModalOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('printing-receipt')
  } else {
    document.body.classList.remove('printing-receipt')
  }
})

const handlePrintReceipt = () => {
  isReceiptModalOpen.value = true
  setTimeout(() => {
    window.print()
  }, 150)
}

const loadPet = async () => {
  const currentSlug = slug.value
  const hasLocalVerified = isVerifiedForPet(currentSlug) && Boolean(getVerifiedToken(currentSlug))

  if (!hasLocalVerified) {
    isVerified.value = false
    portalData.value = null
    isLoading.value = false
    router.replace({ name: 'medical-records' })
    return
  }

  isLoading.value = true
  try {
    const data = await fetchMedicalRecords(currentSlug)
    if (data) {
      portalData.value = data
      verifiedSession.value = getVerifiedAdopterSession(currentSlug)
      isVerified.value = true
    } else {
      portalData.value = null
      clearVerification(currentSlug)
      isVerified.value = false
      router.replace({ name: 'medical-records' })
    }
  } finally {
    isLoading.value = false
  }
}

const handleVerify = async (form: IMedicalVerificationForm) => {
  const result = await verifyAccess(slug.value, form)
  if (result.success) {
    await loadPet()
  }
}

onBeforeRouteLeave(() => {
  document.body.classList.remove('printing-receipt')
  clearVerification(slug.value)
  portalData.value = null
  isVerified.value = false
})

onUnmounted(() => {
  document.body.classList.remove('printing-receipt')
  clearVerification(slug.value)
  portalData.value = null
  isVerified.value = false
})

watch(slug, () => {
  loadPet()
})

onMounted(async () => {
  await loadPet()
})
</script>

<template>
  <section class="medical-shell">
    <Transition name="portal-expand" mode="out-in">
      <div v-if="isLoading" key="loading" class="medical-card loading-card" role="status" aria-live="polite">
        <div class="spinner-wrap">
          <Spinner />
        </div>
        <p class="loading-text">Loading medical profile...</p>
      </div>

      <!-- Unverified State: Blurred Skeleton + Floating Gatekeeper Modal -->
      <div v-else-if="!isVerified" key="gatekeeper" class="gatekeeper-stage">
        <!-- Floating Interactive Gatekeeper Card -->
        <div class="gatekeeper-modal-overlay">
          <MedicalVerificationGatekeeper
            :petName="petName"
            :isVerifying="isVerifying"
            :errorMessage="verificationError"
            @verify="handleVerify"
          />
        </div>

        <!-- Blurred Background Skeleton Placeholder -->
        <div class="medical-card blurred-skeleton" aria-hidden="true">
          <header class="hero">
            <div class="hero-top">
              <span class="eyebrow">Veterinary &amp; Care Record</span>
              <span class="status-badge">{{ petStatus }}</span>
            </div>
            <div class="hero-content">
              <div class="photo-placeholder"></div>
              <div class="hero-text-placeholder">
                <div class="skeleton-line name"></div>
                <div class="skeleton-line capsules"></div>
                <div class="skeleton-line sub"></div>
              </div>
            </div>
          </header>
          <article class="block">
            <h2>Official Medical Documents &amp; PDFs</h2>
            <div class="skeleton-doc-grid">
              <div class="skeleton-doc-card"></div>
              <div class="skeleton-doc-card"></div>
            </div>
          </article>
        </div>
      </div>

      <!-- Verified State: Full Unlocked Medical Dashboard -->
      <div v-else-if="portalData" key="dashboard" class="medical-card unlocked-dashboard">
        <header class="hero">
          <div class="hero-top">
            <div class="eyebrow-group">
              <span class="eyebrow">Veterinary &amp; Health Record</span>
            </div>
            <div class="top-actions">
              <span class="status-badge" :class="petStatus">{{ petStatus }}</span>
            </div>
          </div>

          <div class="hero-main">
            <div class="pet-avatar-wrap">
              <img
                v-if="petPhotoUrl && !isImgError"
                :src="petPhotoUrl"
                :alt="petName"
                class="pet-avatar"
                loading="lazy"
                @error="handlePetImgError"
              />
              <div v-else class="pet-avatar-fallback" aria-hidden="true">
                <span class="pet-avatar-initial">{{ petName ? petName.charAt(0).toUpperCase() : '🐾' }}</span>
              </div>
            </div>

            <div class="hero-details">
              <h1>{{ petName }}'s Medical Record</h1>
              <div class="hero-traits">
                <Capsules v-if="petSpecies" :label="petSpecies" />
                <Capsules v-if="petSex" :label="petSex" />
                <Capsules v-if="petAge" :label="petAge" />
                <Capsules v-for="(trait, idx) in physicalTraits" :key="idx" :label="trait" />
              </div>
            </div>
          </div>
        </header>

        <!-- PDF Documents Section -->
        <MedicalDocumentsList :documents="documents" :petName="petName" />

        <!-- Pet Identification & Official Tags -->
        <MedicalIdentificationCard :ident="identInfo" />

        <!-- Chronological Care Timeline -->
        <article v-if="careTimeline.length > 0" class="block">
          <h2>Chronological Care Timeline</h2>
          <div class="timeline">
            <div v-for="(event, idx) in careTimeline" :key="idx" class="timeline-item">
              <div class="timeline-icon" aria-hidden="true">
                <svg
                  v-if="event.type === 'intake'"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <svg
                  v-else-if="event.type === 'surgery'"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .2.3V9a4 4 0 0 1-8 0V2.3z" />
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                  <circle cx="20" cy="10" r="2" />
                </svg>
                <svg
                  v-else-if="event.type === 'microchip'"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <svg
                  v-else-if="event.type === 'diagnostic'"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M8 13h2" />
                  <path d="M8 17h8" />
                </svg>
                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m18 2 4 4" />
                  <path d="m17 7 3-3" />
                  <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
                  <path d="m9 11 4 4" />
                  <path d="m5 19-3 3" />
                  <path d="m14 4 6 6" />
                </svg>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <strong>{{ event.title }}</strong>
                  <span class="timeline-date">{{ event.date }}</span>
                </div>
                <p class="timeline-note">{{ event.note }}</p>
              </div>
            </div>

            <!-- Timeline Starting Point (at the bottom where older records began) -->
            <div class="timeline-start-point" aria-hidden="true">
              <div class="timeline-start-marker">
                <span class="timeline-start-dot"></span>
              </div>
              <div class="timeline-start-content">
                <span class="timeline-start-badge">Rescue Intake</span>
                <span class="timeline-start-label">Care Journey Began</span>
              </div>
            </div>
          </div>
        </article>

        <!-- Diagnostic Testing Panel (only displayed when lab screening tests are recorded with dates) -->
        <MedicalDiagnosticsCard
          v-if="diagnosticTests && diagnosticTests.length > 0"
          :diagnostics="diagnosticTests"
          :petName="petName"
        />

        <!-- Adopter & Payment Information (only displayed when API returns adoption data) -->
        <MedicalAdopterCard
          v-if="adopterInfo"
          :adopter="adopterInfo"
          :petName="petName"
          :petPhotoUrl="petPhotoUrl"
          @print-receipt="handlePrintReceipt"
        />

        <!-- Diet, Nutrition & Daily Guidelines -->
        <MedicalDietCard :diet="dietInfo" :petName="petName" />

        <!-- Surgeries, Medications & Clinical History -->
        <MedicalMedicationsCard
          :medications="medicationsList"
          :procedures="proceduresList"
          :healthSummary="healthSummary"
        />
      </div>
    </Transition>

    <!-- Printable Official Payment Receipt Modal -->
    <MedicalPaymentReceiptModal
      v-if="adopterInfo"
      :isOpen="isReceiptModalOpen"
      :adopter="adopterInfo"
      :petName="petName"
      :species="petSpecies"
      :microchipId="identInfo.microchipId"
      @close="isReceiptModalOpen = false"
    />
  </section>
</template>

<style scoped src="./PetMedicalProfile.css"></style>
