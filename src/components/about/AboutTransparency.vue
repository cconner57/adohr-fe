<script setup lang="ts">
// import Candid from '@/components/common/candid-award/Candid.vue'
</script>

<template>
  <section class="transparency">
    <div class="content-wrapper">
      <div class="awards-container" v-scroll-reveal>
        <!-- Commented out Candid / GuideStar awards pending updated profile for ADOHR
        <div class="awards-showcase">
          <p class="showcase-label">Recognized by Candid · GuideStar</p>
          <div class="awards-grid">
            <a
              href="https://www.guidestar.org/profile/81-0780050"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View ADOHR 2024 Gold Candid profile"
              class="seal-link"
            >
              <Candid type="Gold" year="2024" />
            </a>
            <a
              href="https://www.guidestar.org/profile/81-0780050"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View ADOHR 2023 Gold Candid profile"
              class="seal-link"
            >
              <Candid type="Gold" year="2023" />
            </a>
            <a
              href="https://www.guidestar.org/profile/81-0780050"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View ADOHR 2022 Silver Candid profile"
              class="seal-link"
            >
              <Candid type="Silver" year="2022" />
            </a>
          </div>
        </div>
        -->

        <!-- Rescue Transparency Standards -->
        <div class="awards-showcase standards-showcase">
          <p class="showcase-label">Our Standards · Rescue Transparency</p>
          <div class="standards-grid">
            <div class="standard-item">
              <div class="standard-badge standard-badge--volunteer">
                <svg
                  class="badge-icon"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <span class="standard-title">100% Volunteer</span>
              <span class="standard-desc">Every dollar goes directly to animal care</span>
            </div>

            <div class="standard-item">
              <div class="standard-badge standard-badge--medical">
                <svg
                  class="badge-icon"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <span class="standard-title">Full Medical Care</span>
              <span class="standard-desc">Fully vetted, vaccinated & microchipped</span>
            </div>

            <div class="standard-item">
              <div class="standard-badge standard-badge--nonprofit">
                <svg
                  class="badge-icon"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <span class="standard-title">501(c)(3) Nonprofit</span>
              <span class="standard-desc">Tax-deductible gifts & public reporting</span>
            </div>
          </div>
        </div>
      </div>

      <div class="notice reveal-left" v-scroll-reveal>
        <p class="eyebrow">Accountability</p>
        <h2>Transparency</h2>
        <p>
          ADOHR is a 501(c)(3) nonprofit. Donations are tax-deductible as allowed by law. We publish
          annual updates and operate with financial transparency.
        </p>
        <p class="small mono">EIN: 81-0780050 · PO Box 5543, Pasadena, CA 91107</p>
        <!-- Commented out Candid profile link for now
        <p class="small">
          Candid Seals recognize nonprofit transparency and profile completeness.
          <a
            class="candid-link-row"
            href="https://app.candid.org/profile/9498927/i-dream-of-home-rescue-inc-81-0780050"
            target="_blank"
            rel="noopener noreferrer"
          >
            View our Candid profile ↗
          </a>
        </p>
        -->
        <p class="small">
          All contributions directly fund animal rescue, medical treatments, foster supplies, and
          rehoming efforts across Southern California.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.transparency {
  color: var(--text-primary);
  background-color: var(--text-inverse);
  display: flex;
  justify-content: center;
  padding: 90px var(--layout-padding-side);
  border-bottom: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));

  .content-wrapper {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
  }

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
    line-height: 1.12;
  }

  p:not(.eyebrow) {
    font-size: 1.15rem;
    max-width: 600px;
    margin-top: 16px;
    line-height: 1.65;
    color: var(--text-secondary);
  }

  .awards-container {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .awards-showcase {
    background: oklch(from var(--text-primary) l c h / 3%);
    border: 1.5px solid var(--line-ink, oklch(from var(--text-primary) l c h / 14%));
    border-radius: var(--radius-xl, 24px);
    padding: 2.25rem 2rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 560px;

    .showcase-label {
      font-family: ui-monospace, 'SF Mono', monospace;
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-secondary);
      margin: 0;
    }

    .awards-grid {
      display: flex;
      gap: 1.75rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }

    .seal-link {
      display: inline-block;
      transition: transform 0.2s ease;
      text-decoration: none;
    }

    .standards-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem;
      align-items: start;
      width: 100%;
    }

    .standard-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
      width: 100%;
    }

    .standard-badge {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .standard-badge--volunteer {
      background: oklch(96% 0.04 65deg);
      border: 1.5px solid oklch(84% 0.1 65deg);
      color: oklch(48% 0.16 65deg);
      box-shadow: 0 4px 12px oklch(84% 0.1 65deg / 18%);
    }

    .standard-badge--medical {
      background: oklch(96% 0.04 150deg);
      border: 1.5px solid oklch(80% 0.1 150deg);
      color: var(--color-primary);
      box-shadow: 0 4px 12px oklch(80% 0.08 150deg / 18%);
    }

    .standard-badge--nonprofit {
      background: oklch(96% 0.03 240deg);
      border: 1.5px solid oklch(80% 0.08 240deg);
      color: oklch(45% 0.12 240deg);
      box-shadow: 0 4px 12px oklch(80% 0.08 240deg / 18%);
    }

    .standard-title {
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.25;
      letter-spacing: -0.01em;
      min-height: 2.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
    }

    .standard-desc {
      font-size: 0.82rem;
      color: var(--text-secondary);
      line-height: 1.45;
      text-align: center;
      max-width: 155px;
      text-wrap: balance;
    }

    @media (width <= 520px) {
      .standards-grid {
        grid-template-columns: 1fr;
        gap: 1.75rem;
      }

      .standard-title {
        min-height: auto;
      }
    }
  }

  .notice {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex: 1;

    .small {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-top: 14px;

      &.mono {
        font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace;
        letter-spacing: 0.02em;
        padding-top: 14px;
        border-top: 1px solid var(--line-ink, oklch(from var(--text-primary) l c h / 16%));
      }

      a {
        color: var(--color-secondary);
        font-weight: 700;
        text-decoration: underline;
        text-underline-offset: 3px;

        &:hover {
          color: var(--color-primary);
        }
      }

      .candid-link-row {
        display: block;
        margin-top: 6px;
      }
    }
  }

  @media (width <= 1024px) {
    .content-wrapper {
      flex-direction: column;
      gap: 40px;
      text-align: center;
    }

    .awards-container {
      order: -1;
      width: 100%;
    }

    .awards-showcase {
      padding: 1.5rem;
      width: 100%;
    }

    .notice {
      text-align: center;
      align-items: center;
      max-width: 100%;

      p {
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
}
</style>
