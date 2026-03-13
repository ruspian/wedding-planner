"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { User, Lock, Globe } from "lucide-react";
import { useState } from "react";
import RenderTabContent from "./RenderTabContent";
import { updateAdminProfile } from "@/actions/admin.action";
import { AdminData } from "@/types/admin.setting";

const tabs = [
  { id: "profile", name: "Profil Admin", icon: User },
  { id: "security", name: "Keamanan", icon: Lock },
  { id: "system", name: "Sistem & Web", icon: Globe },
];

export default function AdminSettingsClient({
  adminData,
}: {
  adminData: AdminData;
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: adminData.name || "",
    email: adminData.email || "",
  });

  // Handle submit perubahan profil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const result = await updateAdminProfile(adminData.id, formData);
      if (!result.success) {
        alert(result.message);
        return;
      }
      alert("Profil berhasil diperbarui!"); // Nanti bisa ganti pake toast
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
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
        className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Pengaturan Sistem
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Sesuaikan profil admin dan preferensi aplikasi Anda.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-6 items-start"
      >
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

        <div className="flex-1 w-full bg-white p-6 md:p-8 rounded-3xl border border-zinc-200 shadow-sm min-h-100">
          <AnimatePresence mode="wait">
            <div key={activeTab}>
              <RenderTabContent
                activeTab={activeTab}
                isSaving={isSaving}
                formData={formData}
                setFormData={setFormData}
                handleSaveProfile={handleSaveProfile}
                id={adminData.id}
              />
            </div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
