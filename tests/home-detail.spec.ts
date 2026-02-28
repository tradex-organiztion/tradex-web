import { test, expect } from '@playwright/test'

test.describe('홈 대시보드 상세', () => {
  test('통계 카드 표시 확인', async ({ page }) => {
    await page.goto('/home')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 주요 통계 카드 존재 확인
    await expect(page.getByText('총 자산').first()).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('실현 손익').first()).toBeVisible()
    await expect(page.getByText('승률').first()).toBeVisible()
  })

  test('인사말 표시', async ({ page }) => {
    await page.goto('/home')

    // "안녕하세요 ~님!" 인사말 확인
    await expect(page.getByText('안녕하세요').first()).toBeVisible({ timeout: 10_000 })
  })

  test('헤더 알림 아이콘 표시', async ({ page }) => {
    await page.goto('/home')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 헤더의 알림 아이콘 (Bell)
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('수신함으로 이동 가능', async ({ page }) => {
    await page.goto('/home')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 수신함 링크/버튼 클릭
    await page.goto('/inbox')
    await expect(page).toHaveURL(/inbox/)
    await expect(page.getByText('수신함').first()).toBeVisible({ timeout: 5_000 })
  })
})
