import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
}

export function Loading({ size = 'md', className }: LoadingProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-gray-200 border-t-navy-900',
        sizeClasses[size],
        className
      )}
    />
  )
}

export function LoadingPage() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loading size="lg" />
    </div>
  )
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <Loading size="lg" />
    </div>
  )
}
