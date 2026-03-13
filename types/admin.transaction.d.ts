export interface SearchParamsType {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export interface TransactionData {
  id: string;
  date: string;
  userName: string;
  packageName: string;
  amount: number;
  method: string;
  status: string;
}

export interface TransactionStats {
  monthlyRevenue: number;
  pendingRevenue: number;
  failedRevenue: number;
}

export interface AdminTransactionsClientProps {
  transactions: TransactionData[];
  stats: TransactionStats;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
