import { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <PublicHeader />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}