"use client";

import { motion, Variants } from "framer-motion";
import {
  Search,
  Filter,
  MoreVertical,
  ShieldBan,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AdminUsersClientProps, UserData } from "@/types/admin.user";
import getStatusBadge from "./Badge";
import DetailUser from "./DetailUser";
import SuspendUser from "./SuspendUser";
import { toggleSuspendUser } from "@/actions/admin.action";
import { toast } from "sonner";

export default function AdminUsersClient({
  usersData,
  totalPages,
  currentPage,
  totalUsers,
}: AdminUsersClientProps) {
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToSuspend, setUserToSuspend] = useState<UserData | null>(null);
  const [isSuspending, setIsSuspending] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ambil nilai pencarian
  const currentSearch = searchParams.get("search") || "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;

      // tutup menu jika klik diluar menu
      if (openActionMenu && !target.closest(".active-action-menu")) {
        setOpenActionMenu(null); // Langsung tutup!
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionMenu]);

  // Fungsi hendel pencarian
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleConfirmSuspend = async () => {
    if (!userToSuspend) return;

    setIsSuspending(true);

    try {
      const suspendPromise = toggleSuspendUser(userToSuspend.id).then(
        (result) => {
          if (!result.success) {
            throw new Error(result.message || "Gagal mengubah status akun.");
          }
          return result;
        },
      );

      await toast.promise(suspendPromise, {
        loading: "Tunggu Sebentar...",
        success: (res) => res.message,
        error: (err) => err.message,
      });

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan, coba lagi!",
      );
    } finally {
      setIsSuspending(false);
      setUserToSuspend(null);
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

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm w-full overflow-hidden"
        >
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Manajemen Pengguna
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Pantau semua akun pengantin yang terdaftar di sistem.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors text-sm font-medium w-full sm:w-auto">
            <Filter size={16} /> Filter Data
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden w-full max-w-full"
        >
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                size={18}
              />
              <input
                type="text"
                defaultValue={currentSearch}
                onChange={(e) => {
                  setTimeout(() => handleSearch(e.target.value), 400);
                }}
                placeholder="Cari nama atau email pengguna..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="w-full max-w-full overflow-x-auto pb-6 min-h-100">
            <table className="w-full min-w-max text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-200">
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">
                    User ID
                  </th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">
                    Nama Pasangan
                  </th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">
                    Tanggal Pernikahan
                  </th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">
                    Status Transaksi
                  </th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">
                    Paket
                  </th>
                  <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {usersData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-zinc-500 font-medium bg-zinc-50/30"
                    >
                      Tidak ada data pengguna ditemukan.
                    </td>
                  </tr>
                ) : (
                  usersData.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="hover:bg-zinc-50/50 transition-colors group relative"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
                          {user.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-zinc-900">
                          {user.name || "User Baru"}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-zinc-700">
                          {user.weddingDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                            user.plan === "Premium"
                              ? "bg-indigo-50 text-indigo-600"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap relative active-action-menu">
                        <button
                          onClick={() =>
                            setOpenActionMenu(
                              openActionMenu === user.id ? null : user.id,
                            )
                          }
                          className={`p-2 rounded-lg transition-colors ${openActionMenu === user.id ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openActionMenu === user.id && (
                          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-40 bg-white border border-zinc-200 shadow-xl rounded-xl z-10 py-1 overflow-hidden">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer"
                            >
                              <Eye size={14} className="text-zinc-400" /> Lihat
                              Detail
                            </button>
                            <div className="h-px w-full bg-zinc-100 my-1"></div>
                            {user?.isSuspended ? (
                              <button
                                onClick={() => {
                                  setUserToSuspend(user);
                                  setOpenActionMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                              >
                                <ShieldBan size={14} /> Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setUserToSuspend(user);
                                  setOpenActionMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-medium cursor-pointer"
                              >
                                <ShieldCheck size={14} /> Unsuspend
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between text-sm text-zinc-500 gap-4">
            <span>
              Total <b className="text-zinc-700">{totalUsers}</b> pengguna
            </span>

            <div className="flex gap-2 items-center">
              <button
                disabled={currentPage <= 1}
                onClick={() =>
                  router.push(
                    `${pathname}?page=${currentPage - 1}${currentSearch ? `&search=${currentSearch}` : ""}`,
                  )
                }
                className="px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-zinc-700 shadow-sm"
              >
                Sebelumnya
              </button>
              <span className="px-4 py-2 font-medium text-zinc-700 bg-zinc-100/50 rounded-xl">
                Hal {currentPage} dari {totalPages || 1}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  router.push(
                    `${pathname}?page=${currentPage + 1}${currentSearch ? `&search=${currentSearch}` : ""}`,
                  )
                }
                className="px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-zinc-700 shadow-sm"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <DetailUser
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        modalVariants={modalVariants}
      />

      <SuspendUser
        isSuspending={isSuspending}
        modalVariants={modalVariants}
        setUserToSuspend={setUserToSuspend}
        handleConfirmSuspend={handleConfirmSuspend}
        userToSuspend={userToSuspend}
      />
    </>
  );
}
