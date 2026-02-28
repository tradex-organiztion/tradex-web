import { test, expect } from '@playwright/test'

test.describe('전체 네비게이션', () => {
  test('사이드바에서 모든 주요 페이지로 이동', async ({ page }) => {
    await page.goto('/home')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 홈 → 차트 분석
    await page.getByText('차트 분석').click()
    await page.waitForURL('**/chart**', { timeout: 5_000 })
    await expect(page).toHaveURL(/chart/)

    // 차트 → 매매일지
    await page.getByText('매매일지 관리').click()
    await page.waitForURL('**/trading/journal**', { timeout: 5_000 })
    await expect(page).toHaveURL(/trading\/journal/)

    // 매매일지 → 전략 분석
    await page.getByText('전략 분석').click()
    await page.waitForURL('**/analysis/strategy**', { timeout: 5_000 })
    await expect(page).toHaveURL(/analysis\/strategy/)

    // 전략 분석 → 리스크 패턴
    await page.getByText('리스크 패턴').click()
    await page.waitForURL('**/analysis/risk**', { timeout: 5_000 })
    await expect(page).toHaveURL(/analysis\/risk/)

    // 리스크 패턴 → 수익 관리
    await page.getByText('수익 관리').click()
    await page.waitForURL('**/portfolio**', { timeout: 5_000 })
    await expect(page).toHaveURL(/portfolio/)
  })

  test('사이드바 로고 클릭으로 홈 이동', async ({ page }) => {
    await page.goto('/chart')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 사이드바 내 Tradex 링크 클릭
    await page.getByRole('link', { name: 'Tradex' }).first().click()
    await page.waitForURL('**/home**', { timeout: 5_000 })
    await expect(page).toHaveURL(/home/)
  })

  test('사이드바에서 Tradex AI 이동', async ({ page }) => {
    await page.goto('/home')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    await page.locator('nav').getByText('Tradex AI').click()
    await page.waitForURL('**/ai**', { timeout: 5_000 })
    await expect(page).toHaveURL(/ai/)
  })

  test('포트폴리오 Assets 페이지에서 P&L 이동', async ({ page }) => {
    await page.goto('/portfolio/assets')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // P&L 직접 이동
    await page.goto('/portfolio/pnl')
    await expect(page).toHaveURL(/portfolio\/pnl/)
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })
  })

  test('존재하지 않는 페이지 접근 시 에러 없음', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-xyz')

    // 서버 에러(500)가 아닌지 확인
    expect(response?.status()).not.toBe(500)

    // 페이지가 렌더링되어야 함 (404 페이지든 리다이렉트든)
    await expect(page.locator('body')).toBeVisible()
  })
})
