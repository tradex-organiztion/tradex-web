import { test, expect } from '@playwright/test'

test.describe('수신함', () => {
  test('수신함 페이지 로드', async ({ page }) => {
    await page.goto('/inbox')
    await expect(page).toHaveURL(/inbox/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('수신함 제목 및 알림 목록 표시', async ({ page }) => {
    await page.goto('/inbox')

    // "수신함" 타이틀 존재
    await expect(page.getByText('수신함').first()).toBeVisible({ timeout: 5_000 })

    // 알림 항목이 로드될 때까지 대기
    await expect(page.getByText('포지션 진입').first()).toBeVisible({ timeout: 10_000 })
  })
})
