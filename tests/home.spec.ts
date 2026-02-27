import { test, expect } from '@playwright/test'

test.describe('홈 대시보드', () => {
  test('홈 페이지 로드 및 주요 요소 표시', async ({ page }) => {
    await page.goto('/home')
    await expect(page).toHaveURL(/home/)

    // 사이드바 존재
    await expect(page.locator('nav').first()).toBeVisible()

    // 대시보드 콘텐츠 영역 존재
    await expect(page.locator('main')).toBeVisible()
  })

  test('사이드바 네비게이션 동작', async ({ page }) => {
    await page.goto('/home')

    // 차트 분석 링크 클릭
    await page.getByText('차트 분석').click()
    await page.waitForURL('**/chart**')
    await expect(page).toHaveURL(/chart/)
  })
})
