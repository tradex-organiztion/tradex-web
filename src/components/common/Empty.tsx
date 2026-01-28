import { cn } from '@/lib/utils'
import { Inbox, FileText, BarChart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

type EmptyType = 'default' | 'inbox' | 'journal' | 'chart' | 'search'

interface EmptyProps {
  type?: EmptyType
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const iconMap = {
  default: Inbox,
  inbox: Inbox,
  journal: FileText,
  chart: BarChart,
  search: Search,
}

const defaultMessages: Record<EmptyType, { title: string; description: string }> = {
  default: {
    title: '데이터가 없습니다',
    description: '아직 등록된 항목이 없습니다.',
  },
  inbox: {
    title: '알림이 없습니다',
    description: '새로운 알림이 오면 여기에 표시됩니다.',
  },
  journal: {
    title: '매매일지가 없습니다',
    description: '첫 번째 매매일지를 작성해보세요.',
  },
  chart: {
    title: '차트 데이터가 없습니다',
    description: '심볼을 선택하여 차트를 확인하세요.',
  },
  search: {
    title: '검색 결과가 없습니다',
    description: '다른 검색어로 다시 시도해보세요.',
  },
}

export function Empty({
  type = 'default',
  title,
  description,
  action,
  className,
}: EmptyProps) {
  const Icon = iconMap[type]
  const messages = defaultMessages[type]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">
        {title || messages.title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-gray-600">
        {description || messages.description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
