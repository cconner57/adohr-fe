import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAdoptionStore } from '@/stores/adoption'
import { usePetStore } from '@/stores/pets'

import PetAdoption from '../PetAdoption.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}))

vi.mock('@/utils/haptics', () => ({
  vibrate: vi.fn(),
}))

vi.mock('@/composables/useMetrics', () => ({
  useMetrics: () => ({
    submitMetric: vi.fn(),
  }),
}))

describe('PetAdoption.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.scrollTo = vi.fn()
  })

  it('provides 7 uniform adoption steps for dogs including Current Pets', async () => {
    const petStore = usePetStore()
    petStore.selectPet({
      id: 'sugar-1',
      petName: 'Sugar',
      species: 'dog',
    })

    const wrapper = mount(PetAdoption, {
      global: {
        stubs: {
          AdoptionSteps: {
            props: ['steps', 'currentStep'],
            template: '<div class="steps-stub">{{ steps.join(",") }}</div>',
          },
          CatAdoptionInfoSection: true,
          GeneralSection: true,
          HomeSection: true,
          NewCatSection: true,
          CurrentPetsSection: true,
          PastPetsSection: true,
          OtherSection: true,
          SummarySection: true,
          ApplicationHeader: true,
          Button: true,
          FormSubmitted: true,
        },
      },
    })

    const adoptionStore = useAdoptionStore()
    adoptionStore.step = 1
    await wrapper.vm.$nextTick()

    const stepsText = wrapper.find('.steps-stub').text()
    expect(stepsText).toBe('General,Home,New Dog,Current Pets,Past Pets,Other,Summary')
  })

  it('renders CurrentPetsSection at step 4 and PastPetsSection at step 5 for dogs', async () => {
    const petStore = usePetStore()
    petStore.selectPet({
      id: 'sugar-1',
      petName: 'Sugar',
      species: 'dog',
    })

    const wrapper = mount(PetAdoption, {
      global: {
        stubs: {
          AdoptionSteps: true,
          CatAdoptionInfoSection: true,
          GeneralSection: true,
          HomeSection: true,
          NewCatSection: true,
          CurrentPetsSection: {
            template: '<div class="current-pets-section-stub">Current Pets</div>',
          },
          PastPetsSection: {
            template: '<div class="past-pets-section-stub">Past Pets</div>',
          },
          OtherSection: true,
          SummarySection: true,
          ApplicationHeader: true,
          Button: true,
          FormSubmitted: true,
        },
      },
    })

    const adoptionStore = useAdoptionStore()

    // Step 4: Current Pets should be displayed, not Past Pets
    adoptionStore.step = 4
    await wrapper.vm.$nextTick()

    const currentPets = wrapper.find('.current-pets-section-stub')
    const pastPets = wrapper.find('.past-pets-section-stub')
    expect(currentPets.attributes('style') || '').not.toContain('display: none')
    expect(pastPets.attributes('style')).toContain('display: none')

    // Step 5: Past Pets should be displayed, not Current Pets
    adoptionStore.step = 5
    await wrapper.vm.$nextTick()

    expect(currentPets.attributes('style')).toContain('display: none')
    expect(pastPets.attributes('style') || '').not.toContain('display: none')
  })

  it('provides 7 adoption steps for cats with New Cat step', async () => {
    const petStore = usePetStore()
    petStore.selectPet({
      id: 'cat-1',
      petName: 'Whiskers',
      species: 'cat',
    })

    const wrapper = mount(PetAdoption, {
      global: {
        stubs: {
          AdoptionSteps: {
            props: ['steps', 'currentStep'],
            template: '<div class="steps-stub">{{ steps.join(",") }}</div>',
          },
          CatAdoptionInfoSection: true,
          GeneralSection: true,
          HomeSection: true,
          NewCatSection: true,
          CurrentPetsSection: true,
          PastPetsSection: true,
          OtherSection: true,
          SummarySection: true,
          ApplicationHeader: true,
          Button: true,
          FormSubmitted: true,
        },
      },
    })

    const adoptionStore = useAdoptionStore()
    adoptionStore.step = 1
    await wrapper.vm.$nextTick()

    const stepsText = wrapper.find('.steps-stub').text()
    expect(stepsText).toBe('General,Home,New Cat,Current Pets,Past Pets,Other,Summary')
  })
})
