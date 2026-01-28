import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({
  title = '오류가 발생했습니다',
  message = '잠시 후 다시 시도해주세요.',
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-100">
        <AlertCircle className="h-8 w-8 text-error-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
      )}
    </div>
  )
}

export function ErrorPage({
  title,
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <ErrorMessage title={title} message={message} onRetry={onRetry} />
    </div>
  )
}
