"use client";

import getStatusBadge from "@/components/layout/Badge";
import { motion, Variants } from "framer-motion";
import { Search, Filter, MoreVertical, ShieldBan, Eye } from "lucide-react";
import { useState } from "react";

// Dummy Data Pengguna
const usersData = [
  {
    id: "USR-001",
    name: "Pian & Nisa",
    email: "pian@example.com",
    weddingDate: "10 Agustus 2026",
    status: "Active",
    plan: "Premium",
  },
  {
    id: "USR-002",
    name: "Budi & Ani",
    email: "budi@example.com",
    weddingDate: "15 September 2026",
    status: "Active",
    plan: "Free",
  },
  {
    id: "USR-003",
    name: "Siti & Joko",
    email: "siti@example.com",
    weddingDate: "Belum Diatur",
    status: "Pending",
    plan: "Free",
  },
  {
    id: "USR-004",
    name: "Rina & Tono",
    email: "rina@example.com",
    weddingDate: "12 Desember 2026",
    status: "Suspended",
    plan: "Premium",
  },
  {
    id: "USR-005",
    name: "Dewi & Putra",
    email: "dewi@example.com",
    weddingDate: "05 November 2026",
    status: "Active",
    plan: "Free",
  },
];

export default function AdminUsersPage() {
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

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
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Manajemen Pengguna
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Pantau semua akun pengantin yang mendaftar secara mandiri di
            PlanNiks.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors text-sm font-medium w-full sm:w-auto">
          <Filter size={16} /> Filter Data
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama atau email pengguna..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-100 pb-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 text-zinc-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  User ID
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Nama Pasangan
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Tanggal Pernikahan
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Status Akun
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Paket
                </th>
                <th className="px-6 py-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {usersData.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="hover:bg-zinc-50/50 transition-colors group relative"
                >
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
                      {user.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900 whitespace-nowrap">
                      {user.name}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-700 whitespace-nowrap">
                      {user.weddingDate}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap ${
                        user.plan === "Premium"
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center relative">
                    <button
                      onClick={() =>
                        setOpenActionMenu(
                          openActionMenu === user.id ? null : user.id,
                        )
                      }
                      className={`p-2 rounded-lg transition-colors ${openActionMenu === user.id ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openActionMenu === user.id && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-40 bg-white border border-zinc-200 shadow-xl rounded-xl z-10 py-1 overflow-hidden">
                        <button className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
                          <Eye size={14} className="text-zinc-400" /> Lihat
                          Detail
                        </button>
                        <div className="h-px w-full bg-zinc-100 my-1"></div>
                        <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium">
                          <ShieldBan size={14} /> Suspend Akun
                        </button>
                      </div>
                    )}
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
