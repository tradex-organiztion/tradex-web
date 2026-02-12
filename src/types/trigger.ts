export type TriggerSourceType =
  | 'trendline'
  | 'horizontal_line'
  | 'fibonacci'
  | 'bollinger_band'
  | 'ema'
  | 'sma'
  | 'rsi'
  | 'macd'

export type TriggerCondition =
  | 'TOUCH'
  | 'CROSS_ABOVE'
  | 'CROSS_BELOW'
  | 'INSIDE'
  | 'OUTSIDE'

export type TriggerActionType =
  | 'NOTIFY'
  | 'ENTRY_LONG'
  | 'ENTRY_SHORT'

export type TriggerType =
  | 'DRAWING_TOUCH'
  | 'INDICATOR_CROSS'
  | 'PATTERN'

export interface TriggerSource {
  type: TriggerSourceType
  entityId?: string
  params?: Record<string, number>
}

export interface TriggerAction {
  type: TriggerActionType
  params?: Record<string, unknown>
}

export interface Trigger {
  id: string
  name: string
  type: TriggerType
  source: TriggerSource
  condition: TriggerCondition
  action: TriggerAction
  symbol: string
  active: boolean
  createdAt: string
  lastTriggeredAt?: string
}
