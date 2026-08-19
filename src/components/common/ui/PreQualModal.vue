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

const allAcknowledged = computed(() => {
  return ackAge.value && ackHousing.value && ackCare.value && ackHousehold.value
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
            To ensure the best match for {{ petName ? petName : 'our rescues' }}, please confirm you meet our core adoption criteria before completing the application:
          </p>

          <div class="checklist">
            <label class="check-item" :class="{ checked: ackAge }">
              <input type="checkbox" v-model="ackAge" />
              <div class="item-text">
                <strong>21+ Years of Age</strong>
                <span>Primary applicant is 21 or older (or has a parent/guardian co-signer).</span>
              </div>
            </label>

            <label class="check-item" :class="{ checked: ackHousing }">
              <input type="checkbox" v-model="ackHousing" />
              <div class="item-text">
                <strong>Housing & Landlord Approval</strong>
                <span>Own home, or have landlord/lease permission to keep pets at your residence.</span>
              </div>
            </label>

            <label class="check-item" :class="{ checked: ackCare }">
              <input type="checkbox" v-model="ackCare" />
              <div class="item-text">
                <strong>Veterinary & Lifetime Care Commitment</strong>
                <span>Prepared to provide lifetime indoor shelter, routine veterinary care, and high-quality nutrition.</span>
              </div>
            </label>

            <label class="check-item" :class="{ checked: ackHousehold }">
              <input type="checkbox" v-model="ackHousehold" />
              <div class="item-text">
                <strong>All Household Members Onboard</strong>
                <span>Everyone living in the home is enthusiastic and agrees to welcome this pet.</span>
              </div>
            </label>
          </div>

          <!-- Weekend Fast-Track Toggle -->
          <div class="fast-track-box">
            <label class="fast-track-label">
              <input type="checkbox" v-model="isFastTrack" />
              <div class="fast-track-text">
                <span class="ft-tag">⚡ Fast-Track Weekend Pre-Approval</span>
                <p>I plan to visit Pasadena PetSmart this Saturday or Sunday (12–4 PM) to meet pets in person. Priority review my application before the event!</p>
              </div>
            </label>
          </div>
        </div>

        <footer class="modal-footer">
          <Button
            title="Cancel"
            variant="secondary"
            color="blue"
            @click="emit('close')"
          />
          <Button
            title="I'm Ready to Apply →"
            color="blue"
            :disabled="!allAcknowledged"
            @click="handleProceed"
          />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="css">
.prequal-overlay {
  position: fixed;
  inset: 0;
  background-color: oklch(0% 0 0deg / 65%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal, 2000);
  padding: 1rem;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

.prequal-modal {
  background-color: var(--text-inverse);
  color: var(--text-primary);
  border-radius: var(--radius-lg, 16px);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
  position: relative;

  .header-icon {
    font-size: 1.8rem;
  }

  .eyebrow {
    font-family: var(--font-mono, monospace);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-secondary);
    display: block;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
  }

  .close-btn {
    position: absolute;
    right: 1rem;
    top: 1rem;
    background: transparent;
    border: none;
    font-size: 1.75rem;
    color: var(--text-secondary);
    cursor: pointer;
    line-height: 1;
    padding: 4px 8px;
    border-radius: var(--radius-sm);

    &:hover {
      color: var(--text-primary);
    }
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .intro-text {
    font-size: 0.92rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
  }
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.check-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md, 10px);
  border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
  background-color: var(--text-inverse);
  cursor: pointer;
  transition: all 0.2s ease;

  input[type="checkbox"] {
    margin-top: 3px;
    width: 18px;
    height: 18px;
    accent-color: var(--color-primary);
    cursor: pointer;
  }

  .item-text {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    span {
      font-size: 0.8rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
  }

  &:hover {
    border-color: var(--color-primary);
    background-color: oklch(from var(--color-primary-weak) l c h / 30%);
  }

  &.checked {
    border-color: var(--color-primary);
    background-color: oklch(from var(--color-primary-weak) l c h / 40%);
  }
}

.fast-track-box {
  background: linear-gradient(135deg, oklch(from var(--color-primary) 96% 0.05 h), oklch(from var(--color-warning) 96% 0.06 h));
  border: 1.5px solid var(--color-warning);
  border-radius: var(--radius-md, 10px);
  padding: 12px 14px;

  .fast-track-label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;

    input[type="checkbox"] {
      margin-top: 3px;
      width: 18px;
      height: 18px;
      accent-color: var(--color-warning);
      cursor: pointer;
    }

    .fast-track-text {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .ft-tag {
        font-size: 0.82rem;
        font-weight: 800;
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      p {
        font-size: 0.8rem;
        color: var(--text-primary);
        line-height: 1.4;
        margin: 0;
      }
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
  background-color: oklch(from var(--text-inverse) 98% c h);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
