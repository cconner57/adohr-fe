import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { Page } from '@playwright/test'

const petsFixture = JSON.parse(
  readFileSync(join(import.meta.dirname, 'pets.json'), 'utf-8'),
)

/**
 * Intercepts /pets API calls and returns fixture data.
 * Handles both /pets?... and /pets/spotlight, /pets/adopted-count.
 */
export async function mockPetsApi(page: Page) {
  await page.route('**/pets/adopted-count*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { count: 42 } }),
    }),
  )

  await page.route('**/pets/spotlight*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(petsFixture.filter((p) => p.profileSettings.isSpotlightFeatured)),
    }),
  )

  await page.route('**/pets?*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(petsFixture),
    }),
  )

  // Bare /pets without query string
  await page.route(/\/pets$/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(petsFixture),
    }),
  )
}

/** Intercepts /metrics with an empty 200 to prevent console errors. */
export async function mockMetricsApi(page: Page) {
  await page.route('**/metrics*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    }),
  )
}

/** Intercepts POST /applications/* with a success response. */
export async function mockApplicationsApi(page: Page) {
  await page.route('**/applications/**', (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    }
    return route.continue()
  })
}

/** Intercepts GET /public/locations* with default public ADOHR locations. */
export async function mockPublicLocationsApi(page: Page) {
  await page.route('**/public/locations*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        locations: [
          {
            id: 'loc-main',
            name: 'Main Shelter',
            shortName: 'Main',
            locationType: 'shelter',
            isDefault: true,
          },
          {
            id: 'loc-upland',
            name: 'PetSmart - Upland',
            shortName: 'Upland',
            locationType: 'retail_partner',
            isDefault: false,
          },
        ],
      }),
    }),
  )
}

/** Convenience wrapper — mocks all API endpoints. */
export async function mockAllApis(page: Page) {
  await mockPetsApi(page)
  await mockMetricsApi(page)
  await mockApplicationsApi(page)
  await mockPublicLocationsApi(page)
}
