import { expect, test } from '@playwright/test'

import { mockAllApis } from '../fixtures/test-utils'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page)
  })

  test('desktop nav links navigate to correct pages', async ({ page }) => {
    // Use a desktop viewport so the full nav bar is visible
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    const primaryNav = page.getByRole('navigation', { name: 'Primary navigation' })

    // Navigate to About
    await primaryNav.locator('a[href="/about"]').click()
    await expect(page).toHaveURL('/about')

    // Navigate to Adopt
    await primaryNav.locator('a[href="/adopt"]').click()
    await expect(page).toHaveURL('/adopt')
    await expect(page.locator('h1')).toContainText('Find your new best friend')

    // Navigate to Volunteer
    await primaryNav.locator('a[href="/volunteer"]').click()
    await expect(page).toHaveURL('/volunteer')

    // Navigate back Home
    await primaryNav.locator('a.nav-item[href="/"]').click()
    await expect(page).toHaveURL('/')
  })

  test('browser back/forward navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')

    const primaryNav = page.getByRole('navigation', { name: 'Primary navigation' })

    await primaryNav.locator('a[href="/adopt"]').click()
    await expect(page).toHaveURL('/adopt')

    await page.goBack()
    await expect(page).toHaveURL('/')

    await page.goForward()
    await expect(page).toHaveURL('/adopt')
  })

  test('404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/unknown-route-12345')
    await expect(page.locator('body')).toContainText(/not found|404|page/i)
  })
})
