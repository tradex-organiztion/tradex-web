'use client'

import { useState } from 'react'
import { Calendar, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// 리스크 카테고리 타입
type RiskCategory = 'entry' | 'exit' | 'position' | 'timing' | 'emotion'

// 탭 데이터
const RISK_TABS: { id: RiskCategory; label: string }[] = [
  { id: 'entry', label: '진입 리스크' },
  { id: 'exit', label: '청산 리스크' },
  { id: 'position', label: '포지션 관리 리스크' },
  { id: 'timing', label: '시간·상황 리스크' },
  { id: 'emotion', label: '감정 기반 리스크' },
]

// 각 탭별 데이터
const RISK_DATA: Record<RiskCategory, {
  title: string
  description: string
  aiInsight: string
  stats: { label: string; value: string; subtext: string }[]
  best: { label: string; value: string }
  worst: { label: string; value: string }
}> = {
  entry: {
    title: '진입 리스크',
    description: '어떤 상황에서 잘못 들어가고 있는가?',
    aiInsight: "지난 30일동안 매매의 38%가 '계획 외 진입'이며, 이 구간은 평균 승률이 24%입니다.",
    stats: [
      { label: '계획 외 진입', value: '38%', subtext: '48건/127건' },
      { label: '손절 후 재진입', value: '14회', subtext: '최근 20거래 중' },
      { label: '연속 진입(뇌동매매)', value: '17회', subtext: '3건 이상 연속' },
    ],
    best: { label: '사전 분석 진입 승률', value: '62%' },
    worst: { label: '계획 외 진입 승률', value: '24%' },
  },
  exit: {
    title: '청산 리스크',
    description: '왜 수익을 극대화하지 못하고 손실을 키우는가?',
    aiInsight: '지난 20번의 거래 중 14번에서 목표가 도달 전 조기 익절이 발생했습니다.',
    stats: [
      { label: '손절가 미준수', value: '67%', subtext: '85건/127건' },
      { label: '조기 익절', value: '58%', subtext: '목표가 전 청산' },
      { label: '평균 손절 지연', value: '+0.8%', subtext: '손실 36% 증가' },
    ],
    best: { label: '계획대로 청산 시 평균수익', value: '+5.2%' },
    worst: { label: '조기 청산 시 평균 수익', value: '+1.4%' },
  },
  position: {
    title: '포지션 관리 리스크',
    description: '내 포지션 운용 방식 자체가 리스크를 만들고 있는가?',
    aiInsight: '레버리지 x15 이상 포지션이 전체 손실의 61%를 차지합니다. 평균 손익비가 0.72로, 장기적으로 손실 구조입니다.',
    stats: [
      { label: '평균 손익비(R/R)', value: '0.72', subtext: '위험 구조' },
      { label: '물타기 빈도', value: '23회', subtext: '전체의 18%' },
    ],
    best: { label: 'x10 이하 레버리지 승률', value: '68%' },
    worst: { label: 'x20 이상 레버리지 승률', value: '31%' },
  },
  timing: {
    title: '시간·상황 리스크',
    description: '특정 시간대나 시장 상태에서 유독 약한가?',
    aiInsight: '횡보장에서 손실의 72%를 기록하고 있습니다. 오전 진입의 평균 승률이 22%로 매우 낮습니다.',
    stats: [
      { label: '오전 진입 승률', value: '22%', subtext: '09:00-11:00' },
      { label: '밤 진입 승률', value: '68%', subtext: '22:00-01:0' },
      { label: '횡보장 손실', value: '72%', subtext: '전체 손실 중' },
      { label: '고변동 구간 실수', value: '41회', subtext: 'ATR 상위 25%' },
    ],
    best: { label: '추세장 승률', value: '71%' },
    worst: { label: '횡보장 승률', value: '28%' },
  },
  emotion: {
    title: '감정 기반 리스크',
    description: '감정이 개입된 매매가 실제 손실을 만드는가?',
    aiInsight: "익절 후 첫 거래 승률이 평소의 절반 이하로 감소합니다. 손절 후 바로 진입하는 패턴이 '감정 기반 매매'로 분류됩니다.",
    stats: [
      { label: '보복 매매(Revenge)', value: '9회', subtext: '손절 후 즉시 진입' },
      { label: '밤 진입 승률', value: '12회', subtext: '익절 직후 진입' },
      { label: '방향 뒤집기', value: '8회', subtext: '손절 후 역포지션' },
      { label: 'FOMO 비율', value: '+127%', subtext: '최근 2주' },
    ],
    best: { label: '차분한 상태 진입 승률', value: '64%' },
    worst: { label: '감정적 진입 승률', value: '29%' },
  },
}

// 핵심 개선 권장사항
const RECOMMENDATIONS = [
  '횡보장 진입을 피하고 명확한 추세 확인 후 진입하세요.',
  '오전 9-11시 진입을 자제하고 밤 시간대 매매에 집중하세요.',
  '레버리지를 10배 이하로 제한하세요.',
  '손절 후 최소 1시간 대기 후 재진입을 고려하세요.',
  '목표가를 설정하고 자동 청산 주문을 활용하세요.',
]

export default function RiskPatternPage() {
  const [startDate, setStartDate] = useState('2025-12-25')
  const [endDate, setEndDate] = useState('2026-01-25')
  const [activeTab, setActiveTab] = useState<RiskCategory>('entry')

  const currentData = RISK_DATA[activeTab]

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-title-1-bold text-label-normal">리스크 패턴</h1>
        <p className="text-body-2-regular text-label-assistive mt-1">
          반복되는 실수와 습관을 파악하여 손실을 최소화하세요.
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 border border-line-normal rounded-lg bg-white">
          <input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-24 text-body-2-regular text-label-normal bg-transparent focus:outline-none"
          />
          <Calendar className="w-4 h-4 text-label-assistive" />
        </div>
        <span className="text-label-assistive">~</span>
        <div className="flex items-center gap-2 px-4 py-2.5 border border-line-normal rounded-lg bg-white">
          <input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-24 text-body-2-regular text-label-normal bg-transparent focus:outline-none"
          />
          <Calendar className="w-4 h-4 text-label-assistive" />
        </div>
        <button className="px-5 py-2.5 bg-label-normal text-white text-body-2-medium rounded-lg hover:bg-gray-700 transition-colors">
          조회
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* 가장 치명적인 리스크 */}
        <div className="bg-white rounded-xl border border-line-normal p-5">
          <p className="text-caption-regular text-label-assistive mb-1">가장 치명적인 리스크</p>
          <p className="text-title-2-bold text-label-normal mb-4">패턴 분석</p>
          <p className="text-caption-regular text-label-assistive mb-1">손절 후 즉각 재진입(복수매매) 손실 기여도</p>
          <p className="text-title-2-bold text-label-positive">
            42% <span className="text-body-2-regular text-label-assistive font-normal">14회 발생</span>
          </p>
        </div>

        {/* 가장 자주 발생하는 */}
        <div className="bg-white rounded-xl border border-line-normal p-5">
          <p className="text-caption-regular text-label-assistive mb-1">가장 자주 발생하는</p>
          <p className="text-title-2-bold text-label-normal mb-4">습관</p>
          <p className="text-caption-regular text-label-assistive mb-1">계획 외 진입 발생 비율</p>
          <p className="text-title-2-bold text-label-positive">
            38% <span className="text-body-2-regular text-label-assistive font-normal">48건 발생</span>
          </p>
        </div>

        {/* 리스크 패턴으로 인한 손실 비중 */}
        <div className="bg-white rounded-xl border-2 border-line-danger p-5">
          <p className="text-caption-regular text-label-danger mb-1">리스크 패턴으로 인한</p>
          <p className="text-title-2-bold text-label-normal mb-4">손실 비중</p>
          <p className="text-caption-regular text-label-assistive mb-1">패턴별 누적 손실</p>
          <p className="text-title-2-bold text-label-danger">
            42%(-18,750원) <span className="text-body-2-regular text-label-assistive font-normal">전체 손실 중</span>
          </p>
        </div>
      </div>

      {/* Tradex DNA 분석 */}
      <div className="bg-white rounded-xl border border-line-normal p-6">
        <div className="mb-4">
          <h2 className="text-title-2-bold text-label-normal">Tradex DNA 분석</h2>
          <p className="text-body-2-regular text-label-assistive">AI 기반 종합 분석 리포트</p>
        </div>

        {/* AI Insight */}
        <div className="bg-green-50 rounded-lg px-4 py-3 mb-6">
          <div className="flex items-start gap-2">
            <span className="shrink-0 px-2 py-0.5 bg-green-500 text-white text-caption-medium rounded">AI 인사이트</span>
            <p className="text-body-2-regular text-label-normal">
              당신은 고변동 구간에서 지나치게 공격적입니다. 오전 매매를 줄이고 상승 추세를 공략하는 편이 승률이 <span className="font-bold">2배</span> 높습니다.
            </p>
          </div>
        </div>

        {/* 핵심 개선 권장사항 */}
        <div className="flex gap-8">
          <p className="text-body-2-medium text-label-normal shrink-0">핵심 개선 권장사항</p>
          <div className="space-y-2">
            {RECOMMENDATIONS.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-label-normal flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-body-2-regular text-label-neutral">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 상세 분석 */}
      <div>
        <h2 className="text-title-2-bold text-label-normal mb-4">상세 분석</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {RISK_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-body-2-medium transition-colors",
                activeTab === tab.id
                  ? "bg-label-normal text-white"
                  : "bg-white border border-line-normal text-label-neutral hover:bg-gray-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-line-normal p-6">
          <div className="mb-4">
            <h3 className="text-title-2-bold text-label-normal">{currentData.title}</h3>
            <p className="text-body-2-regular text-label-assistive">{currentData.description}</p>
          </div>

          {/* AI Insight */}
          <div className="bg-green-50 rounded-lg px-4 py-3 mb-6">
            <div className="flex items-start gap-2">
              <span className="shrink-0 px-2 py-0.5 bg-green-500 text-white text-caption-medium rounded">AI 인사이트</span>
              <p className="text-body-2-regular text-label-normal">{currentData.aiInsight}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={cn(
            "grid gap-4 mb-4",
            currentData.stats.length <= 3 ? "grid-cols-3" : "grid-cols-4"
          )}>
            {currentData.stats.map((stat, index) => (
              <div key={index} className="border border-line-normal rounded-lg p-4">
                <p className="text-caption-regular text-label-assistive mb-1">{stat.label}</p>
                <p className="text-title-2-bold text-label-normal">
                  {stat.value} <span className="text-body-2-regular text-label-assistive font-normal">{stat.subtext}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Best / Worst Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Best */}
            <div className="border-2 border-line-positive rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-caption-medium text-label-positive mb-1">Best</p>
                <p className="text-body-2-medium text-label-normal">{currentData.best.label}</p>
              </div>
              <p className="text-title-1-bold text-label-positive">{currentData.best.value}</p>
            </div>

            {/* Worst */}
            <div className="border-2 border-line-danger rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-caption-medium text-label-danger mb-1">Worst</p>
                <p className="text-body-2-medium text-label-normal">{currentData.worst.label}</p>
              </div>
              <p className="text-title-1-bold text-label-danger">{currentData.worst.value}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
