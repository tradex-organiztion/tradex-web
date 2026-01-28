'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, CandlestickData, Time, CandlestickSeries } from 'lightweight-charts'
import { cn } from '@/lib/utils'

interface CandleChartProps {
  data?: CandlestickData<Time>[]
  className?: string
  showVolume?: boolean
  onCrosshairMove?: (price: number | null, time: Time | null) => void
}

// 샘플 데이터 생성
const generateSampleData = (): CandlestickData<Time>[] => {
  const data: CandlestickData<Time>[] = []
  let basePrice = 97000
  const now = new Date()

  for (let i = 100; i >= 0; i--) {
    const date = new Date(now)
    date.setHours(date.getHours() - i)

    const open = basePrice + (Math.random() - 0.5) * 500
    const close = open + (Math.random() - 0.5) * 800
    const high = Math.max(open, close) + Math.random() * 300
    const low = Math.min(open, close) - Math.random() * 300

    data.push({
      time: Math.floor(date.getTime() / 1000) as Time,
      open,
      high,
      low,
      close,
    })

    basePrice = close
  }

  return data
}

export function CandleChart({
  data,
  className,
  onCrosshairMove
}: CandleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#323232',
      },
      grid: {
        vertLines: { color: '#F1F1F1' },
        horzLines: { color: '#F1F1F1' },
      },
      crosshair: {
        mode: 1, // Normal
        vertLine: {
          width: 1,
          color: '#D7D7D7',
          style: 2,
          labelBackgroundColor: '#323232',
        },
        horzLine: {
          width: 1,
          color: '#D7D7D7',
          style: 2,
          labelBackgroundColor: '#323232',
        },
      },
      rightPriceScale: {
        borderColor: '#D7D7D7',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#D7D7D7',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
      },
    })

    chartRef.current = chart

    // 캔들스틱 시리즈 추가 (v5 API)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#13C34E',
      downColor: '#FF0015',
      borderUpColor: '#13C34E',
      borderDownColor: '#FF0015',
      wickUpColor: '#13C34E',
      wickDownColor: '#FF0015',
    })

    // 데이터 설정
    const chartData = data || generateSampleData()
    candleSeries.setData(chartData)

    // 현재 가격 설정
    if (chartData.length > 0) {
      setCurrentPrice(chartData[chartData.length - 1].close)
    }

    // 크로스헤어 이동 이벤트
    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData.has(candleSeries)) {
        const data = param.seriesData.get(candleSeries) as CandlestickData<Time>
        setCurrentPrice(data.close)
        onCrosshairMove?.(data.close, param.time)
      } else {
        const lastData = chartData[chartData.length - 1]
        setCurrentPrice(lastData?.close || null)
        onCrosshairMove?.(null, null)
      }
    })

    // 차트 크기 조절
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // 차트를 최신 데이터로 스크롤
    chart.timeScale().fitContent()

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, onCrosshairMove])

  return (
    <div className={cn("relative", className)}>
      <div ref={chartContainerRef} className="w-full h-full" />
      {currentPrice && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-normal">
          <p className="text-caption-regular text-label-assistive">현재가</p>
          <p className="text-title-2-bold text-label-normal">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      )}
    </div>
  )
}
