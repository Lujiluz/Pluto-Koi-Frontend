import Header from "../components/layout/public/Header";
import { AuthProvider } from "@/hooks/useAuth";
import QueryProvider from "@/providers/QueryProvider";
import PageTransition from "../components/common/PageTransition";
import { ToastProvider } from "@/components/common/Toast";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <Header />
          <PageTransition>
            <main className="min-h-screen">{children}</main>
          </PageTransition>
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
