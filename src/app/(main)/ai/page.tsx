"use client";

import { useState, useRef, useEffect } from "react";

// 추천 프롬프트 데이터
const suggestedPrompts = [
  {
    icon: "📈",
    text: "현재 차트에서 4시간봉 기준으로 지지/저항선을 분석하고 차트에 그려줘",
  },
  {
    icon: "🔍",
    text: "최근 90일의 내 모든 거래에서 4시간 봉 기준으로 EMA 지표만 사용했을 경우, 예상되는 결과를 보여줘",
  },
  {
    icon: "📊",
    text: "최근 7일 간 내 매매 전략 별 승률을 분석하고, 문제점을 분석해서 내 매매 원칙을 설정해줘",
  },
  {
    icon: "🔔",
    text: "1시간 봉 기준으로 볼린저 밴드를 터치할 때 진입 트리거를 설정해줘",
  },
  {
    icon: "📉",
    text: "오늘 매매 시작 전 알아야 하는 이슈와 비트코인 시장 상황을 브리핑 해줘",
  },
];

// 액션 메뉴 아이템
const actionMenuItems = [
  { icon: "📷", label: "사진 및 파일 업로드" },
  { icon: "📊", label: "차트 분석 요청" },
  { icon: "📝", label: "매매일지 작성" },
  { icon: "🔔", label: "트리거 설정" },
];

export default function TradexAIPage() {
  const [inputValue, setInputValue] = useState("");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setIsActionMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    // TODO: AI 요청 처리
    console.log("Submit:", inputValue);
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>

        {/* Input Area */}
        <div className="w-full max-w-2xl">
          <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-gray-300 focus-within:shadow-md transition-all">
            {/* Plus Button */}
            <div className="relative" ref={actionMenuRef}>
              <button
                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {/* Action Menu Dropdown */}
              {isActionMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-10">
                  {actionMenuItems.map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setIsActionMenuOpen(false);
                        // TODO: Handle action
                      }}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Tradex AI에게 무엇이든 물어보세요!"
              className="flex-1 px-3 py-1 text-gray-700 placeholder-gray-400 focus:outline-none"
            />

            {/* Microphone Button */}
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          {/* Suggested Prompts */}
          <div className="mt-6 space-y-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt.text)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <span className="text-base mt-0.5">{prompt.icon}</span>
                <span className="leading-relaxed">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
