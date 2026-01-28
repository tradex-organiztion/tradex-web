'use client'

import { useState } from 'react'
import { AlertTriangle, TrendingDown, TrendingUp, Info, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// 리스크 패턴 타입
type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

interface RiskPattern {
  id: string
  name: string
  description: string
  level: RiskLevel
  score: number
  trend: 'up' | 'down' | 'stable'
  details: {
    label: string
    value: string
    status: 'good' | 'warning' | 'danger'
  }[]
}

// 샘플 데이터
const riskPatterns: RiskPattern[] = [
  {
    id: '1',
    name: '진입 리스크',
    description: '포지션 진입 시 발생할 수 있는 리스크 수준',
    level: 'medium',
    score: 45,
    trend: 'down',
    details: [
      { label: '평균 진입 타이밍', value: '적절', status: 'good' },
      { label: '손절 설정 비율', value: '78%', status: 'warning' },
      { label: '과매매 경향', value: '낮음', status: 'good' },
    ]
  },
  {
    id: '2',
    name: '청산 리스크',
    description: '포지션 청산 시 발생할 수 있는 리스크 수준',
    level: 'high',
    score: 72,
    trend: 'up',
    details: [
      { label: '조기 청산 비율', value: '34%', status: 'danger' },
      { label: '익절 달성률', value: '45%', status: 'warning' },
      { label: '손절 준수율', value: '62%', status: 'warning' },
    ]
  },
  {
    id: '3',
    name: '자금 관리 리스크',
    description: '자본 대비 포지션 크기 및 레버리지 관련 리스크',
    level: 'low',
    score: 28,
    trend: 'stable',
    details: [
      { label: '평균 레버리지', value: '12x', status: 'good' },
      { label: '최대 손실 비율', value: '2.5%', status: 'good' },
      { label: '자본 활용률', value: '적정', status: 'good' },
    ]
  },
  {
    id: '4',
    name: '심리적 리스크',
    description: '감정적 매매 및 FOMO/FUD 관련 리스크',
    level: 'critical',
    score: 85,
    trend: 'up',
    details: [
      { label: 'FOMO 매매 빈도', value: '높음', status: 'danger' },
      { label: '복수 매매 경향', value: '중간', status: 'warning' },
      { label: '계획 외 매매', value: '38%', status: 'danger' },
    ]
  },
]

const riskLevelConfig: Record<RiskLevel, { label: string; color: string; bgColor: string }> = {
  low: { label: '낮음', color: 'text-element-positive-default', bgColor: 'bg-element-positive-lighter' },
  medium: { label: '보통', color: 'text-element-warning-default', bgColor: 'bg-element-warning-lighter' },
  high: { label: '높음', color: 'text-orange-500', bgColor: 'bg-orange-100' },
  critical: { label: '위험', color: 'text-element-danger-default', bgColor: 'bg-element-danger-lighter' },
}

// 리스크 게이지 컴포넌트
function RiskGauge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeConfig = {
    sm: { width: 60, height: 60, stroke: 6 },
    md: { width: 100, height: 100, stroke: 8 },
    lg: { width: 140, height: 140, stroke: 10 },
  }

  const { width, height, stroke } = sizeConfig[size]
  const radius = (width - stroke) / 2
  const circumference = radius * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (score: number) => {
    if (score < 30) return '#13C34E'
    if (score < 50) return '#FEC700'
    if (score < 70) return '#FF8C00'
    return '#FF0015'
  }

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} className="transform -rotate-90">
        {/* Background arc */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke="#F1F1F1"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={0}
          strokeLinecap="round"
          className="origin-center"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
        {/* Progress arc */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="origin-center transition-all duration-500"
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "font-bold",
          size === 'sm' && "text-body-2-bold",
          size === 'md' && "text-title-2-bold",
          size === 'lg' && "text-title-1-bold"
        )}>
          {score}
        </span>
      </div>
    </div>
  )
}

// 리스크 카드 컴포넌트
function RiskCard({ pattern, onClick }: { pattern: RiskPattern; onClick: () => void }) {
  const config = riskLevelConfig[pattern.level]

  return (
    <div
      className="bg-white rounded-xl border border-line-normal p-5 hover:shadow-normal transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-body-1-bold text-label-normal">{pattern.name}</h3>
            <Badge variant={pattern.level === 'critical' ? 'danger' : pattern.level === 'high' ? 'warning' : 'secondary'} size="sm">
              {config.label}
            </Badge>
          </div>
          <p className="text-body-2-regular text-label-assistive">{pattern.description}</p>
        </div>
        <RiskGauge score={pattern.score} size="sm" />
      </div>

      <div className="space-y-2">
        {pattern.details.map((detail, index) => (
          <div key={index} className="flex items-center justify-between text-body-2-regular">
            <span className="text-label-assistive">{detail.label}</span>
            <span className={cn(
              detail.status === 'good' && "text-label-positive",
              detail.status === 'warning' && "text-label-warning",
              detail.status === 'danger' && "text-label-danger"
            )}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-line-normal">
        <div className="flex items-center gap-1.5 text-body-2-regular">
          {pattern.trend === 'up' ? (
            <>
              <TrendingUp className="w-4 h-4 text-label-danger" />
              <span className="text-label-danger">상승 추세</span>
            </>
          ) : pattern.trend === 'down' ? (
            <>
              <TrendingDown className="w-4 h-4 text-label-positive" />
              <span className="text-label-positive">하락 추세</span>
            </>
          ) : (
            <>
              <span className="w-4 h-0.5 bg-label-assistive rounded" />
              <span className="text-label-assistive">유지</span>
            </>
          )}
        </div>
        <button className="flex items-center gap-1 text-body-2-medium text-label-neutral hover:text-label-normal transition-colors">
          상세 분석 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function RiskAnalysisPage() {
  const [selectedPattern, setSelectedPattern] = useState<RiskPattern | null>(null)

  // 전체 리스크 점수 계산
  const overallScore = Math.round(riskPatterns.reduce((sum, p) => sum + p.score, 0) / riskPatterns.length)

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-title-1-bold text-gray-800">리스크 분석</h1>
          <p className="text-body-2-regular text-gray-600 mt-1">
            나의 트레이딩 리스크 패턴을 분석하고 개선점을 찾아보세요.
          </p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Sparkles className="w-4 h-4" />
          AI 리스크 진단
        </Button>
      </div>

      {/* Overall Risk Summary */}
      <div className="bg-white rounded-xl border border-line-normal p-6">
        <div className="flex items-center gap-8">
          <RiskGauge score={overallScore} size="lg" />
          <div className="flex-1">
            <h2 className="text-title-2-bold text-label-normal mb-2">종합 리스크 점수</h2>
            <p className="text-body-1-regular text-label-neutral mb-4">
              현재 트레이딩 리스크 수준은 <span className="font-semibold text-label-warning">보통</span>입니다.
              심리적 리스크 관리에 특히 주의가 필요합니다.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-element-positive-default" />
                <span className="text-body-2-regular text-label-assistive">낮음 (0-30)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-element-warning-default" />
                <span className="text-body-2-regular text-label-assistive">보통 (31-50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-body-2-regular text-label-assistive">높음 (51-70)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-element-danger-default" />
                <span className="text-body-2-regular text-label-assistive">위험 (71+)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Pattern Grid */}
      <div className="grid grid-cols-2 gap-4">
        {riskPatterns.map((pattern) => (
          <RiskCard
            key={pattern.id}
            pattern={pattern}
            onClick={() => setSelectedPattern(pattern)}
          />
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-element-primary-default flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-body-1-bold text-label-normal mb-2">Tradex AI 인사이트</h3>
            <div className="space-y-2 text-body-2-regular text-label-neutral">
              <p>• <span className="text-label-danger font-medium">심리적 리스크</span>가 가장 높습니다. FOMO 매매를 줄이기 위해 진입 전 체크리스트를 활용해보세요.</p>
              <p>• <span className="text-label-warning font-medium">청산 리스크</span>를 낮추려면 익절 목표가에 도달 시 부분 청산 전략을 고려해보세요.</p>
              <p>• 자금 관리는 양호합니다. 현재 레버리지 수준을 유지하세요.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal would go here */}
      {selectedPattern && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedPattern(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-title-2-bold text-label-normal">{selectedPattern.name} 상세 분석</h2>
                <p className="text-body-2-regular text-label-assistive mt-1">{selectedPattern.description}</p>
              </div>
              <RiskGauge score={selectedPattern.score} size="md" />
            </div>

            <div className="space-y-4 mb-6">
              {selectedPattern.details.map((detail, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-body-2-medium text-label-normal">{detail.label}</span>
                  <Badge variant={
                    detail.status === 'good' ? 'positive' :
                    detail.status === 'warning' ? 'warning' : 'danger'
                  }>
                    {detail.value}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setSelectedPattern(null)}>
                닫기
              </Button>
              <Button className="flex-1 gap-2">
                <Sparkles className="w-4 h-4" />
                AI 개선 제안 받기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
