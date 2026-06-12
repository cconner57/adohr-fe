<script setup lang="ts">
import type { IPet } from '../../../models/common.ts'
import AdoptionProcess from '../adopt-process/AdoptionProcess.vue'

defineProps<{
  pet: IPet
  formattedFallbackStory: string
}>()
</script>

<template>
  <div class="adopt-detail__about">
    <div class="adopt-detail__about__content">
      <div class="adopt-detail__about__fun">
        <p class="eyebrow">In their own words</p>
        <h2>From {{ pet.name }}</h2>
        <p v-if="pet.descriptions?.primary">{{ pet.descriptions?.primary }}</p>
        <p v-else class="adopt-detail__about__fallback">{{ formattedFallbackStory }}</p>
      </div>
      <div
        class="adopt-detail__about__additional-info"
        v-if="pet.profileSettings.showAdditionalInformation"
      >
        <h2>Additional Information</h2>
        <ul>
          <li v-for="(info, index) in pet.descriptions?.additionalInformation" :key="index">
            {{ info }}
          </li>
        </ul>
      </div>
    </div>
    <div class="adopt-detail__about__process">
      <AdoptionProcess :pet="pet" />
    </div>
  </div>
</template>

<style scoped lang="css">
.adopt-detail__about {
  display: flex;
  gap: 0;
  margin-top: 20px;
  background-color: var(--text-inverse);
  padding: 32px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  width: 100%;

  .eyebrow {
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-secondary);
    margin-bottom: 6px;
  }

  .adopt-detail__about__content {
    width: 50%;
    padding-right: 32px;
    border-right: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

    .adopt-detail__about__fun {
      width: 100%;
    }

    .adopt-detail__about__additional-info {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

      ul {
        padding-left: 20px;
        list-style: disc;
      }

      li {
        margin-bottom: 8px;
        line-height: 1.55;
        color: var(--text-secondary);
      }
    }

    .adopt-detail__about__fallback {
      white-space: pre-line;
    }
  }

  .adopt-detail__about__process {
    width: 50%;
    padding-left: 32px;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.015em;
    margin-bottom: 16px;
  }

  p:not(.eyebrow) {
    font-size: 1rem;
    line-height: 1.65;
    margin-bottom: 12px;
    color: var(--text-secondary);
  }

  @media (width <= 768px) {
    flex-direction: column;

    .adopt-detail__about__content,
    .adopt-detail__about__process {
      width: 100%;
      padding: 0;
      border-right: none;
    }

    .adopt-detail__about__process {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
    }
  }
}
</style>
