<script setup lang="ts">
import InputField from '../../common/ui/InputField.vue'
import InputSignature from '../../common/ui/InputSignature.vue'

defineProps<{
  age: number | null
  fullName: string
  name: string
  parentDate: string
  parentName: string
  parentSignature: string | null
  signature: string | null
  signatureDate: string
  hasNameError?: boolean
  hasDateError?: boolean
  hasSignatureError?: boolean
  hasParentNameError?: boolean
  hasParentDateError?: boolean
  hasParentSignatureError?: boolean
}>()

const emit = defineEmits<{
  'update:fullName': [value: string]
  'update:parentName': [value: string]
  'update:signature': [value: string | null]
  'update:signatureDate': [value: string]
  'update:parentSignature': [value: string | null]
  'update:parentDate': [value: string]
}>()
</script>

<template>
  <div class="waiver-container">
    <p class="waiver">
      I, {{ name === ' ' ? '(volunteer name)' : name }}, agree to volunteer with A Dream of Home
      Rescue (ADOHR) and abide by its policies. I understand that animal handling involves risks of
      injury (e.g., bites, scratches) and illness, and I assume full responsibility for these risks.
      I hereby release and forever discharge ADOHR, its board, and affiliates from any claims,
      demands, or causes of action arising from my service. In an emergency, I authorize ADOHR to
      seek medical treatment on my behalf. I further grant ADOHR the right to use photos or videos
      of me for promotional or social media purposes.
    </p>

    <div class="acknowledgement">
      <div class="name-date-container">
        <InputField
          label="Name"
          placeholder=""
          :modelValue="fullName"
          @update:modelValue="(val) => emit('update:fullName', String(val))"
          :hasError="hasNameError"
        />
        <InputField
          label="Date"
          placeholder=""
          type="date"
          :modelValue="signatureDate"
          @update:modelValue="(val) => emit('update:signatureDate', String(val))"
          :hasError="hasDateError"
        />
      </div>
      <InputSignature
        label="Signature"
        placeholder=""
        :modelValue="signature"
        @update:modelValue="(val) => emit('update:signature', val)"
        :hasError="hasSignatureError"
      />
    </div>

    <label v-if="age !== null && age < 21" for="parental-consent" class="label"
      >If under 21, I ({{ parentName === '' ? 'parent/guardian name' : parentName }}) give
      permission for my child to volunteer with ADOHR and agree to the above waiver.</label
    >
    <div v-if="age !== null && age < 21" class="parentGuardian">
      <div class="name-date-container">
        <InputField
          label="Parent/Guardian Name"
          placeholder=""
          :modelValue="parentName"
          @update:modelValue="(val) => emit('update:parentName', String(val))"
          :hasError="hasParentNameError"
        />
        <InputField
          label="Date"
          placeholder=""
          type="date"
          :modelValue="parentDate"
          @update:modelValue="(val) => emit('update:parentDate', String(val))"
          :hasError="hasParentDateError"
        />
      </div>
      <InputSignature
        label="Parent/Guardian Signature"
        placeholder=""
        :modelValue="parentSignature"
        @update:modelValue="(val) => emit('update:parentSignature', val)"
        :hasError="hasParentSignatureError"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
.waiver-container {
  margin-bottom: 24px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;

  & .acknowledgement,
  .parentGuardian {
    display: flex;
    flex-direction: column;
    grid-column: 1 / -1;
    gap: 16px;

    & .name-date-container {
      display: flex;
      gap: 12px;

      & > :nth-child(1) {
        flex: 1;
      }

      & > :nth-child(2) {
        flex: 0 0 33%;
      }
    }

    @media (width <= 440px) {
      .name-date-container {
        flex-direction: column;
        gap: 0;

        & > :nth-child(2) {
          flex: none;
        }
      }
    }
  }

  label {
    border-top: 2px solid #808080;
    padding-top: 12px;
    margin-top: 12px;
    font-weight: 400;
    grid-column: 1 / -1;
    text-align: center;
  }

  @media (width <= 440px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 8px;
  }
}

.waiver {
  color: #000;
  background: var(--color-white);
  border: 1px dashed #cfe2ff;
  padding: 12px;
  border-radius: 10px;
  font-size: 1rem;
  box-shadow: var(--shadow-md);
  line-height: 1.4;
  margin-bottom: 12px;
  width: 100%;
  max-width: 100%;
  grid-column: 1 / -1;

  @media (width <= 440px) {
    font-size: 0.9rem;
  }
}
</style>
