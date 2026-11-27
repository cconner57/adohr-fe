<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AdoptDetail from '@/components/adopt/adopt-view/AdoptDetail.vue'
import AdoptDetailSkeleton from '@/components/adopt/adopt-view/AdoptDetailSkeleton.vue'
import type { IPet } from '@/models/common'
import { usePetStore } from '@/stores/pets'

const props = defineProps<{
  id?: string
}>()

const route = useRoute()
const router = useRouter()
const store = usePetStore()

const petId = computed(() => (props.id ?? (route.params.id as string | undefined) ?? '').trim())
const pet = ref<IPet | null>(null)
const isLoading = ref(true)
const loadError = ref<string | null>(null)
let activeLoadToken = 0

const loadPetDetail = async () => {
  const targetId = petId.value
  const requestToken = ++activeLoadToken
  loadError.value = null

  if (!targetId) {
    pet.value = null
    isLoading.value = false
    return
  }

  isLoading.value = true
  try {
    const resolved = await store.fetchPetDetail(targetId)
    if (requestToken !== activeLoadToken) return
    pet.value = resolved
  } catch (err: unknown) {
    if (requestToken !== activeLoadToken) return
    pet.value = null
    loadError.value =
      err instanceof Error ? err.message : 'Unable to load this pet profile right now.'
  } finally {
    if (requestToken === activeLoadToken) {
      isLoading.value = false
    }
  }
}

watch(
  petId,
  () => {
    void loadPetDetail()
  },
  { immediate: true },
)
</script>

<template>
  <div class="adopt">
    <div class="content-wrapper">
      <main aria-live="polite">
        <AdoptDetailSkeleton v-if="isLoading" />

        <div v-else-if="loadError" class="empty-state error-state" role="alert">
          <div class="empty-icon-wrap error-icon-wrap" aria-hidden="true">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2>Unable to load pet profile</h2>
          <p>{{ loadError }}</p>
          <div class="empty-actions">
            <button type="button" class="reset-btn retry-btn" @click="loadPetDetail">
              Try again
            </button>
            <button type="button" class="reset-btn secondary" @click="router.push('/adopt')">
              Browse Adoptable Pets
            </button>
          </div>
        </div>

        <AdoptDetail v-else-if="pet" :pet="pet" />

        <div v-else class="empty-state">
          <div class="empty-icon-wrap" aria-hidden="true">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
              <g transform="translate(8, 14.2) rotate(-14) scale(0.85)">
                <ellipse cx="0" cy="2.5" rx="3.4" ry="2.7" />
                <circle cx="-4" cy="-1.4" r="1.4" />
                <circle cx="-1.5" cy="-4" r="1.5" />
                <circle cx="1.5" cy="-4" r="1.5" />
                <circle cx="4" cy="-1.4" r="1.4" />
              </g>
              <g transform="translate(16, 9.8) rotate(14) scale(0.85)">
                <ellipse cx="0" cy="2.5" rx="3.4" ry="2.7" />
                <circle cx="-4" cy="-1.4" r="1.4" />
                <circle cx="-1.5" cy="-4" r="1.5" />
                <circle cx="1.5" cy="-4" r="1.5" />
                <circle cx="4" cy="-1.4" r="1.4" />
              </g>
            </svg>
          </div>
          <h2>Pet not found</h2>
          <p>
            This pet may have already been adopted or the profile link may be out of date.
          </p>
          <div class="empty-actions">
            <button type="button" class="reset-btn" @click="router.push('/adopt')">
              Browse Adoptable Pets
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped src="./Adopt.css"></style>
