"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { status } = useSession();

  const navLinks = [
    { name: "BERANDA", path: "/" },
    { name: "FITUR", path: "/fitur" },
    { name: "HARGA", path: "/harga" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💍</span>
            <span className="font-bold text-xl text-zinc-800 tracking-tight">
              Plan<span className="text-rose-500">Niks</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-sm font-medium text-zinc-600 hover:text-rose-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {status === "authenticated" ? (
              <Link
                href="/auth"
                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-800 transition-colors"
              >
                Keluar
              </Link>
            ) : (
              <Link
                href="/auth"
                className="px-5 py-2 text-sm font-medium text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* humberger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu hp */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-zinc-200"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-zinc-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2">
                {status === "authenticated" ? (
                  <Link
                    href="/auth"
                    className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-800 transition-colors"
                  >
                    Keluar
                  </Link>
                ) : (
                  <Link
                    href="/auth"
                    className="px-5 py-2 text-sm font-medium text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    Masuk
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
