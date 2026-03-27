import { PaginationProps } from "@/types/pagination";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useDebounce } from "use-debounce";

const Pagination = ({
  totalUsers,
  totalPages,
  currentPage,
  search,
}: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [debouncedSearch] = useDebounce(search, 500);
  return (
    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between text-sm text-zinc-500 gap-4">
      <span>
        Total <b className="text-zinc-700">{totalUsers}</b> pengguna
      </span>

      <div className="flex gap-2 items-center">
        <button
          disabled={currentPage <= 1}
          onClick={() =>
            router.push(
              `${pathname}?page=${currentPage - 1}${debouncedSearch ? `&search=${debouncedSearch}` : ""}`,
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
              `${pathname}?page=${currentPage + 1}${debouncedSearch ? `&search=${debouncedSearch}` : ""}`,
            )
          }
          className="px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-zinc-700 shadow-sm"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

export default Pagination;
