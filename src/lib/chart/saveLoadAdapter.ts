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
} from '@/charting_library'

const STORAGE_KEYS = {
  CHARTS: 'tradex-charts',
  CHART_CONTENT: 'tradex-chart-content',
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

let nextChartId = Date.now()

export class TradexSaveLoadAdapter implements IExternalSaveLoadAdapter {
  async getAllCharts(): Promise<ChartMetaInfo[]> {
    return getStorage<ChartMetaInfo[]>(STORAGE_KEYS.CHARTS, [])
  }

  async removeChart(id: string | number): Promise<void> {
    const charts = getStorage<ChartMetaInfo[]>(STORAGE_KEYS.CHARTS, [])
    setStorage(STORAGE_KEYS.CHARTS, charts.filter(c => c.id !== id))

    const contents = getStorage<Record<string, string>>(STORAGE_KEYS.CHART_CONTENT, {})
    delete contents[String(id)]
    setStorage(STORAGE_KEYS.CHART_CONTENT, contents)
  }

  async saveChart(chartData: ChartData): Promise<string | number> {
    const charts = getStorage<ChartMetaInfo[]>(STORAGE_KEYS.CHARTS, [])
    const contents = getStorage<Record<string, string>>(STORAGE_KEYS.CHART_CONTENT, {})

    const id = chartData.id ?? nextChartId++
    const existing = charts.findIndex(c => c.id === id)

    const meta: ChartMetaInfo = {
      id,
      name: chartData.name,
      symbol: chartData.symbol,
      resolution: chartData.resolution,
      timestamp: Date.now(),
    }

    if (existing >= 0) {
      charts[existing] = meta
    } else {
      charts.push(meta)
    }

    contents[String(id)] = chartData.content
    setStorage(STORAGE_KEYS.CHARTS, charts)
    setStorage(STORAGE_KEYS.CHART_CONTENT, contents)

    return id
  }

  async getChartContent(chartId: number | string): Promise<string> {
    const contents = getStorage<Record<string, string>>(STORAGE_KEYS.CHART_CONTENT, {})
    return contents[String(chartId)] || ''
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
