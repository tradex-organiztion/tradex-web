import { AuthLayout } from '@/components/layout'

export default function AdditionalInfoPage() {
  return (
    <AuthLayout
      title="추가 정보"
      description="더 나은 서비스를 위해 몇 가지 정보를 입력해주세요"
    >
      <div className="space-y-6">
        {/* TODO: AdditionalInfoForm 컴포넌트 */}
        <p className="text-gray-500">추가 정보 입력 폼이 들어갈 자리입니다.</p>
      </div>
    </AuthLayout>
  )
}
