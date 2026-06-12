<script setup lang="ts">
import InputSignature from '@/components/common/ui/InputSignature.vue'
import type { IFosterQuestion } from '@/models/foster-form'

defineProps<{
  answers: Record<string, string>
  // eslint-disable-next-line no-unused-vars
  getVisibleQuestion: (id: string) => IFosterQuestion | undefined
  // eslint-disable-next-line no-unused-vars
  questionHasError: (question: IFosterQuestion) => boolean
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

      <article
        v-if="getVisibleQuestion('q94')"
        class="question-card"
        :class="{
          'has-error': questionHasError(getVisibleQuestion('q94')!),
        }"
      >
        <div class="agreement-ack-row">
          <div class="agreement-ack-item">
            <label for="q94">Type your name</label>
            <input
              id="q94"
              type="text"
              :value="answers.q94 ?? ''"
              :aria-invalid="questionHasError(getVisibleQuestion('q94')!)"
              @input="emit('update-answer', 'q94', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div
            v-if="getVisibleQuestion('q94_date')"
            class="agreement-ack-item"
            :class="{ 'has-error': questionHasError(getVisibleQuestion('q94_date')!) }"
          >
            <label for="q94_date">Date</label>
            <input
              id="q94_date"
              type="date"
              :value="answers.q94_date ?? ''"
              :aria-invalid="questionHasError(getVisibleQuestion('q94_date')!)"
              @input="emit('update-answer', 'q94_date', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </article>

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

      <article
        v-if="getVisibleQuestion('q95')"
        class="question-card"
        :class="{ 'has-error': questionHasError(getVisibleQuestion('q95')!) }"
      >
        <div class="agreement-ack-row">
          <div class="agreement-ack-item">
            <label for="q95">Type your name</label>
            <input
              id="q95"
              type="text"
              :value="answers.q95 ?? ''"
              :aria-invalid="questionHasError(getVisibleQuestion('q95')!)"
              @input="emit('update-answer', 'q95', ($event.target as HTMLInputElement).value)"
            />
          </div>

          <div
            v-if="getVisibleQuestion('q95_date')"
            class="agreement-ack-item"
            :class="{ 'has-error': questionHasError(getVisibleQuestion('q95_date')!) }"
          >
            <label for="q95_date">Date</label>
            <input
              id="q95_date"
              type="date"
              :value="answers.q95_date ?? ''"
              :aria-invalid="questionHasError(getVisibleQuestion('q95_date')!)"
              @input="emit('update-answer', 'q95_date', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </article>

      <article
        v-if="getVisibleQuestion('q100')"
        class="question-card signature-card"
        :class="{ 'has-error': questionHasError(getVisibleQuestion('q100')!) }"
      >
        <InputSignature
          label="Signature"
          :modelValue="answers.q100 ?? null"
          :hasError="questionHasError(getVisibleQuestion('q100')!)"
          @update:modelValue="(val) => emit('update-answer', 'q100', val ?? '')"
        />
      </article>
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
  gap: 8px;

  label {
    font-size: 1rem;
    color: var(--text-primary);
  }

  input {
    width: 100%;
    border: 1px solid var(--color-neutral-border);
    border-radius: var(--radius-md);
    padding: 12px 16px;
    font: inherit;
    font-size: 1rem;
    color: var(--text-primary);
    background-color: var(--color-white);
    box-shadow: var(--shadow-md);
    min-height: 48px;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 20%);
    }
  }

  &.has-error input {
    border-color: var(--color-danger) !important;
    outline: 1px solid var(--color-danger);
  }
}
</style>
