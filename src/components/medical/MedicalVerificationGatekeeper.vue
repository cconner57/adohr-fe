<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import Button from '@/components/common/ui/Button.vue'
import InputField from '@/components/common/ui/InputField.vue'
import Select from '@/components/common/ui/Select.vue'
import type { IMedicalVerificationForm } from '@/models/common'
import { formatPhoneNumber } from '@/utils/validators'

const props = defineProps<{
  petName?: string
  isVerifying?: boolean
  errorMessage?: string | null
}>()

const emit = defineEmits<{
  verify: [form: IMedicalVerificationForm]
  'scroll-faq': []
}>()

const currentYear = new Date().getFullYear()

const monthOptions = [
  { label: 'January (01)', value: '01' },
  { label: 'February (02)', value: '02' },
  { label: 'March (03)', value: '03' },
  { label: 'April (04)', value: '04' },
  { label: 'May (05)', value: '05' },
  { label: 'June (06)', value: '06' },
  { label: 'July (07)', value: '07' },
  { label: 'August (08)', value: '08' },
  { label: 'September (09)', value: '09' },
  { label: 'October (10)', value: '10' },
  { label: 'November (11)', value: '11' },
  { label: 'December (12)', value: '12' },
]

const yearOptions = Array.from({ length: 8 }, (_, i) => {
  const yr = currentYear - i
  return { label: String(yr), value: String(yr) }
})

const form = reactive<IMedicalVerificationForm>({
  petName: props.petName || '',
  adopterLastName: '',
  email: '',
  phoneNumber: '',
  adoptionMonth: '',
  adoptionYear: String(currentYear),
})

watch(
  () => props.petName,
  (newName) => {
    if (newName && !form.petName) {
      form.petName = newName
    }
  },
  { immediate: true },
)

const handlePhoneInput = (val: string | number | null) => {
  form.phoneNumber = formatPhoneNumber(val)
}

const isFormComplete = computed(() => {
  const digits = form.phoneNumber.replace(/\D/g, '')
  return Boolean(
    form.petName.trim() &&
      form.adopterLastName.trim() &&
      form.email.trim() &&
      digits.length >= 10 &&
      form.adoptionMonth &&
      form.adoptionYear,
  )
})

const handleSubmit = () => {
  if (!isFormComplete.value || props.isVerifying) return
  emit('verify', {
    petName: form.petName.trim(),
    adopterLastName: form.adopterLastName.trim(),
    email: form.email.trim(),
    phoneNumber: form.phoneNumber.trim(),
    adoptionMonth: form.adoptionMonth,
    adoptionYear: form.adoptionYear,
  })
}
</script>

<template>
  <div class="gatekeeper-card" role="dialog" aria-modal="true" aria-labelledby="gatekeeper-title">
    <div class="card-header">
      <div class="lock-icon-wrap" aria-hidden="true">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 id="gatekeeper-title">
        {{ props.petName ? `Access ${props.petName}'s Records` : 'Access Pet Medical Records' }}
      </h2>
      <p class="subtitle">
        Enter your adoption details below to unlock and download official veterinary records,
        vaccine certificates, and care timelines.
      </p>
    </div>

    <form class="gatekeeper-form" @submit.prevent="handleSubmit">
      <div class="form-grid">
        <InputField
          id="gatekeeper-pet-name"
          label="Pet's Name at time of adoption"
          placeholder="e.g. Luna"
          :modelValue="form.petName"
          :required="true"
          :fullWidth="true"
          @update:modelValue="(val) => (form.petName = String(val ?? ''))"
        />

        <InputField
          id="gatekeeper-last-name"
          label="Adopter's Last Name"
          placeholder="e.g. Jenkins"
          :modelValue="form.adopterLastName"
          :required="true"
          :fullWidth="true"
          @update:modelValue="(val) => (form.adopterLastName = String(val ?? ''))"
        />

        <InputField
          id="gatekeeper-email"
          label="Email Address on File"
          placeholder="e.g. sarah@example.com"
          type="email"
          inputmode="email"
          :modelValue="form.email"
          :required="true"
          :fullWidth="true"
          @update:modelValue="(val) => (form.email = String(val ?? ''))"
        />

        <InputField
          id="gatekeeper-phone"
          label="Phone Number on File"
          placeholder="555-000-0000"
          type="tel"
          inputmode="tel"
          :modelValue="form.phoneNumber"
          :required="true"
          :fullWidth="true"
          @update:modelValue="handlePhoneInput"
        />

        <div class="date-row">
          <div class="date-field">
            <Select
              label="Adoption Month"
              placeholder="Select month"
              :options="monthOptions"
              :modelValue="form.adoptionMonth"
              :fullWidth="true"
              @update:modelValue="(val) => (form.adoptionMonth = String(val ?? ''))"
            />
          </div>

          <div class="date-field">
            <Select
              label="Adoption Year"
              placeholder="Select year"
              :options="yearOptions"
              :modelValue="form.adoptionYear"
              :fullWidth="true"
              @update:modelValue="(val) => (form.adoptionYear = String(val ?? ''))"
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <Button
          type="submit"
          theme="secondary"
          size="large"
          :fullWidth="true"
          :loading="props.isVerifying"
          :disabled="!isFormComplete || props.isVerifying"
          title="Unlock Medical Records"
        />
      </div>

      <div v-if="props.errorMessage" class="error-banner" role="alert">
        <svg
          class="error-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{{ props.errorMessage }}</span>
      </div>

      <footer class="form-footer">
        <p class="privacy-note">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>No account needed · Information is verified against adoption files.</span>
        </p>
        <p class="help-link">
          <span>Having trouble accessing records?</span>
          <a href="mailto:help@adohr.org">Contact Support</a>
          <span class="sep" aria-hidden="true">·</span>
          <button type="button" class="faq-link-btn" @click="emit('scroll-faq')">
            View FAQ
          </button>
        </p>
      </footer>
    </form>
  </div>
</template>

<style scoped lang="css">
.gatekeeper-card {
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
  background-color: var(--text-inverse);
  border: 1.5px solid var(--line-ink-strong);
  border-radius: var(--radius-lg);
  padding: clamp(24px, 5vw, 36px);
  box-shadow: 0 20px 50px -10px oklch(from var(--shadow-color) l c h / 35%);
  color: var(--text-primary);
  text-align: center;
  position: relative;
  z-index: 10;
}

.card-header {
  margin-bottom: 24px;

  .lock-icon-wrap {
    width: 56px;
    height: 56px;
    margin: 0 auto 16px;
    border-radius: var(--radius-full);
    background-color: oklch(from var(--color-secondary) 94% 0.05 h);
    color: var(--color-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid oklch(from var(--color-secondary) 85% 0.08 h);
  }

  h2 {
    font-size: clamp(1.4rem, 3.5vw, 1.85rem);
    font-weight: 800;
    color: var(--color-primary);
    margin: 0 0 8px;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
  }
}

.gatekeeper-form {
  text-align: left;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: oklch(from var(--color-danger) 95% 0.04 h);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  color: var(--color-danger);
  font-size: 0.88rem;
  font-weight: 600;
  margin-top: 14px;
  margin-bottom: 6px;

  .error-icon {
    flex-shrink: 0;
  }
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (width <= 440px) {
    grid-template-columns: 1fr;
  }
}

.form-actions {
  margin-top: 8px;
  margin-bottom: 12px;
}

.form-footer {
  text-align: center;
  border-top: 1px solid var(--line-ink);
  padding-top: 16px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .privacy-note {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;

    svg {
      flex-shrink: 0;
      color: var(--text-secondary);
    }
  }

  p {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
  }

  .help-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    flex-wrap: wrap;

    a,
    .faq-link-btn {
      color: var(--color-secondary);
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 3px;
      background: none;
      border: none;
      padding: 0;
      font-family: inherit;
      font-size: inherit;
      cursor: pointer;

      &:hover {
        color: var(--color-primary);
      }
    }

    .sep {
      color: var(--text-secondary);
      user-select: none;
    }
  }
}
</style>
