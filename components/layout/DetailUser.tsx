import { X, Mail, Calendar, CreditCard, Activity } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DetailUserProps } from "@/types/admin.user";
import getStatusBadge from "./Badge";

const DetailUser = ({
  selectedUser,
  setSelectedUser,
  modalVariants,
}: DetailUserProps) => {
  return (
    <AnimatePresence>
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-xl font-bold text-zinc-900">
                Detail Pengguna
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                  {selectedUser.name
                    ? selectedUser.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">
                    {selectedUser.name || "User Baru"}
                  </h3>
                  <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-1">
                    <Mail size={14} /> {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <p className="text-xs text-zinc-500 font-medium mb-1 flex items-center gap-1.5">
                    <Calendar size={14} /> Tanggal Nikah
                  </p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {selectedUser.weddingDate}
                  </p>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <p className="text-xs text-zinc-500 font-medium mb-1 flex items-center gap-1.5">
                    <CreditCard size={14} /> Paket Aktif
                  </p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {selectedUser.plan}
                  </p>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl col-span-2">
                  <p className="text-xs text-zinc-500 font-medium mb-1 flex items-center gap-1.5">
                    <Activity size={14} /> Status Transaksi Terakhir
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-400 font-mono text-center pt-2">
                User ID: {selectedUser.id}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DetailUser;
