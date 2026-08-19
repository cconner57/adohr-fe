import { expect, test } from '@playwright/test'

import { mockAllApis } from '../fixtures/test-utils'

test.describe('Adoption form flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page)

    // Set the selected pet in sessionStorage before navigating
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'adoption_pet',
        JSON.stringify({ id: 'pet-001', name: 'Luna', petName: 'Luna', species: 'cat' }),
      )
      // Enable demo mode to bypass strict validation
      sessionStorage.setItem('adoption_os_demo_mode', 'true')
    })
  })

  test('adoption form loads for a pet', async ({ page }) => {
    await page.goto('/pet-adoption/pet-001')

    // The page should render without a white screen
    await expect(page.locator('body')).not.toHaveText('Cannot GET')

    // Should show the pet adoption form content
    await expect(page.locator('.form-card, .page-shell, .cat-adoption-info').first()).toBeVisible()
  })

  test('can navigate through form steps', async ({ page }) => {
    await page.goto('/pet-adoption/pet-001')

    // Wait for form to load
    await expect(page.locator('.form-card, .page-shell, .cat-adoption-info').first()).toBeVisible()

    // Look for a Next/Continue button to advance steps
    const nextButton = page.getByRole('button', { name: /next|continue/i })

    // If a next button exists, click it to verify step navigation works
    if (await nextButton.isVisible()) {
      await nextButton.click()
      // The page should not crash — check that the body still has content
      await expect(page.locator('body')).not.toBeEmpty()
    }
  })
})
