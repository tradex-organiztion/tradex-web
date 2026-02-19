import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-6xl font-bold text-gray-200">404</span>
        <h2 className="text-xl font-semibold text-gray-800">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="max-w-sm text-sm text-gray-600">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          href="/home"
          className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
