'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { PortfolioTabNav } from '@/components/portfolio'

// 시간 필터 옵션
const timeFilters = ['이전 7일', '30일', '60일', '90일', '180일', '사용자 지정']

// 요약 카드 데이터
const summaryCards = [
  { label: '총 손익', value: '+$5,234.00', valueColor: 'text-label-positive', icon: '/icons/icon-dollar.svg' },
  { label: '거래 규모', value: '$53,550.00', valueColor: 'text-label-normal', icon: '/icons/icon-bar-chart.svg' },
  { label: '승률', value: '80%', valueColor: 'text-label-positive', icon: '/icons/icon-target.svg' },
  { label: '승/패 횟수', value: '+4/-1회', valueColor: 'text-label-normal', icon: '/icons/icon-trophy.svg' },
]

// 손익 랭킹
const topPairs = [
  { rank: 1, pair: 'BTC/USDT', pnl: '+$12,450.75', isPositive: true, width: 100 },
  { rank: 2, pair: 'ETH/USDT', pnl: '+$8,450.20', isPositive: true, width: 68 },
  { rank: 3, pair: 'SOL/USDT', pnl: '+$3,450', isPositive: true, width: 28 },
  { rank: 4, pair: 'BNB/USDT', pnl: '+$1,890', isPositive: true, width: 15 },
  { rank: 5, pair: 'ADA/USDT', pnl: '-$2,340', isPositive: false, width: 19 },
]

// 거래 내역
const tradeHistory = [
  { pair: 'BTC/USDT', qty: '0.5', entry: '$94,200', exit: '$96,800', position: 'Long', pnl: '+$1,300', result: 'Win', volume: '$47,100', fee: '$47.10' },
  { pair: 'ETH/USDT', qty: '12.5', entry: '$3,350', exit: '$3,280', position: 'Short', pnl: '+$875', result: 'Win', volume: '$41,875', fee: '$41.88' },
  { pair: 'SOL/USDT', qty: '150', entry: '$185', exit: '$178', position: 'Long', pnl: '-$560', result: 'Lose', volume: '$27,750', fee: '$27.75' },
  { pair: 'BTC/USDT', qty: '0.3', entry: '$92,500', exit: '$94,800', position: 'Long', pnl: '+$690', result: 'Win', volume: '$27,750', fee: '$27.75' },
]

// 하단 요약 카드
const detailCards = [
  { label: '총 종료 주문 수', value: '5회', valueColor: 'text-label-normal', icon: '/icons/icon-check-file.svg' },
  { label: '종료 주문 승률', value: '80%', valueColor: 'text-label-positive', icon: '/icons/icon-target.svg' },
  { label: '롱 포지션 손익', value: '+1,250(24.5%)', valueColor: 'text-label-positive', icon: '/icons/icon-signal.svg' },
  { label: '숏 포지션 손익', value: '-420(8.2%)', valueColor: 'text-label-danger', icon: '/icons/icon-signal.svg' },
]

export default function PnLPage() {
  const [activeFilter, setActiveFilter] = useState('이전 7일')

  return (
    <div className="flex flex-col gap-4">
      {/* Title Section */}
      <div className="space-y-2">
        <h1 className="text-title-1-bold text-label-normal">수익 관리</h1>
        <p className="text-body-1-regular text-label-neutral">
          계좌의 모든 거래 성과를 한눈에 파악하고 수익을 극대화하세요.
        </p>
      </div>

      {/* Tab Switcher */}
      <PortfolioTabNav />

      {/* Main Chart Section - Full Width */}
      <div className="bg-white rounded-xl border border-line-normal shadow-normal overflow-hidden">
        {/* Time Filters */}
        <div className="flex gap-2.5 p-5 border-b border-line-normal">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-3 py-2 rounded-lg text-body-1-medium transition-colors",
                activeFilter === filter
                  ? "bg-gray-800 text-white"
                  : "bg-white border border-line-normal text-label-normal hover:bg-gray-50"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Summary Cards Row */}
        <div className="grid grid-cols-4 gap-3 p-5 border-b border-line-normal">
          {summaryCards.map((card) => (
            <div key={card.label} className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
              <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-lg flex-shrink-0">
                <Image src={card.icon} alt={card.label} width={24} height={24} />
              </div>
              <div className="space-y-0.5">
                <p className="text-body-2-medium text-label-neutral">{card.label}</p>
                <p className={cn("text-body-1-bold", card.valueColor)}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="p-5">
          <div className="h-52 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-body-2-regular text-label-assistive">손익 차트</p>
          </div>
        </div>
      </div>

      {/* 손익 랭킹 - Separate Card */}
      <div className="bg-white rounded-xl border border-line-normal shadow-normal overflow-hidden p-5 space-y-5">
        <h3 className="text-body-1-bold text-label-normal">손익 랭킹</h3>
        <div className="space-y-4">
          {topPairs.map((pair) => (
            <div key={pair.rank} className="flex items-center gap-3">
              <span className="flex items-center justify-center min-w-[26px] h-5 px-1.5 rounded-full bg-gray-800 text-body-2-medium text-white">
                {pair.rank}
              </span>
              <span className="text-body-2-bold text-label-normal w-[80px]">{pair.pair}</span>
              <div className="flex-1 h-2">
                <div
                  className={cn(
                    "h-full rounded-full",
                    pair.isPositive ? "bg-element-positive-default" : "bg-element-danger-default"
                  )}
                  style={{ width: `${pair.width}%` }}
                />
              </div>
              <span className={cn(
                "text-body-2-bold w-[100px] text-right",
                pair.isPositive ? "text-label-positive" : "text-label-danger"
              )}>
                {pair.pnl}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white rounded-xl border border-line-normal shadow-normal overflow-hidden">
        {/* Section Header */}
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-body-1-bold text-label-normal">체결 완료 주문 / 종료된 포지션</h3>
        </div>

        {/* Detail Summary Cards */}
        <div className="grid grid-cols-4 gap-3 px-5 pb-5 border-b border-line-normal">
          {detailCards.map((card) => (
            <div key={card.label} className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-3">
              <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-lg flex-shrink-0">
                <Image src={card.icon} alt={card.label} width={24} height={24} />
              </div>
              <div className="space-y-0.5">
                <p className="text-body-2-medium text-label-neutral">{card.label}</p>
                <p className={cn("text-body-1-bold", card.valueColor)}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trade History Table */}
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-9 gap-4 px-4 py-1 bg-gray-100 text-body-2-regular text-label-neutral min-w-[800px]">
            <span>거래 페어</span>
            <span className="text-right">수량</span>
            <span className="text-right">진입가</span>
            <span className="text-right">종료가</span>
            <span>포지션</span>
            <span className="text-right">손익</span>
            <span>결과</span>
            <span className="text-right">거래 규모</span>
            <span className="text-right">수수료</span>
          </div>

          {/* Table Body */}
          {tradeHistory.map((trade, i) => (
            <div
              key={i}
              className="grid grid-cols-9 gap-4 px-4 py-3 border-b border-gray-200 last:border-b-0 text-body-2-regular min-w-[800px]"
            >
              <span className="text-body-2-bold text-label-normal">{trade.pair}</span>
              <span className="text-right text-label-normal">{trade.qty}</span>
              <span className="text-right text-label-normal">{trade.entry}</span>
              <span className="text-right text-label-normal">{trade.exit}</span>
              <span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-caption-medium",
                  trade.position === 'Long'
                    ? "bg-element-positive-lighter text-element-positive-default"
                    : "bg-element-danger-lighter text-element-danger-default"
                )}>
                  {trade.position}
                </span>
              </span>
              <span className={cn(
                "text-right",
                trade.pnl.startsWith('+') ? "text-label-positive" : "text-label-danger"
              )}>
                {trade.pnl}
              </span>
              <span className={cn(
                trade.result === 'Win' ? "text-label-positive" : "text-label-danger"
              )}>
                {trade.result}
              </span>
              <span className="text-right text-label-normal">{trade.volume}</span>
              <span className="text-right text-label-normal">{trade.fee}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
