import { test, expect } from '@playwright/test'

test.describe('설정 모달', () => {
  test('쿼리 파라미터로 설정 모달 열기 및 탭 전환', async ({ page }) => {
    // ?settings=account로 직접 모달 열기
    await page.goto('/home?settings=account')

    // 설정 모달 열림 — 계정 탭 콘텐츠 확인
    await expect(page.getByText('닉네임')).toBeVisible({ timeout: 5_000 })

    // 다른 탭으로 전환 — getByRole('button')로 탭 버튼 정확히 타겟
    await page.getByRole('button', { name: '구독' }).click()
    await expect(page.getByText('현재 요금제')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '기본' }).click()
    await expect(page.getByText('테마', { exact: true })).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '알림' }).click()
    await expect(page.getByText('푸시 알림', { exact: true })).toBeVisible({ timeout: 5_000 })
  })

  test('구독 탭에서 요금제 표시', async ({ page }) => {
    await page.goto('/home?settings=subscription')

    // 구독 관련 콘텐츠 로드 대기
    await expect(page.getByText('현재 요금제')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('모든 요금제')).toBeVisible()
    await expect(page.getByText('결제 수단', { exact: true })).toBeVisible()
    await expect(page.getByText('결제 내역', { exact: true })).toBeVisible()
  })

  test('설정 모달 닫기 (오버레이 클릭)', async ({ page }) => {
    await page.goto('/home?settings=account')

    // 모달이 열린 상태 확인
    await expect(page.getByText('닉네임')).toBeVisible({ timeout: 5_000 })

    // 백드롭(오버레이) 클릭으로 닫기
    await page.locator('.bg-black\\/50').click({ position: { x: 10, y: 10 } })

    // 모달이 닫힘
    await expect(page.getByText('닉네임')).not.toBeVisible({ timeout: 3_000 })
  })
})
