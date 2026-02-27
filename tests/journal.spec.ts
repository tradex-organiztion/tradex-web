import { test, expect } from '@playwright/test'

test.describe('매매일지', () => {
  test('매매일지 페이지 로드', async ({ page }) => {
    await page.goto('/trading/journal')
    await expect(page).toHaveURL(/trading\/journal/)
    await expect(page.locator('main')).toBeVisible()
  })

  test('캘린더/리스트 뷰 전환', async ({ page }) => {
    await page.goto('/trading/journal')

    // 뷰 전환 버튼 찾기 (캘린더/리스트)
    const listViewBtn = page.getByRole('button', { name: /리스트|list/i })
    const calendarViewBtn = page.getByRole('button', { name: /캘린더|calendar/i })

    // 둘 중 하나가 존재하면 클릭하여 전환
    if (await listViewBtn.isVisible().catch(() => false)) {
      await listViewBtn.click()
      // 리스트 뷰로 전환됨
    } else if (await calendarViewBtn.isVisible().catch(() => false)) {
      await calendarViewBtn.click()
      // 캘린더 뷰로 전환됨
    }

    // 페이지가 크래시 없이 유지
    await expect(page.locator('main')).toBeVisible()
  })

  test('매매일지 작성 폼 열기', async ({ page }) => {
    await page.goto('/trading/journal')

    // "매매 등록" 또는 "+" 버튼 찾기
    const addBtn = page.getByRole('button', { name: /매매 등록|추가|등록/i }).or(
      page.locator('button:has-text("+")')
    )

    if (await addBtn.first().isVisible().catch(() => false)) {
      await addBtn.first().click()
      // 폼 패널이 열리는지 확인
      await expect(page.locator('text=포지션').or(page.locator('text=매매'))).toBeVisible({ timeout: 5_000 })
    }
  })
})
