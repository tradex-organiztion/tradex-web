'use client'

import { useEffect, useRef, useState } from 'react'
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

// TradingView 스크립트 로드 대기
function waitForTradingView(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const win = window as unknown as { TradingView?: { widget?: unknown } }
    if (win.TradingView?.widget) {
      resolve()
      return
    }
    const start = Date.now()
    const interval = setInterval(() => {
      if (win.TradingView?.widget) {
        clearInterval(interval)
        resolve()
      } else if (Date.now() - start > timeout) {
        clearInterval(interval)
        reject(new Error('TradingView library failed to load'))
      }
    }, 100)
  })
}

export function TVChartContainer({ symbol, className }: TVChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<IChartingLibraryWidget | null>(null)
  const { setWidgetInstance, setIsReady, selectedSymbol } = useChartStore()
  const [loadError, setLoadError] = useState<string | null>(null)

  const activeSymbol = symbol || selectedSymbol

  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false

    const initWidget = async () => {
      try {
        await waitForTradingView()
      } catch {
        if (!cancelled) setLoadError('TradingView 차트 라이브러리를 로드할 수 없습니다.')
        return
      }

      if (cancelled || !containerRef.current) return

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
        disabled_features: [],
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
        if (!cancelled) {
          widgetRef.current = tvWidget
          setWidgetInstance(tvWidget)
          setIsReady(true)

          // Add theme toggle button to the top toolbar
          const themeBtn = tvWidget.createButton()
          let isDark = false
          themeBtn.textContent = '🌙'
          themeBtn.title = '다크 모드'
          themeBtn.style.cssText = 'font-size: 18px; cursor: pointer; padding: 0 6px;'
          themeBtn.addEventListener('click', () => {
            isDark = !isDark
            tvWidget.changeTheme(isDark ? 'dark' : 'light').then(() => {
              // Re-apply custom candle colors after theme change
              tvWidget.applyOverrides({
                'mainSeriesProperties.candleStyle.upColor': '#13C34E',
                'mainSeriesProperties.candleStyle.downColor': '#FF0015',
                'mainSeriesProperties.candleStyle.borderUpColor': '#13C34E',
                'mainSeriesProperties.candleStyle.borderDownColor': '#FF0015',
                'mainSeriesProperties.candleStyle.wickUpColor': '#13C34E',
                'mainSeriesProperties.candleStyle.wickDownColor': '#FF0015',
              })
            })
            themeBtn.textContent = isDark ? '☀️' : '🌙'
            themeBtn.title = isDark ? '라이트 모드' : '다크 모드'
          })
        }
      })
    }

    initWidget()

    return () => {
      cancelled = true
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

  if (loadError) {
    return (
      <div className={className} style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-body-1-regular text-label-assistive">{loadError}</p>
      </div>
    )
  }

  return (
    <div className={className} style={{ height: '100%', width: '100%' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}
