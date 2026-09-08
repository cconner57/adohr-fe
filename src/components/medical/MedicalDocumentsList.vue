<script setup lang="ts">
import Button from '@/components/common/ui/Button.vue'
import { useMedicalRecords } from '@/composables/useMedicalRecords'
import type { IPetMedicalDocument } from '@/models/common'

const props = defineProps<{
  documents: IPetMedicalDocument[]
  petName?: string
}>()

const { downloadDocument, formatFileSize } = useMedicalRecords()

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Recent'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getCategoryLabel = (category?: string) => {
  switch (category) {
    case 'vaccination':
      return 'Vaccine Record'
    case 'spay_neuter':
      return 'Sterilization Proof'
    case 'intake_exam':
      return 'Intake Exam'
    case 'lab_results':
      return 'Lab & Diagnostics'
    default:
      return 'Medical Record'
  }
}
</script>

<template>
  <section class="documents-section" aria-labelledby="documents-title">
    <div class="section-header">
      <div class="header-text">
        <h2 id="documents-title">Official Medical Documents &amp; PDFs</h2>
        <p class="section-sub">
          Download certified PDF records for your veterinarian, pet insurance claims, or personal archives.
        </p>
      </div>
      <div v-if="props.documents.length > 0" class="doc-count-badge">
        {{ props.documents.length }} {{ props.documents.length === 1 ? 'Document' : 'Documents' }}
      </div>
    </div>

    <div v-if="props.documents.length > 0" class="documents-grid">
      <article
        v-for="doc in props.documents"
        :key="doc.id"
        class="document-card"
      >
        <div class="doc-icon-wrap" aria-hidden="true">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span class="pdf-tag">PDF</span>
        </div>

        <div class="doc-body">
          <div class="doc-top-row">
            <span class="category-pill">{{ getCategoryLabel(doc.category) }}</span>
            <span class="file-size">{{ formatFileSize(doc.fileSizeBytes) }}</span>
          </div>

          <h3 class="doc-title">{{ doc.title }}</h3>

          <p v-if="doc.notes" class="doc-notes">{{ doc.notes }}</p>

          <div class="doc-meta">
            <span v-if="doc.veterinarian" class="meta-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .2.3V9a4 4 0 0 1-8 0V2.3z" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
              <span>{{ doc.veterinarian }}</span>
            </span>
            <span class="meta-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{{ formatDate(doc.uploadedAt) }}</span>
            </span>
          </div>
        </div>

        <div class="doc-action">
          <Button
            theme="secondary"
            size="small"
            :onClick="() => downloadDocument(doc)"
            title="Download"
          />
        </div>
      </article>
    </div>

    <div v-else class="empty-docs">
      <div class="empty-icon-wrap" aria-hidden="true">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h3>No Attached PDF Records Yet</h3>
      <p>
        Digital medical files for {{ props.petName || 'this pet' }} have not been uploaded yet.
        Please check back soon or contact ADOHR if you need physical records expedited.
      </p>
    </div>
  </section>
</template>

<style scoped lang="css">
.documents-section {
  margin-top: 2rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--line-ink);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--color-primary);
    margin: 0 0 4px;
  }

  .section-sub {
    font-size: 0.92rem;
    color: var(--text-secondary);
    margin: 0;
  }

  .doc-count-badge {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    background-color: oklch(from var(--color-secondary) 94% 0.05 h);
    color: var(--color-secondary);
    border: 1px solid oklch(from var(--color-secondary) 84% 0.08 h);
    white-space: nowrap;
    flex-shrink: 0;
  }
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;

  @media (width <= 640px) {
    grid-template-columns: 1fr;
  }
}

.document-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border: 1.5px solid var(--line-ink);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-secondary-border-strong);
  }
}

.doc-icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-secondary);
  margin-bottom: 10px;

  .pdf-tag {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    background-color: var(--color-secondary);
    color: var(--color-white);
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.doc-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.doc-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.category-pill {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-primary);
  background-color: oklch(from var(--color-primary) 95% 0.03 h);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.file-size {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.doc-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 2px 0 0;
  line-height: 1.3;
}

.doc-notes {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
}

.doc-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  font-size: 0.78rem;
  color: var(--text-secondary);

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 5px;

    svg {
      flex-shrink: 0;
      color: var(--text-secondary);
    }
  }
}

.doc-action {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px dashed var(--line-ink);
}

.empty-docs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 36px 20px;
  background-color: oklch(from var(--color-neutral-weak) l c h / 50%);
  border-radius: var(--radius-md);
  border: 1px dashed var(--line-ink);

  .empty-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    margin-bottom: 12px;
    opacity: 0.85;
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 6px;
  }

  p {
    font-size: 0.88rem;
    color: var(--text-secondary);
    max-width: 460px;
    margin: 0 auto;
    line-height: 1.5;
  }
}
</style>
