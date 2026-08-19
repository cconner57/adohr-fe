<script setup lang="ts">
import { onMounted } from 'vue'

import type { SurrenderFormState } from '../../../models/surrender-form.ts'
import ButtonToggle from '../../common/ui/ButtonToggle.vue'
import InputGrid from '../../common/ui/InputGrid.vue'
import InputSelectGroup from '../../common/ui/InputSelectGroup.vue'
import InputTextArea from '../../common/ui/InputTextArea.vue'

const { formState, touched, handleBlur, hasAttemptedSubmit, selectedAnimal } = defineProps<{
  formState: SurrenderFormState
  touched: Record<string, boolean>
  handleBlur: (_field: string) => void // eslint-disable-line no-unused-vars
  hasAttemptedSubmit: boolean
  selectedAnimal: string
}>()

const peopleRows = ['men', 'women', 'children']
const peopleColumns = [
  'never encounter',
  'friendly',
  'afraid',
  'show teeth/growl',
  'snaps',
  'bites',
  'other',
]

const unknownsRows = ['dogs', 'cats']
const unknownsColumns = [
  'never encounter',
  'friendly',
  'afraid',
  'show teeth/growl',
  'snaps',
  'bites',
  'other',
]

const knownsRows = ['dogs', 'cats']
const knownsColumns = [
  'never encounter',
  'friendly',
  'afraid',
  'show teeth/hiss',
  'snaps',
  'bites',
  'other',
]

onMounted(() => {
  const toggleFields: (
    | 'animalScaredOfAnything'
    | 'animalAllowedOnFurniture'
    | 'animalEscapedBefore'
    | 'animalProblemsRidingInCar'
  )[] = ['animalScaredOfAnything', 'animalAllowedOnFurniture', 'animalEscapedBefore']

  toggleFields.forEach((field) => {
    if (!formState[field]) {
      formState[field] = 'No'
    }
  })

  const gridInits: {
    field:
      | 'animalsBehaviorTowardsKnownPeople'
      | 'animalsBehaviorTowardsStrangers'
      | 'animalsBehaviorTowardsKnownAnimals'
    rows: string[]
  }[] = [
    { field: 'animalsBehaviorTowardsKnownPeople', rows: peopleRows },
    { field: 'animalsBehaviorTowardsStrangers', rows: unknownsRows },
    { field: 'animalsBehaviorTowardsKnownAnimals', rows: knownsRows },
  ]

  gridInits.forEach(({ field, rows }) => {
    if (!formState[field]) {
      const initialGridState: Record<string, string[]> = {}
      rows.forEach((row) => {
        initialGridState[row] = ['other']
      })

      formState[field] = JSON.stringify(initialGridState)
    }
  })
})
</script>

<template>
  <div class="behavior-section">
    <h2 class="section-title">Behavior</h2>
    <div class="behavior-grid">
      <InputGrid
        :label="`How does the ${selectedAnimal.toLowerCase()} usually behave towards people they do know?`"
        :rows="peopleRows"
        :columns="peopleColumns"
        :modelValue="formState.animalsBehaviorTowardsKnownPeople"
        @update:modelValue="(val) => (formState.animalsBehaviorTowardsKnownPeople = val)"
        :exclusiveOptions="['none of these', 'never encounter']"
        :singleSelect="true"
      />
      <InputGrid
        :label="`How does the ${selectedAnimal.toLowerCase()} usually behave towards animals they do not know?`"
        :rows="unknownsRows"
        :columns="unknownsColumns"
        :modelValue="formState.animalsBehaviorTowardsStrangers"
        @update:modelValue="(val) => (formState.animalsBehaviorTowardsStrangers = val)"
        :exclusiveOptions="['none of these', 'never encounter']"
        :singleSelect="true"
      />
      <InputGrid
        :label="`How does the ${selectedAnimal.toLowerCase()} usually behave towards animals they know`"
        :rows="knownsRows"
        :columns="knownsColumns"
        :modelValue="formState.animalsBehaviorTowardsKnownAnimals"
        @update:modelValue="(val) => (formState.animalsBehaviorTowardsKnownAnimals = val)"
        :exclusiveOptions="['none of these', 'never encounter']"
        :singleSelect="true"
      />
      <InputTextArea
        label="Comments on answers above"
        placeholder="Any comments"
        :spanFull="false"
        :modelValue="formState.commentsOnBehavior"
        @update:modelValue="(val) => (formState.commentsOnBehavior = val || '')"
      />
      <InputSelectGroup
        :label="`How does the ${selectedAnimal.toLowerCase()} usually react when an unfamiliar person approaches or enters the yard or house?`"
        :options="['Friendly', 'Afraid', 'Barks', 'Shows Teeth/Hisses', 'Will Bite/Scratch']"
        :modelValue="formState.animalsReactionToNewPeople"
        @update:modelValue="(val) => (formState.animalsReactionToNewPeople = val as string)"
        :hasError="
          (touched.animalsReactionToNewPeople && !formState.animalsReactionToNewPeople) ||
          (hasAttemptedSubmit && !formState.animalsReactionToNewPeople)
        "
        @blur="handleBlur('animalsReactionToNewPeople')"
        :multiple="true"
      />
      <InputSelectGroup
        :label="`Is the ${selectedAnimal.toLowerCase()} housetrained?`"
        :options="['Yes', 'No', 'Partially']"
        :modelValue="formState.animalHouseTrained"
        @update:modelValue="(val) => (formState.animalHouseTrained = val as string)"
        :hasError="
          (touched.animalHouseTrained && !formState.animalHouseTrained) ||
          (hasAttemptedSubmit && !formState.animalHouseTrained)
        "
        @blur="handleBlur('animalHouseTrained')"
      />
      <InputSelectGroup
        :label="`Where does the ${selectedAnimal.toLowerCase()} spend the majority of their time?`"
        :options="[
          'Inside the house, runs free',
          'Inside the house, crated',
          'Outside the house, runs free in yard',
          'Outside the house, kennel',
          'Outside the house, tied up',
          'Other',
        ]"
        :modelValue="formState.animalSpendMajorityOfTime"
        @update:modelValue="(val) => (formState.animalSpendMajorityOfTime = val as string)"
        :hasError="
          (touched.animalSpendMajorityOfTime && !formState.animalSpendMajorityOfTime) ||
          (hasAttemptedSubmit && !formState.animalSpendMajorityOfTime)
        "
        @blur="handleBlur('animalSpendMajorityOfTime')"
      />
      <InputSelectGroup
        :label="`How many hours a day is the ${selectedAnimal.toLowerCase()} left alone without a human?`"
        :options="['Never', '1-3 hours', '4-8 hours', '9-12 hours', 'Over 12 hours']"
        :modelValue="formState.animalLeftAloneDuration"
        @update:modelValue="(val) => (formState.animalLeftAloneDuration = val as string)"
        :hasError="
          (touched.animalLeftAloneDuration && !formState.animalLeftAloneDuration) ||
          (hasAttemptedSubmit && !formState.animalLeftAloneDuration)
        "
        @blur="handleBlur('animalLeftAloneDuration')"
      />
      <InputSelectGroup
        :label="`When left alone, is he/she...`"
        :options="['Outdoors', 'Free roam in home', 'Confined to a room', 'Crated', 'Other']"
        :modelValue="formState.animalWhenLeftAlone"
        @update:modelValue="(val) => (formState.animalWhenLeftAlone = val as string)"
        :hasError="
          (touched.animalWhenLeftAlone && !formState.animalWhenLeftAlone) ||
          (hasAttemptedSubmit && !formState.animalWhenLeftAlone)
        "
        @blur="handleBlur('animalWhenLeftAlone')"
      />
      <InputSelectGroup
        :label="`When left alone, does the ${selectedAnimal.toLowerCase()} usually show any of the following behaviors?`"
        :options="['Destroy household items', 'Urinate/Deficate', 'Cry', 'None of these', 'Other']"
        :modelValue="formState.animalLeftAloneBehaviors"
        @update:modelValue="(val) => (formState.animalLeftAloneBehaviors = val as string)"
        :hasError="
          (touched.animalLeftAloneBehaviors && !formState.animalLeftAloneBehaviors) ||
          (hasAttemptedSubmit && !formState.animalLeftAloneBehaviors)
        "
        @blur="handleBlur('animalLeftAloneBehaviors')"
        :multiple="true"
      />
      <InputSelectGroup
        :label="`When the ${selectedAnimal.toLowerCase()} plays, do they typically...`"
        :options="['Jumps', 'Hiss', 'Bites lightly', 'Bites hard', 'None of these', 'Other']"
        :modelValue="formState.animalHowItPlays"
        @update:modelValue="(val) => (formState.animalHowItPlays = val as string)"
        :hasError="
          (touched.animalHowItPlays && !formState.animalHowItPlays) ||
          (hasAttemptedSubmit && !formState.animalHowItPlays)
        "
        @blur="handleBlur('animalHowItPlays')"
        :multiple="true"
      />
      <InputSelectGroup
        :label="`What toys does the ${selectedAnimal.toLowerCase()} like?`"
        :options="['Balls', 'Plush', 'Squeaky', 'Tug toy', 'None', 'Other']"
        :modelValue="formState.animalToysItLikes"
        @update:modelValue="(val) => (formState.animalToysItLikes = val as string)"
        :hasError="
          (touched.animalToysItLikes && !formState.animalToysItLikes) ||
          (hasAttemptedSubmit && !formState.animalToysItLikes)
        "
        @blur="handleBlur('animalToysItLikes')"
        :multiple="true"
      />
      <InputSelectGroup
        :label="`What games does the ${selectedAnimal.toLowerCase()} like?`"
        :options="['Tug', 'Chase', 'Wrestling', 'None', 'Other']"
        :modelValue="formState.animalGamesItLikes"
        @update:modelValue="(val) => (formState.animalGamesItLikes = val as string)"
        :hasError="
          (touched.animalGamesItLikes && !formState.animalGamesItLikes) ||
          (hasAttemptedSubmit && !formState.animalGamesItLikes)
        "
        @blur="handleBlur('animalGamesItLikes')"
        :multiple="true"
      />
      <ButtonToggle
        :label="`Is the ${selectedAnimal.toLowerCase()} scared of anything?`"
        :modelValue="formState.animalScaredOfAnything"
        @update:modelValue="(val) => (formState.animalScaredOfAnything = val as string)"
      />
      <InputTextArea
        :label="`If yes, please explain`"
        placeholder="Explanation"
        :spanFull="false"
        :modelValue="formState.animalScaredOfAnythingExplanation"
        @update:modelValue="(val) => (formState.animalScaredOfAnythingExplanation = val || '')"
      />
      <InputTextArea
        :label="`Please tell us the ${selectedAnimal.toLowerCase()} bad habits`"
        placeholder="Describe habits"
        :spanFull="false"
        :modelValue="formState.animalBadHabits"
        @update:modelValue="(val) => (formState.animalBadHabits = val || '')"
      />
      <ButtonToggle
        :label="`Is the ${selectedAnimal.toLowerCase()} allowed on furniture?`"
        :modelValue="formState.animalAllowedOnFurniture"
        @update:modelValue="(val) => (formState.animalAllowedOnFurniture = val as string)"
      />
      <InputSelectGroup
        :label="`Where does the ${selectedAnimal.toLowerCase()} usually sleep at overnight?`"
        :options="[
          'Crate',
          'Floor',
          'Your bed',
          'Couch',
          'Kids bed',
          'Cat bed',
          'Outside',
          'Other',
        ]"
        :modelValue="formState.animalSleepAtNight"
        @update:modelValue="(val) => (formState.animalSleepAtNight = val as string)"
        :hasError="
          (touched.animalSleepAtNight && !formState.animalSleepAtNight) ||
          (hasAttemptedSubmit && !formState.animalSleepAtNight)
        "
        @blur="handleBlur('animalSleepAtNight')"
        :multiple="true"
      />
      <InputTextArea
        :label="`Describe the ${selectedAnimal.toLowerCase()} reaction if a person or other cat gets near or attempts to take food he/she is eating`"
        placeholder="Describe reaction"
        :spanFull="false"
        :modelValue="formState.animalBehaviorFoodOthers"
        @update:modelValue="(val) => (formState.animalBehaviorFoodOthers = val || '')"
      />
      <InputSelectGroup
        :label="`Does the ${selectedAnimal.toLowerCase()} have problems riding in cars?`"
        :options="['Yes', 'No', 'Don\'t know']"
        :modelValue="formState.animalProblemsRidingInCar"
        @update:modelValue="(val) => (formState.animalProblemsRidingInCar = val as string)"
        :hasError="
          (touched.animalProblemsRidingInCar && !formState.animalProblemsRidingInCar) ||
          (hasAttemptedSubmit && !formState.animalProblemsRidingInCar)
        "
        @blur="handleBlur('animalProblemsRidingInCar')"
      />
      <InputTextArea
        label="`If yes, please explain`"
        placeholder="Explanation"
        :spanFull="false"
        :modelValue="formState.animalProblemsRidingInCarExplanation"
        @update:modelValue="(val) => (formState.animalProblemsRidingInCarExplanation = val || '')"
      />
      <ButtonToggle
        label="Has the pet escaped your property 2 or more times in the last 6 months?"
        :modelValue="formState.animalEscapedBefore"
        @update:modelValue="(val) => (formState.animalEscapedBefore = val as string)"
      />
      <InputTextArea
        label="If yes, please explain"
        placeholder="Explanation"
        :spanFull="false"
        :modelValue="formState.animalEscapedBeforeExplanation"
        @update:modelValue="(val) => (formState.animalEscapedBeforeExplanation = val || '')"
      />
      <InputTextArea
        label="Describe the pets reaction if a person or other cat attempts to take a toy they are playing with"
        placeholder="Describe reaction"
        :spanFull="false"
        :modelValue="formState.animalBehaviorToysOthers"
        @update:modelValue="(val) => (formState.animalBehaviorToysOthers = val || '')"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
.behavior-section h5 {
  margin-bottom: 24px;
}

.behavior-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (width >= 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;
  }
}

.full-width {
  @media (width >= 768px) {
    grid-column: 1 / -1;
  }
}
</style>
