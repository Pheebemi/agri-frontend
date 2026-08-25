import { AuthGuard } from "@/components/layout/auth-guard";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-page">
        <Sidebar />
        <div className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</div>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
