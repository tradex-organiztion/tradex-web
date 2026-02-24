'use client'

import dynamic from 'next/dynamic'
import Script from 'next/script'
import { useChartStore } from '@/stores/useChartStore'
import { TriggerPanel } from '@/components/chart'

// TradingView requires window object - must be loaded client-side only
const TVChartContainer = dynamic(
  () => import('@/components/chart/TVChartContainer').then(mod => ({ default: mod.TVChartContainer })),
  { ssr: false }
)

export default function ChartPage() {
  const { selectedSymbol } = useChartStore()

  return (
    <div className="flex flex-col h-[calc(100vh-48px)]" style={{ margin: 0 }}>
      <Script src="/charting_library/charting_library.standalone.js" strategy="afterInteractive" />

      <div className="flex-1 relative">
        <TVChartContainer
          symbol={selectedSymbol}
          className="absolute inset-0"
        />
      </div>
      <TriggerPanel />
    </div>
  )
}
