<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { API_ENDPOINTS } from '@/constants/api'
import type { IPet, IVaccineRecord, IVaccineSeries } from '@/models/common'
import { usePetStore } from '@/stores/pets'
import { PUBLIC_ORG_ID } from '@/utils/api'

interface IMedicalFile {
  name: string
  url: string
}

const route = useRoute()
const petStore = usePetStore()

const isLoading = ref(true)
const pet = ref<IPet | null>(null)

const slug = computed(() => String(route.params.slug ?? '').trim())

const isAllowedStatus = computed(() => {
  const status = pet.value?.details.status
  return status === 'adopted' || status === 'archived'
})

const hasMedicalVisibility = computed(() => {
  return pet.value?.profileSettings.showMedicalHistory ?? false
})

const isVisible = computed(() => !!pet.value && isAllowedStatus.value && hasMedicalVisibility.value)

const toDateLabel = (value?: string | null) => {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString()
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
    rows.push({
      name: label,
      status: 'Series marked complete',
    })
  }

  return rows
}

const vaccineRecords = computed(() => {
  const vaccinations = pet.value?.medical.vaccinations
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

  if (seriesLines.length > 0) {
    lines.push(...seriesLines)
  }

  const otherVaccines = vaccinations.other ?? []
  otherVaccines.forEach((record, index) => {
    const name = record.name?.trim() || `Other Vaccine ${index + 1}`
    const parsed = parseVaccineRecord(name, record)
    if (parsed) {
      lines.push(parsed)
    }
  })

  return lines
})

const toRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

const parseFileEntry = (value: unknown): IMedicalFile | null => {
  const record = toRecord(value)
  if (!record) return null

  const url = typeof record.url === 'string' ? record.url : ''
  if (!url) return null

  const nameFromName = typeof record.name === 'string' ? record.name : ''
  const nameFromTitle = typeof record.title === 'string' ? record.title : ''
  const name = nameFromName || nameFromTitle || 'Medical Document'

  return { name, url }
}

const medicalFiles = computed(() => {
  const files: IMedicalFile[] = []
  const root = toRecord(pet.value)
  if (!root) return files

  const medicalRecord = toRecord(root.medical)

  const sourceArrays: unknown[] = [
    root.medicalFiles,
    root.medicalDocuments,
    medicalRecord?.files,
    medicalRecord?.documents,
  ]

  sourceArrays.forEach((arr) => {
    if (!Array.isArray(arr)) return

    arr.forEach((entry) => {
      const parsed = parseFileEntry(entry)
      if (parsed) {
        files.push(parsed)
      }
    })
  })

  const deduped = new Map<string, IMedicalFile>()
  files.forEach((file) => deduped.set(file.url, file))
  return Array.from(deduped.values())
})

const findPetFromStatusList = async () => {
  const queryByStatus = async (status: 'adopted' | 'archived') => {
    const response = await fetch(
      `${API_ENDPOINTS.PETS_LIST}?status=${status}&orgId=${PUBLIC_ORG_ID}`,
    )
    if (!response.ok) return [] as IPet[]

    const json = await response.json()
    const payload = (json as { data?: unknown }).data ?? json
    if (Array.isArray(payload)) return payload as IPet[]
    if (
      payload &&
      typeof payload === 'object' &&
      Array.isArray((payload as { data?: unknown }).data)
    ) {
      return (payload as { data: IPet[] }).data
    }

    return [] as IPet[]
  }

  const [adopted, archived] = await Promise.all([
    queryByStatus('adopted'),
    queryByStatus('archived'),
  ])
  const all = [...adopted, ...archived]
  const normalized = slug.value.toLowerCase()
  return all.find((p) => (p.slug ?? p.id).toLowerCase() === normalized) ?? null
}

const loadPet = async () => {
  isLoading.value = true
  try {
    const fromDetail = await petStore.fetchPetDetail(slug.value)
    if (fromDetail) {
      pet.value = fromDetail
      return
    }

    pet.value = await findPetFromStatusList()
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
          Medical details are only available for pets in adopted or archived status with public
          medical history enabled.
        </p>
      </template>

      <template v-else>
        <header class="hero">
          <h1>{{ pet.name }} Medical Profile</h1>
          <p class="status">Status: {{ pet.details.status }}</p>
        </header>

        <article class="block">
          <h2>Spay / Neuter</h2>
          <p>
            {{
              pet.medical.spayedOrNeutered === null
                ? 'Not provided'
                : pet.medical.spayedOrNeutered
                  ? 'Yes'
                  : 'No'
            }}
          </p>
          <p class="muted">Procedure Date: {{ toDateLabel(pet.medical.spayedOrNeuteredDate) }}</p>
        </article>

        <article class="block">
          <h2>Vaccination History</h2>
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
          <p v-else class="muted">No vaccination records available.</p>
          <p class="muted">
            Vaccinations Up To Date:
            {{
              pet.medical.vaccinationsUpToDate === null
                ? 'Not provided'
                : pet.medical.vaccinationsUpToDate
                  ? 'Yes'
                  : 'No'
            }}
          </p>
        </article>

        <article class="block">
          <h2>Downloadable Medical Documents</h2>
          <ul v-if="medicalFiles.length > 0">
            <li v-for="file in medicalFiles" :key="file.url">
              <a :href="file.url" target="_blank" rel="noopener noreferrer">{{ file.name }}</a>
            </li>
          </ul>
          <p v-else class="muted">No downloadable files are currently available.</p>
        </article>
      </template>
    </div>
  </section>
</template>

<style scoped lang="css">
.medical-shell {
  min-height: 100vh;
  padding: 9rem var(--layout-padding-side) 3rem;
  background:
    radial-gradient(circle at top right, rgb(255 255 255 / 30%), transparent 30%),
    linear-gradient(180deg, #f3f6f9, #dfe8f2);
}

.medical-card {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 10px 28px rgb(0 0 0 / 12%);
}

.hero {
  margin-bottom: 1rem;

  h1 {
    color: var(--color-primary);
    margin-bottom: 0.3rem;
  }

  .status {
    text-transform: capitalize;
    font-weight: 700;
  }
}

.block {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-top: 1rem;

  h2 {
    margin-bottom: 0.4rem;
    color: var(--color-primary);
  }

  ul {
    margin-left: 1.1rem;
  }

  .medical-list {
    margin-top: 0.5rem;
    margin-bottom: 1rem;

    dt {
      font-weight: 700;
      color: var(--text-primary);
      margin-top: 0.8rem;
    }

    dd {
      margin-left: 0;
      margin-bottom: 0.8rem;
      padding-left: 1rem;
      border-left: 2px solid var(--color-secondary);
      color: var(--text-secondary);

      div {
        margin-bottom: 0.2rem;
      }
    }
  }

  a {
    color: var(--color-secondary);
    font-weight: 700;
  }
}

.muted {
  color: #4b5563;
}

@media (width <= 640px) {
  .medical-shell {
    padding: 6rem 1rem 2rem;
  }

  .medical-card {
    padding: 1rem;
  }
}
</style>
