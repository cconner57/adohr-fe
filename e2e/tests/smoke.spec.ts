import { expect, test } from '@playwright/test'

import { mockAllApis } from '../fixtures/test-utils'

test.describe('Smoke tests — every route renders', () => {
  test.beforeEach(async ({ page }) => {
    await mockAllApis(page)
  })

  test('Home page renders', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav').first()).toBeVisible()
    await expect(page.locator('body')).not.toHaveText('Cannot GET')
  })

  test('About page renders', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('body')).not.toHaveText('Cannot GET')
    // Wait for lazy-loaded route to resolve
    await expect(page.locator('main, .about, [class*="about"]').first()).toBeVisible()
  })

  test('Adopt page renders with pet cards', async ({ page }) => {
    await page.goto('/adopt')
    await expect(page.locator('h1')).toContainText('Find your new best friend')
    await expect(page.locator('.pet-item').first()).toBeVisible()
  })

  test('Volunteer page renders', async ({ page }) => {
    await page.goto('/volunteer')
    await expect(page.locator('body')).not.toHaveText('Cannot GET')
    await expect(page.locator('form, .volunteer, [class*="volunteer"]').first()).toBeVisible()
  })

  test('Surrender page renders', async ({ page }) => {
    await page.goto('/surrender')
    await expect(page.locator('body')).not.toHaveText('Cannot GET')
    await expect(page.locator('.page-shell, .form-card').first()).toBeVisible()
  })

  test('Donate page renders', async ({ page }) => {
    await page.goto('/donate')
    await expect(page.locator('body')).not.toHaveText('Cannot GET')
    await expect(page.locator('.donate, [class*="donate"]').first()).toBeVisible()
  })

  test('404 page renders for unknown route', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.locator('body')).toContainText(/not found|404|page/i)
  })

  test('Adopt detail page renders for a valid pet', async ({ page }) => {
    await page.goto('/adopt/luna')
    await expect(page.locator('body')).not.toHaveText('Cannot GET')
  })
})
