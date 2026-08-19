<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import Button from '../../common/ui/Button.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  fastTrack: []
}>()

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
            <span>PetSmart Event Guide</span>
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

          <ul class="checklist" role="list">
            <li class="check-item">
              <div class="item-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div class="item-content">
                <strong>Housing &amp; Landlord Approval</strong>
                <p>If you rent or have an HOA, bring a copy of your lease or pet policy showing pets are permitted.</p>
              </div>
            </li>

            <li class="check-item">
              <div class="item-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div class="item-content">
                <strong>All Household Members</strong>
                <p>Everyone living in the home (including existing dogs for dog meet-and-greets) should attend to ensure a great match.</p>
              </div>
            </li>

            <li class="check-item">
              <div class="item-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div class="item-content">
                <strong>Safe Transport Gear</strong>
                <p>Bring a secure hard-sided cat carrier (for cats/kittens) or a secure leash &amp; collar (for dogs).</p>
              </div>
            </li>

            <li class="check-item">
              <div class="item-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div class="item-content">
                <strong>Valid Government ID &amp; Adoption Fee</strong>
                <p>We accept electronic payments (Venmo, PayPal, Zelle) or major credit cards for adoption fees.</p>
              </div>
            </li>
          </ul>

          <div class="tip-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span><strong>Pro-Tip:</strong> Get pre-approved before Saturday so your application is on file when you arrive at PetSmart!</span>
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
            variant="outline"
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
}

.event-prep-modal {
  background: var(--text-inverse);
  border-radius: var(--radius-xl, 24px);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.25s ease-out;
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
    margin-bottom: 1.25rem;
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
