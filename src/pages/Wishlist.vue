<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import Footer from '@/components/common/footer/Footer.vue'
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
          <strong>🚨 Urgent Needs:</strong>
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
              <span class="icon">{{ item.icon }}</span>
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

<style scoped lang="css">
.wishlist-page {
  min-height: 100vh;
  background: var(--text-inverse);
  color: var(--text-primary);

  .content-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--layout-padding-side);
    box-sizing: border-box;
  }
}

/* ── Hero ─────────────────────────────────────────────── */
.hero {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  padding: clamp(120px, 12vw, 150px) 0 clamp(40px, 6vw, 70px);
  text-align: center;

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-warning);
    margin-bottom: 12px;
  }

  h1 {
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.04;
    margin-bottom: 0.5rem;
    max-width: 20ch;
  }

  .lead {
    font-size: clamp(1.05rem, 2vw, 1.2rem);
    max-width: 600px;
    margin-top: 20px;
    line-height: 1.6;
    color: oklch(from var(--text-inverse) l c h / 88%);
    margin-bottom: 40px;
  }

  .quick-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .shop-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 28px;
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
    border-radius: var(--radius-full, 9999px);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
  }

  .amazon-btn {
    background-color: #ff9900;
    color: #000;
  }

  .chewy-btn {
    background-color: #1c49c2;
    color: #fff;
  }
}

/* ── Urgent Banner ───────────────────────────────────── */
.urgent-banner {
  background-color: var(--color-danger);
  color: var(--text-inverse);
  padding: 16px 0;

  .urgent-content {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.05rem;

    strong {
      font-weight: 700;
      white-space: nowrap;
    }
  }
}

/* ── Supplies Section ────────────────────────────────── */
.supplies-section {
  padding: 60px 0 80px;

  .category-filters {
    display: flex;
    gap: 12px;
    margin-bottom: 40px;
    overflow-x: auto;
    padding-bottom: 12px;
    scrollbar-width: none; /* Firefox */
    
    &::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }

    .filter-pill {
      background: var(--surface-secondary, oklch(from var(--text-primary) 98% 0 h));
      border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      color: var(--text-primary);
      padding: 8px 20px;
      border-radius: var(--radius-full, 9999px);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;

      &:hover {
        background: var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      }

      &.active {
        background: var(--text-primary);
        color: var(--text-inverse);
        border-color: var(--text-primary);
      }
    }
  }

  .status {
    text-align: center;
    padding: 40px;
    color: var(--text-secondary);
    font-size: 1.1rem;

    &.error {
      color: var(--color-danger);
    }
  }

  .supply-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    
    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .supply-card {
    background: var(--text-inverse);
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    border-radius: var(--radius-lg);
    padding: 24px;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1));
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .icon {
        font-size: 2.5rem;
        line-height: 1;
      }

      .priority-badge {
        font-family: var(--font-mono, ui-monospace, SF Mono, monospace);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 4px 10px;
        border-radius: var(--radius-full, 9999px);

        &.urgent {
          background-color: var(--color-danger);
          color: var(--text-inverse);
        }
        &.high {
          background-color: var(--color-warning);
          color: var(--text-primary);
        }
        &.medium {
          background-color: var(--color-secondary);
          color: var(--text-inverse);
        }
        &.low {
          background-color: var(--color-gray-50, #f9fafb);
          color: var(--text-secondary);
          border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
        }
      }
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .desc {
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 20px;
      flex-grow: 1;
    }

    .cost-badge {
      align-self: flex-start;
      background: var(--surface-secondary, oklch(from var(--text-primary) 98% 0 h));
      color: var(--text-secondary);
      font-family: var(--font-mono, ui-monospace, SF Mono, monospace);
      font-size: 0.8rem;
      padding: 4px 8px;
      border-radius: 4px;
    }
  }
}

/* ── How to Help ─────────────────────────────────────── */
.how-to-help {
  padding: 80px 0 100px;
  background-color: var(--surface-secondary, oklch(from var(--text-primary) 98% 0 h));
  border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-secondary);
    margin-bottom: 12px;
  }

  h2 {
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 40px;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    list-style: none;
    padding: 0;
    margin: 0;

    @media (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }

  .step-card {
    background: var(--text-inverse);
    border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    border-radius: var(--radius-lg);
    padding: 30px;
    position: relative;
    box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1));

    .step-num {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: var(--color-secondary);
      color: var(--text-inverse);
      font-family: var(--font-mono, ui-monospace, SF Mono, monospace);
      font-size: 1.2rem;
      font-weight: 800;
      border-radius: 50%;
      margin-bottom: 20px;
    }

    h3 {
      font-size: 1.3rem;
      font-weight: 800;
      margin-bottom: 12px;
    }

    p {
      color: var(--text-secondary);
      line-height: 1.6;
    }
  }
}

/* Reveal hooks (global directive assumed based on other components) */
:deep(.reveal) {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

:deep(.reveal.active) {
  opacity: 1;
  transform: translateY(0);
}
</style>
