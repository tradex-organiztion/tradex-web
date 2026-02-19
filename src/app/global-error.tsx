'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              예상치 못한 오류가 발생했습니다
            </h2>
            <p className="max-w-sm text-sm text-gray-600">
              {error.message || '잠시 후 다시 시도해주세요.'}
            </p>
            <button
              onClick={reset}
              className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
