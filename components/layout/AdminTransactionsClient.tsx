"use client";

import { motion, Variants } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  FileText,
  CreditCard,
  MoreVertical,
  Eye,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AdminTransactionsClientProps } from "@/types/admin.transaction";
import { useDebounce } from "use-debounce";
import { formatRupiah } from "@/lib/formatRupiah";
import TransactionBadge from "./TransactionBadge";
import { exportTransactionsCSV } from "@/actions/admin.action";
import { toast } from "sonner";

export default function AdminTransactionsClient({
  transactions,
  stats,
  totalPages,
  currentPage,
  totalItems,
}: AdminTransactionsClientProps) {
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //   buka tutup modal aksi
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (openActionMenu && !target.closest(".active-action-menu")) {
        setOpenActionMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openActionMenu]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentSearch = searchParams.get("search") || "";

    if (debouncedSearch !== currentSearch) {
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }

      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, pathname, router, searchParams]);

  const handleExportCSV = async () => {
    setIsExporting(true);

    try {
      const result = await exportTransactionsCSV(debouncedSearch);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Gagal membuat file CSV");
      }

      // Ubah string CSV jadi file
      const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      // element link untuk download
      const link = document.createElement("a");
      link.href = url;

      // nama file
      const dateToday = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `Data_Transaksi_${dateToday}.csv`);

      document.body.appendChild(link);
      link.click();

      // hapus element download
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      toast.error("Gagal mengekspor data transaksi. Coba lagi!");
    } finally {
      setIsExporting(false);
    }
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
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium w-full sm:w-auto shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Memproses...
            </>
          ) : (
            <>
              <FileText size={16} /> Export CSV
            </>
          )}
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Pemasukan Bulan Ini
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {formatRupiah(stats.monthlyRevenue)}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-500">
            <ArrowUpRight size={24} />
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700">
              Menunggu Pembayaran
            </p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {formatRupiah(stats.pendingRevenue)}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-amber-500">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-rose-700">Transaksi Gagal</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {formatRupiah(stats.failedRevenue)}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500">
            <ArrowDownRight size={24} />
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden w-full max-w-full"
      >
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID Transaksi atau Nama..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors text-sm font-medium">
            <Filter size={16} /> Filter Status
          </button>
        </div>

        <div className="w-full max-w-full overflow-x-auto pb-6 min-h-75">
          <table className="w-full min-w-max text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-200">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  ID Transaksi
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Tanggal
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Pengguna
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
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-zinc-500 font-medium bg-zinc-50/30"
                  >
                    Tidak ada data transaksi ditemukan.
                  </td>
                </tr>
              ) : (
                transactions.map((trx, index) => (
                  <motion.tr
                    key={trx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="hover:bg-zinc-50/50 transition-colors group relative"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-mono font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md">
                        {trx.id.length > 12
                          ? `${trx.id.slice(0, 10)}...`
                          : trx.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-zinc-600">{trx.date}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-zinc-900">
                        {trx.userName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-800">
                        {trx.packageName}
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
                      {TransactionBadge(trx.status)}
                    </td>
                    <td
                      className={`px-6 py-4 text-center whitespace-nowrap relative ${openActionMenu === trx.id ? "active-action-menu" : ""}`}
                    >
                      <button
                        onClick={() =>
                          setOpenActionMenu(
                            openActionMenu === trx.id ? null : trx.id,
                          )
                        }
                        className={`p-2 rounded-lg transition-colors ${openActionMenu === trx.id ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openActionMenu === trx.id && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-40 bg-white border border-zinc-200 shadow-xl rounded-xl z-10 py-1 overflow-hidden">
                          <button className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer">
                            <Eye size={14} className="text-zinc-400" /> Detail
                            Transaksi
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between text-sm text-zinc-500 gap-4">
          <span>
            Total <b className="text-zinc-700">{totalItems}</b> transaksi
          </span>
          <div className="flex gap-2 items-center">
            <button
              disabled={currentPage <= 1}
              onClick={() =>
                router.push(
                  `${pathname}?page=${currentPage - 1}${debouncedSearch ? `&search=${debouncedSearch}` : ""}`,
                )
              }
              className="px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 transition-colors font-medium text-zinc-700 shadow-sm"
            >
              Sebelumnya
            </button>
            <span className="px-4 py-2 font-medium text-zinc-700 bg-zinc-100/50 rounded-xl">
              Hal {currentPage} dari {totalPages || 1}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                router.push(
                  `${pathname}?page=${currentPage + 1}${debouncedSearch ? `&search=${debouncedSearch}` : ""}`,
                )
              }
              className="px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 transition-colors font-medium text-zinc-700 shadow-sm"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
