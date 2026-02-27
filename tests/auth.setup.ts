import { test as setup, expect } from '@playwright/test'

const AUTH_FILE = 'tests/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // 로그인 페이지로 이동
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible()

  // 데모 계정으로 로그인
  await page.getByPlaceholder('example@tradex.kr').fill('string@email.com')
  await page.getByPlaceholder('내용을 입력하세요').fill('stringst')
  await page.getByRole('button', { name: '로그인', exact: true }).click()

  // 홈 페이지로 이동될 때까지 대기
  await page.waitForURL('**/home**', { timeout: 15_000 })

  // 인증 상태 저장
  await page.context().storageState({ path: AUTH_FILE })
})
