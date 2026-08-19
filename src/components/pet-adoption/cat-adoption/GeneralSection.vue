<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAdoptionStore } from '../../../stores/adoption'
import {
  formatPhoneNumber,
  sanitizeAddress,
  sanitizeCity,
  sanitizeName,
  sanitizeZip,
} from '../../../utils/validators'
import ButtonToggle from '../../common/ui/ButtonToggle.vue'
import InputField from '../../common/ui/InputField.vue'

defineProps<{
  touched?: Record<string, boolean>
  // eslint-disable-next-line no-unused-vars
  handleBlur: (_field: string) => void
  hasAttemptedSubmit?: boolean
}>()

const adoptionStore = useAdoptionStore()
const { formState } = storeToRefs(adoptionStore)

function addRoommate() {
  formState.value.roommatesNames.push('')
}

function removeRoommate(index: number) {
  formState.value.roommatesNames.splice(index, 1)
}

function addChild() {
  formState.value.childrenNamesAges.push({ name: '', age: '' })
}

function removeChild(index: number) {
  formState.value.childrenNamesAges.splice(index, 1)
}

function handleAgreementUpdate(val: string | number | boolean | null) {
  formState.value.adultMembersAgreed = val as 'Yes' | 'No'
}
</script>

<template>
  <div class="cat-adoption-form">
    <div>
      <h2 class="section-title">Applicant Information</h2>

      <div class="fax-field" aria-hidden="true">
        <label for="fax_number">Fax Number</label>
        <input
          id="fax_number"
          v-model="formState.fax_number"
          type="text"
          name="fax_number"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <div class="form-grid">
        <InputField
          :modelValue="formState.firstName"
          @update:modelValue="(val) => (formState.firstName = sanitizeName(val))"
          label="First Name"
          name="firstName"
          placeholder="First Name"
          required
          :hasError="(touched?.firstName || hasAttemptedSubmit) && !formState.firstName"
          @blur="handleBlur?.('firstName')"
        />
        <InputField
          :modelValue="formState.lastName"
          @update:modelValue="(val) => (formState.lastName = sanitizeName(val))"
          label="Last Name"
          name="lastName"
          placeholder="Last Name"
          required
          :hasError="(touched?.lastName || hasAttemptedSubmit) && !formState.lastName"
          @blur="handleBlur?.('lastName')"
        />
        <InputField
          :modelValue="formState.age"
          @update:modelValue="
            (val) => {
              const str = String(val).replace(/\D/g, '').substring(0, 3)
              formState.age = str ? Number(str) : null
            }
          "
          label="Age"
          name="age"
          placeholder="Age"
          required
          :hasError="(touched?.age || hasAttemptedSubmit) && !formState.age"
          @blur="handleBlur?.('age')"
        />
        <InputField
          v-model="formState.email"
          label="Email"
          name="email"
          placeholder="Email"
          required
          :hasError="(touched?.email || hasAttemptedSubmit) && !formState.email"
          @blur="handleBlur?.('email')"
        />
        <InputField
          class="full-width"
          :modelValue="formState.address"
          @update:modelValue="(val) => (formState.address = sanitizeAddress(val))"
          label="Address"
          name="address"
          placeholder="Street Address"
          required
          :hasError="(touched?.address || hasAttemptedSubmit) && !formState.address"
          @blur="handleBlur?.('address')"
        />
        <InputField
          class="full-width"
          :modelValue="formState.addressLine2"
          @update:modelValue="(val) => (formState.addressLine2 = sanitizeAddress(val))"
          label="Address Line 2"
          name="addressLine2"
          placeholder="Address Line 2"
          @blur="handleBlur?.('addressLine2')"
        />
        <InputField
          :modelValue="formState.city"
          @update:modelValue="(val) => (formState.city = sanitizeCity(val))"
          label="City"
          name="city"
          placeholder="City"
          required
          :hasError="(touched?.city || hasAttemptedSubmit) && !formState.city"
          @blur="handleBlur?.('city')"
        />
        <InputField
          :modelValue="formState.state"
          @update:modelValue="(val) => (formState.state = sanitizeCity(val))"
          label="State"
          name="state"
          placeholder="State"
          required
          :hasError="(touched?.state || hasAttemptedSubmit) && !formState.state"
          @blur="handleBlur?.('state')"
        />
        <InputField
          :modelValue="formState.zip"
          @update:modelValue="(val) => (formState.zip = sanitizeZip(val))"
          label="Zip Code"
          name="zip"
          placeholder="Zip Code"
          required
          maxlength="5"
          inputmode="numeric"
          pattern="[0-9]*"
          :hasError="(touched?.zip || hasAttemptedSubmit) && !formState.zip"
          @blur="handleBlur?.('zip')"
        />
        <InputField
          :modelValue="formState.phoneNumber"
          @update:modelValue="(val) => (formState.phoneNumber = formatPhoneNumber(val))"
          label="Phone Number"
          name="phoneNumber"
          placeholder="123-456-7890"
          required
          type="tel"
          maxlength="12"
          inputmode="numeric"
          :hasError="(touched?.phoneNumber || hasAttemptedSubmit) && !formState.phoneNumber"
          @blur="handleBlur?.('phoneNumber')"
        />
        <InputField
          :modelValue="formState.spouseFirstName"
          @update:modelValue="(val) => (formState.spouseFirstName = sanitizeName(val))"
          label="Spouse/Partner First Name"
          name="spouseFirstName"
          placeholder="First Name"
          required
        />
        <InputField
          :modelValue="formState.spouseLastName"
          @update:modelValue="(val) => (formState.spouseLastName = sanitizeName(val))"
          label="Spouse/Partner Last Name"
          name="spouseLastName"
          placeholder="Last Name"
          required
        />

        <div class="roommates">
          <label class="section-label"
            >Name of roommmate(s) and other adults in the household</label
          >
          <div
            v-for="(roommate, index) in formState.roommatesNames"
            :key="index"
            class="dynamic-input-row"
          >
            <div class="grow">
              <InputField
                :modelValue="formState.roommatesNames[index]"
                @update:modelValue="(val) => (formState.roommatesNames[index] = sanitizeName(val))"
                :name="`roommate-${index}`"
                placeholder="Names"
                required
                :label="`Roommate ${index + 1}`"
              />
            </div>
            <button v-if="index === 0" class="add-btn" @click.prevent="addRoommate">
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
            <button v-else class="remove-btn" @click.prevent="removeRoommate(index)">
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
        </div>
        <div class="children">
          <label class="section-label">Name and ages of children (under 18) in the household</label>
          <div
            v-for="(child, index) in formState.childrenNamesAges"
            :key="index"
            class="dynamic-input-row"
          >
            <div class="grow">
              <InputField
                :modelValue="child.name"
                @update:modelValue="(val) => (child.name = sanitizeName(val))"
                :name="`child-name-${index}`"
                placeholder="Name"
                required
                :label="`Child ${index + 1}`"
              />
            </div>
            <div class="age-wrapper">
              <InputField
                :modelValue="child.age"
                @update:modelValue="
                  (val) => {
                    const str = String(val).replace(/\D/g, '').substring(0, 3)
                    child.age = str || ''
                  }
                "
                :name="`child-age-${index}`"
                placeholder="Age"
                required
                :label="`Child ${index + 1}`"
              />
            </div>
            <button v-if="index === 0" class="add-btn" @click.prevent="addChild">
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
            <button v-else class="remove-btn" @click.prevent="removeChild(index)">
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
        </div>
        <ButtonToggle
          label="Have all adult members of the household agreed to this adoption?"
          :modelValue="formState.adultMembersAgreed"
          @update:modelValue="handleAgreementUpdate"
          :hasError="hasAttemptedSubmit && !formState.adultMembersAgreed"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.cat-adoption-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 0.5rem;

  .fax-field {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    z-index: -1;
  }

  p {
    font-size: 1.75rem;
    font-weight: 600;
    text-align: center;
    color: var(--color-primary);
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 24px;
    color: var(--text-primary);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;

    @container (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .full-width {
    grid-column: 1 / -1;
  }

  .roommates,
  .children {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .dynamic-input-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    width: 100%;

    :deep(.control .label) {
      display: none;
    }

    :deep(.control) {
      gap: 0;
    }
  }

  .grow {
    flex-grow: 1;
  }

  .age-input {
    width: 80px;
    flex-shrink: 0;
  }

  .add-btn,
  .remove-btn {
    width: 52px;
    height: 52px;
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    padding: 0;
    flex-shrink: 0;
    margin-top: 0;
    box-shadow: var(--shadow-md);

    &:hover {
      color: var(--color-secondary);
      border-color: var(--color-secondary);
    }
  }

  .remove-btn:hover {
    color: var(--color-danger);
    border-color: var(--color-danger);
    background-color: var(--color-danger-weak);
  }

  @container (max-width: 480px) {
    .children .dynamic-input-row {
      flex-wrap: wrap;

      .grow {
        flex-basis: 100%;
        width: 100%;
        min-width: 100%;
      }

      .age-wrapper {
        flex: 1;
        min-width: 0;
      }

      .add-btn,
      .remove-btn {
        flex-shrink: 0;
      }
    }
  }

  .all-agreed {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    margin: 1rem 0 2rem;

    p {
      font-size: 1.25rem;
      font-weight: 600;
      text-align: center;
      color: var(--color-primary);
    }
  }
}
</style>
