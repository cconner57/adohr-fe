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
                <input type="checkbox" v-model="goodWithKids" />
                <span class="cb-title">Children under 12</span>
                <span class="cb-desc">Needs a gentle, kid-friendly companion</span>
              </label>

              <label class="checkbox-card" :class="{ selected: goodWithDogs }">
                <input type="checkbox" v-model="goodWithDogs" />
                <span class="cb-title">Other Dog(s)</span>
                <span class="cb-desc">Needs a dog-friendly socialite</span>
              </label>

              <label class="checkbox-card" :class="{ selected: goodWithCats }">
                <input type="checkbox" v-model="goodWithCats" />
                <span class="cb-title">Other Cat(s)</span>
                <span class="cb-desc">Needs a cat-friendly companion</span>
              </label>
            </div>
          </div>
        </div>

        <footer class="matcher-footer">
          <Button
            v-if="step > 1"
            title="Back"
            variant="outline"
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

<style scoped lang="css">
.matcher-overlay {
  position: fixed;
  inset: 0;
  background-color: oklch(from var(--text-primary) l c h / 65%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal, 1000);
  padding: 1rem;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.2s ease-out;
}

.matcher-modal {
  background: var(--text-inverse);
  border-radius: var(--radius-xl, 24px);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.25s ease-out;
}

.matcher-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem 1.5rem 1rem;

  .header-left {
    .step-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-secondary);
      display: block;
      margin-bottom: 4px;
    }

    h2 {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0;
      color: var(--text-primary);
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    font-size: 1.75rem;
    line-height: 1;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 4px 8px;
    border-radius: var(--radius-sm);

    &:hover {
      color: var(--text-primary);
    }
  }
}

.progress-bar-track {
  height: 4px;
  background-color: oklch(from var(--text-primary) l c h / 8%);
  width: 100%;

  .progress-bar-fill {
    height: 100%;
    background-color: var(--color-secondary);
    transition: width 0.3s ease;
  }
}

.matcher-body {
  padding: 1.5rem;
  overflow-y: auto;

  .quiz-step {
    h3 {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0 0 4px;
      color: var(--text-primary);
    }

    .step-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      margin: 0 0 1.25rem;
    }
  }
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .option-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    background-color: oklch(from var(--text-primary) l c h / 3%);
    border: 2px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
    border-radius: var(--radius-md, 12px);
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
    font-family: inherit;

    .option-icon {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }

    strong {
      font-size: 1rem;
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    small {
      font-size: 0.82rem;
      color: var(--text-secondary);
    }

    &:hover {
      border-color: var(--color-primary);
      background-color: var(--color-primary-weak);
    }

    &.selected {
      border-color: var(--color-primary);
      background-color: var(--color-primary-weak);
      box-shadow: 0 0 0 1px var(--color-primary);
    }
  }
}

.checkbox-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .checkbox-card {
    display: flex;
    flex-direction: column;
    padding: 1rem 1.25rem;
    background-color: oklch(from var(--text-primary) l c h / 3%);
    border: 2px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
    border-radius: var(--radius-md, 12px);
    cursor: pointer;
    position: relative;
    padding-left: 3rem;
    transition: all 0.15s ease;

    input[type='checkbox'] {
      position: absolute;
      left: 1.25rem;
      top: 1.25rem;
      width: 18px;
      height: 18px;
      accent-color: var(--color-primary);
      cursor: pointer;
    }

    .cb-title {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .cb-desc {
      font-size: 0.82rem;
      color: var(--text-secondary);
    }

    &:hover {
      border-color: var(--color-primary);
    }

    &.selected {
      border-color: var(--color-primary);
      background-color: var(--color-primary-weak);
    }
  }
}

.matcher-footer {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
  background-color: oklch(from var(--text-inverse) 98% c h);

  .spacer {
    flex: 1;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
