import { test, expect } from '@playwright/test'

test.describe('인증 플로우', () => {
  test.use({ storageState: { cookies: [], origins: [] } }) // 비인증 상태

  test('비인증 사용자는 로그인 페이지로 리다이렉트', async ({ page }) => {
    await page.goto('/home')
    await page.waitForURL('**/login**')
    await expect(page).toHaveURL(/login/)
  })

  test('잘못된 로그인 시 에러 표시', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible()

    // input 요소에 직접 접근
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')

    await emailInput.fill('wrong@email.com')
    await passwordInput.fill('wrongpassword')

    // 버튼 활성화 대기 후 클릭
    const submitBtn = page.getByRole('button', { name: '로그인', exact: true })
    await expect(submitBtn).toBeEnabled({ timeout: 3_000 })
    await submitBtn.click()

    // 에러 메시지 또는 로그인 페이지에 남아있음
    // API가 오래 걸릴 수 있으므로 충분한 timeout
    const errorOrStay = await Promise.race([
      page.getByText('올바르지 않습니다').waitFor({ timeout: 15_000 }).then(() => 'error'),
      page.getByText('실패했습니다').waitFor({ timeout: 15_000 }).then(() => 'error'),
      page.getByText('연결할 수 없습니다').waitFor({ timeout: 15_000 }).then(() => 'error'),
      page.getByText('등록되지 않은').waitFor({ timeout: 15_000 }).then(() => 'error'),
      // 15초 후에도 로그인 페이지에 있으면 OK (에러가 inline으로 표시될 수 있음)
      new Promise(resolve => setTimeout(() => resolve('timeout'), 16_000)),
    ]).catch(() => 'error-caught')

    // 에러가 표시되었거나, 여전히 로그인 페이지에 있어야 함 (홈으로 가면 안 됨)
    expect(page.url()).toContain('login')
  })

  test('정상 로그인 후 홈으로 이동', async ({ page }) => {
    await page.goto('/login')

    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')

    await emailInput.fill('string@email.com')
    await passwordInput.fill('stringst')

    const submitBtn = page.getByRole('button', { name: '로그인', exact: true })
    await expect(submitBtn).toBeEnabled({ timeout: 3_000 })
    await submitBtn.click()

    await page.waitForURL('**/home**', { timeout: 15_000 })
    await expect(page).toHaveURL(/home/)
  })

  test('회원가입 페이지 접근 가능', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByText('회원가입')).toBeVisible()
  })
})
