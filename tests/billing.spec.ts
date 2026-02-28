import { test, expect } from '@playwright/test'

test.describe('빌링 콜백', () => {
  test('빌링 성공 페이지 — 파라미터 누락 시 에러 표시', async ({ page }) => {
    // authKey/customerKey 없이 접근
    await page.goto('/billing/success')

    await expect(page.getByText('결제 처리 실패')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('필수 파라미터가 누락되었습니다')).toBeVisible()
    await expect(page.getByRole('button', { name: '설정으로 돌아가기' })).toBeVisible()
  })

  test('빌링 성공 페이지 — 설정으로 돌아가기 버튼', async ({ page }) => {
    await page.goto('/billing/success')
    await expect(page.getByText('결제 처리 실패')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '설정으로 돌아가기' }).click()
    await page.waitForURL('**/home**', { timeout: 5_000 })
    await expect(page).toHaveURL(/home/)
  })

  test('빌링 실패 페이지 — 기본 렌더링', async ({ page }) => {
    await page.goto('/billing/fail')

    await expect(page.getByText('결제 실패')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: '다시 시도' })).toBeVisible()
  })

  test('빌링 실패 페이지 — 쿼리 파라미터로 에러 정보 표시', async ({ page }) => {
    await page.goto('/billing/fail?code=PAY_PROCESS_CANCELED&message=사용자가 결제를 취소했습니다')

    await expect(page.getByText('결제 실패')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('사용자가 결제를 취소했습니다')).toBeVisible()
    await expect(page.getByText('오류 코드: PAY_PROCESS_CANCELED')).toBeVisible()
  })

  test('빌링 실패 페이지 — 다시 시도 버튼으로 설정 이동', async ({ page }) => {
    await page.goto('/billing/fail')
    await expect(page.getByText('결제 실패')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '다시 시도' }).click()
    await page.waitForURL('**/home**', { timeout: 5_000 })
    await expect(page).toHaveURL(/home/)
  })
})
