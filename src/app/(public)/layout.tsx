import Header from "../components/layout/public/Header";
import { AuthProvider } from "@/hooks/useAuth";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
    </AuthProvider>
  );
}
