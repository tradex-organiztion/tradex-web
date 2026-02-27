import { test, expect } from '@playwright/test'

test.describe('수익 관리', () => {
  test('Assets 페이지 로드', async ({ page }) => {
    await page.goto('/portfolio/assets')
    await expect(page).toHaveURL(/portfolio\/assets/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('P&L 페이지 로드', async ({ page }) => {
    await page.goto('/portfolio/pnl')
    await expect(page).toHaveURL(/portfolio\/pnl/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('Assets에서 P&L 탭 전환', async ({ page }) => {
    await page.goto('/portfolio/assets')

    // P&L 탭/링크 클릭
    const pnlLink = page.getByText('P&L').or(page.getByText('손익'))
    if (await pnlLink.first().isVisible().catch(() => false)) {
      await pnlLink.first().click()
      await page.waitForURL('**/portfolio/pnl**')
      await expect(page).toHaveURL(/portfolio\/pnl/)
    }
  })
})
