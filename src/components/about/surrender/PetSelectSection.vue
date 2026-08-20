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
  <div class="pet-select-container">
    <h2 class="select-question-title">Will you be surrendering Dog(s) or Cat(s)?</h2>
    <div class="times" :class="{ 'has-error': formError }">
      <label class="time-card" :class="{ selected: selectedAnimal === 'dog' }">
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

      <label class="time-card" :class="{ selected: selectedAnimal === 'cat' }">
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
  </div>
</template>

<style scoped lang="css">
.pet-select-container {
  margin: 1rem 0 2rem;
}

.select-question-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem;
}

.times {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 2rem;
}

.times.has-error .time-card {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 1.5px var(--color-danger);
}

.time-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  border-radius: var(--radius-lg, 12px);
  background: var(--text-inverse);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-secondary);
    background: oklch(from var(--color-secondary) 98% 0.02 h);
  }

  &.selected {
    background: oklch(from var(--color-primary) 96% 0.04 h);
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary) inset;
  }
}

.time-card > input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.time-card__content strong {
  display: block;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.time-card__content small {
  color: var(--text-secondary);
  display: block;
  margin-top: 4px;
  font-size: 0.88rem;
  line-height: 1.4;
}
</style>
