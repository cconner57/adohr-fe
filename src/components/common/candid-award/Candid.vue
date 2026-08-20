<script setup lang="ts">
defineProps<{
  type: 'Gold' | 'Silver' | 'Platinum' | 'Bronze' | string
  year: string
}>()
</script>

<template>
  <div class="candid-seal" :class="[`seal-${type.toLowerCase()}`]" :title="`${type} Transparency ${year} - Candid / GuideStar`">
    <div class="seal-outer-ring">
      <div class="seal-inner">
        <span class="seal-brand">Candid.</span>
        <div class="seal-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <span class="seal-tier">{{ type }}</span>
        <span class="seal-label">Transparency</span>
        <span class="seal-year">{{ year }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.candid-seal {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 4px 14px rgb(0 0 0 / 12%), 0 1px 3px rgb(0 0 0 / 8%);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
  text-decoration: none;

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 10px 24px rgb(0 0 0 / 18%), 0 2px 6px rgb(0 0 0 / 10%);
  }

  &.seal-gold {
    background: linear-gradient(135deg, #FFE259 0%, #FFA751 50%, #FFD700 100%);

    .seal-inner {
      border: 1.5px dashed #B8860B;
      color: #5C4308;
      background: linear-gradient(180deg, #FFFDF0 0%, #FFF8DC 100%);
    }

    .seal-icon {
      color: #DAA520;
    }
  }

  &.seal-silver {
    background: linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 50%, #EEEEEE 100%);

    .seal-inner {
      border: 1.5px dashed #757575;
      color: #37474F;
      background: linear-gradient(180deg, #FAFAFA 0%, #ECEFF1 100%);
    }

    .seal-icon {
      color: #78909C;
    }
  }

  .seal-outer-ring {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    padding: 2px;
    background: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .seal-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6px 4px;
    gap: 1px;
  }

  .seal-brand {
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .seal-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1px 0;
  }

  .seal-tier {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    line-height: 1.1;
  }

  .seal-label {
    font-size: 0.56rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.85;
    line-height: 1;
  }

  .seal-year {
    font-family: var(--font-mono, ui-monospace);
    font-size: 0.74rem;
    font-weight: 800;
    margin-top: 1px;
    line-height: 1;
  }
}
</style>
