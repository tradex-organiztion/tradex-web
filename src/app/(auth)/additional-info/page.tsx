import { AuthLayout, AuthCard } from '@/components/layout'

export default function AdditionalInfoPage() {
  return (
    <AuthLayout>
      <AuthCard title="추가 정보" className="w-[424px]">
        <p className="text-body-1-medium text-gray-600 text-center mb-6">
          더 나은 서비스를 위해 몇 가지 정보를 입력해주세요
        </p>
        <div className="space-y-6">
          {/* TODO: AdditionalInfoForm 컴포넌트 */}
          <p className="text-gray-500">추가 정보 입력 폼이 들어갈 자리입니다.</p>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
