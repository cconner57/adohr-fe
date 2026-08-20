<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import Button from '../../common/ui/Button.vue'

defineProps<{
  isOpen: boolean
}>()

export interface IMatcherCriteria {
  species: 'All' | 'Dog' | 'Cat'
  energy: string
  homeType: string
  goodWith: string[]
}

const emit = defineEmits<{
  close: []
  apply: [criteria: IMatcherCriteria]
}>()

const step = ref(1)
const totalSteps = 4

const speciesChoice = ref<'All' | 'Dog' | 'Cat'>('All')
const energyChoice = ref<'low' | 'medium' | 'high'>('medium')
const homeChoice = ref<'apartment' | 'yard' | 'spacious'>('apartment')
const goodWithKids = ref(false)
const goodWithDogs = ref(false)
const goodWithCats = ref(false)

const handleFinish = () => {
  const goodWith: string[] = []
  if (goodWithKids.value) goodWith.push('kids')
  if (goodWithDogs.value) goodWith.push('dogs')
  if (goodWithCats.value) goodWith.push('cats')

  emit('apply', {
    species: speciesChoice.value,
    energy: energyChoice.value,
    homeType: homeChoice.value,
    goodWith,
  })
  emit('close')
}

const handleNext = () => {
  if (step.value < totalSteps) {
    step.value++
  } else {
    handleFinish()
  }
}

const handleBack = () => {
  if (step.value > 1) {
    step.value--
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
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
      class="matcher-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="matcher-modal-title"
      @click.self="emit('close')"
    >
      <div class="matcher-modal">
        <header class="matcher-header">
          <div class="header-left">
            <span class="step-badge">Step {{ step }} of {{ totalSteps }}</span>
            <h2 id="matcher-modal-title">Find Your Perfect Pet Match</h2>
          </div>
          <button
            type="button"
            class="close-btn"
            aria-label="Close quiz"
            @click="emit('close')"
          >
            &times;
          </button>
        </header>

        <div class="progress-bar-track">
          <div class="progress-bar-fill" :style="{ width: `${(step / totalSteps) * 100}%` }"></div>
        </div>

        <div class="matcher-body">
          <!-- Step 1: Species -->
          <div v-if="step === 1" class="quiz-step">
            <h3>Who are you hoping to welcome home?</h3>
            <p class="step-desc">Select the companion type you're looking to adopt.</p>
            <div class="options-grid">
              <button
                type="button"
                class="option-card"
                :class="{ selected: speciesChoice === 'Dog' }"
                @click="speciesChoice = 'Dog'"
              >
                <span class="option-icon" aria-hidden="true">🐶</span>
                <strong>A Dog or Puppy</strong>
                <small>Playful, loyal, ready for walks</small>
              </button>

              <button
                type="button"
                class="option-card"
                :class="{ selected: speciesChoice === 'Cat' }"
                @click="speciesChoice = 'Cat'"
              >
                <span class="option-icon" aria-hidden="true">🐱</span>
                <strong>A Cat or Kitten</strong>
                <small>Independent, affectionate cuddlers</small>
              </button>

              <button
                type="button"
                class="option-card"
                :class="{ selected: speciesChoice === 'All' }"
                @click="speciesChoice = 'All'"
              >
                <span class="option-icon" aria-hidden="true">🐾</span>
                <strong>Open to Either!</strong>
                <small>Show me the best match for my life</small>
              </button>
            </div>
          </div>

          <!-- Step 2: Energy -->
          <div v-else-if="step === 2" class="quiz-step">
            <h3>What is your ideal activity level?</h3>
            <p class="step-desc">Pick the energy that fits your daily lifestyle best.</p>
            <div class="options-grid">
              <button
                type="button"
                class="option-card"
                :class="{ selected: energyChoice === 'low' }"
                @click="energyChoice = 'low'"
              >
                <span class="option-icon" aria-hidden="true">🛋️</span>
                <strong>Couch Potato / Chill</strong>
                <small>Loves naps, lap snuggles, gentle strolls</small>
              </button>

              <button
                type="button"
                class="option-card"
                :class="{ selected: energyChoice === 'medium' }"
                @click="energyChoice = 'medium'"
              >
                <span class="option-icon" aria-hidden="true">⚖️</span>
                <strong>Balanced &amp; Easygoing</strong>
                <small>Enjoys playtime, then happily settles down</small>
              </button>

              <button
                type="button"
                class="option-card"
                :class="{ selected: energyChoice === 'high' }"
                @click="energyChoice = 'high'"
              >
                <span class="option-icon" aria-hidden="true">⚡</span>
                <strong>Active / Adventure Buddy</strong>
                <small>Hiking partner, fetch champion, high energy</small>
              </button>
            </div>
          </div>

          <!-- Step 3: Home Environment -->
          <div v-else-if="step === 3" class="quiz-step">
            <h3>What type of home environment do you have?</h3>
            <p class="step-desc">Helps ensure the pet will thrive in your space.</p>
            <div class="options-grid">
              <button
                type="button"
                class="option-card"
                :class="{ selected: homeChoice === 'apartment' }"
                @click="homeChoice = 'apartment'"
              >
                <span class="option-icon" aria-hidden="true">🏢</span>
                <strong>Apartment / Condo</strong>
                <small>Best for calm, quiet, compact companions</small>
              </button>

              <button
                type="button"
                class="option-card"
                :class="{ selected: homeChoice === 'yard' }"
                @click="homeChoice = 'yard'"
              >
                <span class="option-icon" aria-hidden="true">🏡</span>
                <strong>House with Fenced Yard</strong>
                <small>Great for room to run and explore</small>
              </button>

              <button
                type="button"
                class="option-card"
                :class="{ selected: homeChoice === 'spacious' }"
                @click="homeChoice = 'spacious'"
              >
                <span class="option-icon" aria-hidden="true">🌳</span>
                <strong>Large / Rural Space</strong>
                <small>Plenty of space for big or high-energy pets</small>
              </button>
            </div>
          </div>

          <!-- Step 4: Household Members -->
          <div v-else-if="step === 4" class="quiz-step">
            <h3>Who else lives in your household?</h3>
            <p class="step-desc">Select all that apply to ensure safe compatibility.</p>
            <div class="checkbox-grid">
              <label class="checkbox-card" :class="{ selected: goodWithKids }">
                <input type="checkbox" v-model="goodWithKids" class="sr-only" />
                <div class="custom-cb" :class="{ checked: goodWithKids }" aria-hidden="true">
                  <svg v-if="goodWithKids" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div class="cb-content">
                  <span class="cb-title">Children under 12</span>
                  <span class="cb-desc">Needs a gentle, kid-friendly companion</span>
                </div>
              </label>

              <label class="checkbox-card" :class="{ selected: goodWithDogs }">
                <input type="checkbox" v-model="goodWithDogs" class="sr-only" />
                <div class="custom-cb" :class="{ checked: goodWithDogs }" aria-hidden="true">
                  <svg v-if="goodWithDogs" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div class="cb-content">
                  <span class="cb-title">Other Dog(s)</span>
                  <span class="cb-desc">Needs a dog-friendly socialite</span>
                </div>
              </label>

              <label class="checkbox-card" :class="{ selected: goodWithCats }">
                <input type="checkbox" v-model="goodWithCats" class="sr-only" />
                <div class="custom-cb" :class="{ checked: goodWithCats }" aria-hidden="true">
                  <svg v-if="goodWithCats" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div class="cb-content">
                  <span class="cb-title">Other Cat(s)</span>
                  <span class="cb-desc">Needs a cat-friendly companion</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <footer class="matcher-footer">
          <Button
            v-if="step > 1"
            title="Back"
            variant="secondary"
            color="blue"
            @click="handleBack"
          />
          <div class="spacer"></div>
          <Button
            :title="step === totalSteps ? 'Show My Top Matches 🐾' : 'Next Step →'"
            color="blue"
            @click="handleNext"
          />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped src="./PetMatcherModal.css"></style>
