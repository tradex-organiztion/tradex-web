'use client'

import { useState, useCallback, useEffect } from 'react'
import { Plus, Trash2, Bell, BellOff, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useTriggerStore } from '@/stores/useTriggerStore'
import { useChartStore } from '@/stores/useChartStore'
import { startTriggerEngine, stopTriggerEngine } from '@/lib/chart/triggerEngine'
import type { Trigger, TriggerType, TriggerSourceType, TriggerCondition, TriggerActionType } from '@/types/trigger'
import { toast } from 'sonner'

interface TriggerPanelProps {
  className?: string
}

const TRIGGER_TYPE_LABELS: Record<TriggerType, string> = {
  DRAWING_TOUCH: '드로잉 터치',
  INDICATOR_CROSS: '지표 크로스',
  PATTERN: '패턴',
}

const SOURCE_TYPE_LABELS: Record<TriggerSourceType, string> = {
  trendline: '추세선',
  horizontal_line: '수평선',
  fibonacci: '피보나치',
  bollinger_band: '볼린저 밴드',
  ema: 'EMA',
  sma: 'SMA',
  rsi: 'RSI',
  macd: 'MACD',
}

const CONDITION_LABELS: Record<TriggerCondition, string> = {
  TOUCH: '터치',
  CROSS_ABOVE: '상향 돌파',
  CROSS_BELOW: '하향 돌파',
  INSIDE: '내부 진입',
  OUTSIDE: '외부 이탈',
}

const ACTION_TYPE_LABELS: Record<TriggerActionType, string> = {
  NOTIFY: '알림',
  ENTRY_LONG: '롱 진입',
  ENTRY_SHORT: '숏 진입',
}

export function TriggerPanel({ className }: TriggerPanelProps) {
  const { triggers, addTrigger, removeTrigger, toggleTrigger, setLastTriggered } = useTriggerStore()
  const { widgetInstance, selectedSymbol } = useChartStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<TriggerType>('DRAWING_TOUCH')
  const [newSourceType, setNewSourceType] = useState<TriggerSourceType>('trendline')
  const [newCondition, setNewCondition] = useState<TriggerCondition>('TOUCH')
  const [newActionType, setNewActionType] = useState<TriggerActionType>('NOTIFY')

  const symbolTriggers = triggers.filter((t) => t.symbol === selectedSymbol)
  const activeCount = symbolTriggers.filter((t) => t.active).length

  const handleTriggered = useCallback((trigger: Trigger) => {
    setLastTriggered(trigger.id)

    if (trigger.action.type === 'NOTIFY') {
      toast(`트리거 발동: ${trigger.name}`, {
        description: `${SOURCE_TYPE_LABELS[trigger.source.type]} ${CONDITION_LABELS[trigger.condition]}`,
      })
    }
  }, [setLastTriggered])

  // Start/stop trigger engine
  useEffect(() => {
    if (!widgetInstance) return

    startTriggerEngine(
      () => {
        try {
          return widgetInstance.activeChart()
        } catch {
          return null
        }
      },
      () => triggers.filter((t) => t.active),
      () => {
        // Get current price from widget
        // In real implementation this would come from the datafeed
        return null
      },
      { onTriggered: handleTriggered }
    )

    return () => stopTriggerEngine()
  }, [widgetInstance, triggers, handleTriggered])

  const handleAddTrigger = () => {
    if (!newName.trim()) return

    const trigger: Trigger = {
      id: `trigger-${Date.now()}`,
      name: newName,
      type: newType,
      source: {
        type: newSourceType,
      },
      condition: newCondition,
      action: {
        type: newActionType,
      },
      symbol: selectedSymbol,
      active: true,
      createdAt: new Date().toISOString(),
    }

    addTrigger(trigger)
    setShowAddForm(false)
    setNewName('')
  }

  return (
    <div className={cn("border-t border-line-normal bg-white", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-label-neutral" />
          <span className="text-body-2-medium text-label-normal">트리거</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-element-primary-default text-gray-0 text-caption-medium flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-label-assistive" />
        ) : (
          <ChevronUp className="w-4 h-4 text-label-assistive" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 max-h-64 overflow-y-auto">
          {/* Trigger List */}
          {symbolTriggers.length === 0 ? (
            <p className="text-caption-regular text-label-assistive py-2">
              설정된 트리거가 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {symbolTriggers.map((trigger) => (
                <div
                  key={trigger.id}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg",
                    trigger.active ? "bg-gray-50" : "bg-gray-50 opacity-50"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-body-2-medium text-label-normal truncate">
                      {trigger.name}
                    </p>
                    <p className="text-caption-regular text-label-assistive">
                      {SOURCE_TYPE_LABELS[trigger.source.type]} · {CONDITION_LABELS[trigger.condition]} · {ACTION_TYPE_LABELS[trigger.action.type]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => toggleTrigger(trigger.id)}
                      className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                    >
                      {trigger.active ? (
                        <Bell className="w-3.5 h-3.5 text-label-neutral" />
                      ) : (
                        <BellOff className="w-3.5 h-3.5 text-label-disabled" />
                      )}
                    </button>
                    <button
                      onClick={() => removeTrigger(trigger.id)}
                      className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-label-danger" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Trigger Form */}
          {showAddForm ? (
            <div className="mt-3 p-3 border border-line-normal rounded-lg">
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="트리거 이름"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-8 text-body-2-regular"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TriggerType)}
                    className="h-8 rounded-lg border border-line-normal px-2 text-caption-regular text-label-normal bg-white"
                  >
                    {Object.entries(TRIGGER_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <select
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value as TriggerSourceType)}
                    className="h-8 rounded-lg border border-line-normal px-2 text-caption-regular text-label-normal bg-white"
                  >
                    {Object.entries(SOURCE_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as TriggerCondition)}
                    className="h-8 rounded-lg border border-line-normal px-2 text-caption-regular text-label-normal bg-white"
                  >
                    {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <select
                    value={newActionType}
                    onChange={(e) => setNewActionType(e.target.value as TriggerActionType)}
                    className="h-8 rounded-lg border border-line-normal px-2 text-caption-regular text-label-normal bg-white"
                  >
                    {Object.entries(ACTION_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddTrigger}
                    disabled={!newName.trim()}
                  >
                    추가
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="mt-2 w-full gap-1"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              트리거 추가
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
