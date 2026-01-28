'use client'

import { Sidebar, Header, TradexAIPanel } from "@/components/layout";
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarCollapsed, isAIPanelOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />

      <main
        className={cn(
          'pt-10 transition-all duration-300',
          isSidebarCollapsed ? 'pl-16' : 'pl-[200px]',
          isAIPanelOpen && 'pr-[400px]'
        )}
      >
        <div className="px-9 py-8">
          {children}
        </div>
      </main>

      <TradexAIPanel />
    </div>
  );
}
