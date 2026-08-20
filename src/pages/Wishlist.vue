<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import Footer from '@/components/common/footer/Footer.vue'
import WishlistIcon from '@/components/wishlist/WishlistIcon.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import type { WishlistCategory } from '@/models/wishlist'
import { useWishlistStore } from '@/stores/wishlist'

const { vScrollReveal } = useScrollReveal()

const wishlistStore = useWishlistStore()
const { isLoading, error, urgentItems } = storeToRefs(wishlistStore)

const activeCategory = ref<WishlistCategory | 'all'>('all')

const categories = [
  { value: 'all', label: 'All' },
  { value: 'food', label: 'Food' },
  { value: 'medical', label: 'Medical' },
  { value: 'comfort', label: 'Comfort' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'transport', label: 'Transport' },
  { value: 'toys', label: 'Toys' },
]

const displayedItems = computed(() => {
  return wishlistStore.filteredByCategory(activeCategory.value)
})

onMounted(() => {
  wishlistStore.fetchWishlist()
})
</script>

<template>
  <main class="wishlist-page">
    <section class="hero">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">Small gifts, big impact</p>
        <h1>Foster Supply Wishlist</h1>
        <p class="lead">
          Our foster families need everyday supplies to care for our animals. 
          Whether it's a bag of food or a warm blanket, every contribution helps 
          set a rescue up for success.
        </p>
        
        <div class="quick-links">
          <a href="https://www.amazon.com/hz/wishlist/ls/adohr" target="_blank" rel="noopener noreferrer" class="shop-btn amazon-btn">
            Shop Amazon Wishlist ↗
          </a>
          <a href="https://www.chewy.com/g/adohr" target="_blank" rel="noopener noreferrer" class="shop-btn chewy-btn">
            Shop Chewy Wishlist ↗
          </a>
        </div>
      </div>
    </section>

    <section v-if="urgentItems.length > 0" class="urgent-banner">
      <div class="content-wrapper" v-scroll-reveal>
        <div class="urgent-content">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <strong>Urgent Needs:</strong>
          <span>We are critically low on {{ urgentItems.map(i => i.name).join(', ') }}</span>
        </div>
      </div>
    </section>

    <section class="supplies-section" aria-labelledby="supplies-title">
      <div class="content-wrapper">
        <div class="category-filters" v-scroll-reveal>
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="filter-pill"
            :class="{ active: activeCategory === cat.value }"
            @click="activeCategory = cat.value as WishlistCategory | 'all'"
          >
            {{ cat.label }}
          </button>
        </div>

        <div v-if="isLoading" class="status">Loading supplies...</div>
        <div v-else-if="error" class="status error">{{ error }}</div>
        
        <div v-else class="supply-grid" role="list">
          <article v-for="item in displayedItems" :key="item.id" class="supply-card" v-scroll-reveal>
            <div class="card-header">
              <div class="icon-bubble">
                <WishlistIcon :name="item.icon" />
              </div>
              <span class="priority-badge" :class="item.priority">{{ item.priority }}</span>
            </div>
            <h3>{{ item.name }}</h3>
            <p class="desc">{{ item.description }}</p>
            <span class="cost-badge">Est. {{ item.estimatedCost }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="how-to-help" aria-labelledby="help-title">
      <div class="content-wrapper" v-scroll-reveal>
        <p class="eyebrow">Your support matters</p>
        <h2 id="help-title">How to Help</h2>
        
        <ol class="steps-grid">
          <li class="step-card">
            <span class="step-num">1</span>
            <h3>Browse or Shop Online</h3>
            <p>Browse our list of needs above, or use our 1-click Amazon and Chewy wishlists to send items directly to us.</p>
          </li>
          <li class="step-card">
            <span class="step-num">2</span>
            <h3>Ship Directly</h3>
            <p>If you prefer to buy elsewhere, you can ship directly to our PO Box: <br><strong>PO Box 5543, Pasadena, CA 91107</strong></p>
          </li>
          <li class="step-card">
            <span class="step-num">3</span>
            <h3>Drop Off Locally</h3>
            <p>Bring physical donations to our weekend adoption events at <strong>PetSmart Pasadena (3347 E Foothill Blvd)</strong>.</p>
          </li>
        </ol>
      </div>
    </section>

    <Footer />
  </main>
</template>

<style scoped src="./Wishlist.css"></style>
