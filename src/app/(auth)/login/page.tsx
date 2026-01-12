import { AuthLayout } from '@/components/layout'

export default function LoginPage() {
  return (
    <AuthLayout
      title="로그인"
      description="Tradex 계정에 로그인하세요"
    >
      <div className="space-y-6">
        {/* TODO: LoginForm 컴포넌트 */}
        <p className="text-gray-500">로그인 폼이 들어갈 자리입니다.</p>
      </div>
    </AuthLayout>
  )
}
