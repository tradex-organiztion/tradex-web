'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { useChartStore } from '@/stores/useChartStore'
import { useUIStore } from '@/stores'
import { TriggerPanel } from '@/components/chart'
import { captureChartContext } from '@/lib/chart/chartContext'
import { aiApi } from '@/lib/api/ai'
import type { AIAnalysisResponse } from '@/lib/api/ai'
import { cn } from '@/lib/utils'

// TradingView requires window object - must be loaded client-side only
const TVChartContainer = dynamic(
  () => import('@/components/chart/TVChartContainer').then(mod => ({ default: mod.TVChartContainer })),
  { ssr: false }
)

export default function ChartPage() {
  const { selectedSymbol, widgetInstance } = useChartStore()
  const { setAIPanelOpen } = useUIStore()
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleAnalyzeChart = async () => {
    if (!widgetInstance || isAnalyzing) return
    setIsAnalyzing(true)
    setShowAnalysis(true)

    const context = await captureChartContext(widgetInstance).catch(() => null)
    if (!context) {
      setIsAnalyzing(false)
      return
    }

    const result = await aiApi.analyzeChart(context).catch(() => null)
    if (result) {
      setAnalysis(result)
    }
    setIsAnalyzing(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]" style={{ margin: 0 }}>
      <Script src="/charting_library/charting_library.standalone.js" strategy="beforeInteractive" />

      {/* Chart toolbar with AI actions */}
      <div className="flex items-center justify-end gap-2 px-3 py-1.5 border-b border-line-normal bg-white">
        <button
          onClick={handleAnalyzeChart}
          disabled={!widgetInstance || isAnalyzing}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-medium transition-colors",
            widgetInstance && !isAnalyzing
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-100 text-label-disabled cursor-not-allowed"
          )}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.33V3.33M8 12.67V14.67M3.33 8H1.33M14.67 8H12.67" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          {isAnalyzing ? '분석 중...' : 'AI 차트 분석'}
        </button>
        <button
          onClick={() => setAIPanelOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption-medium border border-line-normal text-label-normal hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M14 10.67a1.33 1.33 0 01-1.33 1.33H4.67L2 14V3.33A1.33 1.33 0 013.33 2h9.34A1.33 1.33 0 0114 3.33v7.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          AI 채팅
        </button>
      </div>

      <div className="flex-1 relative">
        <TVChartContainer
          symbol={selectedSymbol}
          className="absolute inset-0"
        />

        {/* AI Analysis Overlay */}
        {showAnalysis && (
          <div className="absolute top-3 right-3 w-[320px] bg-white rounded-xl border border-line-normal shadow-emphasize z-10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line-normal">
              <span className="text-body-2-bold text-label-normal">AI 차트 분석</span>
              <button
                onClick={() => setShowAnalysis(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-4 h-4 text-label-assistive" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {isAnalyzing ? (
                <div className="flex items-center gap-2 py-4 justify-center">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-body-2-regular text-label-assistive">차트를 분석하고 있습니다...</span>
                </div>
              ) : analysis ? (
                <>
                  <p className="text-body-2-regular text-label-normal">{analysis.summary}</p>

                  <div className="space-y-2">
                    <span className="text-caption-bold text-label-neutral">시그널</span>
                    {analysis.signals.map((signal, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={cn(
                          "mt-0.5 w-2 h-2 rounded-full shrink-0",
                          signal.type === 'bullish' ? 'bg-green-400' :
                          signal.type === 'bearish' ? 'bg-red-400' : 'bg-gray-400'
                        )} />
                        <div className="flex-1">
                          <p className="text-caption-regular text-label-normal">{signal.description}</p>
                          <p className="text-caption-regular text-label-assistive">
                            신뢰도 {Math.round(signal.confidence * 100)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-line-normal">
                    <span className="text-caption-bold text-label-neutral">추천</span>
                    <p className="text-body-2-regular text-label-normal mt-1">{analysis.recommendation}</p>
                  </div>
                </>
              ) : (
                <p className="text-body-2-regular text-label-assistive text-center py-4">
                  분석 결과가 없습니다.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <TriggerPanel />
    </div>
  )
}
