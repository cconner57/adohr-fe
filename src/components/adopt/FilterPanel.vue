<script setup lang="ts">
import { ref, watch } from 'vue'

import Button from '../common/ui/Button.vue'
import Drawer from '../common/ui/Drawer.vue'

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

const handleClear = () => {
  localFilters.value = {
    age: [],
    size: [],
    sex: '',
    goodWith: [],
    special: [],
  }
  emit('clear')
}

const applyFilters = () => {
  emit('apply', localFilters.value)
  emit('close')
}
</script>

<template>
  <Drawer
    :isOpen="isOpen"
    title="Filter Pets"
    placement="right"
    mobilePlacement="right"
    width="440px"
    @close="emit('close')"
  >
    <div class="filter-sections">
      <section>
        <h4>Age</h4>
        <div class="chips">
          <button
            v-for="opt in ['Baby', 'Young', 'Adult', 'Senior']"
            :key="opt"
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
            :class="{ active: localFilters.goodWith.includes(opt.toLowerCase()) }"
            @click="toggleArrayFilter('goodWith', opt.toLowerCase())"
          >
            {{ opt }}
          </button>
        </div>
      </section>

      <section class="special-tags-section">
        <h4>Special Tags</h4>
        <div class="chips">
          <button
            v-for="opt in [
              { label: 'Special Needs', value: 'special-needs' },
              { label: 'Bonded Pair', value: 'bonded' },
              { label: 'Fee Sponsored', value: 'sponsored' },
              { label: 'Saved Pets', value: 'saved' },
              { label: 'Coming Soon', value: 'coming-soon' }
            ]"
            :key="opt.value"
            type="button"
            :class="{ active: localFilters.special?.includes(opt.value) }"
            @click="toggleArrayFilter('special', opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="filter-drawer-footer">
        <Button title="Show Results" color="green" @click="applyFilters" size="medium" :fullWidth="true" />
        <Button title="Clear All" color="white" @click="handleClear" size="medium" :fullWidth="true" />
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
.filter-sections {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

section {
  display: flex;
  flex-direction: column;
  gap: 10px;

  h4 {
    margin: 0;
    font-size: 0.88rem;
    color: var(--text-secondary);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  button {
    all: unset;
    padding: 7px 16px;
    border-radius: var(--radius-full, 9999px);
    border: 1px solid var(--line-ink, #e0e0e0);
    background: #f8f9fa;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--transition-normal);

    &:hover {
      background: #eee;
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    &.active {
      background: var(--color-primary);
      color: var(--color-white);
      border-color: var(--color-primary);
    }
  }
}

.filter-drawer-footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
}
</style>
