export interface WeddingData {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: Date | null;
  totalBudget: number;
}

export interface WeddingSetupClientProps {
  userName: string;
  weddingData: WeddingData | null;
}
