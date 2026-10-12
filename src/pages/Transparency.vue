<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

import Footer from '@/components/common/footer/Footer.vue'
import Spinner from '@/components/common/ui/Spinner.vue'
import { useTransparencyStore } from '@/stores/transparency'

const transparencyStore = useTransparencyStore()
const { stats, selectedYear, isLoading, error, availableYears, liveReleaseRate, isNoKill, maddiesFundSaveRate } =
  storeToRefs(transparencyStore)

const sac = computed(() => stats.value?.sacMatrix ?? null)
const methodology = computed(() => stats.value?.methodology ?? null)

const handleYearSelect = (year: number) => {
  if (year === selectedYear.value) return
  transparencyStore.fetchTransparency(year)
}

onMounted(() => {
  transparencyStore.fetchTransparency()
})
</script>

<template>
  <main class="transparency-page">
    <header class="transparency-hero">
      <div class="content-wrapper">
        <p class="hero-eyebrow">Open Shelter Telemetry · Public Accountability</p>
        <h1 class="hero-title">Shelter Transparency &amp; Annual Report</h1>
        <p class="hero-subtitle">
          Certified statistics adhering to Maddie's Fund transparency benchmarks and the Shelter Animals Count (SAC) Core Data Matrix
        </p>

        <div class="year-selector" role="group" aria-label="Select reporting year">
          <span class="year-label">Reporting Year:</span>
          <button
            v-for="yr in availableYears"
            :key="yr"
            type="button"
            class="year-btn"
            :class="{ active: yr === selectedYear }"
            :aria-pressed="yr === selectedYear"
            @click="handleYearSelect(yr)"
          >
            {{ yr }}
          </button>
        </div>
      </div>
    </header>

    <div class="content-wrapper main-body">
      <div v-if="isLoading" class="loading-state" aria-live="polite">
        <Spinner />
        <p>Loading certified transparency report for {{ selectedYear }}...</p>
      </div>

      <div v-else-if="error" class="error-state" role="alert">
        <p class="error-msg">{{ error }}</p>
        <button type="button" class="retry-btn" @click="transparencyStore.fetchTransparency(selectedYear)">
          Retry
        </button>
      </div>

      <template v-else-if="stats">
        <!-- Top Metrics KPI Grid -->
        <section class="kpi-grid" aria-label="Key Performance Indicators">
          <article class="kpi-card highlight">
            <span class="kpi-label">Asilomar Live Release Rate</span>
            <div class="kpi-value-row">
              <span class="kpi-value">{{ liveReleaseRate }}%</span>
              <span v-if="isNoKill" class="kpi-badge no-kill">No-Kill Standard</span>
            </div>
            <p class="kpi-caption">Exceeds the 90% national benchmark for no-kill animal welfare</p>
          </article>

          <article class="kpi-card highlight">
            <span class="kpi-label">Maddie's Fund Save Rate</span>
            <div class="kpi-value-row">
              <span class="kpi-value">{{ maddiesFundSaveRate }}%</span>
              <span class="kpi-badge certified">Maddie's Benchmark</span>
            </div>
            <p class="kpi-caption">(Live Intakes - Shelter Euthanasia) / Live Intakes</p>
          </article>

          <article class="kpi-card">
            <span class="kpi-label">Total Lives Saved (All-Time)</span>
            <span class="kpi-value">{{ stats.totalSaved }}</span>
            <p class="kpi-caption">Forever adoptions finalized since inception</p>
          </article>

          <article class="kpi-card">
            <span class="kpi-label">Adoptions in {{ selectedYear }}</span>
            <span class="kpi-value">{{ stats.adoptedThisYear }}</span>
            <p class="kpi-caption">Animals matched into loving adoptive homes</p>
          </article>

          <article class="kpi-card">
            <span class="kpi-label">Currently in Foster Care</span>
            <span class="kpi-value">{{ stats.currentlyAvailable }}</span>
            <p class="kpi-caption">Pets actively thriving in foster placement</p>
          </article>

          <article class="kpi-card">
            <span class="kpi-label">Donated Volunteer Care</span>
            <span class="kpi-value">{{ stats.volunteerHoursThisYear }} hrs</span>
            <p class="kpi-caption">Dedicated community hours logged in {{ selectedYear }}</p>
          </article>
        </section>

        <!-- Maddie's Fund & Asilomar Methodology Disclosure -->
        <section class="methodology-card" aria-labelledby="methodology-heading">
          <div class="methodology-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span id="methodology-heading">Methodology &amp; Maddie's Fund Compliance</span>
          </div>
          <p class="methodology-intro">
            {{ methodology?.compliance || "Certified public shelter statistics conforming to Maddie's Fund Transparency guidelines and Shelter Animals Count (SAC) Core Data Matrix standards" }}
          </p>
          <div class="formula-grid">
            <div class="formula-box">
              <span class="formula-title">Asilomar Live Release Rate:</span>
              <code class="formula-code">{{ methodology?.asilomarFormula || "Live Outcomes / (Total Outcomes - Owner Intended Euthanasia) * 100" }}</code>
            </div>
            <div class="formula-box">
              <span class="formula-title">Maddie's Fund Save Rate:</span>
              <code class="formula-code">{{ methodology?.maddiesFundFormula || "(Total Live Intakes - Shelter Euthanasia) / Total Live Intakes * 100" }}</code>
            </div>
          </div>
        </section>

        <!-- Shelter Animals Count (SAC) Core Data Matrix -->
        <section class="sac-section" aria-labelledby="sac-table-heading">
          <div class="section-header">
            <div>
              <h2 id="sac-table-heading" class="section-title">Shelter Animals Count (SAC) Core Data Matrix</h2>
              <p class="section-subtitle">
                Official standardized telemetry for animal admissions, live releases, and shelter mortality for {{ selectedYear }}
              </p>
            </div>
          </div>

          <div class="table-container">
            <table class="sac-table">
              <thead>
                <tr>
                  <th scope="col" class="row-header">Reporting Metric</th>
                  <th scope="col">Canine</th>
                  <th scope="col">Feline</th>
                  <th scope="col">Other</th>
                  <th scope="col" class="col-total">Total All Species</th>
                </tr>
              </thead>
              <tbody>
                <tr class="group-header">
                  <td colspan="5">A. Beginning Animal Census (Jan 1)</td>
                </tr>
                <tr>
                  <td class="row-label">Beginning Count</td>
                  <td>{{ sac?.canine.beginningCount.total ?? 0 }}</td>
                  <td>{{ sac?.feline.beginningCount.total ?? 0 }}</td>
                  <td>{{ sac?.other.beginningCount.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.beginningCount.total ?? 0 }}</td>
                </tr>

                <tr class="group-header">
                  <td colspan="5">B. Live Intakes &amp; Admissions</td>
                </tr>
                <tr>
                  <td class="row-label">Stray / At-Large</td>
                  <td>{{ sac?.canine.intakes.stray.total ?? 0 }}</td>
                  <td>{{ sac?.feline.intakes.stray.total ?? 0 }}</td>
                  <td>{{ sac?.other.intakes.stray.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.intakes.stray.total ?? 0 }}</td>
                </tr>
                <tr>
                  <td class="row-label">Relinquished by Owner</td>
                  <td>{{ sac?.canine.intakes.relinquishedByOwner.total ?? 0 }}</td>
                  <td>{{ sac?.feline.intakes.relinquishedByOwner.total ?? 0 }}</td>
                  <td>{{ sac?.other.intakes.relinquishedByOwner.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.intakes.relinquishedByOwner.total ?? 0 }}</td>
                </tr>
                <tr>
                  <td class="row-label">Transferred In from Agency</td>
                  <td>{{ sac?.canine.intakes.transferredIn.total ?? 0 }}</td>
                  <td>{{ sac?.feline.intakes.transferredIn.total ?? 0 }}</td>
                  <td>{{ sac?.other.intakes.transferredIn.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.intakes.transferredIn.total ?? 0 }}</td>
                </tr>
                <tr>
                  <td class="row-label">Other Live Intakes</td>
                  <td>{{ sac?.canine.intakes.otherLiveIntake.total ?? 0 }}</td>
                  <td>{{ sac?.feline.intakes.otherLiveIntake.total ?? 0 }}</td>
                  <td>{{ sac?.other.intakes.otherLiveIntake.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.intakes.otherLiveIntake.total ?? 0 }}</td>
                </tr>
                <tr class="subtotal-row">
                  <td class="row-label">Total Live Intakes</td>
                  <td>{{ sac?.canine.intakes.total.total ?? 0 }}</td>
                  <td>{{ sac?.feline.intakes.total.total ?? 0 }}</td>
                  <td>{{ sac?.other.intakes.total.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.intakes.total.total ?? 0 }}</td>
                </tr>

                <tr class="group-header">
                  <td colspan="5">C. Live Outcomes</td>
                </tr>
                <tr>
                  <td class="row-label">Adoptions</td>
                  <td>{{ sac?.canine.outcomes.adoption.total ?? 0 }}</td>
                  <td>{{ sac?.feline.outcomes.adoption.total ?? 0 }}</td>
                  <td>{{ sac?.other.outcomes.adoption.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.outcomes.adoption.total ?? stats.adoptedThisYear }}</td>
                </tr>
                <tr>
                  <td class="row-label">Returned to Owner</td>
                  <td>{{ sac?.canine.outcomes.returnedToOwner.total ?? 0 }}</td>
                  <td>{{ sac?.feline.outcomes.returnedToOwner.total ?? 0 }}</td>
                  <td>{{ sac?.other.outcomes.returnedToOwner.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.outcomes.returnedToOwner.total ?? 0 }}</td>
                </tr>
                <tr>
                  <td class="row-label">Transferred Out</td>
                  <td>{{ sac?.canine.outcomes.transferredOut.total ?? 0 }}</td>
                  <td>{{ sac?.feline.outcomes.transferredOut.total ?? 0 }}</td>
                  <td>{{ sac?.other.outcomes.transferredOut.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.outcomes.transferredOut.total ?? 0 }}</td>
                </tr>
                <tr class="subtotal-row">
                  <td class="row-label">Total Live Outcomes</td>
                  <td>{{ sac?.canine.outcomes.totalLiveOutcomes.total ?? 0 }}</td>
                  <td>{{ sac?.feline.outcomes.totalLiveOutcomes.total ?? 0 }}</td>
                  <td>{{ sac?.other.outcomes.totalLiveOutcomes.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.outcomes.totalLiveOutcomes.total ?? stats.adoptedThisYear }}</td>
                </tr>

                <tr class="group-header">
                  <td colspan="5">D. Other Outcomes &amp; Euthanasia</td>
                </tr>
                <tr>
                  <td class="row-label">Died in Care</td>
                  <td>{{ sac?.canine.outcomes.diedInCare.total ?? 0 }}</td>
                  <td>{{ sac?.feline.outcomes.diedInCare.total ?? 0 }}</td>
                  <td>{{ sac?.other.outcomes.diedInCare.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.outcomes.diedInCare.total ?? 0 }}</td>
                </tr>
                <tr>
                  <td class="row-label">Shelter Euthanasia</td>
                  <td>{{ sac?.canine.outcomes.shelterEuthanasia.total ?? 0 }}</td>
                  <td>{{ sac?.feline.outcomes.shelterEuthanasia.total ?? 0 }}</td>
                  <td>{{ sac?.other.outcomes.shelterEuthanasia.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.outcomes.shelterEuthanasia.total ?? 0 }}</td>
                </tr>
                <tr class="total-row">
                  <td class="row-label">Ending Animal Census (Dec 31)</td>
                  <td>{{ sac?.canine.endingCount.total ?? 0 }}</td>
                  <td>{{ sac?.feline.endingCount.total ?? 0 }}</td>
                  <td>{{ sac?.other.endingCount.total ?? 0 }}</td>
                  <td class="cell-total">{{ sac?.total.endingCount.total ?? stats.currentlyAvailable }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Species Breakdown & Monthly Adoptions -->
        <section class="breakdown-grid">
          <article class="breakdown-card">
            <h3>Species Distribution</h3>
            <p class="breakdown-caption">All-time admissions by animal species</p>
            <ul class="species-list">
              <li v-for="sp in stats.speciesBreakdown" :key="sp.species" class="species-item">
                <span class="species-name">{{ sp.species }}</span>
                <span class="species-count">{{ sp.count }}</span>
              </li>
            </ul>
          </article>

          <article class="breakdown-card">
            <h3>Monthly Adoptions ({{ selectedYear }})</h3>
            <p class="breakdown-caption">Adoptions completed each calendar month</p>
            <div class="monthly-bars">
              <div v-for="m in stats.monthlyAdoptions" :key="m.month" class="month-col">
                <span class="month-count">{{ m.count }}</span>
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    :style="{
                      height: `${Math.min(100, Math.max(8, m.count * 8))}%`
                    }"
                  ></div>
                </div>
                <span class="month-label">{{ m.month }}</span>
              </div>
            </div>
          </article>
        </section>

        <!-- Verification & Charity Disclosure -->
        <section class="charity-card" aria-label="Nonprofit verification">
          <div class="charity-content">
            <span class="charity-badge">501(c)(3) Nonprofit Public Disclosure</span>
            <h3>{{ stats.orgName || 'A Dream of Home Rescue' }}</h3>
            <p class="charity-meta">
              <strong>Federal Tax ID / EIN:</strong> {{ stats.ein || '42-3096944' }} &bull;
              <strong>Rescue Model:</strong> 100% Foster-Home Network
            </p>
            <p class="charity-text">
              ADOHR publishes animal welfare telemetry directly from its live database, providing transparent accountability to grantmakers, foundation evaluators, and the Southern California community
            </p>
          </div>
        </section>
      </template>
    </div>

    <Footer borderTopColor="white" />
  </main>
</template>

<style scoped src="./Transparency.css"></style>
