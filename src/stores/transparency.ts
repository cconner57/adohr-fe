import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { API_ENDPOINTS } from '@/constants/api'
import type { ITransparencyStats } from '@/models/transparency'

export const useTransparencyStore = defineStore('transparency', () => {
  const stats = ref<ITransparencyStats | null>(null)
  const selectedYear = ref<number>(new Date().getFullYear())
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const availableYears = computed(() => {
    const current = new Date().getFullYear()
    return [current, current - 1, current - 2]
  })

  const liveReleaseRate = computed(() => {
    if (stats.value?.liveReleaseRate !== undefined) {
      return stats.value.liveReleaseRate
    }
    return stats.value?.saveRate ?? 0
  })

  const isNoKill = computed(() => {
    return liveReleaseRate.value >= 90.0
  })

  const maddiesFundSaveRate = computed(() => {
    if (stats.value?.maddiesFundSaveRate !== undefined) {
      return stats.value.maddiesFundSaveRate
    }
    return liveReleaseRate.value
  })

  const fetchTransparency = async (year?: number) => {
    isLoading.value = true
    error.value = null
    const targetYear = year ?? selectedYear.value

    try {
      const url = API_ENDPOINTS.TRANSPARENCY_PUBLIC(targetYear)
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Failed to load transparency report (HTTP ${res.status})`)
      }
      const data: ITransparencyStats = await res.json()
      stats.value = data
      selectedYear.value = targetYear
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load transparency data'
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats,
    selectedYear,
    isLoading,
    error,
    availableYears,
    liveReleaseRate,
    isNoKill,
    maddiesFundSaveRate,
    fetchTransparency,
  }
})
