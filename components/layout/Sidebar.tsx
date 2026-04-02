"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Store,
  LogOut,
  Menu,
  X,
  CalendarCheck,
  HeartHandshake,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Wedding", path: "/weddings", icon: HeartHandshake },
  { name: "Tamu", path: "/guests", icon: Users },
  { name: "Budget", path: "/budget", icon: Wallet },
  { name: "Vendor", path: "/vendors", icon: Store },
  { name: "Jadwal", path: "/tasks", icon: CalendarCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // varian animasi
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
        className="hidden md:flex flex-col w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-zinc-200 fixed left-0 top-0 p-4 z-40"
      >
        <div className="flex items-center gap-2 px-4 py-4 mb-4">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-2xl"
          >
            💍
          </motion.span>
          <span className="font-bold text-xl text-zinc-800 tracking-tight">
            Plan<span className="text-rose-500">Niks</span>
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col gap-2"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <motion.div key={item.path} variants={itemVariants}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative group ${
                    isActive
                      ? "text-rose-600 font-semibold"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <item.icon size={20} className="z-10 relative" />
                  <span className="z-10 relative">{item.name}</span>

                  {isActive ? (
                    <motion.div
                      layoutId="desktop-active"
                      className="absolute inset-0 bg-rose-50 border border-rose-100 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-zinc-100 rounded-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200" />
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
          className="mt-auto border-t border-zinc-100 pt-4"
        >
          <motion.button
            whileHover={{ x: 5, backgroundColor: "#fff1f2", color: "#e11d48" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </motion.button>
        </motion.div>
      </motion.aside>

      <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200 z-50 flex items-center justify-between p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">💍</span>
          <span className="font-bold text-lg text-zinc-800">
            Plan<span className="text-rose-500">Niks</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
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
              className="md:hidden fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50"
            />

            <motion.div
              variants={mobileDrawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden fixed top-0 left-0 h-screen w-[80%] max-w-75 bg-white z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                <span className="font-bold text-xl text-zinc-800 tracking-tight">
                  Plan<span className="text-rose-500">Niks</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-400 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors"
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
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Link
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                          isActive
                            ? "text-rose-600 font-semibold bg-rose-50"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                        }`}
                      >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose-500 rounded-r-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="mt-auto border-t border-zinc-100 pt-4">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                  <LogOut size={20} />
                  <span className="font-medium">Keluar</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
