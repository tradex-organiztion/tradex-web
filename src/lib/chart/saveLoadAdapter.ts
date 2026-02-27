import type {
  IExternalSaveLoadAdapter,
  ChartMetaInfo,
  ChartData,
  StudyTemplateMetaInfo,
  StudyTemplateData,
  ChartTemplate,
  ChartTemplateContent,
  LineToolsAndGroupsState,
  LineToolsAndGroupsLoadRequestType,
  LineToolsAndGroupsLoadRequestContext,
  ResolutionString,
} from '@/charting_library'
import { chartLayoutApi } from '@/lib/api/chartLayout'

const STORAGE_KEYS = {
  STUDY_TEMPLATES: 'tradex-study-templates',
  STUDY_TEMPLATE_CONTENT: 'tradex-study-template-content',
  DRAWING_TEMPLATES: 'tradex-drawing-templates',
  CHART_TEMPLATES: 'tradex-chart-templates',
  CHART_TEMPLATE_CONTENT: 'tradex-chart-template-content',
  LINE_TOOLS: 'tradex-line-tools',
}

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function setStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export class TradexSaveLoadAdapter implements IExternalSaveLoadAdapter {
  async getAllCharts(): Promise<ChartMetaInfo[]> {
    try {
      const layouts = await chartLayoutApi.getAll()
      return layouts.map(l => ({
        id: l.id,
        name: l.name,
        symbol: l.symbol,
        resolution: (l.resolution || '60') as ResolutionString,
        timestamp: new Date(l.updatedAt || l.createdAt).getTime(),
      }))
    } catch (err) {
      console.warn('Failed to load chart layouts from server:', (err as Error).message)
      return []
    }
  }

  async removeChart(id: string | number): Promise<void> {
    try {
      await chartLayoutApi.delete(Number(id))
    } catch (err) {
      console.warn('Failed to delete chart layout:', (err as Error).message)
    }
  }

  async saveChart(chartData: ChartData): Promise<string | number> {
    try {
      const payload = {
        name: chartData.name,
        symbol: chartData.symbol,
        resolution: chartData.resolution,
        content: chartData.content,
      }

      if (chartData.id) {
        // 기존 차트 수정
        await chartLayoutApi.update(Number(chartData.id), payload)
        return chartData.id
      } else {
        // 새 차트 생성
        const result = await chartLayoutApi.create(payload)
        // result: Record<string, number> e.g. { "id": 123 }
        const newId = result.id ?? Object.values(result)[0]
        return newId
      }
    } catch (err) {
      console.warn('Failed to save chart layout:', (err as Error).message)
      // fallback: 임시 ID 반환 (저장 실패해도 크래시 방지)
      return Date.now()
    }
  }

  async getChartContent(chartId: number | string): Promise<string> {
    try {
      const result = await chartLayoutApi.getContent(Number(chartId))
      return result.content || ''
    } catch (err) {
      console.warn('Failed to load chart content:', (err as Error).message)
      return ''
    }
  }

  async getAllStudyTemplates(): Promise<StudyTemplateMetaInfo[]> {
    return getStorage<StudyTemplateMetaInfo[]>(STORAGE_KEYS.STUDY_TEMPLATES, [])
  }

  async removeStudyTemplate(studyTemplateInfo: StudyTemplateMetaInfo): Promise<void> {
    const templates = getStorage<StudyTemplateMetaInfo[]>(STORAGE_KEYS.STUDY_TEMPLATES, [])
    setStorage(
      STORAGE_KEYS.STUDY_TEMPLATES,
      templates.filter(t => t.name !== studyTemplateInfo.name)
    )

    const contents = getStorage<Record<string, string>>(STORAGE_KEYS.STUDY_TEMPLATE_CONTENT, {})
    delete contents[studyTemplateInfo.name]
    setStorage(STORAGE_KEYS.STUDY_TEMPLATE_CONTENT, contents)
  }

  async saveStudyTemplate(studyTemplateData: StudyTemplateData): Promise<void> {
    const templates = getStorage<StudyTemplateMetaInfo[]>(STORAGE_KEYS.STUDY_TEMPLATES, [])
    const contents = getStorage<Record<string, string>>(STORAGE_KEYS.STUDY_TEMPLATE_CONTENT, {})

    if (!templates.some(t => t.name === studyTemplateData.name)) {
      templates.push({ name: studyTemplateData.name })
    }

    contents[studyTemplateData.name] = studyTemplateData.content
    setStorage(STORAGE_KEYS.STUDY_TEMPLATES, templates)
    setStorage(STORAGE_KEYS.STUDY_TEMPLATE_CONTENT, contents)
  }

  async getStudyTemplateContent(studyTemplateInfo: StudyTemplateMetaInfo): Promise<string> {
    const contents = getStorage<Record<string, string>>(STORAGE_KEYS.STUDY_TEMPLATE_CONTENT, {})
    return contents[studyTemplateInfo.name] || ''
  }

  async getDrawingTemplates(toolName: string): Promise<string[]> {
    const all = getStorage<Record<string, string[]>>(STORAGE_KEYS.DRAWING_TEMPLATES, {})
    return all[toolName] || []
  }

  async loadDrawingTemplate(toolName: string, templateName: string): Promise<string> {
    const key = `${STORAGE_KEYS.DRAWING_TEMPLATES}:${toolName}:${templateName}`
    return getStorage<string>(key, '')
  }

  async removeDrawingTemplate(toolName: string, templateName: string): Promise<void> {
    const all = getStorage<Record<string, string[]>>(STORAGE_KEYS.DRAWING_TEMPLATES, {})
    if (all[toolName]) {
      all[toolName] = all[toolName].filter(n => n !== templateName)
      setStorage(STORAGE_KEYS.DRAWING_TEMPLATES, all)
    }

    const key = `${STORAGE_KEYS.DRAWING_TEMPLATES}:${toolName}:${templateName}`
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }

  async saveDrawingTemplate(toolName: string, templateName: string, content: string): Promise<void> {
    const all = getStorage<Record<string, string[]>>(STORAGE_KEYS.DRAWING_TEMPLATES, {})
    if (!all[toolName]) {
      all[toolName] = []
    }
    if (!all[toolName].includes(templateName)) {
      all[toolName].push(templateName)
    }
    setStorage(STORAGE_KEYS.DRAWING_TEMPLATES, all)

    const key = `${STORAGE_KEYS.DRAWING_TEMPLATES}:${toolName}:${templateName}`
    setStorage(key, content)
  }

  async getChartTemplateContent(templateName: string): Promise<ChartTemplate> {
    const contents = getStorage<Record<string, ChartTemplateContent>>(STORAGE_KEYS.CHART_TEMPLATE_CONTENT, {})
    return { content: contents[templateName] }
  }

  async getAllChartTemplates(): Promise<string[]> {
    return getStorage<string[]>(STORAGE_KEYS.CHART_TEMPLATES, [])
  }

  async saveChartTemplate(newName: string, theme: ChartTemplateContent): Promise<void> {
    const names = getStorage<string[]>(STORAGE_KEYS.CHART_TEMPLATES, [])
    if (!names.includes(newName)) {
      names.push(newName)
    }
    setStorage(STORAGE_KEYS.CHART_TEMPLATES, names)

    const contents = getStorage<Record<string, ChartTemplateContent>>(STORAGE_KEYS.CHART_TEMPLATE_CONTENT, {})
    contents[newName] = theme
    setStorage(STORAGE_KEYS.CHART_TEMPLATE_CONTENT, contents)
  }

  async removeChartTemplate(templateName: string): Promise<void> {
    const names = getStorage<string[]>(STORAGE_KEYS.CHART_TEMPLATES, [])
    setStorage(STORAGE_KEYS.CHART_TEMPLATES, names.filter(n => n !== templateName))

    const contents = getStorage<Record<string, ChartTemplateContent>>(STORAGE_KEYS.CHART_TEMPLATE_CONTENT, {})
    delete contents[templateName]
    setStorage(STORAGE_KEYS.CHART_TEMPLATE_CONTENT, contents)
  }

  async saveLineToolsAndGroups(
    layoutId: string | undefined,
    chartId: string | number,
    state: LineToolsAndGroupsState
  ): Promise<void> {
    const key = `${STORAGE_KEYS.LINE_TOOLS}:${layoutId || 'default'}:${chartId}`
    // LineToolsAndGroupsState contains Maps which don't serialize directly
    const serializable = {
      sources: state.sources ? Array.from(state.sources.entries()) : null,
      groups: Array.from(state.groups.entries()),
      symbol: state.symbol,
    }
    setStorage(key, serializable)
  }

  async loadLineToolsAndGroups(
    layoutId: string | undefined,
    chartId: string | number,
    _requestType: LineToolsAndGroupsLoadRequestType,
    _requestContext: LineToolsAndGroupsLoadRequestContext
  ): Promise<Partial<LineToolsAndGroupsState> | null> {
    const key = `${STORAGE_KEYS.LINE_TOOLS}:${layoutId || 'default'}:${chartId}`
    const data = getStorage<{
      sources: [string, unknown][] | null
      groups: [string, unknown][]
      symbol?: string
    } | null>(key, null)

    if (!data) return null

    return {
      sources: data.sources ? new Map(data.sources as never) : null,
      groups: new Map(data.groups as never),
      symbol: data.symbol,
    }
  }
}
