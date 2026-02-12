import type { IChartWidgetApi, EntityId } from '@/charting_library'
import type { Trigger } from '@/types/trigger'

interface TriggerCallbacks {
  onTriggered: (trigger: Trigger) => void
}

let evaluationInterval: ReturnType<typeof setInterval> | null = null

function getStudyValue(
  chart: IChartWidgetApi,
  trigger: Trigger
): number | null {
  try {
    const studies = chart.getAllStudies()
    const study = studies.find((s) => {
      if (trigger.source.entityId) return s.id === trigger.source.entityId
      const name = s.name.toLowerCase()
      switch (trigger.source.type) {
        case 'bollinger_band':
          return name.includes('bollinger')
        case 'ema':
          return name.includes('ema') || name.includes('exponential')
        case 'sma':
          return name.includes('sma') || name.includes('moving average')
        case 'rsi':
          return name.includes('rsi')
        case 'macd':
          return name.includes('macd')
        default:
          return false
      }
    })

    if (!study) return null

    // Use exportData to get the latest study values
    // This is async in real implementation but we return null for now
    // Real implementation would cache last known values
    return null
  } catch {
    return null
  }
}

function getDrawingValue(
  chart: IChartWidgetApi,
  trigger: Trigger,
  currentTime: number
): number | null {
  try {
    if (!trigger.source.entityId) return null

    const shape = chart.getShapeById(trigger.source.entityId as EntityId)
    if (!shape) return null

    const points = shape.getPoints()
    if (!points || points.length === 0) return null

    if (trigger.source.type === 'horizontal_line') {
      return points[0].price
    }

    if (trigger.source.type === 'trendline' && points.length >= 2) {
      // Linear interpolation between two points
      const p1 = points[0]
      const p2 = points[1]
      const t1 = p1.time as number
      const t2 = p2.time as number

      if (t1 === t2) return p1.price

      const ratio = (currentTime - t1) / (t2 - t1)
      return p1.price + ratio * (p2.price - p1.price)
    }

    if (trigger.source.type === 'fibonacci' && points.length >= 2) {
      const level = trigger.source.params?.level ?? 0.618
      const p1 = points[0]
      const p2 = points[1]
      return p2.price + (p1.price - p2.price) * level
    }

    return points[0].price
  } catch {
    return null
  }
}

function evaluateCondition(
  currentPrice: number,
  targetValue: number,
  condition: Trigger['condition'],
  tolerance: number = 0.001
): boolean {
  const relTolerance = targetValue * tolerance

  switch (condition) {
    case 'TOUCH':
      return Math.abs(currentPrice - targetValue) <= relTolerance
    case 'CROSS_ABOVE':
      return currentPrice >= targetValue && currentPrice <= targetValue + relTolerance
    case 'CROSS_BELOW':
      return currentPrice <= targetValue && currentPrice >= targetValue - relTolerance
    case 'INSIDE':
      return currentPrice <= targetValue
    case 'OUTSIDE':
      return currentPrice >= targetValue
    default:
      return false
  }
}

function evaluateTrigger(
  trigger: Trigger,
  chart: IChartWidgetApi,
  currentPrice: number,
  currentTime: number
): boolean {
  if (!trigger.active) return false

  let targetValue: number | null = null

  switch (trigger.type) {
    case 'DRAWING_TOUCH':
      targetValue = getDrawingValue(chart, trigger, currentTime)
      break
    case 'INDICATOR_CROSS':
      targetValue = getStudyValue(chart, trigger)
      break
    case 'PATTERN':
      // Pattern detection would be handled separately
      return false
    default:
      return false
  }

  if (targetValue === null) return false

  return evaluateCondition(currentPrice, targetValue, trigger.condition)
}

export function startTriggerEngine(
  getChart: () => IChartWidgetApi | null,
  getTriggers: () => Trigger[],
  getCurrentPrice: () => number | null,
  callbacks: TriggerCallbacks
): void {
  stopTriggerEngine()

  evaluationInterval = setInterval(() => {
    const chart = getChart()
    const price = getCurrentPrice()
    if (!chart || price === null) return

    const triggers = getTriggers()
    const now = Date.now()

    for (const trigger of triggers) {
      if (!trigger.active) continue

      // Prevent firing same trigger too frequently (min 30 seconds between fires)
      if (trigger.lastTriggeredAt) {
        const lastFired = new Date(trigger.lastTriggeredAt).getTime()
        if (now - lastFired < 30000) continue
      }

      const triggered = evaluateTrigger(trigger, chart, price, now)
      if (triggered) {
        callbacks.onTriggered(trigger)
      }
    }
  }, 1000)
}

export function stopTriggerEngine(): void {
  if (evaluationInterval) {
    clearInterval(evaluationInterval)
    evaluationInterval = null
  }
}
