<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import Button from '@/components/common/ui/Button.vue'
import Drawer from '@/components/common/ui/Drawer.vue'

interface IChecklistItem {
  id: string
  title: string
  description: string
  iconType: 'members' | 'carrier' | 'video'
}

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    initialSpecies?: 'cat' | 'dog'
  }>(),
  {
    initialSpecies: 'cat',
  },
)

const emit = defineEmits<{
  close: []
}>()

const selectedSpecies = ref<'cat' | 'dog'>(props.initialSpecies)

watch(
  () => props.initialSpecies,
  (newSpecies) => {
    if (newSpecies) {
      selectedSpecies.value = newSpecies
    }
  },
)

const catItems: IChecklistItem[] = [
  {
    id: 'cat-members',
    title: 'All Household Members',
    description:
      'Everyone living in the home should attend to ensure comfort and connection with your new cat or kitten.',
    iconType: 'members',
  },
  {
    id: 'cat-carrier',
    title: 'Secure Cat Carrier (Hard or Soft-Sided)',
    description:
      'Bring a secure hard-sided or soft-sided carrier. For cat safety, cats/kittens are never permitted to leave the event held in arms or without a carrier.',
    iconType: 'carrier',
  },
  {
    id: 'cat-video',
    title: 'Home Walkthrough Video (2–3 mins)',
    description:
      'A 2–3 minute video walkthrough of your home on your phone. We verify window screens are intact, toxic plants (like lilies) are removed, and a quiet initial adjustment room is ready.',
    iconType: 'video',
  },
]

const dogItems: IChecklistItem[] = [
  {
    id: 'dog-members',
    title: 'All Household Members & Resident Dogs',
    description:
      'Everyone living in the home AND any resident dogs should attend for supervised meet-and-greets to confirm compatibility.',
    iconType: 'members',
  },
  {
    id: 'dog-leash',
    title: 'Leash, Collar & Harness',
    description:
      'Bring a standard 4–6 ft leash and properly fitted martingale collar or harness. Retractable flexi-leashes are not permitted on-site.',
    iconType: 'carrier',
  },
  {
    id: 'dog-video',
    title: 'Home & Yard Walkthrough Video (2–3 mins)',
    description:
      'A 2–3 minute video showing your indoor space and yard perimeter (fence height, secure gates/latches, and no access to trash or toxic pool/lawn chemicals).',
    iconType: 'video',
  },
]

const currentItems = computed(() => {
  return selectedSpecies.value === 'cat' ? catItems : dogItems
})
</script>

<template>
  <Drawer
    :isOpen="isOpen"
    title="What to Bring to the Event"
    placement="right"
    mobilePlacement="bottom"
    width="520px"
    @close="emit('close')"
  >
    <div class="prep-drawer-content">
      <p class="drawer-desc">
        Adoptions can be finalized on-site for pre-approved applicants! To help our volunteers
        safely complete your adoption, please arrive prepared with the following:
      </p>

      <!-- Species Switcher -->
      <div class="species-switch" role="tablist" aria-label="Checklist animal type">
        <button
          type="button"
          role="tab"
          class="switch-btn"
          :class="{ active: selectedSpecies === 'cat' }"
          :aria-selected="selectedSpecies === 'cat'"
          @click="selectedSpecies = 'cat'"
        >
          <span aria-hidden="true">🐱</span>
          <span>Cat or Kitten</span>
        </button>
        <button
          type="button"
          role="tab"
          class="switch-btn"
          :class="{ active: selectedSpecies === 'dog' }"
          :aria-selected="selectedSpecies === 'dog'"
          @click="selectedSpecies = 'dog'"
        >
          <span aria-hidden="true">🐶</span>
          <span>Dog or Puppy</span>
        </button>
      </div>

      <!-- Checklist Items -->
      <ul class="checklist" role="list">
        <li v-for="(item, idx) in currentItems" :key="item.id" class="check-item">
          <div class="item-num" aria-hidden="true">{{ idx + 1 }}</div>
          <div class="item-text">
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </li>
      </ul>

      <!-- Notice Box -->
      <div class="notice-box">
        <svg
          class="notice-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div class="notice-text">
          <strong>Adoption Fee Payment</strong>
          <p>
            Adoption donations cover full spay/neuter, microchipping, deworming, and core vaccines.
            Cash, credit/debit card, Zelle, and Apple Pay are accepted at the venue.
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="drawer-footer-actions">
        <Button
          title="Got it, thanks!"
          variant="primary"
          color="blue"
          size="medium"
          :fullWidth="true"
          @click="emit('close')"
        />
      </div>
    </template>
  </Drawer>
</template>

<style scoped lang="css">
.prep-drawer-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.25rem 0;
}

.drawer-desc {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.species-switch {
  display: flex;
  background-color: var(--color-neutral-surface);
  border: 1px solid var(--line-ink);
  border-radius: var(--radius-full);
  padding: 4px;
  gap: 4px;
}

.switch-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: var(--text-primary);
  }

  &.active {
    background-color: var(--text-inverse);
    color: var(--color-primary);
    box-shadow: var(--shadow-sm);
  }
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.check-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  border-radius: var(--radius-md);
  background-color: var(--color-primary-surface);
  border: 1px solid var(--color-primary-border);

  .item-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: var(--color-primary);
    color: var(--text-inverse);
    font-weight: 800;
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  .item-text {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
    }

    p {
      margin: 0;
      font-size: 0.88rem;
      line-height: 1.5;
      color: var(--text-secondary);
    }
  }
}

.notice-box {
  display: flex;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background-color: var(--color-warning-surface);
  border: 1px solid var(--color-warning-border);
  color: var(--color-warning-dark);

  .notice-icon {
    flex-shrink: 0;
    color: var(--color-secondary);
    margin-top: 2px;
  }

  .notice-text {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    strong {
      font-size: 0.92rem;
      color: var(--text-primary);
    }

    p {
      margin: 0;
      font-size: 0.85rem;
      line-height: 1.45;
      color: var(--text-secondary);
    }
  }
}

.drawer-footer-actions {
  width: 100%;
}
</style>
