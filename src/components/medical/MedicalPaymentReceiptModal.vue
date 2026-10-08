<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import type { IAdopterPaymentInfo } from '@/models/common'

const props = defineProps<{
  isOpen: boolean
  adopter: IAdopterPaymentInfo
  petName?: string
  species?: string
  microchipId?: string | null
}>()

const emit = defineEmits<{
  close: []
  print: []
}>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

const handlePrint = () => {
  window.print()
  emit('print')
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
      class="receipt-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      @click.self="emit('close')"
    >
      <div class="receipt-dialog">
        <!-- Modal Toolbar (Hidden during print) -->
        <div class="modal-toolbar no-print">
          <span class="toolbar-title">Adoption Payment Receipt</span>
          <div class="toolbar-actions">
            <button
              class="toolbar-btn primary"
              type="button"
              title="Print Receipt"
              @click="handlePrint"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Print Receipt</span>
            </button>
            <button
              class="toolbar-btn close-btn"
              type="button"
              aria-label="Close Receipt Modal"
              @click="emit('close')"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Official Printable Receipt Sheet -->
        <div class="receipt-sheet" id="printable-adoption-receipt">
          <!-- Receipt Header / Letterhead -->
          <div class="sheet-header">
            <div class="org-brand">
              <img
                src="/images/adohr-logo.png"
                alt="ADOHR Logo"
                class="org-logo"
                width="54"
                height="54"
              />
              <div class="org-info">
                <span class="org-name">A DREAM OF HOME RESCUE</span>
                <span class="org-sub">501(c)(3) Nonprofit Animal Rescue Organization</span>
                <span class="org-contact">help.adohr@gmail.com · www.adohr.org</span>
              </div>
            </div>

            <div class="receipt-meta">
              <span class="receipt-tag">OFFICIAL RECEIPT</span>
              <h2 id="receipt-modal-title" class="receipt-number">{{ adopter.receiptNumber }}</h2>
              <span class="receipt-date">Date: {{ adopter.paymentDate }}</span>
            </div>
          </div>

          <div class="sheet-divider"></div>

          <!-- Adopter & Pet Two-Column Meta -->
          <div class="meta-columns">
            <div class="meta-box">
              <span class="box-heading">Adopter Details</span>
              <p class="meta-line"><strong>Name:</strong> {{ adopter.adopterName }}</p>
              <p class="meta-line"><strong>Contact Email Address:</strong> {{ adopter.email }}</p>
            </div>

            <div class="meta-box">
              <span class="box-heading">Adopted Pet Profile</span>
              <p class="meta-line"><strong>Pet Name:</strong> {{ petName || 'Adopted Pet' }}</p>
              <p class="meta-line"><strong>Species:</strong> {{ species || 'Pet' }}</p>
              <p v-if="microchipId" class="meta-line"><strong>Microchip ID:</strong> #{{ microchipId }}</p>
              <p class="meta-line"><strong>Placement Date:</strong> {{ adopter.paymentDate }}</p>
            </div>
          </div>

          <!-- Itemized Table -->
          <div class="table-wrap">
            <table class="receipt-table">
              <thead>
                <tr>
                  <th class="col-desc">Description of Adoption Services</th>
                  <th class="col-status">Status</th>
                  <th class="col-amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fee, index) in adopter.itemizedFees" :key="index">
                  <td class="col-desc">
                    <span class="fee-name">{{ fee.label }}</span>
                  </td>
                  <td class="col-status">
                    <span class="table-badge" :class="{ free: fee.included }">
                      {{ fee.included ? 'Included' : 'Paid' }}
                    </span>
                  </td>
                  <td class="col-amount" :class="{ 'fee-free': fee.included }">
                    {{ fee.amount }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" class="total-label">Total Adoption Placement Fee Paid:</td>
                  <td class="total-amount">{{ adopter.adoptionFee }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Transaction Record -->
          <div class="txn-record">
            <div class="txn-field">
              <span class="txn-label">Payment Method:</span>
              <span class="txn-val">{{ adopter.paymentMethod }}</span>
            </div>
            <div class="txn-field">
              <span class="txn-label">{{ adopter.zelleConfirmationId ? 'Zelle Confirmation ID:' : 'Transaction Reference:' }}</span>
              <span class="txn-val font-mono">{{ adopter.zelleConfirmationId || adopter.transactionId }}</span>
            </div>
            <div class="txn-field">
              <span class="txn-label">Payment Status:</span>
              <span class="txn-badge paid">PAID IN FULL</span>
            </div>
          </div>

          <!-- Legal & Rescue Acknowledgment -->
          <div class="sheet-disclaimer">
            <p>
              This official receipt verifies full payment for the pet adoption detailed above. A Dream of Home Rescue
              is a recognized 501(c)(3) nonprofit public charity. Adoption fees help cover rescue transportation,
              veterinary medical care, spay/neuter sterilization, and vital preventative immunizations.
            </p>
            <div class="sign-off">
              <div class="signature-line">
                <span class="sig-title">Authorized Representative</span>
                <span class="sig-name">ADOHR Adoptions &amp; Finance Team</span>
              </div>
              <div class="tax-info">
                <span>Tax ID / 501(c)(3) Nonprofit</span>
                <span>Thank you for choosing adoption!</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions (Hidden in print) -->
        <div class="modal-footer no-print">
          <button class="action-btn secondary" type="button" @click="emit('close')">
            Close
          </button>
          <button class="action-btn primary" type="button" @click="handlePrint">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped src="./MedicalPaymentReceiptModal.css"></style>

