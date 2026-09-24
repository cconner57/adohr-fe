<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId, watch } from 'vue'

export interface IComboboxOption {
  label: string
  value: string
  isCustom?: boolean
}

const props = withDefaults(
  defineProps<{
    label?: string
    modelValue: string | string[] | null
    options: IComboboxOption[]
    multiple?: boolean
    placeholder?: string
    hasError?: boolean
    allowCreate?: boolean
    noResultsText?: string
  }>(),
  {
    multiple: false,
    placeholder: 'Select...',
    options: () => [],
    noResultsText: 'No options found',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
}>()

const instanceId = useId()
const inputId = `combobox-input-${instanceId}`
const listboxId = `combobox-list-${instanceId}`

const isOpen = ref(false)
const searchQuery = ref('')
const highlightedIndex = ref(-1)
const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const filteredOptions = computed<IComboboxOption[]>(() => {
  if (!searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase().trim()

  const exactMatch = props.options.some((o) => o.label.toLowerCase().trim() === q)
  const filtered = props.options.filter((o) => o.label.toLowerCase().includes(q))

  if (props.allowCreate && !exactMatch && q.length > 0) {
    return [
      ...filtered,
      { label: `Create "${searchQuery.value}"`, value: searchQuery.value, isCustom: true },
    ]
  }

  return filtered
})

const activeDescendantId = computed(() => {
  if (!isOpen.value || highlightedIndex.value < 0 || highlightedIndex.value >= filteredOptions.value.length) {
    return undefined
  }
  return `${listboxId}-opt-${highlightedIndex.value}`
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (!props.multiple) {
      if (newVal) {
        const option = props.options.find((o) => o.value === newVal)
        searchQuery.value = option ? option.label : (newVal as string)
      } else {
        searchQuery.value = ''
      }
    }
  },
  { immediate: true },
)

watch(filteredOptions, () => {
  highlightedIndex.value = -1
})

function isSelected(value: string) {
  if (props.multiple) {
    return ((props.modelValue as string[]) || []).includes(value)
  }
  return props.modelValue === value
}

function selectOption(option: IComboboxOption) {
  const valToEmit = option.value

  if (props.multiple) {
    const current = (props.modelValue as string[]) || []
    const newVal = current.includes(valToEmit)
      ? current.filter((v) => v !== valToEmit)
      : [...current, valToEmit]
    emit('update:modelValue', newVal)
    searchQuery.value = ''
    inputRef.value?.focus()
  } else {
    emit('update:modelValue', valToEmit)
    searchQuery.value = option.isCustom ? valToEmit : option.label
    isOpen.value = false
  }
}

function removeTag(value: string) {
  if (props.multiple) {
    const current = (props.modelValue as string[]) || []
    emit(
      'update:modelValue',
      current.filter((v) => v !== value),
    )
  }
}

function handleInput() {
  isOpen.value = true
  highlightedIndex.value = -1
}

function handleFocus() {
  isOpen.value = true
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      isOpen.value = true
      highlightedIndex.value = 0
      event.preventDefault()
    }
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (filteredOptions.value.length > 0) {
      highlightedIndex.value = (highlightedIndex.value + 1) % filteredOptions.value.length
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (filteredOptions.value.length > 0) {
      highlightedIndex.value = (highlightedIndex.value - 1 + filteredOptions.value.length) % filteredOptions.value.length
    }
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
      selectOption(filteredOptions.value[highlightedIndex.value])
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="containerRef" class="combobox-field" :class="{ 'has-error': hasError }">
    <label v-if="label" :for="inputId" class="label">{{ label }}</label>

    <div class="combobox-wrapper">
      <div v-if="multiple && (modelValue as string[])?.length" class="selected-tags">
        <span v-for="val in modelValue as string[]" :key="val" class="tag">
          {{ options.find((o) => o.value === val)?.label || val }}
          <button
            type="button"
            class="remove-tag"
            :aria-label="`Remove ${options.find((o) => o.value === val)?.label || val}`"
            @click="removeTag(val)"
          >
            ×
          </button>
        </span>
      </div>

      <div class="input-container">
        <input
          :id="inputId"
          ref="inputRef"
          v-model="searchQuery"
          type="text"
          class="combobox-input"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="isOpen"
          :aria-controls="listboxId"
          :aria-activedescendant="activeDescendantId"
          :placeholder="multiple && (modelValue as string[])?.length ? '' : placeholder"
          @focus="handleFocus"
          @input="handleInput"
          @keydown="handleKeydown"
        />
        <span class="chevron" aria-hidden="true">▼</span>
      </div>

      <div
        v-show="isOpen"
        :id="listboxId"
        class="dropdown-menu"
        role="listbox"
      >
        <template v-if="filteredOptions.length > 0">
          <button
            v-for="(option, index) in filteredOptions"
            :id="`${listboxId}-opt-${index}`"
            :key="option.value"
            type="button"
            role="option"
            :aria-selected="isSelected(option.value)"
            class="dropdown-item"
            :class="{
              selected: isSelected(option.value),
              highlighted: index === highlightedIndex,
              'create-option': option.isCustom,
            }"
            @mousedown.prevent="selectOption(option)"
          >
            {{ option.label }}
            <span v-if="isSelected(option.value)" class="check" aria-hidden="true">✓</span>
          </button>
        </template>
        <div v-else class="no-results" role="status">
          <span v-if="allowCreate && !searchQuery">Type to create...</span>
          <span v-else>{{ noResultsText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.combobox-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.combobox-wrapper {
  position: relative;
  border: 1px solid var(--border-color);
  background: var(--color-white);
  border-radius: var(--radius-md);
  min-height: 48px;
  padding: 4px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.combobox-wrapper:focus-within {
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 2px oklch(from var(--color-secondary) l c h / 10%);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-left: 6px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--color-primary-weak);
  color: var(--text-primary);
  border: 1px solid var(--color-primary-border-strong);
  padding: 2px 8px;
  border-radius: var(--radius-lg);
  font-size: 0.85rem;
  font-weight: 500;
}

.remove-tag {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-danger-text-soft);
  font-size: 1.1rem;
  line-height: 0.8;
  padding: 0 2px;
  margin-right: -2px;

  &:hover {
    color: var(--color-danger);
  }
}

.input-container {
  flex: 1;
  min-width: 120px;
  display: flex;
  align-items: center;
  position: relative;
}

.combobox-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 8px 12px;
  font-size: 1rem;
  color: var(--text-primary);
  background: transparent;

  &::placeholder {
    opacity: 0.5;
  }
}

.chevron {
  pointer-events: none;
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-right: 12px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: var(--z-dropdown);
  box-shadow: 0 10px 30px rgb(0 0 0 / 15%);
}

.dropdown-item {
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-primary);
  font-size: 0.95rem;

  &:hover,
  &.highlighted {
    background: var(--color-neutral-weak);
  }

  &.selected {
    background: var(--color-primary-weak);
    color: var(--color-primary);
    font-weight: 500;
  }

  &.create-option {
    color: var(--color-secondary);
    font-weight: 600;
    border-top: 1px dashed var(--border-color);
  }
}

.check {
  font-weight: 700;
}

.no-results {
  padding: 12px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}
</style>
