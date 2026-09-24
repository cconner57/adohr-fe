<script setup lang="ts">
import InputField from '@/components/common/ui/InputField.vue'
import InputSignature from '@/components/common/ui/InputSignature.vue'

defineProps<{
  answers: Record<string, string>
  errors?: Record<string, boolean>
}>()

const emit = defineEmits<{
  'update-answer': [id: string, value: string]
}>()
</script>

<template>
  <div class="agreement-content">
    <div class="agreement-copy">
      <p>
        I certify that all information submitted in this foster application is true, complete, and
        accurate to the best of my knowledge. I confirm that I am at least 18 years old and
        understand that any material omission or misrepresentation may result in denial, removal of
        a foster animal, or termination of foster participation at ADOHR's sole discretion. I
        understand that fostering may be costly and time intensive, and that I may incur
        out-of-pocket expenses, including urgent care expenses, unless reimbursement is expressly
        authorized in writing by ADOHR in advance. If you understand and agree, please type your
        full name below.
      </p>

      <div class="agreement-card">
        <div class="agreement-ack-row">
          <div class="agreement-ack-item">
            <InputField
              id="q94"
              name="q94"
              label="Type your name"
              placeholder="Full legal name"
              :modelValue="answers.q94 ?? ''"
              :hasError="!!errors?.q94"
              @update:modelValue="(val) => emit('update-answer', 'q94', String(val ?? ''))"
            />
          </div>

          <div class="agreement-ack-item">
            <InputField
              id="q94_date"
              name="q94_date"
              type="date"
              label="Date"
              placeholder="YYYY-MM-DD"
              :modelValue="answers.q94_date ?? ''"
              :hasError="!!errors?.q94_date"
              @update:modelValue="(val) => emit('update-answer', 'q94_date', String(val ?? ''))"
            />
          </div>
        </div>
      </div>

      <p>
        If approved as a foster, I agree to follow all ADOHR policies and instructions, maintain
        safe control of the foster pet, and communicate promptly regarding behavior, health,
        injuries, incidents, escapes, and emergencies. I understand that fostering a dog or cat may
        involve bites, scratches, zoonotic disease exposure, property damage, conflict with resident
        pets, and emotionally difficult outcomes, including severe illness or death. To the fullest
        extent permitted by law, I voluntarily assume all risks related to fostering and agree to
        release, defend, indemnify, and hold harmless ADOHR, its officers, directors, volunteers,
        partners, and representatives from any and all claims, demands, actions, damages, losses,
        liabilities, judgments, and expenses (including reasonable attorneys' fees) arising out of
        or related to my fostering activities, except to the extent caused by ADOHR's gross
        negligence or willful misconduct. If you understand and agree, please type your full name
        below.
      </p>

      <div class="agreement-card">
        <div class="agreement-ack-row">
          <div class="agreement-ack-item">
            <InputField
              id="q95"
              name="q95"
              label="Type your name"
              placeholder="Full legal name"
              :modelValue="answers.q95 ?? ''"
              :hasError="!!errors?.q95"
              @update:modelValue="(val) => emit('update-answer', 'q95', String(val ?? ''))"
            />
          </div>

          <div class="agreement-ack-item">
            <InputField
              id="q95_date"
              name="q95_date"
              type="date"
              label="Date"
              placeholder="YYYY-MM-DD"
              :modelValue="answers.q95_date ?? ''"
              :hasError="!!errors?.q95_date"
              @update:modelValue="(val) => emit('update-answer', 'q95_date', String(val ?? ''))"
            />
          </div>
        </div>
      </div>

      <div class="agreement-card signature-card">
        <InputSignature
          id="fosterSignature"
          label="Signature"
          :modelValue="answers.q100 ?? null"
          :hasError="!!errors?.q100"
          @update:modelValue="(val) => emit('update-answer', 'q100', val ?? '')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.agreement-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.agreement-copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 840px;
  margin: 0 auto;

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-primary);
  }
}

.signature-card {
  margin-top: 8px;
}

.agreement-ack-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;

  @media (width <= 860px) {
    grid-template-columns: 1fr;
  }
}

.agreement-ack-item {
  display: flex;
  flex-direction: column;
}
</style>
