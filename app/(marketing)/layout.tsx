import { Footer } from "@/components/layout/footer";
import { MarketingNav } from "@/components/layout/marketing-nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page">
      <MarketingNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
