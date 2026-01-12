import { Header } from "@/components/layout";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header
        title="홈"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        }
      />

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900">홈</h1>
          <p className="text-gray-500 mt-1">대시보드 페이지입니다. (구현 예정)</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">총 수익</p>
            <p className="text-2xl font-bold text-success-500 mt-1">+12.5%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">총 거래</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">143회</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">승률</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">68.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
