'use client'

import { useEffect, useRef } from 'react'
import type {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
} from '@/charting_library'
import { TradexDatafeed } from '@/lib/chart/datafeed'
import { TradexSaveLoadAdapter } from '@/lib/chart/saveLoadAdapter'
import { useChartStore } from '@/stores/useChartStore'

interface TVChartContainerProps {
  symbol?: string
  className?: string
}

export function TVChartContainer({ symbol, className }: TVChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<IChartingLibraryWidget | null>(null)
  const { setWidgetInstance, setIsReady, selectedSymbol } = useChartStore()

  const activeSymbol = symbol || selectedSymbol

  useEffect(() => {
    if (!containerRef.current) return

    const widgetOptions: ChartingLibraryWidgetOptions = {
      container: containerRef.current,
      library_path: '/charting_library/',
      datafeed: new TradexDatafeed(),
      symbol: activeSymbol,
      interval: '60' as ResolutionString,
      locale: 'ko',
      theme: 'light',
      autosize: true,
      enabled_features: [
        'study_templates',
        'save_chart_properties_to_local_storage',
      ],
      disabled_features: [
        'header_symbol_search',
        'header_compare',
      ],
      overrides: {
        'mainSeriesProperties.candleStyle.upColor': '#13C34E',
        'mainSeriesProperties.candleStyle.downColor': '#FF0015',
        'mainSeriesProperties.candleStyle.borderUpColor': '#13C34E',
        'mainSeriesProperties.candleStyle.borderDownColor': '#FF0015',
        'mainSeriesProperties.candleStyle.wickUpColor': '#13C34E',
        'mainSeriesProperties.candleStyle.wickDownColor': '#FF0015',
        'paneProperties.background': '#ffffff',
        'paneProperties.backgroundType': 'solid',
        'paneProperties.vertGridProperties.color': '#F1F1F1',
        'paneProperties.horzGridProperties.color': '#F1F1F1',
        'scalesProperties.textColor': '#323232',
        'scalesProperties.lineColor': '#D7D7D7',
      },
      loading_screen: {
        backgroundColor: '#ffffff',
        foregroundColor: '#323232',
      },
      save_load_adapter: new TradexSaveLoadAdapter(),
      auto_save_delay: 5,
    }

    const tvWidget = new (window as unknown as { TradingView: { widget: new (opts: ChartingLibraryWidgetOptions) => IChartingLibraryWidget } }).TradingView.widget(widgetOptions)

    tvWidget.onChartReady(() => {
      widgetRef.current = tvWidget
      setWidgetInstance(tvWidget)
      setIsReady(true)
    })

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove()
        widgetRef.current = null
        setWidgetInstance(null)
        setIsReady(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle symbol changes after initial load
  useEffect(() => {
    if (widgetRef.current && activeSymbol) {
      widgetRef.current.setSymbol(
        activeSymbol,
        widgetRef.current.symbolInterval().interval,
        () => {}
      )
    }
  }, [activeSymbol])

  return (
    <div className={className} style={{ height: '100%', width: '100%' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}
