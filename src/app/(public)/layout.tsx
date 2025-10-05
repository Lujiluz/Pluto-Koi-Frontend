import Header from "../components/layout/public/Header";
import { AuthProvider } from "@/hooks/useAuth";
import QueryProvider from "@/providers/QueryProvider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <Header />
        <main className="min-h-screen">{children}</main>
      </AuthProvider>
    </QueryProvider>
  );
}
