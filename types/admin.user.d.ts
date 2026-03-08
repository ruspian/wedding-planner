export interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  weddingDate: string;
  status: string;
  plan: string;
}

export interface AdminUsersClientProps {
  usersData: UserData[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}
