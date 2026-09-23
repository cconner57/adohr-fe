<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import Footer from '@/components/common/footer/Footer.vue'
import SubmitHappyTailModal from '@/components/happy-tails/SubmitHappyTailModal.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useHappyTailsStore } from '@/stores/happyTails'
import { formatDate } from '@/utils/date'

const { vScrollReveal } = useScrollReveal()
const route = useRoute()

const happyTailsStore = useHappyTailsStore()
const { sortedItems, isLoading, error } = storeToRefs(happyTailsStore)

const currentFilter = ref<'all' | 'dog' | 'cat'>('all')
const isSubmitModalOpen = ref(false)

const filteredItems = computed(() => {
  if (currentFilter.value === 'all') return sortedItems.value
  return sortedItems.value.filter(item => item.species === currentFilter.value)
})

onMounted(() => {
  happyTailsStore.fetchHappyTails()
  if (route.query.submit === 'true') {
    isSubmitModalOpen.value = true
  }
})

watch(
  () => route.query.submit,
  (val) => {
    if (val === 'true') {
      isSubmitModalOpen.value = true
    }
  },
)
</script>

<template>
  <main class="happy-tails-page">
    <section class="hero">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">From rescue to home</p>
        <h1>Happy Tails</h1>
        <p class="lead">Celebrating the beautiful journeys of adopted pets and the loving families who gave them a second chance at life.</p>
        <button type="button" class="hero-submit-btn" @click="isSubmitModalOpen = true">
          🐾 Share Your Happy Tail
        </button>
      </div>
    </section>

    <section class="stats-bar">
      <div class="content-wrapper" v-scroll-reveal>
        <div class="stat">
          <span class="stat-number">5,243</span>
          <span class="stat-label">alumni and counting</span>
        </div>
      </div>
    </section>

    <section class="gallery-section" aria-live="polite">
      <div class="content-wrapper">
        <div v-if="sortedItems.length > 0" class="filters" v-scroll-reveal>
          <button 
            :class="['filter-btn', { active: currentFilter === 'all' }]"
            @click="currentFilter = 'all'"
          >
            All Alumni
          </button>
          <button 
            :class="['filter-btn', { active: currentFilter === 'dog' }]"
            @click="currentFilter = 'dog'"
          >
            Dogs
          </button>
          <button 
            :class="['filter-btn', { active: currentFilter === 'cat' }]"
            @click="currentFilter = 'cat'"
          >
            Cats
          </button>
        </div>

        <div v-if="isLoading" class="skeleton-masonry">
          <div v-for="i in 6" :key="i" class="tail-card skeleton">
            <div class="skeleton-img"></div>
            <div class="tail-card__content">
              <div class="skeleton-title"></div>
              <div class="skeleton-meta"></div>
              <div class="skeleton-quote"></div>
            </div>
          </div>
        </div>
        
        <p v-else-if="error" class="status error">{{ error }}</p>
        
        <div v-else-if="sortedItems.length === 0" class="empty-state">
          <div class="empty-icon" aria-hidden="true">🐾</div>
          <h2>Be the First to Share a Story</h2>
          <p>
            Have you adopted a rescue pet from ADOHR? Share your Happy Tail to celebrate your journey together and inspire future adopters!
          </p>
          <button type="button" class="empty-submit-btn" @click="isSubmitModalOpen = true">
            Share Your Happy Tail
          </button>
        </div>

        <div v-else-if="filteredItems.length === 0" class="status empty">
          No {{ currentFilter === 'dog' ? 'dog' : currentFilter === 'cat' ? 'cat' : '' }} alumni stories found.
        </div>
        
        <div v-else class="masonry-grid">
          <article v-for="item in filteredItems" :key="item.id" class="tail-card" v-scroll-reveal>
            <div class="img-wrapper">
              <img :src="item.photoUrl" :alt="item.petName" loading="lazy" />
            </div>
            <div class="tail-card__content">
              <div class="header">
                <h2>{{ item.petName }}</h2>
                <span class="capsule">{{ item.species === 'dog' ? 'Dog' : item.species === 'cat' ? 'Cat' : 'Alumni' }}</span>
              </div>
              <p class="meta">Adopted by {{ item.adoptersName }} · {{ formatDate(item.adoptedDate) }}</p>
              <blockquote class="testimonial">
                "{{ item.testimonial }}"
              </blockquote>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="content-wrapper" v-scroll-reveal>
        <h2>Your pet could be next</h2>
        <p>There are so many animals waiting for their forever homes. Start your journey today.</p>
        <router-link to="/adopt" class="cta-button">View Adoptable Pets</router-link>
      </div>
    </section>
  </main>
  
  <Footer />
  <SubmitHappyTailModal :isOpen="isSubmitModalOpen" @close="isSubmitModalOpen = false" />
</template>

<style scoped src="./HappyTails.css"></style>
