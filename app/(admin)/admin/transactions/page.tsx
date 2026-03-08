"use client";

import getStatusBadge from "@/components/layout/Badge";
import { motion, Variants } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

// Dummy Data Transaksi
const transactionsData = [
  {
    id: "TRX-8901",
    date: "07 Mar 2026",
    user: "Pian & Nisa",
    package: "Premium (1 Thn)",
    amount: 1500000,
    method: "BCA Virtual Account",
    status: "Success",
  },
  {
    id: "TRX-8902",
    date: "06 Mar 2026",
    user: "Rina & Tono",
    package: "Premium (6 Bln)",
    amount: 850000,
    method: "GoPay",
    status: "Success",
  },
  {
    id: "TRX-8903",
    date: "06 Mar 2026",
    user: "Siti & Joko",
    package: "Basic (1 Thn)",
    amount: 500000,
    method: "Mandiri VA",
    status: "Pending",
  },
  {
    id: "TRX-8904",
    date: "05 Mar 2026",
    user: "Budi & Ani",
    package: "Premium (1 Thn)",
    amount: 1500000,
    method: "Credit Card",
    status: "Failed",
  },
  {
    id: "TRX-8905",
    date: "04 Mar 2026",
    user: "Dewi & Putra",
    package: "Premium (1 Bulan)",
    amount: 150000,
    method: "OVO",
    status: "Success",
  },
];

export default function AdminTransactionsPage() {
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  // Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm w-full overflow-hidden"
      >
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Riwayat Transaksi
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Pantau semua pembayaran paket layanan dari pengguna.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium w-full sm:w-auto shadow-md">
          <FileText size={16} /> Export Laporan (CSV)
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Pemasukan Bulan Ini
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {formatRupiah(24500000)}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-500">
            <ArrowUpRight size={24} />
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700">
              Menunggu Pembayaran
            </p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {formatRupiah(3500000)}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-amber-500">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-rose-700">
              Transaksi Gagal/Refund
            </p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {formatRupiah(1500000)}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500">
            <ArrowDownRight size={24} />
          </div>
        </div>
      </motion.div>

      {/* KUNCI UTAMA 1: Pembungkus paling luar dikasih w-full dan overflow-hidden biar gak ngerobek layar */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari ID Transaksi atau Nama..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors text-sm font-medium">
            <Filter size={16} /> Filter Status
          </button>
        </div>

        {/* KUNCI UTAMA 2: Di sini tempat munculin scroll bar kalau isi lebih panjang dari w-full */}
        <div className="w-full overflow-x-auto pb-6">
          {/* KUNCI UTAMA 3: Gunakan min-w-max biar lebar tabel dinamis ngikutin isi, JANGAN PAKAI min-w-225 */}
          <table className="w-full min-w-max text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  ID Transaksi
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Pengguna (Pengantin)
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Detail Pesanan
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">
                  Nominal
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {transactionsData.map((trx, index) => (
                <motion.tr
                  key={trx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="hover:bg-zinc-50/50 transition-colors group relative"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md">
                      {trx.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-zinc-600">{trx.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-zinc-900">{trx.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-zinc-800">
                      {trx.package}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                      <CreditCard size={12} /> {trx.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="font-bold text-zinc-900">
                      {formatRupiah(trx.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(trx.status)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {/* Tombol Cek Detail/Invoice */}
                    <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                      Detail
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
