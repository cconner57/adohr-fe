<script setup lang="ts">
import type { IDietGuidelines } from '@/utils/medicalParser'

defineProps<{
  diet: IDietGuidelines
  petName?: string
}>()
</script>

<template>
  <article v-if="diet.hasInfo" class="medical-section-card diet-card">
    <div class="card-header">
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
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      </div>
      <div>
        <h2>Diet, Nutrition &amp; Transition Guidelines</h2>
        <p class="section-desc">
          Current nutrition schedule, food formula, and portion amounts for {{ petName || 'your pet' }}.
        </p>
      </div>
    </div>

    <div class="diet-grid">
      <div v-if="diet.foodBrand || diet.foodFormula" class="diet-item">
        <span class="label">Food Brand &amp; Formula</span>
        <strong class="value">
          {{ [diet.foodBrand, diet.foodFormula].filter(Boolean).join(' – ') }}
        </strong>
      </div>

      <div v-if="diet.primaryFoodType" class="diet-item">
        <span class="label">Food Type</span>
        <span class="value">{{ diet.primaryFoodType }}</span>
      </div>

      <div v-if="diet.portionSize" class="diet-item">
        <span class="label">Daily Portion</span>
        <span class="value">{{ diet.portionSize }}</span>
      </div>

      <div v-if="diet.feedingFrequency" class="diet-item">
        <span class="label">Feeding Frequency</span>
        <span class="value">{{ diet.feedingFrequency }}</span>
      </div>
    </div>

    <div v-if="diet.isPrescriptionDiet" class="prescription-alert" role="alert">
      <div class="alert-badge">Prescription Diet</div>
      <p class="alert-text">
        {{ diet.prescriptionNotes || 'This pet requires veterinary-formulated prescription food.' }}
      </p>
    </div>

    <div v-if="diet.allergies" class="allergy-row">
      <span class="allergy-label">⚠️ Food Sensitivities &amp; Allergies:</span>
      <span class="allergy-value">{{ diet.allergies }}</span>
    </div>

    <div v-if="diet.feedingNotes" class="feeding-notes">
      <span class="notes-label">Feeding Instructions:</span>
      <p class="notes-text">{{ diet.feedingNotes }}</p>
    </div>
  </article>
</template>

<style scoped lang="css">
.diet-card {
  background-color: var(--color-surface, #fff);
  border: 1px solid var(--line-ink);
  border-radius: var(--radius-md);
  padding: 24px;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;

  .header-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background-color: oklch(from var(--color-secondary) 94% 0.05 h);
    color: var(--color-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-primary);
    margin: 0 0 4px;
  }

  .section-desc {
    font-size: 0.88rem;
    color: var(--text-secondary);
    margin: 0;
  }
}

.diet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  background-color: var(--color-surface-subtle, oklch(from var(--text-primary) 98% 0.01 h));
  border: 1px solid var(--line-ink);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: 16px;
}

.diet-item {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    color: var(--text-secondary);
    letter-spacing: 0.04em;
  }

  .value {
    font-size: 0.95rem;
    color: var(--text-primary);
  }
}

.prescription-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: oklch(from var(--color-warning, #e67e22) 95% 0.05 h);
  border: 1px solid oklch(from var(--color-warning, #e67e22) 80% 0.1 h);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  margin-bottom: 16px;

  .alert-badge {
    background-color: var(--color-warning, #e67e22);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .alert-text {
    font-size: 0.88rem;
    color: var(--text-primary);
    margin: 0;
  }
}

.allergy-row {
  font-size: 0.88rem;
  padding: 10px 14px;
  background-color: oklch(from var(--color-danger) 96% 0.03 h);
  border: 1px solid oklch(from var(--color-danger) 85% 0.06 h);
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .allergy-label {
    font-weight: 700;
    color: var(--color-danger);
  }

  .allergy-value {
    color: var(--text-primary);
  }
}

.feeding-notes {
  border-left: 3px solid var(--color-secondary);
  padding-left: 12px;
  margin-top: 12px;

  .notes-label {
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--text-primary);
    display: block;
    margin-bottom: 2px;
  }

  .notes-text {
    font-size: 0.88rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }
}
</style>
