import { test, expect } from '@playwright/test'

test.describe('Tradex AI', () => {
  test('AI 메인 페이지 로드', async ({ page }) => {
    await page.goto('/ai')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // Tradex 로고/텍스트 표시
    await expect(page.getByText('Tradex').first()).toBeVisible()
  })

  test('AI 메인 페이지 입력창 표시', async ({ page }) => {
    await page.goto('/ai')

    // 입력 placeholder 확인
    await expect(page.getByPlaceholder('Tradex AI에게 무엇이든 물어보세요!')).toBeVisible({ timeout: 5_000 })
  })

  test('AI 추천 프롬프트 표시', async ({ page }) => {
    await page.goto('/ai')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })

    // 추천 프롬프트 중 하나 이상 보이는지 확인
    const prompts = page.getByText('기준으로')
    await expect(prompts.first()).toBeVisible({ timeout: 5_000 })
  })

  test('AI 입력창에 텍스트 입력 가능', async ({ page }) => {
    await page.goto('/ai')

    const input = page.getByPlaceholder('Tradex AI에게 무엇이든 물어보세요!')
    await expect(input).toBeVisible({ timeout: 5_000 })

    await input.fill('비트코인 시장 분석해줘')
    await expect(input).toHaveValue('비트코인 시장 분석해줘')
  })

  test('AI 채팅 페이지 직접 접근', async ({ page }) => {
    await page.goto('/ai/chat')
    await expect(page.locator('main')).toBeVisible({ timeout: 5_000 })
  })
})
