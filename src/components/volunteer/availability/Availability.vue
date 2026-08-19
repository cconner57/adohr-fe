<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { SHIFTS, type SlotDefinition } from './shifts'

const props = defineProps<{
  modelValue: string[]
  hasError?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const slotDaysMap = ref<Record<string, string[]>>({})

const parseModelValue = () => {
  const newMap: Record<string, string[]> = {}

  for (const item of props.modelValue) {
    const exactSlot = SHIFTS.find((s) => s.value === item)
    if (exactSlot) {
      newMap[exactSlot.value] = [...exactSlot.days]
      continue
    }

    const match = item.match(/^([^(]+)(?:\(([^)]+)\))?$/)
    if (!match) continue

    const baseValue = match[1].trim()
    const daysStr = match[2]

    const slot = SHIFTS.find((s) => s.value === baseValue)
    if (!slot) continue

    if (daysStr) {
      const days = daysStr.split(',').map((d) => d.trim())
      newMap[baseValue] = days.filter((d) => slot.days.includes(d))
    } else {
      newMap[baseValue] = [...slot.days]
    }
  }

  slotDaysMap.value = newMap
}

watch(
  () => props.modelValue,
  () => {
    parseModelValue()
  },
  { immediate: true, deep: true },
)

const emitChanges = () => {
  const result: string[] = []

  for (const slot of SHIFTS) {
    const selectedDays = slotDaysMap.value[slot.value]
    if (!selectedDays || selectedDays.length === 0) continue

    if (slot.type === 'fixed') {
      result.push(slot.value)
      continue
    }

    const isAllDaysSelected = slot.days.every((d) => selectedDays.includes(d))

    if (isAllDaysSelected) {
      result.push(slot.value)
    } else {
      result.push(`${slot.value} (${selectedDays.join(', ')})`)
    }
  }

  const currentStr = JSON.stringify(props.modelValue)
  const newStr = JSON.stringify(result)

  if (currentStr !== newStr) {
    emit('update:modelValue', result)
  }
}

const toggleSlot = (slot: SlotDefinition) => {
  const isChecked = !!slotDaysMap.value[slot.value]
  if (isChecked) {
    const newMap = { ...slotDaysMap.value }
    delete newMap[slot.value]
    slotDaysMap.value = newMap
  } else {
    slotDaysMap.value = {
      ...slotDaysMap.value,
      [slot.value]: [...slot.days],
    }
  }
  emitChanges()
}

const toggleDay = (slotValue: string, day: string) => {
  const slot = SHIFTS.find((s) => s.value === slotValue)
  if (!slot) return

  const selectedDays = slotDaysMap.value[slotValue] || []
  let newDays: string[]

  if (selectedDays.includes(day)) {
    newDays = selectedDays.filter((d) => d !== day)
  } else {
    newDays = [...selectedDays, day]
  }

  if (newDays.length === 0) {
    const newMap = { ...slotDaysMap.value }
    delete newMap[slotValue]
    slotDaysMap.value = newMap
  } else {
    slotDaysMap.value = {
      ...slotDaysMap.value,
      [slotValue]: newDays,
    }
  }
  emitChanges()
}

const isSlotChecked = (slotValue: string): boolean => {
  return !!slotDaysMap.value[slotValue]
}

const isDaySelected = (slotValue: string, day: string): boolean => {
  const selectedDays = slotDaysMap.value[slotValue] || []
  return selectedDays.includes(day)
}

const getDayAbbreviation = (day: string): string => {
  if (day === 'Thursday') return 'Th'
  if (day === 'Saturday') return 'Sa'
  if (day === 'Sunday') return 'Su'
  return day.slice(0, 1)
}

const everydayShifts = computed(() =>
  SHIFTS.filter((s) => s.type === 'everyday' || s.id === 'sunday_pm'),
)
const adoptionShifts = computed(() =>
  SHIFTS.filter((s) => s.type === 'adoption' || s.id === 'event_cleanup'),
)
</script>

<template>
  <div class="availability-section">
    <p class="section-label">Preference on time of day (select all that apply):</p>

    <div class="times-grid" :class="{ 'has-error': hasError }">
      <div class="sub-header">Everyday Shifts (Monday – Sunday)</div>
      <div class="sub-header-note">
        Sunday PM clean/feed/socialize hours are 4PM - 6PM due to PetSmart store hours.
      </div>

      <div
        v-for="slot in everydayShifts"
        :key="slot.id"
        class="time-card"
        :class="{ 'is-selected': isSlotChecked(slot.value) }"
        @click="toggleSlot(slot)"
      >
        <input
          type="checkbox"
          :id="'avail-' + slot.id"
          :checked="isSlotChecked(slot.value)"
          @change="toggleSlot(slot)"
          @click.stop
          class="visually-hidden"
          :aria-label="slot.label"
        />
        <div class="time-card__content">
          <div class="time-header">
            <strong>{{ slot.label }}</strong>
            <div class="check-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <small>{{ slot.description }}</small>

          <div
            v-if="slot.type !== 'fixed'"
            class="day-selection-wrapper"
            :class="{ 'is-open': isSlotChecked(slot.value) }"
            @click.stop
          >
            <div class="day-selection-content">
              <span class="day-selection-title">Select Days:</span>
              <div class="days-chips">
                <button
                  v-for="day in slot.days"
                  :key="day"
                  type="button"
                  class="day-chip"
                  :class="{ 'is-active': isDaySelected(slot.value, day) }"
                  @click="toggleDay(slot.value, day)"
                  :aria-label="'Select ' + day + ' for ' + slot.label"
                >
                  {{ getDayAbbreviation(day) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sub-header mt-2">Adoption Events (Saturday & Sunday Only)</div>

      <div
        v-for="slot in adoptionShifts"
        :key="slot.id"
        class="time-card"
        :class="{ 'is-selected': isSlotChecked(slot.value) }"
        @click="toggleSlot(slot)"
      >
        <input
          type="checkbox"
          :id="'avail-' + slot.id"
          :checked="isSlotChecked(slot.value)"
          @change="toggleSlot(slot)"
          @click.stop
          class="visually-hidden"
          :aria-label="slot.label"
        />
        <div class="time-card__content">
          <div class="time-header">
            <strong>{{ slot.label }}</strong>
            <div class="check-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <small>{{ slot.description }}</small>

          <div
            v-if="slot.type !== 'fixed'"
            class="day-selection-wrapper"
            :class="{ 'is-open': isSlotChecked(slot.value) }"
            @click.stop
          >
            <div class="day-selection-content">
              <span class="day-selection-title">Select Days:</span>
              <div class="days-chips">
                <button
                  v-for="day in slot.days"
                  :key="day"
                  type="button"
                  class="day-chip"
                  :class="{ 'is-active': isDaySelected(slot.value, day) }"
                  @click="toggleDay(slot.value, day)"
                  :aria-label="'Select ' + day + ' for ' + slot.label"
                >
                  {{ getDayAbbreviation(day) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.availability-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.section-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.times-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.75rem;
}

.sub-header {
  grid-column: 1 / -1;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  margin-bottom: 0;
}

.sub-header-note {
  grid-column: 1 / -1;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: -0.25rem;
  margin-bottom: 0.125rem;
}

.sub-header.mt-2 {
  margin-top: 1rem;
}

.times-grid.has-error {
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-lg);
  padding: 0.5rem;
}

.time-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.time-card:hover {
  background-color: var(--color-neutral-surface);
  border-color: var(--color-neutral-border-strong);
}

.visually-hidden {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.time-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.time-header strong {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.check-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  transition: all var(--transition-normal);
  background: var(--color-white);
}

.check-icon svg {
  opacity: 0;
  transform: scale(0.5);
  transition: all var(--transition-normal);
}

.time-card.is-selected {
  background: color-mix(in srgb, var(--color-primary) 5%, #fff);
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
}

.time-card.is-selected .check-icon {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.time-card.is-selected .check-icon svg {
  opacity: 1;
  transform: scale(1);
}

.time-card__content small {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
  display: block;
}

.day-selection-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition:
    grid-template-rows 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    margin-top 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  overflow: hidden;
  margin-top: 0;
}

.day-selection-wrapper.is-open {
  grid-template-rows: 1fr;
  margin-top: 0.75rem;
}

.day-selection-content {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.day-selection-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.days-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.day-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--color-white);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.day-chip:hover {
  background: var(--color-neutral-surface);
  border-color: var(--color-neutral-border-strong);
}

.day-chip.is-active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--text-inverse);
}
</style>
