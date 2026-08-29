<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import Button from './Button.vue'

const props = defineProps<{
  isOpen: boolean
  petName?: string
  species?: string
  isWeekendFastTrack?: boolean
}>()

const emit = defineEmits<{
  close: []
  proceed: [{ isFastTrack: boolean }]
}>()

const isFastTrack = ref(props.isWeekendFastTrack ?? false)
const ackAge = ref(false)
const ackHousing = ref(false)
const ackCare = ref(false)
const ackHousehold = ref(false)
const ackDonation = ref(false)

const isCat = computed(() => props.species?.toLowerCase() === 'cat')
const isDog = computed(() => props.species?.toLowerCase() === 'dog')

const careDescription = computed(() => {
  if (isDog.value) {
    return 'Prepared to provide a safe home (with a securely fenced yard for outdoor time), routine veterinary care, and high-quality nutrition.'
  }
  if (isCat.value) {
    return 'Prepared to provide lifetime indoor shelter, routine veterinary care, and high-quality nutrition.'
  }
  return 'Prepared to provide a safe home (indoor shelter / securely fenced yard), routine veterinary care, and high-quality nutrition.'
})

const fastTrackTag = computed(() => {
  if (isCat.value) {
    return '⚡ Fast-Track Adoption Pre-Approval'
  }
  return '⚡ Fast-Track Weekend Pre-Approval'
})

const fastTrackDescription = computed(() => {
  if (isCat.value) {
    return 'I plan to visit Pasadena PetSmart this weekend (12–4 PM) or stop by our in-store Cat Adoption Center during the week when volunteers are on-site to meet pets in person. Priority review my application!'
  }
  return 'I plan to visit Pasadena PetSmart this Saturday or Sunday (12–4 PM) to meet pets in person. Priority review my application before the event!'
})

const allAcknowledged = computed(() => {
  return ackAge.value && ackHousing.value && ackCare.value && ackHousehold.value && ackDonation.value
})

const handleProceed = () => {
  if (!allAcknowledged.value) return
  emit('proceed', { isFastTrack: isFastTrack.value })
  emit('close')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="prequal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prequal-title"
      @click.self="emit('close')"
    >
      <div class="prequal-modal">
        <div class="drawer-handle-bar" aria-hidden="true"></div>
        <header class="modal-header">
          <div class="header-icon">📋</div>
          <div>
            <span class="eyebrow">Quick Readiness Check</span>
            <h2 id="prequal-title">Adoption Pre-Qualification</h2>
          </div>
          <button
            type="button"
            class="close-btn"
            aria-label="Close modal"
            @click="emit('close')"
          >
            &times;
          </button>
        </header>

        <div class="modal-body">
          <p class="intro-text">
            To ensure the best match for {{ petName ? petName : 'our rescues' }}, please confirm you meet our core adoption criteria. <strong>The 5 criteria below are required</strong> to proceed with your application, while the Fast-Track event review is optional:
          </p>

          <div class="checklist">
            <label class="check-item" :class="{ checked: ackAge }">
              <input type="checkbox" v-model="ackAge" class="sr-only" />
              <div class="custom-cb" :class="{ checked: ackAge }" aria-hidden="true">
                <svg v-if="ackAge" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="item-text">
                <strong>21+ Years of Age</strong>
                <span>Primary applicant is 21 or older (or has a parent/guardian co-signer).</span>
              </div>
            </label>

            <label class="check-item" :class="{ checked: ackHousing }">
              <input type="checkbox" v-model="ackHousing" class="sr-only" />
              <div class="custom-cb" :class="{ checked: ackHousing }" aria-hidden="true">
                <svg v-if="ackHousing" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="item-text">
                <strong>Housing & Landlord Approval</strong>
                <span>Own home, or have landlord/lease permission to keep pets at your residence.</span>
              </div>
            </label>

            <label class="check-item" :class="{ checked: ackCare }">
              <input type="checkbox" v-model="ackCare" class="sr-only" />
              <div class="custom-cb" :class="{ checked: ackCare }" aria-hidden="true">
                <svg v-if="ackCare" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="item-text">
                <strong>Veterinary & Lifetime Care Commitment</strong>
                <span>{{ careDescription }}</span>
              </div>
            </label>

            <label class="check-item" :class="{ checked: ackHousehold }">
              <input type="checkbox" v-model="ackHousehold" class="sr-only" />
              <div class="custom-cb" :class="{ checked: ackHousehold }" aria-hidden="true">
                <svg v-if="ackHousehold" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="item-text">
                <strong>All Household Members Onboard</strong>
                <span>Everyone living in the home is enthusiastic and agrees to welcome this pet.</span>
              </div>
            </label>

            <label class="check-item" :class="{ checked: ackDonation }">
              <input type="checkbox" v-model="ackDonation" class="sr-only" />
              <div class="custom-cb" :class="{ checked: ackDonation }" aria-hidden="true">
                <svg v-if="ackDonation" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="item-text">
                <strong>Tax-Deductible Adoption Donation &amp; Placement Policy</strong>
                <span>The adoption fee is a tax-deductible donation and is non-refundable. If an adopted or foster-to-adopt pet ends up not being a good fit, we will work with you to place a different available pet with you that would be a better match if one is available.</span>
              </div>
            </label>
          </div>

          <!-- Fast-Track Toggle (Optional) -->
          <div class="fast-track-box">
            <label class="fast-track-label">
              <input type="checkbox" v-model="isFastTrack" class="sr-only" />
              <div class="custom-cb ft-cb" :class="{ checked: isFastTrack }" aria-hidden="true">
                <svg v-if="isFastTrack" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div class="fast-track-text">
                <div class="ft-header">
                  <span class="ft-tag">{{ fastTrackTag }}</span>
                  <span class="ft-badge">Optional</span>
                </div>
                <p>{{ fastTrackDescription }}</p>
              </div>
            </label>
          </div>
        </div>

        <footer class="modal-footer">
          <Button
            title="I'm Ready to Apply →"
            color="blue"
            :disabled="!allAcknowledged"
            :fullWidth="true"
            @click="handleProceed"
          />
          <Button
            title="Cancel"
            variant="secondary"
            color="blue"
            :fullWidth="true"
            @click="emit('close')"
          />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped src="./PreQualModal.css"></style>

