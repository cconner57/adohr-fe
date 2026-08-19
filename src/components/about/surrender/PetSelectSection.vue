<script setup lang="ts">
const { formError, selectedAnimal } = defineProps<{
  formError: boolean
  selectedAnimal: 'dog' | 'cat' | null
}>()

const emit = defineEmits(['update:selectedAnimal'])

const updateSelectedAnimal = (value: 'dog' | 'cat') => {
  emit('update:selectedAnimal', value)
}
</script>

<template>
  <h2 class="section-title">Will you be surrendering Dog(s) or Cat(s)?</h2>
  <div class="times" :class="{ 'has-error': formError }">
    <label class="time-card">
      <input
        type="radio"
        name="animal"
        value="dog"
        :checked="selectedAnimal === 'dog'"
        @change="updateSelectedAnimal('dog')"
      />
      <div class="time-card__content">
        <strong>Dog(s)</strong>
        <small>Select if you are surrendering dog(s) or puppies</small>
      </div>
    </label>

    <label class="time-card">
      <input
        type="radio"
        name="animal"
        value="cat"
        :checked="selectedAnimal === 'cat'"
        @change="updateSelectedAnimal('cat')"
      />
      <div class="time-card__content">
        <strong>Cat(s)</strong>
        <small>Select if you are surrendering cat(s) or kittens</small>
      </div>
    </label>
  </div>
</template>

<style scoped lang="css">
.times {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 4rem;
}

.times.has-error .time-card {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 1px var(--color-danger);
}

.time-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);
  cursor: pointer;
  user-select: none;
  transition:
    background 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}

.time-card > input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.time-card:has(> input:checked) {
  background: color-mix(in srgb, var(--color-primary) 10%, #fff);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

.time-card:has(> input:focus-visible) {
  box-shadow: 0 0 0 3px oklch(from var(--color-secondary) l c h / 45%);
}

.time-card__content small {
  color: var(--color-neutral-text-soft);
  display: block;
  margin-top: 4px;
}

@supports not (selector(:has(*))) {
  .time-card > input:checked + .time-card__content {
    background: var(--color-primary-weak);
    border-radius: 10px;
    margin: -12px;
    padding: 12px;
    box-shadow: 0 0 0 2px var(--color-primary-border-strong) inset;
  }
}

.error {
  color: var(--color-danger);
  font-size: 1.5rem;
  margin-top: -2rem;
}
</style>
