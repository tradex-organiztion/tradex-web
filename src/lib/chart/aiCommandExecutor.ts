import type {
  IChartingLibraryWidget,
  ResolutionString,
  EntityId,
  StudyInputValue,
} from '@/charting_library'
import type { Trigger } from '@/types/trigger'

export type AIChartAction =
  | 'ADD_STUDY'
  | 'ADD_SHAPE'
  | 'REMOVE_ENTITY'
  | 'SET_TRIGGER'
  | 'CHANGE_SYMBOL'
  | 'CHANGE_INTERVAL'

export interface AIChartCommand {
  action: AIChartAction
  params: Record<string, unknown>
}

export interface AICommandResult {
  success: boolean
  message: string
  entityId?: string
}

async function executeAddStudy(
  widget: IChartingLibraryWidget,
  params: Record<string, unknown>
): Promise<AICommandResult> {
  try {
    const chart = widget.activeChart()
    const name = params.name as string
    const inputs = params.inputs as Record<string, StudyInputValue> | undefined
    const forceOverlay = (params.forceOverlay as boolean) ?? false

    const id = await chart.createStudy(name, forceOverlay, false, inputs)

    if (id) {
      return {
        success: true,
        message: `지표 '${name}'를 추가했습니다.`,
        entityId: String(id),
      }
    }
    return { success: false, message: `지표 '${name}' 추가에 실패했습니다.` }
  } catch (err) {
    return { success: false, message: `지표 추가 오류: ${err}` }
  }
}

async function executeAddShape(
  widget: IChartingLibraryWidget,
  params: Record<string, unknown>
): Promise<AICommandResult> {
  try {
    const chart = widget.activeChart()
    const shape = params.shape as string
    const points = params.points as Array<{ time: number; price: number }>

    if (!points || points.length === 0) {
      return { success: false, message: '드로잉 포인트가 필요합니다.' }
    }

    let id: EntityId | null = null

    if (points.length === 1) {
      id = await chart.createShape(
        { time: points[0].time, price: points[0].price },
        { shape: shape as never }
      )
    } else {
      id = await chart.createMultipointShape(
        points.map((p) => ({ time: p.time, price: p.price })),
        { shape: shape as never }
      )
    }

    if (id) {
      return {
        success: true,
        message: `드로잉 '${shape}'를 추가했습니다.`,
        entityId: String(id),
      }
    }
    return { success: false, message: `드로잉 추가에 실패했습니다.` }
  } catch (err) {
    return { success: false, message: `드로잉 추가 오류: ${err}` }
  }
}

async function executeRemoveEntity(
  widget: IChartingLibraryWidget,
  params: Record<string, unknown>
): Promise<AICommandResult> {
  try {
    const chart = widget.activeChart()
    const entityId = params.entityId as string
    chart.removeEntity(entityId as EntityId)
    return { success: true, message: '요소를 제거했습니다.' }
  } catch (err) {
    return { success: false, message: `요소 제거 오류: ${err}` }
  }
}

function executeChangeSymbol(
  widget: IChartingLibraryWidget,
  params: Record<string, unknown>
): AICommandResult {
  try {
    const symbol = params.symbol as string
    const interval = widget.symbolInterval().interval
    widget.setSymbol(symbol, interval, () => {})
    return { success: true, message: `심볼을 '${symbol}'로 변경했습니다.` }
  } catch (err) {
    return { success: false, message: `심볼 변경 오류: ${err}` }
  }
}

function executeChangeInterval(
  widget: IChartingLibraryWidget,
  params: Record<string, unknown>
): AICommandResult {
  try {
    const interval = params.interval as string
    const symbol = widget.symbolInterval().symbol
    widget.setSymbol(symbol, interval as ResolutionString, () => {})
    return { success: true, message: `시간프레임을 '${interval}'로 변경했습니다.` }
  } catch (err) {
    return { success: false, message: `시간프레임 변경 오류: ${err}` }
  }
}

export async function executeAICommand(
  widget: IChartingLibraryWidget,
  command: AIChartCommand,
  addTrigger?: (trigger: Trigger) => void
): Promise<AICommandResult> {
  switch (command.action) {
    case 'ADD_STUDY':
      return executeAddStudy(widget, command.params)
    case 'ADD_SHAPE':
      return executeAddShape(widget, command.params)
    case 'REMOVE_ENTITY':
      return executeRemoveEntity(widget, command.params)
    case 'SET_TRIGGER': {
      if (!addTrigger) {
        return { success: false, message: '트리거 스토어를 사용할 수 없습니다.' }
      }
      const trigger = command.params.trigger as Trigger
      if (trigger) {
        addTrigger({
          ...trigger,
          id: `trigger-${Date.now()}`,
          createdAt: new Date().toISOString(),
          active: true,
        })
        return { success: true, message: `트리거 '${trigger.name}'를 설정했습니다.` }
      }
      return { success: false, message: '트리거 데이터가 없습니다.' }
    }
    case 'CHANGE_SYMBOL':
      return executeChangeSymbol(widget, command.params)
    case 'CHANGE_INTERVAL':
      return executeChangeInterval(widget, command.params)
    default:
      return { success: false, message: `알 수 없는 명령: ${command.action}` }
  }
}

export async function executeAICommands(
  widget: IChartingLibraryWidget,
  commands: AIChartCommand[],
  addTrigger?: (trigger: Trigger) => void
): Promise<AICommandResult[]> {
  const results: AICommandResult[] = []
  for (const command of commands) {
    const result = await executeAICommand(widget, command, addTrigger)
    results.push(result)
  }
  return results
}
