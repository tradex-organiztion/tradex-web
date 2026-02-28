import { test, expect } from '@playwright/test'

test.describe('매매일지 상세', () => {
  test('매매일지 작성 폼 — 필드 확인', async ({ page }) => {
    await page.goto('/trading/journal')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // "수동 추가하기" 버튼으로 폼 열기
    await page.getByRole('button', { name: '수동 추가하기' }).click()

    // 폼이 열리면 주요 필드 확인
    await expect(page.getByText('거래 페어')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('레버리지')).toBeVisible()
  })

  test('매매일지 작성 폼 — 거래 페어 입력', async ({ page }) => {
    await page.goto('/trading/journal')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '수동 추가하기' }).click()

    const pairInput = page.getByPlaceholder('입력(예. BTC/USDT)')
    await expect(pairInput).toBeVisible({ timeout: 5_000 })
    await pairInput.fill('BTC/USDT')
    await expect(pairInput).toHaveValue('BTC/USDT')
  })

  test('매매일지 작성 폼 — 탭 전환 (사전 시나리오 / 매매 후 복기)', async ({ page }) => {
    await page.goto('/trading/journal')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '수동 추가하기' }).click()
    await expect(page.getByText('사전 시나리오')).toBeVisible({ timeout: 5_000 })

    // 매매 후 복기 탭으로 전환
    await page.getByText('매매 후 복기').click()
    await expect(page.getByText('복기 내용', { exact: true })).toBeVisible({ timeout: 3_000 })
  })

  test('매매일지 작성 폼 — 취소 버튼으로 닫기', async ({ page }) => {
    await page.goto('/trading/journal')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '수동 추가하기' }).click()
    await expect(page.getByText('거래 페어')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '취소' }).click()

    // 폼이 닫힌 후 캘린더가 보여야 함
    await expect(page.getByText('2026년')).toBeVisible({ timeout: 3_000 })
  })

  test('매매일지 캘린더 뷰 — 월 네비게이션', async ({ page }) => {
    await page.goto('/trading/journal')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 현재 월이 표시되는지 확인
    const now = new Date()
    const monthText = `${now.getFullYear()}년 ${now.getMonth() + 1}월`
    await expect(page.getByText(monthText)).toBeVisible({ timeout: 5_000 })

    // 이전 달 버튼 클릭
    await page.getByRole('button', { name: '이전 달' }).click()

    // 월이 변경됨을 확인 (현재 월 텍스트가 사라져야 함)
    await expect(page.getByText(monthText)).not.toBeVisible({ timeout: 3_000 })
  })

  test('매매일지 — action=new 쿼리로 폼 자동 열기', async ({ page }) => {
    await page.goto('/trading/journal?action=new')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 폼이 자동으로 열려야 함 (거래 페어 또는 사전 시나리오 필드)
    await expect(page.getByText('거래 페어').or(page.getByText('사전 시나리오')).first()).toBeVisible({ timeout: 5_000 })
  })

  test('매매일지 리스트 뷰 — 전환 후 표시', async ({ page }) => {
    await page.goto('/trading/journal')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 리스트 뷰로 전환
    await page.getByRole('button', { name: '리스트 보기' }).click()

    // 리스트 뷰가 활성화됨
    await expect(page.locator('main')).toBeVisible()
  })
})
