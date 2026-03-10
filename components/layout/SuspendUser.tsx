import { SuspendUserProps } from "@/types/admin.user";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

const SuspendUser = ({
  isSuspending,
  userToSuspend,
  modalVariants,
  setUserToSuspend,
  handleConfirmSuspend,
}: SuspendUserProps) => {
  return (
    <AnimatePresence>
      {userToSuspend && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSuspending && setUserToSuspend(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-xl font-bold text-zinc-900">Suspend Akun?</h2>
            <p className="text-sm text-zinc-500 mt-2">
              Anda yakin ingin mensuspend akun <b>{userToSuspend.name}</b>?
              Pengguna ini tidak akan bisa login atau mengakses proyek
              pernikahannya lagi.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                disabled={isSuspending}
                onClick={() => setUserToSuspend(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                disabled={isSuspending}
                onClick={handleConfirmSuspend}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 flex items-center justify-center gap-2"
              >
                {isSuspending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Proses...
                  </>
                ) : (
                  "Ya, Suspend"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuspendUser;
