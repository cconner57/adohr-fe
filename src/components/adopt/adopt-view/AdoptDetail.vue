<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import type { IPet } from '../../../models/common.ts'
import { useAdoptionStore } from '../../../stores/adoption'
import { usePetStore } from '../../../stores/pets'
import { useUIStore } from '../../../stores/ui'
import { vibrate } from '../../../utils/haptics.ts'
import PreQualModal from '../../common/ui/PreQualModal.vue'
import AdoptDetailAbout from './AdoptDetailAbout.vue'
import AdoptDetailInfo from './AdoptDetailInfo.vue'
import AdoptDetailLittermates from './AdoptDetailLittermates.vue'
import AdoptDetailMedia from './AdoptDetailMedia.vue'
import AdoptDrawer from './AdoptDrawer.vue'
import RequestInfoDrawer from './RequestInfoDrawer.vue'

const props = defineProps<{
  pet: IPet
}>()

const router = useRouter()
const adoptionStore = useAdoptionStore()
const petStore = usePetStore()
const { currentPets } = storeToRefs(petStore)
const isDrawerOpen = ref(false)
const isInfoDrawerOpen = ref(false)
const isPreQualOpen = ref(false)

onMounted(() => {
  if (currentPets.value.length === 0) {
    petStore.fetchPetsList()
  }
})

const littermates = computed<IPet[]>(() => {
  // If the API directly populates littermates array in the future
  const dynamicPet = props.pet as unknown as { littermates?: IPet[] }
  if (dynamicPet.littermates && Array.isArray(dynamicPet.littermates)) {
    return dynamicPet.littermates
  }

  // Filter currentPets from store if litterName is present
  if (!props.pet.litterName || !props.pet.litterName.trim()) return []
  const normalizedLitter = props.pet.litterName.trim().toLowerCase()
  return currentPets.value.filter(
    (p) =>
      p.id !== props.pet.id &&
      p.litterName &&
      p.litterName.trim().toLowerCase() === normalizedLitter,
  )
})

const isComingSoon = computed(() => {
  const normalizedStatus = props.pet.details?.status?.trim().toLowerCase() ?? ''
  return (
    normalizedStatus === 'intake' ||
    normalizedStatus === 'intake-processing' ||
    normalizedStatus === 'intake processing'
  )
})

const isStartAdoptionDisabled = computed(() => isComingSoon.value)

const fallbackBioStories = [
  (petName: string) =>
    `Hi, I'm ${petName}, and I'm still putting the finishing touches on my story. I've got tail wags, zoomies, and cozy nap-time highlights to share. Come back soon so I can tell you all about my favorite things and the kind of home I'm dreaming of.`,
  (petName: string) =>
    `Hey there, I'm ${petName}! I'm busy polishing up my autobiography between snack breaks and power naps. Check back soon, because I can't wait to share my funniest moments and what makes me happiest.`,
  (petName: string) =>
    `Paws up, I'm ${petName}, and my story is still in the editing phase. I'm choosing the very best tales from my adventures, silly quirks, and cuddle routines. Swing by again soon to read the full version straight from me.`,
  (petName: string) =>
    `Hello friend, I'm ${petName}, and my personal bio is almost ready for the spotlight. I'm gathering my best memories, favorite toys, and dream-home wishlist to share with you. Come back soon and I'll spill all the details.`,
  (petName: string) =>
    `It's me, ${petName}! I'm currently working with my imaginary editor to craft the perfect story. There will be heartwarming chapters, goofy bonus scenes, and lots of personality. Visit again soon to hear it all from me.`,
]

const selectedFallbackStory = ref('')
const formattedFallbackStory = computed(() => {
  const story = selectedFallbackStory.value
  const splitIndex = story.lastIndexOf('. ')

  if (splitIndex === -1) return story

  return `${story.slice(0, splitIndex + 1)}\n\n${story.slice(splitIndex + 2)}`
})

const pickFallbackStory = () => {
  const randomIndex = Math.floor(Math.random() * fallbackBioStories.length)
  selectedFallbackStory.value = fallbackBioStories[randomIndex](props.pet.name)
}

const handleStartAdoption = () => {
  if (isStartAdoptionDisabled.value) return
  vibrate(50)
  isPreQualOpen.value = true
}

const handlePreQualProceed = () => {
  adoptionStore.resetForm()
  petStore.clearSelectedPet()
  petStore.selectPet({ id: props.pet.id, petName: props.pet.name, species: props.pet.species })
  router.push(`/pet-adoption/${props.pet.id}`)
}

const { showToast } = useUIStore()

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(globalThis.location.href)
    showToast(`Link to ${props.pet.name} copied to clipboard! 🐾`, 'success')
  } catch {
    showToast('Failed to copy link.', 'error')
  }
}

const handleShare = async () => {
  const shareData = {
    title: `Check out ${props.pet.name} for adoption!`,
    text: `I found ${props.pet.name} on ADOHR and thought you might be interested!`,
    url: globalThis.location.href,
  }
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        await copyToClipboard()
      }
    }
  } else {
    await copyToClipboard()
  }
}

const r2BaseUrl = (import.meta.env.VITE_R2_PUBLIC_URL as string) ?? ''

const petPhotoUrl = computed(() => {
  const photos = props.pet.photos
  if (!photos || photos.length === 0) return ''
  const primary = photos.find((p) => p.isPrimary) ?? photos[0]
  return `${r2BaseUrl}/${primary.url.replace(/^pets\//, '')}`
})

watch(
  () => props.pet.id,
  () => {
    pickFallbackStory()
  },
  { immediate: true },
)
</script>

<template>
  <div class="adopt-detail">
    <div class="adopt-detail__main">
      <AdoptDetailMedia
        :petPhotoUrl="petPhotoUrl"
        :petName="pet.name"
        :petId="pet.id"
        :pet="pet"
        :photos="pet.photos"
        :isComingSoon="isComingSoon"
        :isStartAdoptionDisabled="isStartAdoptionDisabled"
        @start-adoption="handleStartAdoption"
        @share="handleShare"
        @request-info="isInfoDrawerOpen = true"
        @schedule-meet="isDrawerOpen = true"
      />
      <AdoptDetailInfo
        :pet="pet"
        :isComingSoon="isComingSoon"
      />
    </div>
    <AdoptDetailAbout :pet="pet" :formattedFallbackStory="formattedFallbackStory" />
    <AdoptDetailLittermates :pet="pet" :littermates="littermates" />
  </div>

  <AdoptDrawer
    :pet="pet"
    :isDrawerOpen="isDrawerOpen"
    @update:isDrawerOpen="isDrawerOpen = $event"
  />
  <RequestInfoDrawer
    :pet="pet"
    :isDrawerOpen="isInfoDrawerOpen"
    @update:isDrawerOpen="isInfoDrawerOpen = $event"
  />

  <PreQualModal
    :isOpen="isPreQualOpen"
    :petName="pet.name"
    :species="pet.species"
    @close="isPreQualOpen = false"
    @proceed="handlePreQualProceed"
  />
</template>

<style scoped lang="css">
.adopt-detail {
  width: 100%;

  .adopt-detail__main {
    display: flex;
    gap: 30px;
    width: 100%;

    @media (width <= 1024px) {
      flex-direction: column;
    }
  }

  @media (width <= 430px) {
    padding: 0;
  }
}
</style>
