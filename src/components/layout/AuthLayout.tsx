import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <span className="text-xl font-semibold text-navy-900">Tradex</span>
          </div>

          {/* Title */}
          {title && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
              {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
              )}
            </div>
          )}

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right: Image/Branding */}
      <div className="relative hidden flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-700">
          <div className="flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold mb-4">
                AI 기반 스마트 트레이딩
              </h2>
              <p className="text-lg text-gray-300">
                Tradex와 함께 더 똑똑한 매매 결정을 내리세요.
                AI 분석, 매매일지, 리스크 관리까지 한 곳에서.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-gray-300">활성 사용자</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1M+</div>
                <div className="text-sm text-gray-300">분석된 매매</div>
              </div>
              <div>
                <div className="text-3xl font-bold">85%</div>
                <div className="text-sm text-gray-300">만족도</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
