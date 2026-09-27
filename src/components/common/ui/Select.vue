<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

export interface ISelectOption {
  label: string
  value: string | number
  image?: string | null
  species?: string | null
  sex?: string | null
  age?: string | null
  [key: string]: unknown
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | (string | number)[]
    options: (string | ISelectOption)[]
    placeholder?: string
    label?: string
    hasError?: boolean
    fullWidth?: boolean
    multiple?: boolean
    variant?: 'default' | 'borderless'
    pageSize?: number
    loadMoreText?: string
  }>(),
  {
    placeholder: 'Select an option',
    fullWidth: false,
    hasError: false,
    multiple: false,
    variant: 'default',
    pageSize: undefined,
    loadMoreText: 'Loading more pets...',
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

const normalizedOptions = computed<ISelectOption[]>(() => {
  if (!props.options) return []
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'label' in opt && 'value' in opt) {
      return opt as ISelectOption
    }
    return { label: String(opt), value: opt }
  })
})

const visibleCount = ref(props.pageSize ? props.pageSize + 1 : 999999)

const ensureSelectedIsVisible = () => {
  if (!props.pageSize || !props.modelValue) return
  const selectedIdx = normalizedOptions.value.findIndex((opt) => opt.value === props.modelValue)
  if (selectedIdx >= visibleCount.value) {
    visibleCount.value = Math.min(
      Math.ceil((selectedIdx + 1) / props.pageSize) * props.pageSize + 1,
      normalizedOptions.value.length,
    )
  }
}

watch(
  () => [props.options, props.pageSize],
  () => {
    visibleCount.value = props.pageSize ? props.pageSize + 1 : normalizedOptions.value.length
    ensureSelectedIsVisible()
  },
  { deep: true },
)

const isSelected = (val: string | number) =>
  props.multiple
    ? Array.isArray(props.modelValue) && props.modelValue.includes(val)
    : props.modelValue === val

const displayedOptions = computed(() =>
  props.pageSize ? normalizedOptions.value.slice(0, visibleCount.value) : normalizedOptions.value,
)

const isLoadingMore = ref(false)

const loadMore = () => {
  if (!props.pageSize || isLoadingMore.value || visibleCount.value >= normalizedOptions.value.length) return
  isLoadingMore.value = true
  setTimeout(() => {
    visibleCount.value = Math.min(visibleCount.value + (props.pageSize || 25), normalizedOptions.value.length)
    isLoadingMore.value = false
  }, 250)
}

const handleMenuScroll = (event: Event) => {
  if (!props.pageSize || isLoadingMore.value || visibleCount.value >= normalizedOptions.value.length) return
  const target = event.target as HTMLElement
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 35) {
    loadMore()
  }
}

const updateDropdownPosition = () => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const menuWidth = props.variant === 'borderless' ? 200 : Math.max(rect.width, 160)
  const menuMaxHeight = 320
  let left = props.variant === 'borderless' ? rect.right + window.scrollX - menuWidth : rect.left + window.scrollX
  if (left < 10) left = 10
  if (left + menuWidth > window.innerWidth - 10) left = window.innerWidth - menuWidth - 10

  const menuHeight = menuRef.value?.offsetHeight
    ? Math.min(menuRef.value.offsetHeight, menuMaxHeight)
    : Math.min(displayedOptions.value.length * 48 + 10, menuMaxHeight)
  const shouldOpenUp = window.innerHeight - rect.bottom < menuHeight + 16 && rect.top > menuHeight + 16
  const top = shouldOpenUp
    ? rect.top + window.scrollY - menuHeight - 4
    : rect.bottom + window.scrollY + 4

  dropdownStyles.value = { top: `${top}px`, left: `${left}px`, width: `${menuWidth}px`, position: 'absolute', zIndex: 9999 }
}

watch(isOpen, async (val) => {
  if (val) {
    updateDropdownPosition()
    await nextTick()
    updateDropdownPosition()
    window.addEventListener('scroll', updateDropdownPosition, true)
    window.addEventListener('resize', updateDropdownPosition)
  } else {
    window.removeEventListener('scroll', updateDropdownPosition, true)
    window.removeEventListener('resize', updateDropdownPosition)
  }
})

const selectedOption = computed<ISelectOption | undefined>(() => {
  if (props.multiple) return undefined
  return normalizedOptions.value.find((opt) => opt.value === props.modelValue)
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

  return selectedOption.value ? selectedOption.value.label : props.placeholder
})

const highlightedIndex = ref(-1)
let typeaheadBuffer = ''
let typeaheadTimeout: ReturnType<typeof setTimeout> | null = null

const scrollToHighlighted = () => {
  nextTick(() => {
    if (!menuRef.value) return
    const highlightedEl = menuRef.value.querySelector('.option-item.is-highlighted') as HTMLElement | null
    if (!highlightedEl) return

    const menu = menuRef.value
    const elTop = highlightedEl.offsetTop
    const elBottom = elTop + highlightedEl.offsetHeight
    const menuTop = menu.scrollTop
    const menuBottom = menuTop + menu.clientHeight

    if (elTop < menuTop) {
      menu.scrollTop = elTop
    } else if (elBottom > menuBottom) {
      menu.scrollTop = elBottom - menu.clientHeight
    }
  })
}

const highlightCurrentOrFirst = () => {
  const options = displayedOptions.value
  const currentIndex = options.findIndex((opt) => opt.value === props.modelValue)
  highlightedIndex.value = currentIndex >= 0 ? currentIndex : 0
  scrollToHighlighted()
}

const openDropdown = () => {
  ensureSelectedIsVisible()
  updateDropdownPosition()
  isOpen.value = true
  highlightCurrentOrFirst()
}

const toggleDropdown = () => {
  if (isOpen.value) {
    isOpen.value = false
  } else {
    openDropdown()
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
  const options = displayedOptions.value
  if (options.length === 0) return

  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    if (!isOpen.value) {
      openDropdown()
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
      openDropdown()
    } else {
      if (highlightedIndex.value >= options.length - 2 && visibleCount.value < normalizedOptions.value.length) {
        loadMore()
      }
      highlightedIndex.value = (highlightedIndex.value + 1) % options.length
      scrollToHighlighted()
    }
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) {
      openDropdown()
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

    const matchIndex = normalizedOptions.value.findIndex((opt) => {
      const label = opt.label.toLowerCase()
      const val = String(opt.value).toLowerCase()
      return label.startsWith(typeaheadBuffer) || val.startsWith(typeaheadBuffer)
    })

    if (matchIndex !== -1) {
      if (matchIndex >= visibleCount.value) {
        visibleCount.value = Math.min(
          Math.ceil((matchIndex + 1) / (props.pageSize || 25)) * (props.pageSize || 25) + 1,
          normalizedOptions.value.length,
        )
      }
      if (!isOpen.value) {
        selectOption(normalizedOptions.value[matchIndex].value)
      } else {
        highlightedIndex.value = matchIndex
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

    <button
      type="button"
      class="select-trigger"
      :id="uid"
      :class="{
        'is-open': isOpen,
        'is-placeholder': !modelValue,
        'has-rich-content': Boolean(selectedOption?.image || selectedOption?.species),
      }"
      @click="toggleDropdown"
      :aria-labelledby="label ? `${uid}-label` : undefined"
      :aria-controls="`${uid}-menu`"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="listbox"
      @keydown="handleKeyDown"
    >
      <div class="selected-content">
        <img
          v-if="selectedOption?.image"
          :src="selectedOption.image"
          :alt="selectedOption.label"
          class="selected-pet-thumb"
        />
        <span class="selected-text">{{ selectedLabel }}</span>
        <span
          v-if="selectedOption && (selectedOption.species || selectedOption.sex || selectedOption.age)"
          class="selected-meta"
        >
          <span v-if="selectedOption.species" class="selected-species">{{ selectedOption.species }}</span>
          <span v-if="selectedOption.sex" class="selected-sex">{{ selectedOption.sex }}</span>
          <span v-if="selectedOption.age" class="selected-age">{{ selectedOption.age }}</span>
        </span>
      </div>
      <span class="chevron" aria-hidden="true">▼</span>
    </button>

    <Teleport to="body">
      <transition name="fade">
        <div
          v-show="isOpen"
          :id="`${uid}-menu`"
          ref="menuRef"
          class="options-menu teleported-menu"
          :class="{ 'variant-borderless': variant === 'borderless' }"
          role="listbox"
          :style="dropdownStyles"
          tabindex="-1"
          @scroll.passive="handleMenuScroll"
        >
          <div
            v-for="(option, idx) in displayedOptions"
            :key="option.value"
            class="option-item"
            :class="{
              'is-selected': isSelected(option.value),
              'is-highlighted': idx === highlightedIndex,
              'is-rich-option': Boolean(option.image || option.species || option.sex || option.age),
            }"
            role="option"
            :aria-selected="isSelected(option.value) ? 'true' : 'false'"
            tabindex="-1"
            @mouseenter="highlightedIndex = idx"
            @click="selectOption(option.value)"
          >
            <div class="option-left">
              <img
                v-if="option.image"
                :src="option.image"
                :alt="option.label"
                class="option-pet-thumb"
                loading="lazy"
              />
              <span
                v-else-if="option.value !== '' && (option.species || option.sex)"
                class="option-pet-thumb-placeholder"
                aria-hidden="true"
              >
                🐾
              </span>
              <span class="option-label">{{ option.label }}</span>
            </div>

            <div class="option-right">
              <div
                v-if="option.species || option.sex || option.age"
                class="option-meta-tags"
              >
                <span v-if="option.species" class="meta-pill meta-species">{{ option.species }}</span>
                <span v-if="option.sex" class="meta-pill meta-sex">{{ option.sex }}</span>
                <span v-if="option.age" class="meta-pill meta-age">{{ option.age }}</span>
              </div>
              <span v-if="isSelected(option.value)" class="check" aria-hidden="true">✓</span>
            </div>
          </div>

          <div
            v-if="pageSize && (isLoadingMore || visibleCount < normalizedOptions.length)"
            class="loading-more-container"
          >
            <div v-if="isLoadingMore" class="loading-more-spinner">
              <span class="loading-dot-pulse" aria-hidden="true"></span>
              <span class="loading-text">{{ loadMoreText }}</span>
            </div>
            <div v-else class="scroll-more-trigger" @click.stop="loadMore">
              <span class="scroll-more-text">
                Scroll to load more ({{ normalizedOptions.length - visibleCount }} remaining)
              </span>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped src="./Select.css"></style>
<style src="./Select.teleported.css"></style>
