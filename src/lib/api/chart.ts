/**
 * Chart API Module
 *
 * Currently uses localStorage as fallback.
 * When backend API endpoints are ready, replace with actual API calls:
 *   - GET /api/charts
 *   - POST /api/charts
 *   - GET /api/charts/:id
 *   - DELETE /api/charts/:id
 *   - GET/POST/DELETE /api/chart-templates/studies
 *   - GET/POST/DELETE /api/chart-templates/drawings
 */

export interface ChartRecord {
  id: string
  name: string
  symbol: string
  resolution: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface StudyTemplateRecord {
  name: string
  content: string
}

export const chartApi = {
  // Charts
  getCharts: async (): Promise<ChartRecord[]> => {
    // TODO: Replace with API call when backend is ready
    // return get<ChartRecord[]>('/api/charts')
    return []
  },

  saveChart: async (_data: Omit<ChartRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string }> => {
    // TODO: Replace with API call when backend is ready
    // return post<{ id: string }>('/api/charts', data)
    return { id: String(Date.now()) }
  },

  getChartContent: async (_id: string): Promise<{ content: string }> => {
    // TODO: Replace with API call when backend is ready
    // return get<{ content: string }>(`/api/charts/${id}`)
    return { content: '' }
  },

  deleteChart: async (_id: string): Promise<void> => {
    // TODO: Replace with API call when backend is ready
    // return del(`/api/charts/${id}`)
  },

  // Study Templates
  getStudyTemplates: async (): Promise<StudyTemplateRecord[]> => {
    return []
  },

  saveStudyTemplate: async (_data: StudyTemplateRecord): Promise<void> => {
    // TODO: Replace with API call
  },

  deleteStudyTemplate: async (_name: string): Promise<void> => {
    // TODO: Replace with API call
  },
}
