export interface GuestData {
  id?: string;
  weddingId?: string;
  name: string;
  contact: string | null;
  pax: number;
}

export interface GuestStats {
  totalGuests: number;
  totalEstimatedPax: number;
}
