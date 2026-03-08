"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
} from "lucide-react";

const adminNavItems = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard },
  { name: "Pengguna", path: "/admin/users", icon: Users },
  { name: "Transaksi", path: "/admin/transactions", icon: CreditCard },
  { name: "Sistem", path: "/admin/settings", icon: Settings },
];

export default function SidebarAdmin() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const mobileDrawerVariants: Variants = {
    hidden: {
      x: "-100%",
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    },
    visible: {
      x: 0,
      borderTopRightRadius: "0%",
      borderBottomRightRadius: "0%",
      transition: { type: "spring", bounce: 0, duration: 0.5 },
    },
    exit: {
      x: "-100%",
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:flex flex-col w-64 h-screen bg-zinc-900 border-r border-zinc-800 fixed left-0 top-0 p-4 z-40 text-zinc-300"
      >
        <div className="flex items-center gap-2 px-4 py-4 mb-4">
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="p-1.5 bg-emerald-500 rounded-lg text-white"
          >
            <Activity size={20} />
          </motion.div>
          <span className="font-bold text-xl text-white tracking-tight">
            Plan<span className="text-emerald-500">Admin</span>
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col gap-2"
        >
          {adminNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <motion.div key={item.path} variants={itemVariants}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative group ${
                    isActive ? "text-white font-semibold" : "hover:text-white"
                  }`}
                >
                  <item.icon size={20} className="z-10 relative" />
                  <span className="z-10 relative">{item.name}</span>

                  {isActive ? (
                    <motion.div
                      layoutId="admin-desktop-active"
                      className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-800 rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200" />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-auto border-t border-zinc-800 pt-4"
        >
          <motion.button
            whileHover={{ x: 5, backgroundColor: "#3f3f46", color: "#f87171" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar Sistem</span>
          </motion.button>
        </motion.div>
      </motion.aside>

      <div className="md:hidden fixed top-0 w-full bg-zinc-900 border-b border-zinc-800 z-50 flex items-center justify-between p-4 shadow-sm text-white">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-emerald-500" />
          <span className="font-bold text-lg">
            Plan<span className="text-emerald-500">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              variants={mobileDrawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden fixed top-0 left-0 h-screen w-[80%] max-w-75 bg-zinc-900 text-white z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                <span className="font-bold text-xl tracking-tight">
                  Plan<span className="text-emerald-500">Admin</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col gap-2"
              >
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Link
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${isActive ? "text-emerald-400 font-semibold bg-emerald-500/10" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
                      >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="admin-mobile-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="mt-auto border-t border-zinc-800 pt-4">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-xl transition-colors">
                  <LogOut size={20} />
                  <span className="font-medium">Keluar Sistem</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
