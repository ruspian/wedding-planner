export interface GuestData {
  id: string;
  weddingId: string;
  name: string;
  contact: string | null;
  rsvpStatus: string;
  pax: number;
}

export interface GuestStats {
  totalGuests: number;
  attendingCount: number;
  pendingCount: number;
  totalPaxAttending: number;
}
