import { AuthLayout } from '@/components/layout'

export default function SignupPage() {
  return (
    <AuthLayout
      title="회원가입"
      description="Tradex에 가입하고 스마트한 트레이딩을 시작하세요"
    >
      <div className="space-y-6">
        {/* TODO: SignupForm 컴포넌트 */}
        <p className="text-gray-500">회원가입 폼이 들어갈 자리입니다.</p>
      </div>
    </AuthLayout>
  )
}
