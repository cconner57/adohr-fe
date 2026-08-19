<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

import { usePetStore } from '@/stores/pets'

import Spinner from '../../common/ui/Spinner.vue'

const currentYear = new Date().getFullYear()
const previousYear = currentYear - 1

const petStore = usePetStore()
const { adoptedCounts, countsLoaded } = storeToRefs(petStore)

const countCurrent = computed(() => adoptedCounts.value[currentYear] ?? 0)
const countPrevious = computed(() => adoptedCounts.value[previousYear] ?? 0)
const isLoading = computed(() => !countsLoaded.value)

const getLabel = (count: number) =>
  count === 1 ? 'pet found a forever home' : 'pets found forever homes'

onMounted(() => {
  petStore.fetchAdoptedCounts()
})
</script>

<template>
  <section class="impact">
    <header class="impact-header">
      <p class="eyebrow">Our impact</p>
      <h4>Every number is a <span class="display-accent">life changed.</span></h4>
    </header>

    <div class="stat-rows">
      <div class="stat-row">
        <span class="stat-year">{{ previousYear }}</span>
        <div v-if="isLoading" class="loader-container"><Spinner /></div>
        <template v-else>
          <span class="stat-count">{{ countPrevious }}</span>
          <span class="stat-desc">{{ getLabel(countPrevious) }}</span>
        </template>
      </div>

      <div class="stat-row stat-row--current">
        <span class="stat-year">{{ currentYear }} <em>so far</em></span>
        <div v-if="isLoading" class="loader-container"><Spinner /></div>
        <template v-else>
          <span class="stat-count">{{ countCurrent }}</span>
          <span class="stat-desc">{{ getLabel(countCurrent) }}</span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.loader-container {
  display: flex;
  align-items: center;
  min-height: 80px;
}

.impact {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.impact-header {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  .eyebrow {
    color: var(--color-secondary);
  }

  h4 {
    font-size: var(--font-size-h2);
    color: var(--text-primary);
  }
}

.stat-rows {
  display: flex;
  flex-direction: column;
  border-top: 1.5px solid var(--line-ink);
}

.stat-row {
  display: grid;
  grid-template-columns: 140px auto 1fr;
  align-items: baseline;
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: clamp(1rem, 2.5vw, 1.75rem) 0;
  border-bottom: 1.5px solid var(--line-ink);
}

.stat-year {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  color: var(--text-secondary);

  em {
    font-style: normal;
    display: block;
    font-size: 0.72rem;
    opacity: 0.7;
  }
}

.stat-count {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(3.5rem, 9vw, 6.5rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.stat-row--current .stat-count {
  color: var(--color-secondary);
}

.stat-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 26ch;
  line-height: 1.45;
}

@media (width <= 600px) {
  .stat-row {
    grid-template-columns: 1fr;
    gap: 0.375rem;
  }
}
</style>
