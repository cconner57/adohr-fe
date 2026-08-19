<script setup lang="ts">
import type { FormState } from '../../../models/adopt-form.ts'
import InputField from '../../common/ui/InputField.vue'
import InputSelectGroup from '../../common/ui/InputSelectGroup.vue'

const { modelValue, animalLabel = 'dog' } = defineProps<{
  modelValue: FormState
  touched?: Record<string, boolean>
  // eslint-disable-next-line no-unused-vars
  handleBlur: (_field: string) => void
  hasAttemptedSubmit?: boolean
  animalLabel?: string
}>()

const addPet = () => {
  modelValue.currentPets.push({
    name: '',
    speciesBreedSize: '',
    age: '',
    source: '',
    spayedNeutered: '',
    likesDogs: '',
  })
}

const removePet = (index: number) => {
  modelValue.currentPets.splice(index, 1)
}
</script>

<template>
  <div class="current-pets-section">
    <h2 class="section-title">Current Pets in Household</h2>
    <InputSelectGroup
      label="Do you currently have any pets in your home?"
      :options="['Yes', 'No']"
      :modelValue="modelValue.currentlyHavePets"
      @update:modelValue="(val) => (modelValue.currentlyHavePets = val as string)"
      :hasError="
        (touched?.currentlyHavePets && !modelValue.currentlyHavePets) ||
        (hasAttemptedSubmit && !modelValue.currentlyHavePets)
      "
    />
    <div class="desktop-spacer"></div>
    <div class="children" v-if="modelValue.currentlyHavePets === 'Yes'">
      <div v-for="(pet, index) in modelValue.currentPets" :key="index" class="pet-entry">
        <div class="pet-header">
          <h4>CURRENT PET {{ index + 1 }}</h4>
          <button
            v-if="index === modelValue.currentPets.length - 1"
            class="add-btn"
            @click.prevent="addPet"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path
                d="M12 4.5c.414 0 .75.336.75.75v6h6c.414 0 .75.336.75.75s-.336.75-.75.75h-6v6c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-6h-6c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h6v-6c0-.414.336-.75.75-.75z"
              />
            </svg>
          </button>
          <button v-if="index > 0" class="remove-btn" @click.prevent="removePet(index)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <rect x="5" y="11" width="14" height="2" />
            </svg>
          </button>
        </div>

        <div class="pet-fields">
          <InputField
            v-model="pet.name"
            label="Name:"
            :name="`pet-name-${index}`"
            placeholder="Ex: Fluffy"
            required
            :hasError="
              (touched?.[`pet-name-${index}`] && !pet.name) || (hasAttemptedSubmit && !pet.name)
            "
          />
          <InputField
            v-model="pet.speciesBreedSize"
            label="Species, Breed and Size:"
            :name="`pet-breed-${index}`"
            placeholder="Ex: Dog, Boxer, 50lbs"
            required
            :hasError="
              (touched?.[`pet-breed-${index}`] && !pet.speciesBreedSize) ||
              (hasAttemptedSubmit && !pet.speciesBreedSize)
            "
          />
          <InputField
            v-model="pet.age"
            label="How long have you had this pet (and when did you get this pet)?:"
            :name="`pet-age-${index}`"
            placeholder="Ex: I've had him 10 years - from 2010 to Current"
            required
            :hasError="
              (touched?.[`pet-age-${index}`] && !pet.age) || (hasAttemptedSubmit && !pet.age)
            "
          />
          <InputField
            v-model="pet.likesDogs"
            :label="
              animalLabel === 'cat' ? 'Does this pet like other cats?' : 'Does this pet like dogs?'
            "
            :name="`pet-likes-dogs-${index}`"
            :placeholder="
              animalLabel === 'cat'
                ? 'Describe previous interactions with other cats'
                : 'Describe previous interactions with dogs'
            "
            :subtext="
              animalLabel === 'cat'
                ? 'Describe previous interactions with other cats'
                : 'Describe previous interactions with dogs'
            "
            required
            :hasError="
              (touched?.[`pet-likes-dogs-${index}`] && !pet.likesDogs) ||
              (hasAttemptedSubmit && !pet.likesDogs)
            "
          />
          <InputSelectGroup
            label="Where did you get this pet?"
            :options="['Friend/Family', 'Rescue', 'Shelter', 'Breeder', 'Online Ad', 'Found it']"
            :modelValue="pet.source"
            @update:modelValue="(val) => (pet.source = val as string)"
            :hasError="
              (touched?.[`pet-source-${index}`] && !pet.source) ||
              (hasAttemptedSubmit && !pet.source)
            "
          />
          <InputSelectGroup
            label="Is this pet spayed/neutered?"
            :options="['Yes', 'No', 'Not sure']"
            :modelValue="pet.spayedNeutered"
            @update:modelValue="(val) => (pet.spayedNeutered = val as string)"
            :hasError="
              (touched?.[`pet-spayed-${index}`] && !pet.spayedNeutered) ||
              (hasAttemptedSubmit && !pet.spayedNeutered)
            "
          />

          <hr class="pet-divider" v-if="index < modelValue.currentPets.length - 1" />
        </div>
      </div>

      <div v-if="modelValue.currentPets.length === 0" class="no-pets-placeholder">
        <button class="add-btn-large" @click.prevent="addPet">Add a Pet</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.current-pets-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (width <= 768px) {
  .current-pets-section {
    grid-template-columns: 1fr;
  }

  .desktop-spacer {
    display: none;
  }
}

.children {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.pet-entry {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pet-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pet-header h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.pet-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (width >= 768px) {
  .pet-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem 2rem;
    align-items: start;
  }
}

.pet-divider {
  border: 0;
  border-top: 2px solid #cbd5e1;
  margin: 2rem 0;
  grid-column: 1 / -1;
}

.add-btn,
.remove-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  transition: all var(--transition-normal);
}

.add-btn:hover {
  color: var(--color-secondary);
  border-color: var(--color-secondary);
  background: #f0f9ff;
}

.remove-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
  background: var(--color-white) 5f5;
}

.add-btn-large {
  padding: 12px 24px;
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
}
</style>
