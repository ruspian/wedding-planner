"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { LoginAction, RegisterAction } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const LoginProcess = LoginAction(
          new FormData(e.currentTarget as HTMLFormElement),
        ).then((res) => {
          if (!res.success) throw new Error(res.message);

          router.push("/");

          return res;
        });

        toast.promise(LoginProcess, {
          loading: "Sedang login...",
          success: (res) => res.message,
          error: (err) => err.message || "Gagal login, coba lagi!",
        });
      } else {
        const RegisterProcess = RegisterAction(
          new FormData(e.currentTarget as HTMLFormElement),
        ).then((res) => {
          if (!res.success) throw new Error(res.message);

          setFormData((prev) => ({ ...prev, password: "" }));
          setIsLogin(true);
          return res;
        });
        toast.promise(RegisterProcess, {
          loading: "Memproses pendaftaran...",
          success: (res) => res.message,
          error: (err) => err.message || "Gagal daftar, coba lagi!",
        });
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan, coba lagi!",
      );
    }
  };

  // Variasi animasi untuk form
  const formVariants: Variants = {
    hidden: { opacity: 0, x: isLogin ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, x: isLogin ? 50 : -50, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 z-10"
      >
        <div className="text-center mb-8">
          <motion.h1
            key={isLogin ? "login-title" : "register-title"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-zinc-800"
          >
            {isLogin ? "Selamat Datang" : "Mulai Rencana Mulus"}
          </motion.h1>
          <p className="text-sm text-zinc-500 mt-2">
            {isLogin
              ? "Masuk ke dashboard wedding planner-mu"
              : "Daftar sekarang dan atur hari bahagiamu"}
          </p>
        </div>

        <div className="relative min-h-70">
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "register"}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute w-full space-y-4"
              onSubmit={handleSubmit}
            >
              {!isLogin && (
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    onChange={(e) => handleChange("name", e.target.value)}
                    value={formData.name}
                    placeholder="Nama Lengkap"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all"
                  />
                </div>
              )}

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  onChange={(e) => handleChange("email", e.target.value)}
                  value={formData.email}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="password"
                  name="password"
                  onChange={(e) => handleChange("password", e.target.value)}
                  value={formData.password}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 mt-4 bg-zinc-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
              >
                {isLogin ? "Masuk Dashboard" : "Daftar Sekarang"}
                <ArrowRight size={18} />
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>

        <div className="text-center">
          <p className="text-sm text-zinc-600">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              {isLogin ? "Daftar di sini" : "Masuk"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
