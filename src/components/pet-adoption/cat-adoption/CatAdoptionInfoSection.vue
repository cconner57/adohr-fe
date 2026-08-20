<script setup lang="ts">
import { computed } from 'vue'

import Select from '@/components/common/ui/Select.vue'

interface IPolicyItem {
  title: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    isKitten?: boolean
    species?: 'cat' | 'dog'
    secondPetId?: string | null
    availablePetsOptions?: { label: string; value: string }[]
    animalLabel?: string
    isGeneral?: boolean
    generalPetName?: string
  }>(),
  {
    isKitten: false,
    species: 'cat',
    secondPetId: null,
    availablePetsOptions: () => [],
    animalLabel: 'cat',
    isGeneral: false,
    generalPetName: '',
  },
)

const emit = defineEmits<{
  'update:secondPetId': [id: string | null]
  'update:generalPetName': [name: string]
}>()

const isCat = computed(() => props.species === 'cat')

const includedItems = computed(() => {
  if (isCat.value) {
    return [
      'Spay or Neuter',
      'Vaccinations (kitten series or adult booster)',
      'FeLV & FIV Testing',
      'De-worming',
      'Flea Treatment',
      'Health Exam by a Veterinarian',
    ]
  }
  return [
    'Spay or Neuter',
    'Vaccinations (puppy series or adult booster)',
    'Heartworm Testing & Prevention',
    'De-worming',
    'Flea & Tick Treatment',
    'Health Exam by a Veterinarian',
  ]
})

const goodToKnowItems = computed<IPolicyItem[]>(() => {
  if (isCat.value) {
    return [
      {
        title: 'Indoor Only',
        description: 'For their safety and wellbeing, adopted cats must be kept indoors.',
      },
      {
        title: 'No Declawing',
        description: 'Adopters must agree never to declaw their cat.',
      },
      {
        title: 'Not as Gifts',
        description: 'We do not place cats as gifts for others.',
      },
    ]
  }
  return [
    {
      title: 'Safe & Secure Home',
      description: 'A secure yard or dedicated on-leash walking routine is required.',
    },
    {
      title: 'Training & Socialization',
      description: 'Adopters must commit to humane, positive-reinforcement care.',
    },
    {
      title: 'Not as Gifts',
      description: 'We do not place dogs as gifts for others.',
    },
  ]
})
</script>

<template>
  <div class="info-section-wrapper">
    <div v-if="isKitten && isCat" class="kitten-notice" role="alert">
      <span class="kitten-notice-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <div class="kitten-notice-body">
        <p class="kitten-notice-title">Kitten Pairing Policy</p>
        <p>
          Kittens must be adopted in pairs, or go to a home that already has a young resident cat.
          We do not adopt kittens out as a single pet in order to prevent
          <a
            href="https://meowcatrescue.org/resources/adoption-considerations/single-kitten-syndrome/"
            target="_blank"
            rel="noopener noreferrer"
            class="kitten-link"
            >single kitten syndrome</a
          >
          and ensure they have a healthy social environment.
        </p>
      </div>
    </div>

    <section class="intro-grid" :aria-label="`${animalLabel} adoption policies and included care`">
      <article class="policy-card">
        <h3 class="policy-title">What's <span>Included</span></h3>
        <ul class="included-list">
          <li v-for="item in includedItems" :key="item" class="included-item">
            <span class="check-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span>{{ item }}</span>
          </li>
        </ul>
        <p class="policy-body">
          {{ isCat ? 'Kittens' : 'Puppies' }} may not have completed every service at the time of adoption. By around 6 months
          of age, {{ isCat ? 'kittens' : 'puppies' }} are expected to receive all required veterinary care listed above. If you
          adopt a {{ isCat ? 'kitten' : 'puppy' }}, you agree to coordinate with an ADOHR director so your {{ animalLabel }} can attend
          required follow-up vet visits.
        </p>
        <p class="policy-body">
          These services would ordinarily cost well over $350. Additional donations are always
          appreciated and directly support {{ isCat ? 'cats' : 'dogs' }} needing extra medical care.
        </p>
      </article>

      <article class="policy-card">
        <h3 class="policy-title">Good to <span>Know</span></h3>
        <ul class="good-to-know-list">
          <li v-for="item in goodToKnowItems" :key="item.title" class="good-to-know-item">
            <h4>{{ item.title }}</h4>
            <p v-if="item.description">{{ item.description }}</p>
          </li>
        </ul>
        <p class="policy-body final-note">
          Not every application is approved. Our first responsibility is always the long-term
          welfare of the {{ animalLabel }}, and we appreciate your understanding.
        </p>
      </article>
    </section>

    <!-- Second Pet Selection Box (Matching Image 2 & 3) -->
    <div v-if="availablePetsOptions.length > 0 || isGeneral" class="second-pet-selection-box">
      <p class="selection-box-title">
        Would you like to add a second {{ animalLabel }} to this application?
      </p>
      <div class="selection-input-wrap">
        <Select
          v-if="availablePetsOptions.length > 0"
          :modelValue="secondPetId ?? ''"
          :options="[{ label: 'None', value: '' }, ...availablePetsOptions]"
          placeholder="Select a second pet (optional)"
          fullWidth
          @update:modelValue="(val: unknown) => emit('update:secondPetId', val ? String(val) : null)"
        />
        <input
          v-else-if="isGeneral"
          type="text"
          class="general-second-input"
          :value="generalPetName"
          placeholder="Name of second pet or breed preference (optional)"
          @input="emit('update:generalPetName', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.info-section-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.kitten-notice {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  background-color: var(--color-warning-weak);
  border: 1px solid var(--color-warning-border);
  color: var(--text-primary);
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.kitten-notice-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--color-warning);
  color: var(--text-inverse);
  margin-top: 0.1rem;

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
}

.kitten-notice-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kitten-notice-title {
  font-weight: 700;
  font-size: 1rem;
  margin: 0;
  color: var(--color-warning-strong);
}

.kitten-notice-body p:last-child {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--text-primary);
}

.kitten-link {
  color: var(--color-warning-strong);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    opacity: 0.8;
  }
}

.intro-grid {
  --intro-panel-bg: color-mix(in oklch, var(--text-inverse) 90%, var(--color-primary) 10%);
  --intro-card-bg: color-mix(in oklch, var(--text-inverse) 96%, var(--color-primary) 4%);
  --intro-divider: color-mix(in oklch, var(--color-primary-border) 65%, transparent);

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.75rem;
  margin: 1rem auto 0.5rem;
  padding: clamp(1rem, 1.2vw, 1.4rem);
  border-radius: 1.5rem;
  border: 1px solid color-mix(in oklch, var(--color-primary-border) 55%, transparent);
  background: var(--intro-panel-bg);

  @media (width <= 900px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 0.9rem;
  }
}

.policy-card {
  border: 1px solid var(--intro-divider);
  border-radius: 1.25rem;
  background: var(--intro-card-bg);
  box-shadow: 0 8px 24px rgb(0 0 0 / 6%);
  padding: clamp(1.1rem, 2vw, 1.8rem);
}

.policy-title {
  margin-bottom: 1.1rem;
  font-size: clamp(1.45rem, 2vw, 2.05rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--text-primary);

  span {
    color: var(--color-primary);
    font-style: italic;
  }
}

.included-list,
.good-to-know-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.included-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--intro-divider);
  color: var(--text-primary);
  font-weight: 530;
}

.check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  background: color-mix(in oklch, var(--color-primary) 14%, var(--text-inverse));
  color: var(--color-primary);
  flex-shrink: 0;

  svg {
    width: 1rem;
    height: 1rem;
  }
}

.good-to-know-item {
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--intro-divider);

  h4 {
    margin: 0;
    font-size: 1.06rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  p {
    margin: 0.4rem 0 0;
    line-height: 1.55;
    color: var(--text-primary);
  }
}

.policy-body {
  margin: 1.15rem 0 0;
  color: var(--text-primary);
  line-height: 1.62;
  font-size: 0.98rem;
}

.final-note {
  margin-top: 1.25rem;
}

.second-pet-selection-box {
  background-color: oklch(from var(--color-secondary) 96% 0.05 h);
  border: 1.5px dashed var(--color-secondary);
  border-radius: var(--radius-lg, 16px);
  padding: 1.25rem 1.5rem;
  margin: 0.75rem auto 0;
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  box-sizing: border-box;

  .selection-box-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .selection-input-wrap {
    width: 100%;
    max-width: 440px;
  }

  .general-second-input {
    width: 100%;
    padding: 10px 14px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--line-ink);
    background: var(--text-inverse);
    font-family: inherit;
    font-size: 0.95rem;
    color: var(--text-primary);
    box-sizing: border-box;
  }
}

@media (width <= 640px) {
  .policy-title {
    font-size: 1.55rem;
  }

  .included-item,
  .good-to-know-item p,
  .policy-body {
    font-size: 0.95rem;
  }
}
</style>
