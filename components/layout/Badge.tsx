import { CheckCircle2, Clock, XCircle } from "lucide-react";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return (
        <span className="flex w-fit items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-100">
          <CheckCircle2 size={12} /> Aktif
        </span>
      );
    case "Pending":
      return (
        <span className="flex w-fit items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full border border-amber-100">
          <Clock size={12} /> Pending
        </span>
      );
    case "Suspended":
      return (
        <span className="flex w-fit items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-full border border-rose-100">
          <XCircle size={12} /> Ditangguhkan
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-full">
          Unknown
        </span>
      );
  }
};

export default getStatusBadge;
