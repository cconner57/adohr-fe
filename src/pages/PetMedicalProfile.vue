<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { IPet, IVaccineRecord, IVaccineSeries } from '@/models/common'
import { usePetStore } from '@/stores/pets'

const route = useRoute()
const petStore = usePetStore()

const isLoading = ref(true)
const pet = ref<IPet | null>(null)

const slug = computed(() => String(route.params.slug ?? '').trim())

const isAllowedStatus = computed(() => {
  const status = pet.value?.details?.status
  return status === 'adopted' || status === 'archived' || status === 'available'
})

const hasMedicalVisibility = computed(() => {
  return pet.value?.profileSettings?.showMedicalHistory ?? true
})

const isVisible = computed(() => Boolean(pet.value && isAllowedStatus.value && hasMedicalVisibility.value))

const toDateLabel = (value?: string | null) => {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

interface IParsedVaccineRecord {
  name: string
  administered?: string | null
  expires?: string | null
  veterinarian?: string | null
  status?: string | null
}

const parseVaccineRecord = (name: string, record?: IVaccineRecord): IParsedVaccineRecord | null => {
  if (!record) return null
  return {
    name,
    administered: toDateLabel(record.dateAdministered),
    expires: record.expiresAt ? toDateLabel(record.expiresAt) : null,
    veterinarian: record.veterinarian || null,
  }
}

const expandSeriesObjects = (label: string, series?: IVaccineSeries): IParsedVaccineRecord[] => {
  if (!series) return []
  const rows: IParsedVaccineRecord[] = []
  const round1 = parseVaccineRecord(`${label} Round 1`, series.round1)
  const round2 = parseVaccineRecord(`${label} Round 2`, series.round2)
  const round3 = parseVaccineRecord(`${label} Round 3`, series.round3)

  if (round1) rows.push(round1)
  if (round2) rows.push(round2)
  if (round3) rows.push(round3)

  if (rows.length === 0 && series.isComplete) {
    rows.push({ name: label, status: 'Series marked complete' })
  }
  return rows
}

const vaccineRecords = computed(() => {
  const vaccinations = pet.value?.medical?.vaccinations
  if (!vaccinations) return [] as IParsedVaccineRecord[]
  const lines: IParsedVaccineRecord[] = []

  const rabies = parseVaccineRecord('Rabies', vaccinations.rabies)
  if (rabies) lines.push(rabies)

  const bordetella = parseVaccineRecord('Bordetella', vaccinations.bordetella)
  if (bordetella) lines.push(bordetella)

  const seriesLines = [
    ...expandSeriesObjects('Canine Distemper', vaccinations.canineDistemper),
    ...expandSeriesObjects('Feline Distemper', vaccinations.felineDistemper),
    ...expandSeriesObjects('Feline Leukemia', vaccinations.felineLeukemia),
    ...expandSeriesObjects('Leptospira', vaccinations.leptospira),
  ]

  return [...lines, ...seriesLines]
})

const careTimeline = computed(() => {
  if (!pet.value) return []
  const events: Array<{ icon: string; title: string; date: string; note: string; status: 'completed' | 'current' }> = []

  if (pet.value.createdAt) {
    events.push({
      icon: '🏠',
      title: 'Rescue Intake & Initial Assessment',
      date: toDateLabel(pet.value.createdAt),
      note: 'Comprehensive veterinary intake, health check, and quarantine completed.',
      status: 'completed',
    })
  }

  if (pet.value.medical?.spayedOrNeuteredDate || pet.value.medical?.spayedOrNeutered) {
    events.push({
      icon: '🩺',
      title: 'Spay / Neuter Surgery',
      date: pet.value.medical.spayedOrNeuteredDate ? toDateLabel(pet.value.medical.spayedOrNeuteredDate) : 'Completed',
      note: 'Sterilization procedure completed with full post-op recovery.',
      status: 'completed',
    })
  }

  if (pet.value.medical?.microchip?.microchipped) {
    const chipId = pet.value.medical.microchip.microchipID
    events.push({
      icon: '🏷️',
      title: 'Microchip Implantation & Registration',
      date: 'Active',
      note: chipId ? `Microchip #${chipId} registered with national database.` : 'Microchip implanted and registered.',
      status: 'completed',
    })
  }

  vaccineRecords.value.forEach((v) => {
    events.push({
      icon: '💉',
      title: `Vaccination: ${v.name}`,
      date: v.administered || 'Administered',
      note: v.expires ? `Expires: ${v.expires}` : 'Up to date',
      status: 'completed',
    })
  })

  return events
})

const loadPet = async () => {
  isLoading.value = true
  try {
    const fromDetail = await petStore.fetchPetDetail(slug.value)
    if (fromDetail) {
      pet.value = fromDetail
      return
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadPet()
})
</script>

<template>
  <section class="medical-shell">
    <div class="medical-card">
      <p v-if="isLoading" class="muted">Loading medical profile...</p>

      <template v-else-if="!pet">
        <h1>Medical Profile Not Found</h1>
        <p class="muted">We could not find a pet with that profile slug.</p>
      </template>

      <template v-else-if="!isVisible">
        <h1>Medical Profile Unavailable</h1>
        <p class="muted">
          Medical records are currently restricted for this profile.
        </p>
      </template>

      <template v-else>
        <header class="hero">
          <div class="hero-top">
            <span class="eyebrow">Veterinary &amp; Care Record</span>
            <span class="status-badge" :class="pet.details?.status">{{ pet.details?.status }}</span>
          </div>
          <h1>{{ pet.name }}'s Medical Record</h1>
          <p class="hero-sub">Official veterinary history and preventative care timeline managed by ADOHR.</p>
        </header>

        <!-- Chronological Care Timeline -->
        <article class="block">
          <h2>Chronological Care Timeline</h2>
          <div class="timeline">
            <div v-for="(event, idx) in careTimeline" :key="idx" class="timeline-item">
              <div class="timeline-icon">{{ event.icon }}</div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <strong>{{ event.title }}</strong>
                  <span class="timeline-date">{{ event.date }}</span>
                </div>
                <p class="timeline-note">{{ event.note }}</p>
              </div>
            </div>
          </div>
        </article>

        <!-- Spay/Neuter Status -->
        <article class="block">
          <h2>Spay / Neuter Status</h2>
          <div class="status-row">
            <span class="status-pill" :class="{ yes: pet.medical?.spayedOrNeutered }">
              {{ pet.medical?.spayedOrNeutered ? '✓ Spayed/Neutered' : 'Pending Sterilization' }}
            </span>
            <span v-if="pet.medical?.spayedOrNeuteredDate" class="muted">
              Procedure Date: {{ toDateLabel(pet.medical.spayedOrNeuteredDate) }}
            </span>
          </div>
        </article>

        <!-- Vaccinations Detail -->
        <article class="block">
          <h2>Vaccination Records</h2>
          <dl v-if="vaccineRecords.length > 0" class="medical-list">
            <template v-for="(record, index) in vaccineRecords" :key="index">
              <dt>{{ record.name }}</dt>
              <dd>
                <span v-if="record.status">{{ record.status }}</span>
                <template v-else>
                  <div v-if="record.administered">Administered: {{ record.administered }}</div>
                  <div v-if="record.expires">Expires: {{ record.expires }}</div>
                  <div v-if="record.veterinarian">Veterinarian: {{ record.veterinarian }}</div>
                </template>
              </dd>
            </template>
          </dl>
          <p v-else class="muted">No specific vaccination line items listed.</p>
        </article>
      </template>
    </div>
  </section>
</template>

<style scoped lang="css">
.medical-shell {
  min-height: 100vh;
  padding: 9rem var(--layout-padding-side) 4rem;
  background: var(--text-inverse);
  color: var(--text-primary);
}

.medical-card {
  max-width: 860px;
  margin: 0 auto;
  background: var(--text-inverse);
  border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 14%));
  border-radius: var(--radius-lg, 16px);
  padding: clamp(24px, 4vw, 40px);
  box-shadow: var(--shadow-lg);
}

.hero {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 14%));

  .hero-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', monospace;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-secondary);
    letter-spacing: 0.1em;
  }

  .status-badge {
    text-transform: capitalize;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: var(--radius-full);
    background-color: oklch(from var(--color-secondary) 96% 0.04 h);
    color: var(--color-secondary);
  }

  h1 {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 800;
    color: var(--color-primary);
    margin: 0 0 0.5rem;
  }

  .hero-sub {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin: 0;
  }
}

.block {
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));

  h2 {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  padding-left: 8px;

  &::before {
    content: '';
    position: absolute;
    top: 12px;
    bottom: 12px;
    left: 23px;
    width: 2px;
    background: var(--line-ink, oklch(from var(--text-primary) l c h / 15%));
  }
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  z-index: 1;

  .timeline-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--text-inverse);
    border: 2px solid var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
  }

  .timeline-content {
    flex: 1;
    background-color: oklch(from var(--color-primary-weak) l c h / 30%);
    border-radius: var(--radius-md, 10px);
    padding: 12px 16px;
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 10%));

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 4px;

      strong { font-size: 0.92rem; color: var(--text-primary); }
      .timeline-date {
        font-family: ui-monospace, 'SF Mono', monospace;
        font-size: 0.78rem;
        color: var(--color-secondary);
        font-weight: 600;
      }
    }

    .timeline-note {
      font-size: 0.84rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
    }
  }
}

.status-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .status-pill {
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 0.85rem;
    font-weight: 700;
    background-color: oklch(from var(--color-secondary) 96% 0.04 h);
    color: var(--color-secondary);

    &.yes {
      background-color: oklch(from var(--color-primary) 96% 0.05 h);
      color: var(--color-primary);
    }
  }
}

.medical-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  dt {
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--text-primary);
  }

  dd {
    margin: 0 0 8px 0;
    padding-left: 12px;
    border-left: 2px solid var(--color-secondary);
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
}

.muted {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
</style>
