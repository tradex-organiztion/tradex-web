import { test, expect } from '@playwright/test'

test.describe('인증 추가 플로우', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('아이디 찾기 페이지 접근 및 탭 확인', async ({ page }) => {
    await page.goto('/find-account?tab=id')

    await expect(page.getByText('아이디 찾기')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('비밀번호 찾기')).toBeVisible()
    await expect(page.getByPlaceholder('이름을 입력해주세요.')).toBeVisible()
    await expect(page.getByPlaceholder('휴대폰 번호를 입력해주세요.')).toBeVisible()
  })

  test('비밀번호 찾기 탭 전환', async ({ page }) => {
    await page.goto('/find-account?tab=password')

    await expect(page.getByText('비밀번호 찾기')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByPlaceholder('이메일을 입력해주세요.')).toBeVisible()
    await expect(page.getByRole('button', { name: '완료' })).toBeVisible()
  })

  test('비밀번호 재설정 — 토큰 없이 접근 시 에러', async ({ page }) => {
    await page.goto('/reset-password')

    await expect(page.getByText('유효하지 않은 접근입니다')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: '비밀번호 찾기로 이동' })).toBeVisible()
  })

  test('비밀번호 재설정 — 토큰 있으면 폼 표시', async ({ page }) => {
    await page.goto('/reset-password?token=test-token')

    await expect(page.getByText('비밀번호 재설정')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('새로운 비밀번호를 입력해주세요')).toBeVisible()
    await expect(page.getByPlaceholder('영문, 숫자, 기호 포함 8~16자')).toBeVisible()
    await expect(page.getByPlaceholder('다시 한번 입력해주세요.')).toBeVisible()
  })

  test('로그인 페이지 — 아이디/비밀번호 찾기 링크 존재', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible({ timeout: 5_000 })

    // 아이디/비밀번호 찾기 링크 확인
    const findLink = page.getByText('아이디').or(page.getByText('비밀번호 찾기'))
    await expect(findLink.first()).toBeVisible()
  })
})
