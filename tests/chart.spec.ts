import { test, expect } from '@playwright/test'

test.describe('차트 분석', () => {
  test('차트 페이지 로드', async ({ page }) => {
    await page.goto('/chart')
    await expect(page).toHaveURL(/chart/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('TradingView 차트 위젯 렌더링', async ({ page }) => {
    await page.goto('/chart')

    // TradingView iframe 또는 차트 컨테이너가 로드될 때까지 대기
    const chartContainer = page.locator('#tv_chart_container, [class*="chart"], iframe[id*="tradingview"]')
    await expect(chartContainer.first()).toBeVisible({ timeout: 20_000 })
  })
})
