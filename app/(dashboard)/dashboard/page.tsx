"use client";

import { motion, Variants } from "framer-motion";
import {
  Users,
  Wallet,
  TrendingUp,
  Clock,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

// Dummy data buat awalan (Nanti ini kita ambil dari database pakai Prisma)
const summaryData = {
  daysLeft: 124, // Sisa hari menuju H
  bride: "Calon Istri", // Nanti bisa ganti nama pasangan lo
  groom: "Pian",
  weddingDate: "10 Agustus 2026",
  budget: {
    total: 150000000,
    spent: 45000000,
  },
  guests: {
    total: 500,
    confirmed: 320,
  },
  tasks: {
    total: 45,
    completed: 18,
  },
};

export default function DashboardOverview() {
  // Hitung persentase progress
  const taskProgress = Math.round(
    (summaryData.tasks.completed / summaryData.tasks.total) * 100,
  );
  const budgetProgress = Math.round(
    (summaryData.budget.spent / summaryData.budget.total) * 100,
  );

  // Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // --- ANIMASI FRAMER MOTION ---
  // Container buat efek stagger (munculin card satu per satu)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  // Animasi tiap-tiap card (mental halus dari bawah)
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
      {/* 1. HEADER & COUNTDOWN EKSKLUSIF */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-sm overflow-hidden relative"
      >
        {/* Dekorasi Blur Background di dalam Header */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-200/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-200/50 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Halo, {summaryData.bride} & {summaryData.groom}! 👋
          </h1>
          <p className="text-zinc-500 mt-2 flex items-center gap-2 text-base">
            <Clock size={18} className="text-rose-500" />
            {summaryData.weddingDate}
          </p>
        </div>

        {/* Kotak Countdown */}
        <div className="relative z-10 bg-white/80 backdrop-blur-md border border-rose-100/50 px-8 py-4 rounded-2xl text-center min-w-45 shadow-sm">
          <p className="text-sm font-semibold text-rose-600 tracking-wide uppercase mb-1">
            Menuju Hari-H
          </p>
          <p className="text-5xl font-black text-rose-500">
            {summaryData.daysLeft}{" "}
            <span className="text-xl font-medium text-rose-400">Hari</span>
          </p>
        </div>
      </motion.div>

      {/* 2. PROGRESS BAR UTAMA (Persiapan Keseluruhan) */}
      <motion.div
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-sm"
      >
        <div className="flex justify-between items-end mb-3">
          <div>
            <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
              <TrendingUp size={24} className="text-blue-500" />
              Progress Persiapan
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Berdasarkan tugas yang diselesaikan
            </p>
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="text-3xl font-black text-zinc-900"
          >
            {taskProgress}%
          </motion.span>
        </div>
        {/* Track Progress Bar */}
        <div className="w-full h-4 bg-zinc-100 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${taskProgress}%` }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full"
          />
        </div>
      </motion.div>

      {/* 3. SUMMARY CARDS (GRID 3 KOLOM) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Budget */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full">
              Terpakai {budgetProgress}%
            </span>
          </div>
          <h3 className="text-zinc-500 text-sm font-medium">Sisa Budget</h3>
          <p className="text-3xl font-bold text-zinc-800 mt-1 tracking-tight">
            {formatRupiah(summaryData.budget.total - summaryData.budget.spent)}
          </p>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full mt-5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetProgress}%` }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </motion.div>

        {/* Card Tamu (RSVP) */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-zinc-500 text-sm font-medium">
            Tamu Konfirmasi (RSVP)
          </h3>
          <p className="text-3xl font-bold text-zinc-800 mt-1 tracking-tight">
            {summaryData.guests.confirmed}{" "}
            <span className="text-lg font-normal text-zinc-400">
              / {summaryData.guests.total}
            </span>
          </p>
        </motion.div>

        {/* Card Vendor / Tugas */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
              <HeartHandshake size={24} />
            </div>
          </div>
          <h3 className="text-zinc-500 text-sm font-medium">Tugas Selesai</h3>
          <p className="text-3xl font-bold text-zinc-800 mt-1 tracking-tight">
            {summaryData.tasks.completed}{" "}
            <span className="text-lg font-normal text-zinc-400">
              / {summaryData.tasks.total}
            </span>
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-orange-600 font-medium bg-orange-50 w-fit px-3 py-1.5 rounded-xl">
            <CheckCircle2 size={16} />
            <span>
              {summaryData.tasks.total - summaryData.tasks.completed} Tugas
              tersisa
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
