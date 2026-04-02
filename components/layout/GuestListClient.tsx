"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  X,
  Loader2,
  Save,
} from "lucide-react";
import { useState } from "react";
import { addGuest } from "@/actions/guest.action";
import { toast } from "sonner";
import { GuestData, GuestStats } from "@/types/guest";

export default function GuestListClient({
  guests,
  stats,
  weddingId,
}: {
  guests: GuestData[];
  stats: GuestStats;
  weddingId?: string | null;
}) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State form tambah tamu
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    pax: 1,
    rsvpStatus: "PENDING",
  });

  // Filter tamu dari search bar (Client-side search biar ngebut)
  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.contact && g.contact.toLowerCase().includes(search.toLowerCase())),
  );

  const handleSaveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await addGuest(weddingId as string, formData);
      if (!result.success) throw new Error(result.message);

      setIsModalOpen(false);
      setFormData({ name: "", contact: "", pax: 1, rsvpStatus: "PENDING" });

      toast.success(result.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getRsvpBadge = (status: string) => {
    switch (status) {
      case "ATTENDING":
        return (
          <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-md border border-emerald-100">
            <CheckCircle2 size={12} /> Hadir
          </span>
        );
      case "DECLINED":
        return (
          <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-md border border-rose-100">
            <XCircle size={12} /> Tidak Hadir
          </span>
        );
      default:
        return (
          <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-md border border-amber-100">
            <Clock size={12} /> Menunggu
          </span>
        );
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
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* HEADER */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm"
        >
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Daftar Tamu Undangan
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Kelola undangan dan pantau konfirmasi kehadiran (RSVP).
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium shadow-md w-full sm:w-auto"
          >
            <Plus size={16} /> Tambah Tamu
          </button>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-white border border-zinc-200 p-5 rounded-3xl">
            <p className="text-sm font-medium text-zinc-500">
              Total Tamu Diundang
            </p>
            <p className="text-2xl font-black text-zinc-900 mt-1">
              {stats.totalGuests}
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl">
            <p className="text-sm font-medium text-emerald-700">
              Tamu Konfirmasi Hadir
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {stats.attendingCount}
            </p>
          </div>
          <div className="bg-emerald-600 border border-emerald-700 p-5 rounded-3xl text-white shadow-md shadow-emerald-600/20">
            <p className="text-sm font-medium text-emerald-50">
              Total Porsi Dibutuhkan (Pax)
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Users size={24} className="text-emerald-200" />
              <p className="text-2xl font-black">{stats.totalPaxAttending}</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl">
            <p className="text-sm font-medium text-amber-700">
              Belum Konfirmasi
            </p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {stats.pendingCount}
            </p>
          </div>
        </motion.div>

        {/* TABEL AREA */}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau kontak tamu..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-6 min-h-75">
            <table className="w-full min-w-max text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-200">
                  <th className="px-6 py-4 font-semibold">Nama Tamu</th>
                  <th className="px-6 py-4 font-semibold">Kontak</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Jatah Pax
                  </th>
                  <th className="px-6 py-4 font-semibold">Status RSVP</th>
                  <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-zinc-500"
                    >
                      Tidak ada tamu ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest, index) => (
                    <motion.tr
                      key={guest.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-zinc-50/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-900">
                        {guest.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">
                        {guest.contact || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-zinc-700">
                        {guest.pax}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRsvpBadge(guest.rsvpStatus)}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button className="p-2 text-zinc-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* MODAL TAMBAH TAMU */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="text-xl font-bold text-zinc-900">
                  Tambah Tamu Baru
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveGuest}>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">
                      Nama Lengkap
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Contoh: Budi Santoso"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">
                      Kontak (No HP / Email)
                    </label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      placeholder="08123456789"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">
                        Jatah Orang (Pax)
                      </label>
                      <input
                        required
                        type="number"
                        min="1"
                        value={formData.pax}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pax: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-700">
                        Status RSVP
                      </label>
                      <select
                        value={formData.rsvpStatus}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rsvpStatus: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-zinc-700"
                      >
                        <option value="PENDING">Menunggu</option>
                        <option value="ATTENDING">Hadir</option>
                        <option value="DECLINED">Tidak Hadir</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors shadow-md disabled:opacity-70"
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}{" "}
                    Simpan Tamu
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
