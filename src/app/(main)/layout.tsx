'use client'

import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Sidebar, Header } from "@/components/layout";
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";

const TradexAIPanel = dynamic(
  () => import("@/components/layout/TradexAIPanel").then(mod => ({ default: mod.TradexAIPanel })),
  { ssr: false }
)

const SettingsModal = dynamic(
  () => import("@/components/settings/SettingsModal").then(mod => ({ default: mod.SettingsModal })),
  { ssr: false }
)

// 패딩 없이 풀스크린으로 렌더링할 페이지 경로
const fullscreenPaths = ['/chart']

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAIPanelOpen, isMobile, openSettings } = useUIStore();
  const isFullscreen = fullscreenPaths.some(p => pathname.startsWith(p));

  // ?settings=subscription 등 쿼리 파라미터로 설정 모달 자동 열기
  useEffect(() => {
    const settingsTab = searchParams.get('settings')
    if (settingsTab && ['account', 'general', 'notification', 'subscription'].includes(settingsTab)) {
      openSettings(settingsTab as 'account' | 'general' | 'notification' | 'subscription')
    }
  }, [searchParams, openSettings]);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Header />

      <main
        className={cn(
          'pt-16 transition-all duration-300 min-h-screen',
          isFullscreen ? 'bg-white' : 'bg-gray-50',
          isMobile ? 'pl-0' : 'pl-[200px]',
          isAIPanelOpen && !isMobile && 'pr-[400px]'
        )}
      >
        {isFullscreen ? (
          children
        ) : (
          <div className="px-4 py-6 md:px-6 lg:px-9 lg:py-8">
            {children}
          </div>
        )}
      </main>

      <TradexAIPanel />
      <SettingsModal />
    </div>
  );
}
