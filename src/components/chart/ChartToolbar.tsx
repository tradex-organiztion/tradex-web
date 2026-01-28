'use client'

import { useState } from 'react'
import {
  TrendingUp,
  BarChart3,
  Activity,
  Minus,
  MoveHorizontal,
  Grid,
  Type,
  Pencil
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChartToolbarProps {
  onTimeframeChange?: (timeframe: string) => void
  onIndicatorToggle?: (indicator: string, enabled: boolean) => void
  onToolSelect?: (tool: string) => void
  className?: string
}

const timeframes = [
  { label: '1분', value: '1m' },
  { label: '5분', value: '5m' },
  { label: '15분', value: '15m' },
  { label: '1시간', value: '1h' },
  { label: '4시간', value: '4h' },
  { label: '1일', value: '1d' },
  { label: '1주', value: '1w' },
]

const indicators = [
  { id: 'ma', label: 'MA', icon: TrendingUp, description: '이동평균선' },
  { id: 'ema', label: 'EMA', icon: TrendingUp, description: '지수이동평균' },
  { id: 'bb', label: 'BB', icon: BarChart3, description: '볼린저 밴드' },
  { id: 'rsi', label: 'RSI', icon: Activity, description: '상대강도지수' },
  { id: 'macd', label: 'MACD', icon: Activity, description: 'MACD' },
]

const drawingTools = [
  { id: 'line', label: '직선', icon: Minus },
  { id: 'hline', label: '수평선', icon: MoveHorizontal },
  { id: 'fib', label: '피보나치', icon: Grid },
  { id: 'text', label: '텍스트', icon: Type },
  { id: 'draw', label: '자유 그리기', icon: Pencil },
]

export function ChartToolbar({
  onTimeframeChange,
  onIndicatorToggle,
  onToolSelect,
  className
}: ChartToolbarProps) {
  const [activeTimeframe, setActiveTimeframe] = useState('4h')
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['ma'])
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [showIndicatorMenu, setShowIndicatorMenu] = useState(false)
  const [showToolMenu, setShowToolMenu] = useState(false)

  const handleTimeframeClick = (value: string) => {
    setActiveTimeframe(value)
    onTimeframeChange?.(value)
  }

  const handleIndicatorToggle = (id: string) => {
    const newIndicators = activeIndicators.includes(id)
      ? activeIndicators.filter(i => i !== id)
      : [...activeIndicators, id]
    setActiveIndicators(newIndicators)
    onIndicatorToggle?.(id, !activeIndicators.includes(id))
  }

  const handleToolClick = (id: string) => {
    const newTool = activeTool === id ? null : id
    setActiveTool(newTool)
    onToolSelect?.(newTool || '')
    setShowToolMenu(false)
  }

  return (
    <div className={cn("flex items-center gap-4 px-4 py-2 bg-white border-b border-line-normal", className)}>
      {/* Timeframe Selector */}
      <div className="flex items-center gap-1">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => handleTimeframeClick(tf.value)}
            className={cn(
              "px-3 py-1.5 rounded text-body-2-regular transition-colors",
              activeTimeframe === tf.value
                ? "bg-element-primary-default text-gray-0"
                : "text-label-neutral hover:bg-gray-50"
            )}
          >
            {tf.label}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-line-normal" />

      {/* Indicators Dropdown */}
      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowIndicatorMenu(!showIndicatorMenu)}
          className="gap-2"
        >
          <Activity className="w-4 h-4" />
          지표
          {activeIndicators.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-element-primary-default text-gray-0 text-caption-medium flex items-center justify-center">
              {activeIndicators.length}
            </span>
          )}
        </Button>

        {showIndicatorMenu && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-line-normal rounded-xl shadow-emphasize py-2 z-10">
            {indicators.map((indicator) => (
              <button
                key={indicator.id}
                onClick={() => handleIndicatorToggle(indicator.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  activeIndicators.includes(indicator.id)
                    ? "bg-gray-50 text-label-normal"
                    : "text-label-neutral hover:bg-gray-50"
                )}
              >
                <indicator.icon className="w-4 h-4" />
                <div className="flex-1">
                  <p className="text-body-2-medium">{indicator.label}</p>
                  <p className="text-caption-regular text-label-assistive">{indicator.description}</p>
                </div>
                {activeIndicators.includes(indicator.id) && (
                  <div className="w-2 h-2 rounded-full bg-element-positive-default" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drawing Tools Dropdown */}
      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowToolMenu(!showToolMenu)}
          className={cn("gap-2", activeTool && "ring-2 ring-element-primary-default")}
        >
          <Pencil className="w-4 h-4" />
          그리기
        </Button>

        {showToolMenu && (
          <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-line-normal rounded-xl shadow-emphasize py-2 z-10">
            {drawingTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  activeTool === tool.id
                    ? "bg-gray-50 text-label-normal"
                    : "text-label-neutral hover:bg-gray-50"
                )}
              >
                <tool.icon className="w-4 h-4" />
                <span className="text-body-2-regular">{tool.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Symbol Info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-body-2-medium text-label-normal">BTC/USDT</p>
          <p className="text-caption-regular text-label-assistive">Binance Futures</p>
        </div>
      </div>
    </div>
  )
}
