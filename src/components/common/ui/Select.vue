<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | (string | number)[]
    options: (string | { label: string; value: string | number })[]
    placeholder?: string
    label?: string
    hasError?: boolean
    fullWidth?: boolean
    multiple?: boolean
    variant?: 'default' | 'borderless'
  }>(),
  {
    placeholder: 'Select an option',
    fullWidth: false,
    hasError: false,
    multiple: false,
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null | (string | number)[]]
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const uid = `select-${Math.random().toString(36).substr(2, 9)}`

const dropdownStyles = ref({
  top: '0px',
  left: '0px',
  width: '0px',
  position: 'absolute' as const,
  zIndex: 9999,
})

const updateDropdownPosition = () => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()

  const leftStart = rect.left + window.scrollX
  const width = rect.width
  const menuWidth = props.variant === 'borderless' ? 200 : Math.max(width, 160)
  const menuMaxHeight = 250 // Matches CSS max-height

  let left = leftStart
  if (props.variant === 'borderless') {
    left = rect.right + window.scrollX - menuWidth
  }

  // Ensure it doesn't go off screen horizontally
  if (left < 10) left = 10
  if (left + menuWidth > window.innerWidth - 10) {
    left = window.innerWidth - menuWidth - 10
  }

  // Check if there is enough space below
  const spaceBelow = window.innerHeight - rect.bottom
  const shouldOpenUp = spaceBelow < menuMaxHeight + 20 && rect.top > menuMaxHeight + 20

  const top = shouldOpenUp
    ? rect.top + window.scrollY - menuMaxHeight - 8
    : rect.bottom + window.scrollY + 4

  dropdownStyles.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${menuWidth}px`,
    position: 'absolute',
    zIndex: 9999,
  }
}

watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    updateDropdownPosition()
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

const normalizedOptions = computed(() => {
  if (!props.options) return []
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'label' in opt && 'value' in opt) {
      return opt
    }
    return { label: String(opt), value: opt }
  })
})

const selectedLabel = computed(() => {
  if (props.multiple) {
    if (!Array.isArray(props.modelValue) || props.modelValue.length === 0) {
      return props.placeholder
    }
    const selected = normalizedOptions.value.filter(
      (opt) => Array.isArray(props.modelValue) && props.modelValue.includes(opt.value),
    )
    return selected.map((s) => s.label).join(', ')
  }

  const selected = normalizedOptions.value.find((opt) => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})

const highlightedIndex = ref(-1)
let typeaheadBuffer = ''
let typeaheadTimeout: ReturnType<typeof setTimeout> | null = null

const scrollToHighlighted = () => {
  nextTick(() => {
    if (!menuRef.value) return
    const highlightedEl = menuRef.value.querySelector('.option-item.is-highlighted') as HTMLElement | null
    if (highlightedEl && typeof highlightedEl.scrollIntoView === 'function') {
      highlightedEl.scrollIntoView({ block: 'nearest' })
    }
  })
}

const highlightCurrentOrFirst = () => {
  const options = normalizedOptions.value
  const currentIndex = options.findIndex((opt) => opt.value === props.modelValue)
  highlightedIndex.value = currentIndex >= 0 ? currentIndex : 0
  scrollToHighlighted()
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    highlightCurrentOrFirst()
  }
}

const selectOption = (value: string | number) => {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(value)
    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(value)
    }
    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', value)
    isOpen.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  const options = normalizedOptions.value
  if (options.length === 0) return

  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    if (!isOpen.value) {
      isOpen.value = true
      highlightCurrentOrFirst()
    } else {
      if (highlightedIndex.value >= 0 && highlightedIndex.value < options.length) {
        selectOption(options[highlightedIndex.value].value)
      } else {
        isOpen.value = false
      }
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    isOpen.value = false
    return
  }

  if (event.key === 'Tab') {
    if (isOpen.value) {
      if (highlightedIndex.value >= 0 && highlightedIndex.value < options.length && !props.multiple) {
        selectOption(options[highlightedIndex.value].value)
      }
      isOpen.value = false
    }
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!isOpen.value) {
      isOpen.value = true
      highlightCurrentOrFirst()
    } else {
      highlightedIndex.value = (highlightedIndex.value + 1) % options.length
      scrollToHighlighted()
    }
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) {
      isOpen.value = true
      highlightCurrentOrFirst()
    } else {
      highlightedIndex.value = (highlightedIndex.value - 1 + options.length) % options.length
      scrollToHighlighted()
    }
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    if (isOpen.value) {
      highlightedIndex.value = 0
      scrollToHighlighted()
    }
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    if (isOpen.value) {
      highlightedIndex.value = options.length - 1
      scrollToHighlighted()
    }
    return
  }

  // Typeahead key search (letters, numbers, etc.)
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault()
    if (typeaheadTimeout) clearTimeout(typeaheadTimeout)

    typeaheadBuffer += event.key.toLowerCase()
    typeaheadTimeout = setTimeout(() => {
      typeaheadBuffer = ''
    }, 700)

    const matchIndex = options.findIndex((opt) => {
      const label = opt.label.toLowerCase()
      const val = String(opt.value).toLowerCase()
      return label.startsWith(typeaheadBuffer) || val.startsWith(typeaheadBuffer)
    })

    const fallbackIndex =
      matchIndex === -1
        ? options.findIndex((opt) => {
            const label = opt.label.toLowerCase()
            return label.includes(typeaheadBuffer)
          })
        : matchIndex

    if (fallbackIndex !== -1) {
      if (!isOpen.value) {
        selectOption(options[fallbackIndex].value)
      } else {
        highlightedIndex.value = fallbackIndex
        scrollToHighlighted()
      }
    }
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const isInsideTrigger = containerRef.value?.contains(event.target as Node)
  const isInsideMenu = menuRef.value?.contains(event.target as Node)

  if (!isInsideTrigger && !isInsideMenu) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (typeaheadTimeout) clearTimeout(typeaheadTimeout)
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', updateDropdownPosition, true)
  window.removeEventListener('resize', updateDropdownPosition)
})
</script>

<template>
  <div
    class="select-container"
    :class="{
      'is-fullwidth': fullWidth,
      'has-error': hasError,
      'variant-borderless': variant === 'borderless',
    }"
    ref="containerRef"
  >
    <label v-if="label" :id="`${uid}-label`" class="label" :for="uid">{{ label }}</label>

    <!-- sonar-disable-next-line 939a3f5b-dad4-413c-bfc6-997efcad07e8 -->
    <button
      type="button"
      class="select-trigger"
      :id="uid"
      :class="{ 'is-open': isOpen, 'is-placeholder': !modelValue }"
      @click="toggleDropdown"
      :aria-labelledby="label ? `${uid}-label` : undefined"
      :aria-controls="`${uid}-menu`"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="listbox"
      @keydown="handleKeyDown"
    >
      <span class="selected-text">{{ selectedLabel }}</span>
      <span class="chevron" aria-hidden="true">▼</span>
    </button>

    <Teleport to="body">
      <transition name="fade">
        <!-- sonar-disable-next-line e1cf8e70-fbff-4344-91c9-8d44b86c356c, 5d17b73a-bbb9-4e7f-9912-273a60b3242a -->
        <div
          v-show="isOpen"
          :id="`${uid}-menu`"
          ref="menuRef"
          class="options-menu teleported-menu"
          :class="{ 'variant-borderless': variant === 'borderless' }"
          role="listbox"
          :style="dropdownStyles"
          tabindex="-1"
        >
          <!-- sonar-disable-next-line ea87a864-3f73-4b99-a6da-5ad247605d70, dcbf4805-e189-4bc1-9b22-cfe80661405d, cc4490e1-b4ec-4652-9726-2e19cb607e89, 9aa55b62-e606-457d-877d-9b965ad0fe18, 79e22e78-99e2-48d8-ae6e-7608033939b6 -->
          <div
            v-for="(option, idx) in normalizedOptions"
            :key="option.value"
            class="option-item"
            :class="{
              'is-selected': multiple
                ? Array.isArray(modelValue) && modelValue.includes(option.value)
                : option.value === modelValue,
              'is-highlighted': idx === highlightedIndex,
            }"
            role="option"
            :aria-selected="
              multiple
                ? Array.isArray(modelValue) && modelValue.includes(option.value)
                  ? 'true'
                  : 'false'
                : option.value === modelValue
                  ? 'true'
                  : 'false'
            "
            tabindex="-1"
            @mouseenter="highlightedIndex = idx"
            @click="selectOption(option.value)"
          >
            {{ option.label }}
            <span
              v-if="
                multiple
                  ? Array.isArray(modelValue) && modelValue.includes(option.value)
                  : option.value === modelValue
              "
              class="check"
              aria-hidden="true"
              >✓</span
            >
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped src="./Select.css"></style>

<style>
/* Global styles for teleported menu */
.options-menu.teleported-menu {
  position: absolute;
  background: var(--color-white);
  border: 1px solid var(--border-color, var(--color-gray-200));
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  max-height: 250px;
  overflow-y: auto;
  z-index: var(--z-overlay);
  padding: 4px;
  list-style: none;
  margin: 0;
}

.options-menu.teleported-menu.variant-borderless {
  border: 1px solid var(--color-gray-200);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%);
}

.options-menu.teleported-menu .option-item {
  padding: 10px 12px;
  font-size: 0.95rem;
  color: var(--text-primary, #1f2937);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.1s;
}

.options-menu.teleported-menu .option-item:hover,
.options-menu.teleported-menu .option-item.is-highlighted {
  background-color: var(--color-neutral-weak, var(--color-gray-100));
}

.options-menu.teleported-menu .option-item.is-selected {
  background-color: var(--color-primary-weak, #e0f2f1);
  color: var(--color-primary, #00a5ad);
  font-weight: 500;
}

.options-menu.teleported-menu .check {
  font-size: 0.8rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
