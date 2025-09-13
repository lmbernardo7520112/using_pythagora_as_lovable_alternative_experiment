import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="flex pt-16">
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/80 backdrop-blur-sm border-r border-gray-200 z-40">
          <Sidebar />
        </div>
        <main className="flex-1 ml-64 overflow-y-auto">
          <div className="p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}