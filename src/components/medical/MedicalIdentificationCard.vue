<script setup lang="ts">
import type { IIdentificationInfo } from '@/utils/medicalParser'

defineProps<{
  ident: IIdentificationInfo
}>()
</script>

<template>
  <article v-if="ident.isChipped || ident.rabiesTagNumber || ident.licenseTagNumber" class="medical-section-card ident-card">
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
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      </div>
      <div>
        <h2>Pet Identification &amp; Official Tags</h2>
        <p class="section-desc">
          Official microchip registration, rabies certificates, and municipal license tags.
        </p>
      </div>
    </div>

    <div class="ident-grid">
      <div v-if="ident.isChipped" class="ident-item">
        <span class="label">Microchip Number</span>
        <strong class="value highlight-chip">#{{ ident.microchipId }}</strong>
        <span v-if="ident.microchipBrand" class="sub-label">
          Registry: {{ ident.microchipBrand }}
        </span>
      </div>

      <div v-if="ident.secondaryMicrochipId" class="ident-item">
        <span class="label">Secondary Microchip</span>
        <strong class="value highlight-chip">#{{ ident.secondaryMicrochipId }}</strong>
        <span v-if="ident.secondaryMicrochipBrand" class="sub-label">
          Registry: {{ ident.secondaryMicrochipBrand }}
        </span>
      </div>

      <div v-if="ident.rabiesTagNumber" class="ident-item">
        <span class="label">Rabies Tag Serial</span>
        <strong class="value">#{{ ident.rabiesTagNumber }}</strong>
      </div>

      <div v-if="ident.licenseTagNumber" class="ident-item">
        <span class="label">Municipal License</span>
        <strong class="value">#{{ ident.licenseTagNumber }}</strong>
      </div>
    </div>

    <p class="ident-tip">
      💡 <strong>Adopter Tip:</strong> Remember to register your current phone number and address with
      {{ ident.microchipBrand || 'your pet\'s microchip registry' }} to keep contact records up to date.
    </p>
  </article>
</template>

<style scoped lang="css">
.ident-card {
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

.ident-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  background-color: var(--color-surface-subtle, oklch(from var(--text-primary) 98% 0.01 h));
  border: 1px solid var(--line-ink);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: 14px;
}

.ident-item {
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
    font-size: 0.98rem;
    color: var(--text-primary);

    &.highlight-chip {
      font-family: var(--font-mono);
      color: var(--color-primary);
      letter-spacing: 0.05em;
    }
  }

  .sub-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }
}

.ident-tip {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}
</style>
