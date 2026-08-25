import { AuthGuard } from "@/components/layout/auth-guard";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Farmers are redirected to their own dashboard rather than shown a 403 they
  // can't act on. The backend enforces this too — never rely on the layout alone.
  return (
    <AuthGuard requireAgronomist>
      <div className="flex min-h-screen bg-page">
        <Sidebar />
        <div className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</div>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
