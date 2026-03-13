import { CheckCircle2, Clock, XCircle } from "lucide-react";

const TransactionBadge = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return (
        <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-md border border-emerald-100">
          <CheckCircle2 size={12} /> Berhasil
        </span>
      );
    case "PENDING":
      return (
        <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-md border border-amber-100">
          <Clock size={12} /> Menunggu
        </span>
      );
    case "FAILED":
      return (
        <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-md border border-rose-100">
          <XCircle size={12} /> Gagal
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-md">
          Unknown
        </span>
      );
  }
};

export default TransactionBadge;
