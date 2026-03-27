export interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  weddingDate: string;
  status: string;
  plan: string;
  isSuspended?: boolean;
}

export interface AdminUsersClientProps {
  usersData: UserData[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

export interface DetailUserProps {
  selectedUser: UserData | null;
  setSelectedUser: (user: UserData | null) => void;
  modalVariants: Variants;
}

export interface SuspendUserProps {
  userToSuspend: UserData | null;
  setUserToSuspend: (user: UserData | null) => void;
  handleConfirmSuspend: () => void;
  isSuspending: boolean;
  modalVariants: Variants;
}

export interface ActionMenuProps {
  user: UserData | null;
  setUserToSuspend: (user: UserData | null) => void;
  setOpenActionMenu: (menu: string | null) => void;
  setSelectedUser: (user: UserData | null) => void;
}
