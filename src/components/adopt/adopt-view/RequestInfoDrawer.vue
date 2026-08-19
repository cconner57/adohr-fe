<script setup lang="ts">
import { computed, ref } from 'vue'

import { usePetInquiry } from '@/composables/usePetInquiry'
import type { IPet } from '@/models/common'
import { formatPhoneNumber } from '@/utils/validators'

import Drawer from '../../common/drawer/Drawer.vue'
import Button from '../../common/ui/Button.vue'
import InputField from '../../common/ui/InputField.vue'

const { pet, isDrawerOpen } = defineProps<{
  pet: IPet
  isDrawerOpen: boolean
}>()

const emit = defineEmits(['update:isDrawerOpen'])

const { formData, isSubmitting, isSubmitted, apiError, submitInquiry } = usePetInquiry(
  pet,
  'request_info',
)

const message = ref('')
const hasAttemptedSubmit = ref(false)

const isEmailValid = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const hasCompletePhone = computed(() => {
  return formData.phone.replace(/\D/g, '').length === 10
})

const validationErrors = computed(() => {
  const errors: string[] = []

  if (!formData.firstName.trim()) {
    errors.push('First name is required.')
  }

  if (!formData.lastName.trim()) {
    errors.push('Last name is required.')
  }

  if (!formData.email.trim()) {
    errors.push('Email is required.')
  } else if (!isEmailValid(formData.email.trim())) {
    errors.push('Enter a valid email address.')
  }

  if (formData.phone.trim() && !hasCompletePhone.value) {
    errors.push('Enter a complete phone number.')
  }

  if (!message.value.trim()) {
    errors.push('Message is required.')
  }

  return errors
})

const hasFieldError = (field: string) => {
  if (!hasAttemptedSubmit.value) {
    return false
  }

  switch (field) {
    case 'firstName':
      return !formData.firstName.trim()
    case 'lastName':
      return !formData.lastName.trim()
    case 'email':
      return !formData.email.trim() || !isEmailValid(formData.email.trim())
    case 'phone':
      return formData.phone.trim().length > 0 && !hasCompletePhone.value
    case 'message':
      return !message.value.trim()
    default:
      return false
  }
}

const updatePhone = (value: string | number | null) => {
  formData.phone = formatPhoneNumber(value)
}

const closeDrawer = () => {
  emit('update:isDrawerOpen', false)
}

const submitForm = async () => {
  hasAttemptedSubmit.value = true

  if (validationErrors.value.length > 0) {
    return
  }

  await submitInquiry({ message: message.value.trim() })
}
</script>

<template>
  <Drawer
    :modelValue="isDrawerOpen"
    @update:modelValue="closeDrawer"
    :header="'Request Information'"
  >
    <div v-if="isSubmitted" class="success">
      <div class="success__icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="success__icon"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h3 class="success__title">Message Sent!</h3>
      <p class="success__message">Thank you! We'll get back to you as soon as possible.</p>
    </div>

    <template v-else>
      <p>
        Have a question about <strong>{{ pet.name }}</strong
        >? Fill out the form below and one of our team members will get back to you as soon as
        possible.
      </p>

      <form @submit.prevent>
        <InputField
          label="First Name"
          placeholder="Enter your first name"
          type="text"
          v-model="formData.firstName"
          required
          :hasError="hasFieldError('firstName')"
        />
        <InputField
          label="Last Name"
          placeholder="Enter your last name"
          type="text"
          v-model="formData.lastName"
          required
          :hasError="hasFieldError('lastName')"
        />
        <InputField
          label="Email"
          placeholder="Enter your email"
          type="email"
          v-model="formData.email"
          required
          :hasError="hasFieldError('email')"
        />
        <InputField
          label="Phone (optional)"
          placeholder="Enter your phone number"
          type="tel"
          v-model="formData.phone"
          inputmode="tel"
          maxlength="12"
          :hasError="hasFieldError('phone')"
          @update:modelValue="updatePhone"
        />
        <div class="field">
          <label class="label" for="request-info-message">Message</label>
          <textarea
            id="request-info-message"
            v-model="message"
            :class="{ 'has-error': hasFieldError('message') }"
            placeholder="Enter your question or message"
            rows="5"
          ></textarea>
        </div>
      </form>

      <div v-if="hasAttemptedSubmit && validationErrors.length > 0" class="validation-summary">
        <p class="summary-title">Please complete all required fields:</p>
        <p class="summary-copy">{{ validationErrors[0] }}</p>
      </div>

      <p v-if="apiError" class="error">{{ apiError }}</p>

      <p class="footer-note">We look forward to helping you find your new best friend!</p>

      <div class="actions">
        <Button
          title="Submit"
          color="green"
          @click="submitForm()"
          :loading="isSubmitting"
          :fullWidth="true"
        />
      </div>
    </template>
  </Drawer>
</template>

<style scoped lang="css">
p {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-weight: 300;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  color: var(--text-primary);
  font-size: 1rem;
}

textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  font-size: 1rem;
  font-family: inherit;
  resize: none;
  background-color: var(--color-white);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 20%);
}

textarea.has-error {
  border-color: var(--color-danger);
  outline: 1px solid var(--color-danger);
}

.error {
  color: var(--color-danger);
  font-weight: 400;
  margin-bottom: 1rem;
}

.validation-summary {
  margin-bottom: 1rem;
}

.summary-title,
.summary-copy {
  color: var(--color-danger);
  font-weight: 400;
}

.summary-title {
  margin-bottom: 0.25rem;
}

.summary-copy {
  margin-bottom: 0;
}

.footer-note {
  text-align: center;
  margin-bottom: 0;
}

.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success__icon-wrapper {
  color: #fff;
  background-color: #0f766e;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 12px 30px rgb(15 118 110 / 25%);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
}

.success__icon {
  width: 48px;
  height: 48px;
  color: inherit;
}

.success__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.success__message {
  color: #4b5563;
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 300px;
  margin: 0;
  font-weight: 300;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
</style>
