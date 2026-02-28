import { test, expect } from '@playwright/test'

test.describe('반응형 레이아웃', () => {
  test('모바일 뷰포트에서 사이드바 숨김', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/home')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 모바일에서 사이드바는 기본적으로 숨겨져야 함
    const sidebar = page.locator('nav').first()
    await expect(sidebar).not.toBeInViewport()
  })

  test('태블릿 뷰포트에서 페이지 정상 렌더링', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/home')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })
  })

  test('데스크톱 뷰포트에서 사이드바 표시', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/home')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 데스크톱에서 사이드바 네비게이션 링크 보여야 함
    await expect(page.getByText('홈')).toBeVisible()
    await expect(page.getByText('차트 분석')).toBeVisible()
  })

  test('모바일에서 설정 모달 정상 표시', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/home?settings=account')

    await expect(page.getByText('닉네임')).toBeVisible({ timeout: 5_000 })
  })

  test('모바일에서 매매일지 페이지 정상 로드', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/trading/journal')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })
  })

  test('모바일에서 차트 페이지 정상 로드', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/chart')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })
  })
})
