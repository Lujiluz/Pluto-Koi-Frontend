import Header from "../components/layout/public/Header";
import { AuthProvider } from "@/hooks/useAuth";
import QueryProvider from "@/providers/QueryProvider";
import PageTransition from "../components/common/PageTransition";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <Header />
        <PageTransition>
          <main className="min-h-screen">{children}</main>
        </PageTransition>
      </AuthProvider>
    </QueryProvider>
  );
}
