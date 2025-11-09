import TransactionPageClient from "@/app/components/pages/TransactionPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Transaksi | Pluto Koi",
  description: "Lacak dan lihat riwayat transaksi pembelian Anda di Pluto Koi",
};

export default function TransactionPage() {
  return <TransactionPageClient />;

}
