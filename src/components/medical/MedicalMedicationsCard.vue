<script setup lang="ts">
import type { IProcedureItem } from '@/utils/medicalParser'

defineProps<{
  medications: string[]
  procedures: IProcedureItem[]
  healthSummary?: string | null
}>()
</script>

<template>
  <article v-if="medications.length > 0 || procedures.length > 0 || healthSummary" class="medical-section-card clinical-card">
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
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <div>
        <h2>Surgeries, Medications &amp; Clinical Notes</h2>
        <p class="section-desc">
          Veterinary summaries, active medication schedules, and clinical procedures.
        </p>
      </div>
    </div>

    <div v-if="healthSummary" class="summary-box">
      <strong class="summary-label">Veterinary Health Summary:</strong>
      <p class="summary-text">{{ healthSummary }}</p>
    </div>

    <div v-if="medications.length > 0" class="meds-block">
      <h3>Active Medications &amp; Preventatives</h3>
      <ul class="meds-list">
        <li v-for="(med, idx) in medications" :key="idx" class="med-item">
          <span class="med-bullet" aria-hidden="true">💊</span>
          <span class="med-text">{{ med }}</span>
        </li>
      </ul>
    </div>

    <div v-if="procedures.length > 0" class="procedures-block">
      <h3>Specialized Surgeries &amp; Procedures</h3>
      <div class="procedure-grid">
        <div v-for="(proc, idx) in procedures" :key="idx" class="procedure-item">
          <div class="proc-header">
            <span class="proc-name">{{ proc.name }}</span>
            <span v-if="proc.date" class="proc-date">{{ proc.date }}</span>
          </div>
          <p v-if="proc.notes" class="proc-notes">{{ proc.notes }}</p>
          <span v-if="proc.veterinarian" class="proc-vet">Provider: {{ proc.veterinarian }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="css">
.clinical-card {
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
    background-color: oklch(from var(--color-primary) 94% 0.05 h);
    color: var(--color-primary);
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

.summary-box {
  background-color: var(--color-surface-subtle, oklch(from var(--text-primary) 98% 0.01 h));
  border: 1px solid var(--line-ink);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  margin-bottom: 20px;

  .summary-label {
    display: block;
    font-size: 0.82rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    color: var(--color-primary);
    margin-bottom: 4px;
    letter-spacing: 0.03em;
  }

  .summary-text {
    font-size: 0.92rem;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.5;
  }
}

.meds-block {
  margin-bottom: 20px;

  h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 10px;
  }

  .meds-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .med-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background-color: oklch(from var(--color-secondary) 96% 0.03 h);
    border: 1px solid oklch(from var(--color-secondary) 85% 0.06 h);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    color: var(--text-primary);
  }

  .med-bullet {
    font-size: 1rem;
  }
}

.procedures-block {
  h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 10px;
  }

  .procedure-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
  }

  .procedure-item {
    border: 1px solid var(--line-ink);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    background-color: var(--color-surface-subtle, oklch(from var(--text-primary) 98% 0.01 h));
  }

  .proc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .proc-name {
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--text-primary);
  }

  .proc-date {
    font-size: 0.78rem;
    color: var(--text-secondary);
  }

  .proc-notes {
    font-size: 0.82rem;
    color: var(--text-secondary);
    margin: 4px 0;
  }

  .proc-vet {
    font-size: 0.75rem;
    color: var(--text-secondary);
    display: block;
  }
}
</style>
