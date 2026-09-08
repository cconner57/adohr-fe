<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import Button from '../../common/ui/Button.vue'

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
  fastTrack: []
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
  { id: 'cat-members', title: 'All Household Members', description: 'Everyone living in the home should attend to ensure comfort and connection with your new cat or kitten.', iconType: 'members' },
  { id: 'cat-carrier', title: 'Secure Cat Carrier (Hard or Soft-Sided)', description: 'Bring a secure hard-sided or soft-sided carrier. For cat safety, cats/kittens are never permitted to leave the event held in arms or without a carrier.', iconType: 'carrier' },
  { id: 'cat-video', title: 'Home Walkthrough Video (2–3 mins)', description: 'A 2–3 minute video walkthrough of your home on your phone. We verify window screens are intact, toxic plants (like lilies) are removed, and a quiet initial adjustment room is ready.', iconType: 'video' },
]

const dogItems: IChecklistItem[] = [
  { id: 'dog-members', title: 'All Household Members & Resident Dogs', description: 'Everyone living in the home AND any resident dogs should attend for supervised meet-and-greets to confirm compatibility.', iconType: 'members' },
  { id: 'dog-leash', title: 'Leash, Collar & Harness', description: 'Bring a standard 4–6 ft leash and properly fitted martingale collar or harness. Retractable flexi-leashes are not permitted on-site.', iconType: 'carrier' },
  { id: 'dog-video', title: 'Home & Yard Walkthrough Video (2–3 mins)', description: 'A 2–3 minute video showing your indoor space and yard perimeter (fence height, secure gates/latches, and no access to trash or toxic pool/lawn chemicals).', iconType: 'video' },
]

const currentItems = computed(() => {
  return selectedSpecies.value === 'cat' ? catItems : dogItems
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="event-prep-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prep-modal-title"
      @click.self="emit('close')"
    >
      <div class="event-prep-modal">
        <header class="modal-header">
          <div class="header-badge">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>IDOHR Event Guide</span>
          </div>
          <button
            type="button"
            class="close-btn"
            aria-label="Close modal"
            @click="emit('close')"
          >
            &times;
          </button>
        </header>

        <div class="modal-body">
          <h2 id="prep-modal-title">What to Bring to Our Weekend Adoption Event</h2>
          <p class="intro">
            We hold adoption events every <strong>Saturday &amp; Sunday (12 PM &ndash; 4 PM)</strong> at
            <strong>PetSmart Pasadena</strong> (3347 E Foothill Blvd). To make your adoption smooth and same-day ready, please bring:
          </p>

          <!-- Species Toggle with Vector SVGs -->
          <div class="species-toggle-container">
            <div class="species-toggle-group" role="tablist" aria-label="Adoption preparation pet type">
              <button
                type="button"
                role="tab"
                :aria-selected="selectedSpecies === 'cat'"
                class="species-toggle-btn"
                :class="{ active: selectedSpecies === 'cat' }"
                @click="selectedSpecies = 'cat'"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="toggle-icon"
                  aria-hidden="true"
                >
                  <path d="M12 5c-4 0-7.5 3-7.5 7.5 0 4.1 3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5c0-4.5-3.5-7.5-7.5-7.5z" />
                  <path d="M4.8 9.5L3 3l6.5 2.5" />
                  <path d="M19.2 9.5L21 3l-6.5 2.5" />
                  <circle cx="9" cy="13" r="1" fill="currentColor" />
                  <circle cx="15" cy="13" r="1" fill="currentColor" />
                  <path d="M11 15.5h2l-1 1z" fill="currentColor" />
                </svg>
                <span>Cats &amp; Kittens</span>
              </button>
              <button
                type="button"
                role="tab"
                :aria-selected="selectedSpecies === 'dog'"
                class="species-toggle-btn"
                :class="{ active: selectedSpecies === 'dog' }"
                @click="selectedSpecies = 'dog'"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="toggle-icon"
                  aria-hidden="true"
                >
                  <path d="M12 4.5c-3.8 0-7 3-7 7 0 4.2 3.2 7.5 7 7.5s7-3.3 7-7.5c0-4-3.2-7-7-7z" />
                  <path d="M5.5 8.5C3.5 10 2 13 2.5 15.5c.3 1.5 1.5 2 2.5 1" />
                  <path d="M18.5 8.5c2 1.5 3.5 4.5 3 7-.3 1.5-1.5 2-2.5 1" />
                  <circle cx="9" cy="11.5" r="1" fill="currentColor" />
                  <circle cx="15" cy="11.5" r="1" fill="currentColor" />
                  <path d="M10.5 15h3l-1.5 1.5z" fill="currentColor" />
                  <path d="M12 16.5v2" />
                </svg>
                <span>Dogs &amp; Puppies</span>
              </button>
            </div>
          </div>

          <!-- Dynamic Checklist Items -->
          <ul class="checklist" role="list">
            <li v-for="item in currentItems" :key="item.id" class="check-item">
              <div class="item-icon" aria-hidden="true">
                <svg v-if="item.iconType === 'members'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <svg v-else-if="item.iconType === 'carrier'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <div class="item-content">
                <strong>{{ item.title }}</strong>
                <p>{{ item.description }}</p>
              </div>
            </li>
          </ul>

          <div class="tip-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span v-if="selectedSpecies === 'cat'">
              <strong>Cat Pro-Tip:</strong> Setting up a quiet safe room with food, water, litter box, and a scratcher will help your new kitty decompress comfortably during their first week!
            </span>
            <span v-else>
              <strong>Dog Pro-Tip:</strong> Bring your resident dog's favorite high-value treats to make the supervised on-site meet-and-greet smooth and positive!
            </span>
          </div>
        </div>

        <footer class="modal-footer">
          <Button
            title="Fast-Track Pre-Approval"
            color="blue"
            @click="emit('fastTrack')"
          />
          <Button
            title="Got it, thanks!"
            variant="secondary"
            color="blue"
            @click="emit('close')"
          />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="css">
.event-prep-overlay {
  position: fixed;
  inset: 0;
  background-color: oklch(from var(--text-primary) l c h / 65%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal, 1000);
  padding: 1rem;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.2s ease-out;
  transition: opacity 0.25s ease, backdrop-filter 0.25s ease;
  transition-behavior: allow-discrete;

  @starting-style {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
}

.event-prep-modal {
  background: var(--text-inverse);
  border-radius: var(--radius-conditional-xl, max(0px, min(var(--radius-xl, 24px), (100vw - 100%) * 9999)));
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.25s ease-out;
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  transition-behavior: allow-discrete;

  @starting-style {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-primary-strong);
    background-color: var(--color-primary-weak);
    padding: 4px 10px;
    border-radius: var(--radius-full);
  }

  .close-btn {
    background: transparent;
    border: none;
    font-size: 1.75rem;
    line-height: 1;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 4px 8px;
    border-radius: var(--radius-sm);

    &:hover {
      color: var(--text-primary);
    }
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;

  h2 {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  .intro {
    font-size: 0.92rem;
    line-height: 1.55;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }
}

.species-toggle-container {
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: center;
}

.species-toggle-group {
  display: inline-flex;
  padding: 4px;
  background-color: oklch(from var(--text-primary) l c h / 6%);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 14%));
  border-radius: var(--radius-full);
  gap: 4px;
  width: 100%;
  max-width: 360px;

  .species-toggle-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: var(--radius-full);
    border: none;
    background: transparent;
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;

    .toggle-icon {
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    &:hover {
      color: var(--text-primary);
      background-color: oklch(from var(--text-primary) l c h / 4%);
    }

    &.active {
      background-color: var(--color-primary);
      color: var(--text-inverse);
      box-shadow: 0 2px 8px oklch(from var(--color-primary) l c h / 30%);
    }
  }
}

.checklist {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  .check-item {
    display: flex;
    gap: 0.875rem;
    align-items: flex-start;
    padding: 0.75rem 1rem;
    background-color: oklch(from var(--text-primary) l c h / 3%);
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 10%));
    border-radius: var(--radius-md, 12px);

    .item-icon {
      color: var(--color-secondary);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .item-content {
      strong {
        display: block;
        font-size: 0.95rem;
        color: var(--text-primary);
        margin-bottom: 2px;
      }

      p {
        font-size: 0.84rem;
        line-height: 1.45;
        color: var(--text-secondary);
        margin: 0;
      }
    }
  }
}

.tip-box {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  background-color: var(--color-primary-weak);
  border: 1px solid var(--color-primary-border);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--color-primary-strong);

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 12%));
  background-color: oklch(from var(--text-inverse) 98% c h);

  @media (width <= 480px) {
    flex-direction: column;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
