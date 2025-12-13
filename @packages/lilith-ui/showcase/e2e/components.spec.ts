import { test, expect } from '@playwright/test'

test.describe('Showcase App', () => {
  test('renders homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText("lilith-ui")
  })

  test('theme switching works', async ({ page }) => {
    await page.goto('/')
    
    const luxeButton = page.getByText('✨ Luxe')
    const cyberpunkButton = page.getByText('🌐 Cyberpunk')
    
    await expect(luxeButton).toBeVisible()
    await expect(cyberpunkButton).toBeVisible()
    
    await cyberpunkButton.click()
    await page.waitForTimeout(500)
    
    await luxeButton.click()
    await page.waitForTimeout(500)
  })

  test('navigates to primitives page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Primitives' }).click()
    await expect(page.locator('h1')).toContainText('Primitives')
  })

  test('displays button components', async ({ page }) => {
    await page.goto('/primitives')
    await expect(page.getByRole('heading', { name: 'Button' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Primary' })).toBeVisible()
  })

  test('displays data components', async ({ page }) => {
    await page.goto('/data')
    await expect(page.getByRole('heading', { name: 'Pagination' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible()
  })

  test('displays analytics components', async ({ page }) => {
    await page.goto('/analytics')
    await expect(page.getByRole('heading', { name: /Analytics/ })).toBeVisible()
    await expect(page.getByText('Metric Card')).toBeVisible()
  })
})
