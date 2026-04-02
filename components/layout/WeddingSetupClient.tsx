"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Calendar,
  Wallet,
  ArrowRight,
  Loader2,
  Save,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createWeddingSetup,
  updateWeddingSetup,
} from "@/actions/wedding.action";
import { toast } from "sonner";
import { WeddingSetupClientProps } from "@/types/wedding";

export default function WeddingSetupClient({
  userName,
  weddingData,
}: WeddingSetupClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!weddingData;

  const formattedDate = weddingData?.weddingDate
    ? new Date(weddingData.weddingDate).toISOString().split("T")[0]
    : "";

  const [formData, setFormData] = useState({
    brideName: weddingData?.brideName || "",
    groomName: weddingData?.groomName || "",
    weddingDate: formattedDate,
    totalBudget: weddingData?.totalBudget ? Number(weddingData.totalBudget) : 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;

      if (isEditMode) {
        result = await updateWeddingSetup(weddingData.id, formData);
      } else {
        result = await createWeddingSetup(formData);
      }

      if (!result.success) throw new Error(result.message);

      toast.success(
        isEditMode ? "Data berhasil diperbarui!" : "Project berhasil dibuat!",
      );

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl shadow-zinc-200/50 p-8 md:p-12 border border-zinc-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            {isEditMode
              ? "Pengaturan Project"
              : `Halo, ${userName.split(" ")[0]}!`}
          </h1>
          <p className="text-zinc-500 mt-2">
            {isEditMode
              ? "Perbarui detail rencana pernikahan Anda di sini."
              : "Mari mulai merencanakan pernikahan impian Anda. Isi detail dasar di bawah ini untuk membuat ruang kerja Anda."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">
                Nama Mempelai Wanita
              </label>
              <input
                required
                type="text"
                placeholder="Contoh: Raisa"
                value={formData.brideName}
                onChange={(e) =>
                  setFormData({ ...formData, brideName: e.target.value })
                }
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">
                Nama Mempelai Pria
              </label>
              <input
                required
                type="text"
                placeholder="Contoh: Hamish"
                value={formData.groomName}
                onChange={(e) =>
                  setFormData({ ...formData, groomName: e.target.value })
                }
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-600" /> Tanggal
              Pernikahan
            </label>
            <input
              required
              type="date"
              value={formData.weddingDate}
              onChange={(e) =>
                setFormData({ ...formData, weddingDate: e.target.value })
              }
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <Wallet size={16} className="text-emerald-600" /> Total Anggaran
              (Budget)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">
                Rp
              </span>
              <input
                required
                type="number"
                min="0"
                placeholder="100000000"
                value={formData.totalBudget || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalBudget: Number(e.target.value),
                  })
                }
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
              />
            </div>
            {!isEditMode && (
              <p className="text-xs text-zinc-400">
                Anda dapat mengubah angka ini nanti.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors font-semibold shadow-lg shadow-zinc-900/20 mt-8 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />{" "}
                {isEditMode ? "Menyimpan..." : "Menyiapkan..."}
              </>
            ) : isEditMode ? (
              <>
                <Save size={20} /> Simpan Perubahan
              </>
            ) : (
              <>
                Mulai Rencanakan Sekarang <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
