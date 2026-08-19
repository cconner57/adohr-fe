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
  'schedule_meet',
)

const preferredDate = ref('')
const preferredTime = ref('')
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

  if (!formData.phone.trim()) {
    errors.push('Phone number is required.')
  } else if (!hasCompletePhone.value) {
    errors.push('Enter a complete phone number.')
  }

  if (!preferredDate.value) {
    errors.push('Preferred date is required.')
  }

  if (!preferredTime.value) {
    errors.push('Preferred time is required.')
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
      return !formData.phone.trim() || !hasCompletePhone.value
    case 'preferredDate':
      return !preferredDate.value
    case 'preferredTime':
      return !preferredTime.value
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

  await submitInquiry({
    message: `Preferred Date: ${preferredDate.value}\nPreferred Time: ${preferredTime.value}`,
  })
}
</script>

<template>
  <Drawer :modelValue="isDrawerOpen" @update:modelValue="closeDrawer" :header="`Schedule a Meet`">
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
      <h3 class="success__title">Request Sent!</h3>
      <p class="success__message">
        Thank you! One of our volunteers will reach out to schedule your meet and greet.
      </p>
    </div>

    <template v-else>
      <p>
        We’re excited to help you meet <strong>{{ pet.name }}</strong
        >! Our friendly volunteers are here to assist you in setting up a meet and greet. You’re
        welcome to visit our shelter during these hours:
      </p>
      <ul>
        <li><strong>Monday through Friday</strong><br />10am to 12pm and 6pm to 8pm</li>
        <li><strong>Weekends</strong><br />12pm to 4pm</li>
      </ul>
      <p>
        If these times don’t work for you, no problem! Simply fill out the form below, and one of
        our volunteers will get in touch with you as soon as possible to arrange a time that works
        best for you.
      </p>

      <form @submit.prevent="submitForm">
        <InputField
          label="Your First Name:"
          placeholder="Enter your first name"
          type="text"
          v-model="formData.firstName"
          required
          :hasError="hasFieldError('firstName')"
        />
        <InputField
          label="Your Last Name:"
          placeholder="Enter your last name"
          type="text"
          v-model="formData.lastName"
          required
          :hasError="hasFieldError('lastName')"
        />
        <InputField
          label="Your Email:"
          placeholder="Enter your email"
          type="email"
          v-model="formData.email"
          required
          :hasError="hasFieldError('email')"
        />
        <InputField
          label="Your Phone Number:"
          placeholder="Enter your phone number"
          type="tel"
          v-model="formData.phone"
          inputmode="tel"
          required
          :hasError="hasFieldError('phone')"
          @update:modelValue="updatePhone"
        />
        <InputField
          label="Preferred Date:"
          placeholder="Select a preferred date"
          type="date"
          v-model="preferredDate"
          required
          :hasError="hasFieldError('preferredDate')"
          openPickerOnFocus
        />
        <InputField
          label="Preferred Time:"
          placeholder="Select a preferred time"
          type="time"
          v-model="preferredTime"
          required
          :hasError="hasFieldError('preferredTime')"
          openPickerOnFocus
        />
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
          type="submit"
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
  font-weight: 400;
  line-height: 1.6;
}

ul {
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;
  color: var(--text-primary);
}

li {
  padding: 0.6rem 0;
  margin-bottom: 0;
  border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

  &:last-child {
    border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  }
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
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
  color: var(--text-inverse);
  background-color: var(--color-primary);
  width: 92px;
  height: 104px;
  border-radius: var(--radius-arch, 999px 999px var(--radius-lg) var(--radius-lg));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-lg);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both;
}

.success__icon {
  width: 44px;
  height: 44px;
  color: inherit;
}

.success__title {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.success__message {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 300px;
  margin: 0;
  font-weight: 400;
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
