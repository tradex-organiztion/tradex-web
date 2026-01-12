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
          'pt-16 transition-all duration-300',
          isSidebarCollapsed ? 'pl-16' : 'pl-60',
          isAIPanelOpen && 'pr-96'
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      <TradexAIPanel />
    </div>
  );
}
