"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Globe,
  Save,
  ShieldCheck,
  ServerCrash,
} from "lucide-react";
import { useState } from "react";

// Daftar Menu Pengaturan
const tabs = [
  { id: "profile", name: "Profil Admin", icon: User },
  { id: "security", name: "Keamanan", icon: Lock },
  { id: "notifications", name: "Notifikasi", icon: Bell },
  { id: "system", name: "Sistem & Web", icon: Globe },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("system"); // Default tab yang kebuka
  const [isMaintenance, setIsMaintenance] = useState(false); // State untuk toggle switch

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

  // Komponen Konten Berdasarkan Tab yang Aktif
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-zinc-900">
              Profil Administrator
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    defaultValue="Super Admin"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700">
                    Email Utama
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@planniks.com"
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Bio Singkat
                </label>
                <textarea
                  rows={3}
                  defaultValue="Administrator utama untuk PlanNiks."
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                ></textarea>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-md shadow-emerald-500/20">
                <Save size={18} /> Simpan Perubahan
              </button>
            </div>
          </motion.div>
        );

      case "system":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-zinc-900">
              Preferensi Sistem
            </h2>

            <div className="space-y-4">
              {/* Toggle Maintenance Mode */}
              <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl mt-1 ${isMaintenance ? "bg-rose-100 text-rose-600" : "bg-zinc-200 text-zinc-500"}`}
                  >
                    <ServerCrash size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">
                      Maintenance Mode (Mode Perbaikan)
                    </p>
                    <p className="text-sm text-zinc-500">
                      Tutup akses aplikasi untuk semua pengguna kecuali Admin.
                    </p>
                  </div>
                </div>

                {/* Custom Toggle Switch pakai framer-motion */}
                <button
                  onClick={() => setIsMaintenance(!isMaintenance)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out flex items-center px-1 ${isMaintenance ? "bg-rose-500" : "bg-zinc-300"}`}
                >
                  <motion.div
                    layout
                    className="w-6 h-6 bg-white rounded-full shadow-sm"
                    animate={{ x: isMaintenance ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Pilihan Zona Waktu */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
                <label className="font-semibold text-zinc-900 block">
                  Zona Waktu Sistem (Timezone)
                </label>
                <select className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-zinc-700">
                  <option value="WITA">
                    WITA - Asia/Makassar (Waktu Saat Ini)
                  </option>
                  <option value="WIB">WIB - Asia/Jakarta</option>
                  <option value="WIT">WIT - Asia/Jayapura</option>
                </select>
                <p className="text-xs text-zinc-500">
                  Mempengaruhi pencatatan waktu transaksi dan pembuatan akun.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case "security":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-zinc-900">Keamanan Akun</h2>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
              <ShieldCheck size={24} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800">
                  Autentikasi Dua Faktor (2FA) Aktif
                </p>
                <p className="text-sm text-emerald-600 mt-1">
                  Akun admin Anda saat ini dilindungi dengan sangat baik.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Password Baru
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors font-medium shadow-md">
                Perbarui Password
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* HEADER */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Pengaturan Sistem
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Sesuaikan preferensi aplikasi dan konfigurasi keamanan Anda.
        </p>
      </motion.div>

      {/* MAIN LAYOUT: VERTICAL TABS */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-6 items-start"
      >
        {/* Kiri: Navigasi Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative w-full text-left ${
                  isActive
                    ? "text-emerald-700 font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <tab.icon size={20} className="relative z-10" />
                <span className="relative z-10">{tab.name}</span>

                {/* Animasi latar belakang tab aktif */}
                {isActive && (
                  <motion.div
                    layoutId="active-setting-tab"
                    className="absolute inset-0 bg-emerald-50 border border-emerald-100 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Kanan: Area Konten Form */}
        <div className="flex-1 w-full bg-white p-6 md:p-8 rounded-3xl border border-zinc-200 shadow-sm min-h-100">
          <AnimatePresence mode="wait">
            <div key={activeTab}>{renderTabContent()}</div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
