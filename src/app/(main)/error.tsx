'use client'

import { ErrorPage } from '@/components/common/ErrorMessage'

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorPage
      title="페이지를 불러올 수 없습니다"
      message={error.message || '잠시 후 다시 시도해주세요.'}
      onRetry={reset}
    />
  )
}
