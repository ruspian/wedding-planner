"use client";

import { AdminDataProps } from "@/types/admin.data";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Activity,
  CreditCard,
  BarChart3,
  Settings,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

// 2. Terima data sebagai props
export default function AdminDashboardClient({ data }: AdminDataProps) {
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
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
      {/* HEADER ADMIN */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Admin Control Panel ⚡️
          </h1>
          <p className="text-zinc-400 mt-2 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Status: {data.systemStatus}
          </p>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-4">
          <Settings
            size={20}
            className="text-zinc-300 hover:text-white cursor-pointer transition-colors"
          />
          <AlertCircle
            size={20}
            className="text-zinc-300 hover:text-white cursor-pointer transition-colors"
          />
        </div>
      </motion.div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Users size={24} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-1">
              <TrendingUp size={12} /> +{data.newUsersToday} Hari Ini
            </span>
          </div>
          <h3 className="text-zinc-500 text-sm font-medium">Total Pengguna</h3>
          <p className="text-4xl font-black text-zinc-900 mt-2 tracking-tight">
            {data.totalUsers.toLocaleString("id-ID")}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-zinc-500 text-sm font-medium">
            Project Pernikahan Aktif
          </h3>
          <p className="text-4xl font-black text-zinc-900 mt-2 tracking-tight">
            {data.activeWeddings}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CreditCard size={24} />
            </div>
          </div>
          <h3 className="text-zinc-500 text-sm font-medium">
            Pendapatan Bulan Ini
          </h3>
          <p className="text-3xl font-black text-zinc-900 mt-2 tracking-tight">
            {formatRupiah(data.monthlyRevenue)}
          </p>
        </motion.div>
      </div>

      {/* CHART PLACEHOLDER */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm mt-6 min-h-75 flex flex-col items-center justify-center text-zinc-400 border-dashed"
      >
        <BarChart3 size={48} className="mb-4 opacity-50" />
        <p className="font-medium">
          Grafik Pendaftaran User akan tampil di sini
        </p>
      </motion.div>
    </motion.div>
  );
}
