import { Metadata } from "next";
import TransactionPageClient from "../../components/pages/TransactionPageClient";

export const metadata: Metadata = {
  title: "Riwayat Transaksi | Pluto Koi",
  description: "Lacak dan lihat riwayat transaksi pembelian Anda di Pluto Koi",
};

export default function TransactionPage() {
  return <TransactionPageClient />;
}
