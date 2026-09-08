<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

import Capsules from '@/components/common/ui/Capsules.vue'
import Spinner from '@/components/common/ui/Spinner.vue'
import MedicalDiagnosticsCard from '@/components/medical/MedicalDiagnosticsCard.vue'
import MedicalDietCard from '@/components/medical/MedicalDietCard.vue'
import MedicalDocumentsList from '@/components/medical/MedicalDocumentsList.vue'
import MedicalIdentificationCard from '@/components/medical/MedicalIdentificationCard.vue'
import MedicalMedicationsCard from '@/components/medical/MedicalMedicationsCard.vue'
import MedicalVerificationGatekeeper from '@/components/medical/MedicalVerificationGatekeeper.vue'
import { useMedicalRecords } from '@/composables/useMedicalRecords'
import type {
  IMedicalDocument,
  IMedicalVerificationForm,
  IPetMedicalPortalData,
} from '@/models/common'
import { calculateAge } from '@/utils/date'
import {
  buildCareTimeline,
  buildDiagnosticTests,
  buildDietInfo,
  buildIdentificationInfo,
  buildMedicationsList,
  buildPhysicalTraitCapsules,
  buildProceduresList,
  buildVaccineRecords,
  getSpayNeuterInfo,
  getSpayNeuterLabels,
  toDateLabel,
} from '@/utils/medicalParser'

const route = useRoute()
const router = useRouter()
const {
  isVerifying,
  verificationError,
  isVerifiedForPet,
  getVerifiedToken,
  verifyAccess,
  fetchMedicalRecords,
  clearVerification,
} = useMedicalRecords()

const isLoading = ref(true)
const isVerified = ref(false)
const portalData = ref<IPetMedicalPortalData | null>(null)

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

const petStatus = computed(() => portalData.value?.status || 'adopted')
const isImgError = ref(false)

const petPhotoUrl = computed(() => {
  const data = portalData.value as unknown as Record<string, unknown>
  if (!data) return ''
  if (typeof data.photoUrl === 'string' && data.photoUrl.trim()) return data.photoUrl.trim()
  if (typeof data.photo_url === 'string' && data.photo_url.trim()) return data.photo_url.trim()
  if (typeof data.imageUrl === 'string' && data.imageUrl.trim()) return data.imageUrl.trim()
  if (typeof data.image_url === 'string' && data.image_url.trim()) return data.image_url.trim()
  if (typeof data.photo === 'string' && data.photo.trim()) return data.photo.trim()
  if (Array.isArray(data.photos) && data.photos.length > 0) {
    const primary = (data.photos as Array<{ isPrimary?: boolean; url?: string }>).find(
      (p) => p.isPrimary && p.url,
    )
    if (primary?.url) return primary.url
    const first = (data.photos as Array<string | { url?: string }>)[0]
    if (typeof first === 'string' && first.trim()) return first.trim()
    if (first && typeof first === 'object' && 'url' in first && typeof first.url === 'string') {
      return first.url
    }
  }
  return ''
})

watch(petPhotoUrl, () => {
  isImgError.value = false
})

const documents = computed<IMedicalDocument[]>(() => {
  const docs = portalData.value?.medical?.documents ?? portalData.value?.documents
  return Array.isArray(docs) ? docs : []
})

const vaccineRecords = computed(() => buildVaccineRecords(portalData.value))
const spayNeuterInfo = computed(() => getSpayNeuterInfo(portalData.value))
const spayNeuterLabels = computed(() =>
  getSpayNeuterLabels(petSex.value, spayNeuterInfo.value.isSpayedNeutered),
)
const careTimeline = computed(() => buildCareTimeline(portalData.value, vaccineRecords.value))
const physicalTraits = computed(() => buildPhysicalTraitCapsules(portalData.value))
const identInfo = computed(() => buildIdentificationInfo(portalData.value))
const diagnosticTests = computed(() => buildDiagnosticTests(portalData.value))
const dietInfo = computed(() => buildDietInfo(portalData.value))
const medicationsList = computed(() => buildMedicationsList(portalData.value))
const proceduresList = computed(() => buildProceduresList(portalData.value))
const healthSummary = computed(() => portalData.value?.medical?.healthSummary || null)

const handlePrint = () => {
  window.print()
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
  clearVerification(slug.value)
  portalData.value = null
  isVerified.value = false
})

onUnmounted(() => {
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
              <span class="status-badge">Adopted</span>
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
              <span class="verified-pill">✓ Verified Adopter Access</span>
            </div>
            <div class="top-actions">
              <button
                class="print-btn no-print"
                type="button"
                title="Print Official Medical Summary"
                aria-label="Print Medical Summary"
                @click="handlePrint"
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
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Print Record</span>
              </button>
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
                referrerpolicy="no-referrer"
                @error="isImgError = true"
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
              <p class="hero-sub">Official veterinary health history and preventative care timeline managed by ADOHR.</p>
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
                  v-if="event.type === 'surgery'"
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
          </div>
        </article>

        <!-- Diagnostic Testing Panel -->
        <MedicalDiagnosticsCard :diagnostics="diagnosticTests" :petName="petName" />

        <!-- Spay/Neuter Status -->
        <article class="block">
          <h2>{{ spayNeuterLabels.sectionTitle }}</h2>
          <div class="status-row">
            <span class="status-pill" :class="{ yes: spayNeuterInfo.isSpayedNeutered }">
              {{ spayNeuterLabels.statusPill }}
            </span>
            <span v-if="spayNeuterInfo.spayNeuterDate" class="muted">
              Procedure Date: {{ toDateLabel(spayNeuterInfo.spayNeuterDate) }}
            </span>
          </div>
        </article>

        <!-- Vaccinations Detail -->
        <article class="block">
          <h2>Vaccination Records</h2>
          <dl v-if="vaccineRecords.length > 0" class="medical-list">
            <template v-for="(record, index) in vaccineRecords" :key="index">
              <dt>{{ record.name }}</dt>
              <dd>
                <div v-if="record.administered && record.administered !== 'Not provided'">
                  Administered: {{ record.administered }}
                </div>
                <div v-if="record.expires">Expires: {{ record.expires }}</div>
                <div v-if="record.veterinarian">Veterinarian: {{ record.veterinarian }}</div>
                <div v-if="record.status" class="record-status">{{ record.status }}</div>
                <div
                  v-if="
                    (!record.administered || record.administered === 'Not provided') &&
                    !record.expires &&
                    !record.veterinarian &&
                    !record.status
                  "
                >
                  Not provided
                </div>
              </dd>
            </template>
          </dl>
          <p v-else class="muted">No specific vaccination line items listed.</p>
        </article>

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
  </section>
</template>

<style scoped src="./PetMedicalProfile.css"></style>
