<script setup lang="ts">
import type { IDiagnosticTestResult } from '@/utils/medicalParser'

defineProps<{
  diagnostics: IDiagnosticTestResult[]
  petName?: string
}>()
</script>

<template>
  <article v-if="diagnostics.length > 0" class="medical-section-card diagnostics-card">
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
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M8 13h2" />
          <path d="M8 17h8" />
          <path d="M14 13h2" />
        </svg>
      </div>
      <div>
        <h2>Diagnostic Lab &amp; Disease Screening</h2>
        <p class="section-desc">
          Official laboratory screening results and infectious disease panels for {{ petName || 'your pet' }}.
        </p>
      </div>
    </div>

    <div class="tests-grid">
      <div
        v-for="(test, index) in diagnostics"
        :key="index"
        class="test-item"
        :class="{ positive: test.isPositive, negative: test.isNegative }"
      >
        <div class="test-header">
          <span class="test-name">{{ test.name }}</span>
          <span class="result-badge" :class="{ pos: test.isPositive, neg: test.isNegative }">
            {{ test.result }}
          </span>
        </div>
        <div v-if="test.date" class="test-date">
          Tested: {{ test.date }}
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="css">
.diagnostics-card {
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

.tests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.test-item {
  border: 1px solid var(--line-ink);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  background-color: var(--color-surface-subtle, oklch(from var(--text-primary) 98% 0.01 h));
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.negative {
    border-left: 3px solid var(--color-primary);
  }

  &.positive {
    border-left: 3px solid var(--color-danger);
    background-color: oklch(from var(--color-danger) 97% 0.02 h);
  }
}

.test-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.test-name {
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--text-primary);
}

.result-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  text-transform: capitalize;

  &.neg {
    background-color: oklch(from var(--color-primary) 93% 0.06 h);
    color: var(--color-primary);
    border: 1px solid oklch(from var(--color-primary) 80% 0.1 h);
  }

  &.pos {
    background-color: oklch(from var(--color-danger) 93% 0.06 h);
    color: var(--color-danger);
    border: 1px solid oklch(from var(--color-danger) 80% 0.1 h);
  }
}

.test-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}
</style>
