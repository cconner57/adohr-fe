<script setup lang="ts">
import { ref, watch } from 'vue'

import Button from '../common/ui/Button.vue'

const props = defineProps<{
  isOpen: boolean
  currentFilters: {
    age: string[]
    size: string[]
    sex: string
    goodWith: string[]
    special: string[]
  }
}>()

const emit = defineEmits<{
  close: []
  apply: [filters: {
    age: string[]
    size: string[]
    sex: string
    goodWith: string[]
    special: string[]
  }]
  clear: []
}>()

const localFilters = ref({
  age: [] as string[],
  size: [] as string[],
  sex: '',
  goodWith: [] as string[],
  special: [] as string[],
})

watch(
  () => props.currentFilters,
  (newVal) => {
    localFilters.value = JSON.parse(JSON.stringify(newVal))
    if (!localFilters.value.special) {
      localFilters.value.special = []
    }
  },
  { deep: true, immediate: true },
)

const toggleArrayFilter = (category: 'age' | 'size' | 'goodWith' | 'special', value: string) => {
  if (!localFilters.value[category]) {
    localFilters.value[category] = []
  }
  const index = localFilters.value[category].indexOf(value)
  if (index === -1) {
    localFilters.value[category].push(value)
  } else {
    localFilters.value[category].splice(index, 1)
  }
}

const toggleSex = (value: string) => {
  localFilters.value.sex = localFilters.value.sex === value ? '' : value
}

const applyFilters = () => {
  emit('apply', localFilters.value)

  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="filter-panel">
    <div class="filter-sections">
      <section>
        <h4>Age</h4>
        <div class="chips">
          <button
            v-for="opt in ['Baby', 'Young', 'Adult', 'Senior']"
            :key="opt"
            :class="{ active: localFilters.age.includes(opt.toLowerCase()) }"
            @click="toggleArrayFilter('age', opt.toLowerCase())"
          >
            {{ opt }}
          </button>
        </div>
      </section>

      <section>
        <h4>Size</h4>
        <div class="chips">
          <button
            v-for="opt in ['Small', 'Medium', 'Large', 'Extra-Large']"
            :key="opt"
            :class="{ active: localFilters.size.includes(opt.toLowerCase()) }"
            @click="toggleArrayFilter('size', opt.toLowerCase())"
          >
            {{ opt }}
          </button>
        </div>
      </section>

      <section>
        <h4>Sex</h4>
        <div class="chips">
          <button
            v-for="opt in ['Female', 'Male']"
            :key="opt"
            :class="{ active: localFilters.sex === opt.toLowerCase() }"
            @click="toggleSex(opt.toLowerCase())"
          >
            {{ opt }}
          </button>
        </div>
      </section>

      <section>
        <h4>Good With</h4>
        <div class="chips">
          <button
            v-for="opt in ['Kids', 'Dogs', 'Cats']"
            :key="opt"
            :class="{ active: localFilters.goodWith.includes(opt.toLowerCase()) }"
            @click="toggleArrayFilter('goodWith', opt.toLowerCase())"
          >
            {{ opt }}
          </button>
        </div>
      </section>

      <section>
        <h4>Special Tags</h4>
        <div class="chips">
          <button
            v-for="opt in [
              { label: 'Special Needs', value: 'special-needs' },
              { label: 'Bonded Pair', value: 'bonded' },
              { label: 'Coming Soon', value: 'coming-soon' }
            ]"
            :key="opt.value"
            :class="{ active: localFilters.special?.includes(opt.value) }"
            @click="toggleArrayFilter('special', opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>
    </div>

    <footer>
      <Button title="Clear All" color="white" @click="$emit('clear')" size="medium" />
      <div class="actions">
        <Button title="Show Results" color="green" @click="applyFilters" size="medium" />
      </div>
    </footer>
  </div>
</template>

<style scoped>
.filter-panel {
  width: 100%;
  max-width: 800px;
  background: var(--color-white);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

section {
  display: flex;
  flex-direction: column;
  gap: 12px;

  h4 {
    margin: 0;
    font-size: 1rem;
    color: #666;
    font-weight: 600;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  button {
    all: unset;
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    background: #f8f9fa;
    font-size: 0.9rem;
    color: #444;
    cursor: pointer;
    transition: all var(--transition-normal);

    &:hover {
      background: #eee;
    }

    &.active {
      background: var(--color-primary);
      color: var(--color-white);
      border-color: var(--color-primary);
    }
  }
}

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 12px;
}

@media (width <= 480px) {
  footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .actions {
    width: 100%;
    display: flex;
    gap: 12px;

    button {
      width: 100%;
    }
  }
}

@media (width >= 600px) {
  .filter-sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
