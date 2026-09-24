<script setup lang="ts">
import InputSelectGroup from '@/components/common/ui/InputSelectGroup.vue'
import type { IFosterQuestion } from '@/models/foster-form'

defineProps<{
  question: IFosterQuestion
  modelValue: string
  hasError: boolean
  inputType: string
  questionLabel: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="question-card" :class="{ 'has-error': hasError }">
    <InputSelectGroup
      v-if="question.type === 'select'"
      :label="questionLabel"
      :options="question.options ?? []"
      :modelValue="modelValue"
      :hasError="hasError"
      @update:modelValue="(val) => emit('update:modelValue', String(val ?? ''))"
    />

    <template v-else>
      <label :for="question.id">
        {{ questionLabel }}
      </label>

      <textarea
        v-if="question.type === 'textarea'"
        :id="question.id"
        rows="3"
        :value="modelValue"
        :aria-invalid="hasError"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      ></textarea>

      <input
        v-else
        :id="question.id"
        :type="inputType"
        :value="modelValue"
        :aria-invalid="hasError"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </template>
  </div>
</template>

<style scoped lang="css">
.question-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  background-color: transparent;

  label {
    font-size: 1rem;
    line-height: 1.45;
    color: var(--text-primary);
  }

  input,
  select,
  textarea {
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
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 20%);
    }
  }

  textarea {
    min-height: 96px;
    resize: none;
  }

  &.has-error {
    input,
    select,
    textarea {
      border-color: var(--color-danger) !important;
      outline: 1px solid var(--color-danger);
    }
  }
}
</style>
