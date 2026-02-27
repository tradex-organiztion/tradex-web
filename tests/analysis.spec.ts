import { test, expect } from '@playwright/test'

test.describe('분석', () => {
  test('전략 분석 페이지 로드', async ({ page }) => {
    await page.goto('/analysis/strategy')
    await expect(page).toHaveURL(/analysis\/strategy/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('리스크 패턴 페이지 로드', async ({ page }) => {
    await page.goto('/analysis/risk')
    await expect(page).toHaveURL(/analysis\/risk/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('전략 분석에서 리스크 패턴으로 네비게이션', async ({ page }) => {
    await page.goto('/analysis/strategy')
    await page.getByText('리스크 패턴').click()
    await page.waitForURL('**/analysis/risk**')
    await expect(page).toHaveURL(/analysis\/risk/)
  })
})
