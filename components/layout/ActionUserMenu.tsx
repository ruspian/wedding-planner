import { ActionMenuProps } from "@/types/admin.user";
import { Eye, ShieldBan, ShieldCheck } from "lucide-react";

const ActionUserMenu = ({
  user,
  setUserToSuspend,
  setOpenActionMenu,
  setSelectedUser,
}: ActionMenuProps) => {
  return (
    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-40 bg-white border border-zinc-200 shadow-xl rounded-xl z-10 py-1 overflow-hidden">
      <button
        onClick={() => {
          setSelectedUser(user);
          setOpenActionMenu(null);
        }}
        className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer"
      >
        <Eye size={14} className="text-zinc-400" /> Lihat Detail
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
  );
};

export default ActionUserMenu;
