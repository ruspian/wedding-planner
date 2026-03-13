import { updateAdminPassword } from "@/actions/admin.action";
import { RenderTabContentProps } from "@/types/admin.setting";
import { motion } from "framer-motion";
import { Save, ShieldCheck, ServerCrash, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const RenderTabContent = ({
  id,
  activeTab,
  isSaving,
  formData,
  setFormData,
  handleSaveProfile,
}: RenderTabContentProps) => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = async () => {
    setIsUpdatingPassword(true);
    try {
      const result = await updateAdminPassword(id, passwordForm.newPassword);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message || "Password berhasil diperbarui!");

      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat memperbarui password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
                  value={formData?.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Email Utama
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-md disabled:opacity-70"
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
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
          <h2 className="text-xl font-bold text-zinc-900">Preferensi Sistem</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl mt-1 ${isMaintenance ? "bg-rose-100 text-rose-600" : "bg-zinc-200 text-zinc-500"}`}
                >
                  <ServerCrash size={20} />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">
                    Maintenance Mode
                  </p>
                  <p className="text-sm text-zinc-500">
                    Tutup akses aplikasi untuk semua pengguna kecuali Admin.
                  </p>
                </div>
              </div>
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
                Akun admin Anda dilindungi dengan sangat baik.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Password Baru
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors font-medium shadow-md disabled:opacity-70"
            >
              {isUpdatingPassword ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Lock size={18} />
              )}
              {isUpdatingPassword ? "Menyimpan..." : "Perbarui Password"}
            </button>
          </div>
        </motion.div>
      );
    default:
      return null;
  }
};

export default RenderTabContent;
