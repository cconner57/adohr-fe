<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useAdoptionStore } from '../../../stores/adoption'
import InputField from '../../common/ui/InputField.vue'
import InputSignature from '../../common/ui/InputSignature.vue'

const props = withDefaults(
  defineProps<{
    touched: Record<string, boolean>
    // eslint-disable-next-line no-unused-vars
    handleBlur: (_field: string) => void
    hasAttemptedSubmit?: boolean
    animalLabel?: string
  }>(),
  {
    hasAttemptedSubmit: false,
    animalLabel: 'cat',
  },
)

const adoptionStore = useAdoptionStore()
const { formState } = storeToRefs(adoptionStore)

const normalizeTypedName = (value: string | null) => {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
}

const typedNamesDoNotMatch = computed(() => {
  const firstTypedName = normalizeTypedName(formState.value.agreementSignature1)
  const secondTypedName = normalizeTypedName(formState.value.agreementSignature2)
  return !!firstTypedName && !!secondTypedName && firstTypedName !== secondTypedName
})

const showTypedNameMismatch = computed(() => {
  return (
    typedNamesDoNotMatch.value &&
    (!!props.hasAttemptedSubmit || !!props.touched.agreementSignature2)
  )
})
</script>

<template>
  <div class="summary-section">
    <h2 class="section-title">Adoption Agreement & Acknowledgments</h2>
    <p>
      Thank you for the time to complete this application. Please note: Filling out this application
      does not guarantee an adoption. We have thoroughly evaluated all of the animals in our care,
      and try very hard to match the right pet to the right person and situation. Adoptions are not
      on a first-come-first-served basis. We reserve the right not to adopt. Please remember that we
      are all volunteers and work regular full-time jobs like everyone else. We will reply to your
      application as soon as it has been processed (normally 3-4 days). Thank you for considering a
      rescue {{ props.animalLabel }}!
    </p>

    <p>
      You are making a major commitment when you adopt any pet. Please remember that
      {{ props.animalLabel === 'dog' ? 'dogs' : 'cats' }} can live for up to
      {{ props.animalLabel === 'dog' ? '15' : '20' }} or more years. Thousands of
      {{ props.animalLabel === 'dog' ? 'dogs' : 'cats' }} are killed at animal shelters each year because
      their owners did not plan for the future. {{ props.animalLabel === 'dog' ? 'Dogs' : 'Cats' }} can
      get sick and require expensive medical treatment during the course of their life.
      {{ props.animalLabel === 'dog' ? 'Dogs' : 'Cats' }} need affection, attention and understanding. You
      may have to adjust your lifestyle to accommodate a new pet. If you are ready to make this
      commitment, please type your name below:
    </p>
    <InputField
      v-model="formState.agreementSignature1"
      label="Type your name"
      name="agreementSignature1"
      placeholder="Type full name to acknowledge"
      required
      :hasError="
        (props.touched.agreementSignature1 && !formState.agreementSignature1) ||
        (props.hasAttemptedSubmit && !formState.agreementSignature1)
      "
      @blur="props.handleBlur('agreementSignature1')"
    />
    <p>
      Adoptions require a homecheck/delivery, in the event that my application is accepted, I agree
      and consent to have a volunteer deliver the pet to my home and inspect my indoor and outdoor
      space for safety. All members of the household - including roommates and children - must be
      present for the homecheck/delivery. If you understand and agree, please type your name below:
    </p>
    <InputField
      v-model="formState.agreementSignature2"
      label="Type your name"
      name="agreementSignature2"
      placeholder="Type full name to consent"
      required
      :hasError="
        (props.touched.agreementSignature2 && !formState.agreementSignature2) ||
        (props.hasAttemptedSubmit && !formState.agreementSignature2) ||
        showTypedNameMismatch
      "
      @blur="props.handleBlur('agreementSignature2')"
    />
    <p v-if="showTypedNameMismatch" class="field-error">Both typed names must match exactly.</p>

    <InputSignature
      label="Signature"
      :modelValue="formState.signatureData"
      @update:modelValue="(val) => (formState.signatureData = val)"
      :hasError="
        (props.touched.signatureData && !formState.signatureData) ||
        (props.hasAttemptedSubmit && !formState.signatureData)
      "
    />
  </div>
</template>

<style scoped lang="css">
.summary-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 0;
}

p {
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 1rem;
  max-width: 100%;
  font-weight: 400;
}

p:has(+ .field),
p:last-of-type {
  font-weight: 400;
  margin-bottom: -1rem;
}

.field-error {
  margin-top: -1.2rem;
  color: var(--color-danger);
  font-weight: 600;
  font-size: 0.95rem;
}
</style>
