<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    label?: string
    disabled?: boolean
    labelPosition?: 'left' | 'right'
    fullWidth?: boolean
  }>(),
  {
    modelValue: false,
    disabled: false,
    labelPosition: 'right',
    fullWidth: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div
    class="toggle-wrapper"
    :class="{
      disabled: props.disabled,
      'label-left': props.labelPosition === 'left',
      'full-width': props.fullWidth,
    }"
    @click="toggle"
  >
    <button
      type="button"
      class="toggle-switch"
      :class="{ active: props.modelValue }"
      role="switch"
      :aria-checked="props.modelValue"
      :aria-label="props.label || 'Toggle'"
      :disabled="props.disabled"
      @click.stop="toggle"
      @keydown.space.prevent="toggle"
      @keydown.enter.prevent="toggle"
    >
      <span class="toggle-thumb" aria-hidden="true" />
    </button>
    <span v-if="props.label" class="toggle-label">{{ props.label }}</span>
  </div>
</template>

<style scoped>
.toggle-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.toggle-wrapper.full-width {
  width: 100%;
  justify-content: space-between;
}

.toggle-wrapper.label-left {
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.toggle-wrapper.label-left.full-width {
  justify-content: space-between;
}

.toggle-wrapper.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background-color: var(--color-neutral-border-strong, #ccc);
  border: none;
  border-radius: var(--radius-full, 9999px);
  padding: 2px;
  transition: background-color 0.2s ease;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.toggle-switch:focus-visible {
  outline: 2px solid var(--color-primary-focus, var(--color-primary, #173829));
  outline-offset: 2px;
}

.toggle-switch:disabled {
  cursor: not-allowed;
}

.toggle-switch.active {
  background-color: var(--color-primary, #173829);
}

.toggle-thumb {
  width: 20px;
  height: 20px;
  background-color: var(--color-white, #fff);
  border-radius: 50%;
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
  display: block;
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(20px);
}

.toggle-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
}
</style>
