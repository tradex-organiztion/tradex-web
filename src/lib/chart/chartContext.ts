import type {
  IChartingLibraryWidget,
  EntityInfo,
} from '@/charting_library'

export interface ChartContextStudy {
  id: string
  name: string
}

export interface ChartContextShape {
  id: string
  name: string
  points: Array<{ time: number; price: number }>
}

export interface ChartContextBar {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface ChartContext {
  symbol: string
  interval: string
  visibleRange: { from: number; to: number }
  studies: ChartContextStudy[]
  shapes: ChartContextShape[]
}

export async function captureChartContext(
  widget: IChartingLibraryWidget
): Promise<ChartContext> {
  const chart = widget.activeChart()
  const symbolInterval = widget.symbolInterval()

  // Get visible range
  const range = chart.getVisibleRange()

  // Get all studies
  const allStudies: EntityInfo[] = chart.getAllStudies()
  const studies: ChartContextStudy[] = allStudies.map((s) => ({
    id: String(s.id),
    name: s.name,
  }))

  // Get all shapes (drawings)
  const allShapes = chart.getAllShapes()
  const shapes: ChartContextShape[] = allShapes.map((s) => {
    let points: Array<{ time: number; price: number }> = []
    try {
      const shapeApi = chart.getShapeById(s.id)
      points = shapeApi.getPoints().map((p) => ({
        time: p.time,
        price: p.price,
      }))
    } catch {
      // Shape may not have accessible points
    }
    return {
      id: String(s.id),
      name: s.name,
      points,
    }
  })

  return {
    symbol: symbolInterval.symbol,
    interval: symbolInterval.interval as string,
    visibleRange: {
      from: range.from,
      to: range.to,
    },
    studies,
    shapes,
  }
}
