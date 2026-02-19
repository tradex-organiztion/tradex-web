"use client";

import { cn } from "@/lib/utils";
import type { DailyPnlChartData } from "@/lib/api";

interface DataPoint {
  date: string;
  value: number;
}

interface WeeklyProfitChartProps {
  data?: DataPoint[];
  chartData?: DailyPnlChartData[];
  className?: string;
}

const defaultData: DataPoint[] = [
  { date: "12/30", value: 3200 },
  { date: "12/31", value: 4500 },
  { date: "1/1", value: 3890 },
  { date: "1/2", value: 5200 },
  { date: "1/3", value: 6800 },
  { date: "1/4", value: 7200 },
];

/**
 * WeeklyProfitChart - Figma 디자인 기준
 * - 너비: 669px (고정)
 * - 배경: white
 * - 테두리 반경: 10px
 * - 그림자: shadow-normal
 * - 패딩: px-24, py-20
 * - 타이틀: text-body-1-bold, color: label-normal
 * - 설명: text-body-2-regular, color: label-neutral
 * - 섹션 간격: 24px
 * - 차트 라벨: text-caption-regular, color: label-assistive
 * - 툴팁: white, border-line-normal, rounded-[6px], shadow-heavy
 */
export function WeeklyProfitChart({ data, chartData, className }: WeeklyProfitChartProps) {
  // chartData (API 형식)를 data 형식으로 변환
  const normalizedData: DataPoint[] = chartData && chartData.length > 0
    ? chartData.map((item) => ({
        date: new Date(item.date).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }).replace(". ", "/").replace(".", ""),
        value: item.cumulativePnl,
      }))
    : data || defaultData;

  const maxValue = Math.max(...normalizedData.map((d) => d.value));
  const minValue = Math.min(...normalizedData.map((d) => d.value));
  const range = maxValue - minValue || 1;

  // Chart dimensions
  const chartWidth = 572;
  const chartHeight = 200;
  const padding = { left: 40, right: 20, top: 20, bottom: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Generate path for the line chart
  const points = normalizedData.map((d, i) => {
    const x = padding.left + (i / (normalizedData.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - ((d.value - minValue) / range) * innerHeight;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Generate area path (for gradient fill)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`;

  // Y-axis labels
  const yLabels = ["9k", "7k", "5k", "3k", "1k"];

  // Tooltip data (highlighted point - middle point)
  const highlightedIndex = 2; // 1/1
  const highlightedPoint = points[highlightedIndex];

  return (
    <div className={cn("bg-white rounded-[10px] shadow-normal px-6 py-5", className)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-0.5">
          <p className="text-body-1-bold text-label-normal">주간 수익 곡선</p>
          <p className="text-body-2-regular text-label-neutral">
            최근 7일간의 누적 수익금 추이입니다.
          </p>
        </div>

        <div className="relative">
          <svg
            width="100%"
            height={chartHeight + 30}
            viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(91, 33, 182, 0.15)" />
                <stop offset="100%" stopColor="rgba(91, 33, 182, 0)" />
              </linearGradient>
            </defs>

            {/* Y-axis grid lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding.top + (i / 4) * innerHeight;
              return (
                <line
                  key={i}
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#CDD1D5"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Y-axis labels */}
            {yLabels.map((label, i) => (
              <text
                key={i}
                x={padding.left - 10}
                y={padding.top + (i / 4) * innerHeight + 4}
                textAnchor="end"
                className="text-[12px]"
                fill="#6D7882"
              >
                {label}
              </text>
            ))}

            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGradient)" />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#7C3AED"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Vertical line at highlighted point */}
            <line
              x1={highlightedPoint.x}
              y1={padding.top}
              x2={highlightedPoint.x}
              y2={padding.top + innerHeight}
              stroke="#CDD1D5"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Highlighted point */}
            <circle
              cx={highlightedPoint.x}
              cy={highlightedPoint.y}
              r="6"
              fill="#7C3AED"
              stroke="white"
              strokeWidth="2"
            />

            {/* X-axis labels */}
            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-[12px]"
                fill="#6D7882"
              >
                {p.date}
              </text>
            ))}
          </svg>

          {/* Tooltip */}
          <div
            className="absolute bg-white border border-line-normal rounded-[6px] shadow-heavy px-4 py-2"
            style={{
              left: `${(highlightedPoint.x / chartWidth) * 100 + 10}%`,
              top: `${((highlightedPoint.y - 20) / (chartHeight + 30)) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <p className="text-caption-medium text-label-assistive">2026. 01. 01</p>
            <p className="text-title-2-bold text-label-normal">$3,890.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
