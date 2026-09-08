<script setup lang="ts">
import { ref, watch } from 'vue'

import { useUIStore } from '@/stores/ui'
import { vibrate } from '@/utils/haptics'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  submitted: [story: { petName: string; adopterName: string; species: string; story: string }]
}>()

const uiStore = useUIStore()

const petName = ref('')
const adopterName = ref('')
const adopterEmail = ref('')
const species = ref<'cat' | 'dog'>('cat')
const adoptionYear = ref(new Date().getFullYear().toString())
const story = ref('')
const photoUrl = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const formError = ref<string | null>(null)

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      isSubmitted.value = false
      formError.value = null
    } else {
      document.body.style.overflow = ''
    }
  },
)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

function handlePhotoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    formError.value = 'Please select a valid image file.'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    photoUrl.value = (e.target?.result as string) || ''
  }
  reader.readAsDataURL(file)
}

async function handleSubmit() {
  formError.value = null

  if (!petName.value.trim()) {
    formError.value = 'Please enter your pet’s name.'
    return
  }
  if (!adopterName.value.trim()) {
    formError.value = 'Please enter your name.'
    return
  }
  if (!story.value.trim() || story.value.trim().length < 20) {
    formError.value = 'Please write at least a few sentences about your pet’s journey (min 20 characters).'
    return
  }

  isSubmitting.value = true
  vibrate(50)

  // Simulate server intake
  await new Promise((resolve) => setTimeout(resolve, 800))
  isSubmitting.value = false
  isSubmitted.value = true
  uiStore.showToast('Happy Tail submitted! Thank you! 🐾', 'success')

  emit('submitted', {
    petName: petName.value,
    adopterName: adopterName.value,
    species: species.value,
    story: story.value,
  })
}

function handleClose() {
  emit('close')
  // Reset fields after transition
  setTimeout(() => {
    petName.value = ''
    adopterName.value = ''
    adopterEmail.value = ''
    story.value = ''
    photoUrl.value = ''
    isSubmitted.value = false
  }, 300)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-modal-title"
        @click.self="handleClose"
        @keydown="handleKeydown"
        tabindex="-1"
      >
        <div class="modal-card">
          <button
            type="button"
            class="modal-close"
            aria-label="Close modal"
            @click="handleClose"
          >
            ✕
          </button>

          <!-- Success View -->
          <div v-if="isSubmitted" class="modal-success">
            <div class="success-icon" aria-hidden="true">🐾</div>
            <h2 id="submit-modal-title">Thank You, {{ adopterName }}!</h2>
            <p>
              We loved reading about <strong>{{ petName }}</strong>’s new life with you.
              Your Happy Tail has been received by our rescue volunteers and will appear on
              our alumni wall following quick review.
            </p>
            <button type="button" class="btn btn-primary" @click="handleClose">
              Close
            </button>
          </div>

          <!-- Form View -->
          <div v-else class="modal-body">
            <header class="modal-header">
              <span class="modal-eyebrow">Alumni Story</span>
              <h2 id="submit-modal-title">Share Your Happy Tail</h2>
              <p class="modal-sub">
                Did you adopt from ADOHR? We’d love to hear how your pet is thriving in their forever home!
              </p>
            </header>

            <form class="submit-form" @submit.prevent="handleSubmit">
              <div v-if="formError" class="form-error" role="alert">
                {{ formError }}
              </div>

              <div class="form-row form-row--2">
                <div class="form-group">
                  <label for="ht-pet-name">Pet's Name *</label>
                  <input
                    id="ht-pet-name"
                    v-model="petName"
                    type="text"
                    required
                    placeholder="e.g. Luna"
                  />
                </div>

                <div class="form-group">
                  <label for="ht-species">Species *</label>
                  <select id="ht-species" v-model="species">
                    <option value="cat">Cat / Kitten</option>
                    <option value="dog">Dog / Puppy</option>
                  </select>
                </div>
              </div>

              <div class="form-row form-row--2">
                <div class="form-group">
                  <label for="ht-adopter-name">Your Name *</label>
                  <input
                    id="ht-adopter-name"
                    v-model="adopterName"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>

                <div class="form-group">
                  <label for="ht-adopter-email">Email (Optional)</label>
                  <input
                    id="ht-adopter-email"
                    v-model="adopterEmail"
                    type="email"
                    placeholder="sarah@example.com"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="ht-year">Adoption Year</label>
                <input
                  id="ht-year"
                  v-model="adoptionYear"
                  type="text"
                  placeholder="e.g. 2023"
                />
              </div>

              <div class="form-group">
                <label for="ht-story">Their Story & Life Today *</label>
                <textarea
                  id="ht-story"
                  v-model="story"
                  rows="4"
                  required
                  placeholder="Tell us about their favorite toys, funny quirks, or how they settled into your family..."
                />
              </div>

              <div class="form-group">
                <label for="ht-photo">Upload a Photo</label>
                <input
                  id="ht-photo"
                  type="file"
                  accept="image/*"
                  @change="handlePhotoUpload"
                />
                <div v-if="photoUrl" class="photo-preview">
                  <img :src="photoUrl" alt="Uploaded preview" />
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="handleClose">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">Submitting...</span>
                  <span v-else>Submit Happy Tail 🐾</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped src="./SubmitHappyTailModal.css"></style>
