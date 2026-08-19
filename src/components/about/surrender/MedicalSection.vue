<script setup lang="ts">
import { ref, watch } from 'vue'

import type { SurrenderFormState } from '../../../models/surrender-form.ts'
import ButtonToggle from '../../common/ui/ButtonToggle.vue'
import InputGrid from '../../common/ui/InputGrid.vue'
import InputTextArea from '../../common/ui/InputTextArea.vue'

const { formState } = defineProps<{
  formState: SurrenderFormState
  touched: Record<string, boolean>
  handleBlur: (_field: string) => void // eslint-disable-line no-unused-vars
  hasAttemptedSubmit: boolean
}>()

const behaviorRows = [
  'examine',
  'restrain',
  'administer shots',
  'bathe',
  'clean ears',
  'trim nails',
  'take blood',
]

const behaviorColumns = ['never done', 'shows teeth/hisses', 'snap', 'bite', 'none of these']

const vaccineOptions = ['Rabies', 'FVRCP', 'FPV', 'FVR/FHV-1', 'FCV', 'None']
const selectedVaccines = ref<string[]>([])

const toggleFields: (
  | 'animalVeterinarianYearlyVisits'
  | 'animalSpayedNeutered'
  | 'animalVaccinationsCurrent'
  | 'animalTestedHeartworm'
  | 'animalHeartwormPrevention'
  | 'animalMicrochipped'
  | 'animalPastOrPresentHealthProblems'
  | 'animalCurrentMedications'
  | 'animalVetMuzzled'
)[] = [
  'animalVeterinarianYearlyVisits',
  'animalSpayedNeutered',
  'animalVaccinationsCurrent',
  'animalTestedHeartworm',
  'animalHeartwormPrevention',
  'animalMicrochipped',
  'animalPastOrPresentHealthProblems',
  'animalCurrentMedications',
  'animalVetMuzzled',
]

toggleFields.forEach((field) => {
  if (!formState[field]) {
    formState[field] = 'No'
  }
})

if (formState.animalVaccinationHistory) {
  selectedVaccines.value = formState.animalVaccinationHistory.split(', ')
}

if (!formState.animalVetOrGroomerBehavior) {
  const initialGridState: Record<string, string[]> = {}
  behaviorRows.forEach((row) => {
    initialGridState[row] = ['none of these']
  })
  formState.animalVetOrGroomerBehavior = JSON.stringify(initialGridState)
}

const toggleVaccine = (option: string) => {
  if (option === 'None') {
    selectedVaccines.value = ['None']
  } else {
    if (selectedVaccines.value.includes('None')) {
      selectedVaccines.value = selectedVaccines.value.filter((v) => v !== 'None')
    }

    if (selectedVaccines.value.includes(option)) {
      selectedVaccines.value = selectedVaccines.value.filter((v) => v !== option)
    } else {
      selectedVaccines.value.push(option)
    }
  }
}

watch(
  selectedVaccines,
  (newVal) => {
    formState.animalVaccinationHistory = newVal.join(', ')
  },
  { deep: true },
)
</script>

<template>
  <div class="medical-section">
    <h2 class="section-title">Medical History</h2>
    <div class="medical-grid">
      <InputTextArea
        label="Please list all veterniarians that have seen the cat, including address and number"
        placeholder="List veterinarians, addresses, and phone numbers"
        :spanFull="true"
        :modelValue="formState.animalVeterinarianList"
        @update:modelValue="(val) => (formState.animalVeterinarianList = val || '')"
      />

      <ButtonToggle
        label="Does the cat see a veterinarian at least once a year?"
        :modelValue="formState.animalVeterinarianYearlyVisits"
        @update:modelValue="(val) => (formState.animalVeterinarianYearlyVisits = val as string)"
      />

      <ButtonToggle
        label="Is the cat spayed/neutered?"
        :modelValue="formState.animalSpayedNeutered"
        @update:modelValue="(val) => (formState.animalSpayedNeutered = val as string)"
      />

      <fieldset class="field" aria-labelledby="vaccine-legend">
        <legend id="vaccine-legend" class="field-label">
          What vaccinations has the cat received?
        </legend>
        <div class="chips">
          <label class="chip" v-for="option in vaccineOptions" :key="option">
            <input
              type="checkbox"
              :value="option"
              :checked="selectedVaccines.includes(option)"
              @change="toggleVaccine(option)"
            />
            <span>{{ option }}</span>
          </label>
        </div>
      </fieldset>

      <ButtonToggle
        label="Are vaccinations current?"
        :modelValue="formState.animalVaccinationsCurrent"
        @update:modelValue="(val) => (formState.animalVaccinationsCurrent = val as string)"
      />

      <ButtonToggle
        label="Has the cat been tested for heartworm?"
        :modelValue="formState.animalTestedHeartworm"
        @update:modelValue="(val) => (formState.animalTestedHeartworm = val as string)"
      />

      <InputTextArea
        label="If yes, what were the test results"
        placeholder="Describe test results"
        :spanFull="false"
        :modelValue="formState.animalTestedHeartwormExplanation"
        @update:modelValue="(val) => (formState.animalTestedHeartwormExplanation = val || '')"
      />

      <ButtonToggle
        label="Is the pet taking heartworm preventative?"
        :modelValue="formState.animalHeartwormPrevention"
        @update:modelValue="(val) => (formState.animalHeartwormPrevention = val as string)"
      />

      <InputTextArea
        label="If yes, when is the next dosage due?"
        placeholder="Date or timeframe"
        :spanFull="false"
        :modelValue="formState.animalHeartwormPreventionExplanation"
        @update:modelValue="(val) => (formState.animalHeartwormPreventionExplanation = val || '')"
      />

      <ButtonToggle
        label="Is the pet microchipped?"
        :modelValue="formState.animalMicrochipped"
        @update:modelValue="(val) => (formState.animalMicrochipped = val as string)"
      />

      <InputTextArea
        label="If yes, please provide microchip number"
        placeholder="Microchip number"
        :spanFull="false"
        :modelValue="formState.animalMicrochippedExplanation"
        @update:modelValue="(val) => (formState.animalMicrochippedExplanation = val || '')"
      />

      <InputGrid
        label="Check if the cat has ever shown any of the following behaviors when handled by a vet or groomer"
        :rows="behaviorRows"
        :columns="behaviorColumns"
        :modelValue="formState.animalVetOrGroomerBehavior"
        @update:modelValue="(val) => (formState.animalVetOrGroomerBehavior = val)"
        :exclusiveOptions="['none of these', 'never done']"
      />

      <ButtonToggle
        label="Does the pet have any past or present health problems"
        :modelValue="formState.animalPastOrPresentHealthProblems"
        @update:modelValue="(val) => (formState.animalPastOrPresentHealthProblems = val as string)"
      />

      <InputTextArea
        label="If yes, please describe"
        placeholder="Describe health problems"
        :spanFull="false"
        :modelValue="formState.animalPastOrPresentHealthProblemsExplanation"
        @update:modelValue="
          (val) => (formState.animalPastOrPresentHealthProblemsExplanation = val || '')
        "
      />

      <ButtonToggle
        label="Is the cat currently taking any medications?"
        :modelValue="formState.animalCurrentMedications"
        @update:modelValue="(val) => (formState.animalCurrentMedications = val as string)"
      />

      <InputTextArea
        label="If yes, please list medications"
        placeholder="List medications"
        :spanFull="false"
        :modelValue="formState.animalCurrentMedicationsExplanation"
        @update:modelValue="(val) => (formState.animalCurrentMedicationsExplanation = val || '')"
      />

      <ButtonToggle
        label="Does the cat have to be muzzled at the veterinarians?"
        :modelValue="formState.animalVetMuzzled"
        @update:modelValue="(val) => (formState.animalVetMuzzled = val as string)"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
.medical-section h5 {
  margin-bottom: 24px;
}

.medical-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (width >= 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;
  }
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border: none;
  padding: 0;
  margin: 0;
}

.chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-full);
  border: 1px solid #e7ebf0;
  background-color: var(--color-white);
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  transition:
    background 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;

  span {
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.5;
  }

  &:hover {
    border-color: #d7e2f2;
    background: #f2f7ff;
  }
}

.chip > input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.chip:has(> input:checked) {
  background: color-mix(in srgb, var(--color-primary) 10%, #fff);
  border: 1px solid var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary) inset;
  color: var(--text-primary);
}

.chip:has(> input:focus-visible) {
  box-shadow: 0 0 0 3px var(--color-secondary);
}

@supports not (selector(:has(*))) {
  .chip > input:checked + span {
    background: #e8f1ff;
    border-radius: var(--radius-full);
    padding: 6px 10px;
    margin: -6px -10px;
    box-shadow: 0 0 0 2px #bfd0ff inset;
  }

  .chip > input:focus-visible + span {
    box-shadow: 0 0 0 3px var(--ring);
  }
}

fieldset.field {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
}

.col-span-2 {
  grid-column: span 2;
}

.span-full {
  grid-column: 1 / -1;
}

.required {
  color: #ef4444;
}
</style>
