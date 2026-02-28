import { test, expect } from '@playwright/test'

test.describe('설정 모달 상세', () => {
  test('계정 탭 — 닉네임, 비밀번호, 거래소, 로그아웃 섹션 확인', async ({ page }) => {
    await page.goto('/home?settings=account')

    await expect(page.getByText('닉네임')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: '비밀번호 변경' })).toBeVisible()
    await expect(page.getByText('거래소 API 연동')).toBeVisible()
    await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible()
  })

  test('계정 탭 — 비밀번호 변경 버튼 클릭 시 모달', async ({ page }) => {
    await page.goto('/home?settings=account')
    await expect(page.getByRole('button', { name: '비밀번호 변경' })).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '비밀번호 변경' }).click()

    // 비밀번호 변경 모달 표시 확인
    await expect(page.getByText('새 비밀번호', { exact: true })).toBeVisible({ timeout: 3_000 })
  })

  test('계정 탭 — 거래소 추가 버튼 클릭 시 모달', async ({ page }) => {
    await page.goto('/home?settings=account')
    await expect(page.getByText('거래소 API 연동')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '+ 거래소 추가' }).click()

    // 거래소 추가 모달 표시 확인
    await expect(page.getByText('거래소 선택')).toBeVisible({ timeout: 3_000 })
  })

  test('계정 탭 — 거래소 추가 모달에서 거래소 선택 및 입력 필드', async ({ page }) => {
    await page.goto('/home?settings=account')
    await expect(page.getByText('거래소 API 연동')).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '+ 거래소 추가' }).click()
    await expect(page.getByText('거래소 선택')).toBeVisible({ timeout: 3_000 })

    // API Key 입력 필드 확인
    await expect(page.getByPlaceholder('API Key를 입력하세요')).toBeVisible()
  })

  test('계정 탭 — 로그아웃 확인 모달', async ({ page }) => {
    await page.goto('/home?settings=account')
    await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible({ timeout: 5_000 })

    await page.getByRole('button', { name: '로그아웃' }).click()

    // 확인 모달 표시
    await expect(page.getByText('로그아웃 하시겠습니까?')).toBeVisible({ timeout: 3_000 })
    await expect(page.getByRole('button', { name: '취소' })).toBeVisible()
  })

  test('기본 탭 — 테마 옵션 확인', async ({ page }) => {
    await page.goto('/home?settings=general')

    await expect(page.getByText('테마', { exact: true })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('시스템 설정')).toBeVisible()
    await expect(page.getByText('라이트 모드')).toBeVisible()
    await expect(page.getByText('다크 모드')).toBeVisible()
  })

  test('기본 탭 — 언어 옵션 확인', async ({ page }) => {
    await page.goto('/home?settings=general')

    await expect(page.getByText('언어', { exact: true })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('한국어')).toBeVisible()
    await expect(page.getByText('영어')).toBeVisible()
  })

  test('알림 탭 — 알림 토글 항목 확인', async ({ page }) => {
    await page.goto('/home?settings=notification')

    await expect(page.getByText('푸시 알림', { exact: true })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('포지션 종료 알림')).toBeVisible()
    await expect(page.getByText('리스크 경고')).toBeVisible()
  })

  test('알림 탭 — 토글 스위치 인터랙션', async ({ page }) => {
    await page.goto('/home?settings=notification')
    await expect(page.getByText('푸시 알림', { exact: true })).toBeVisible({ timeout: 5_000 })

    // 토글 스위치가 존재하는지 확인
    const toggles = page.getByRole('switch')
    const count = await toggles.count()
    expect(count).toBeGreaterThan(0)
  })

  test('구독 탭 — 요금제 카드 및 결제 섹션 확인', async ({ page }) => {
    await page.goto('/home?settings=subscription')

    await expect(page.getByText('현재 요금제')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('모든 요금제')).toBeVisible()
    await expect(page.getByText('결제 수단', { exact: true })).toBeVisible()
    await expect(page.getByText('결제 내역', { exact: true })).toBeVisible()
  })
})
