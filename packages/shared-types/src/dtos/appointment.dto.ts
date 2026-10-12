import type { AppointmentStatus } from '../enums';

/** Book an eye test appointment */
export interface CreateAppointmentDto {
  storeId: string;
  appointmentDate: string;   // ISO date string (YYYY-MM-DD)
  slotTime: string;          // HH:MM
  guestName?: string;        // Used when not logged in
  guestPhone?: string;
  guestEmail?: string;
  notes?: string;
}

/** Appointment record */
export interface AppointmentDto {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  appointmentDate: string;
  slotTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

/** Available slots for a store + date */
export interface AvailableSlotsDto {
  storeId: string;
  date: string;
  slots: {
    time: string;            // HH:MM
    available: boolean;
    remaining: number;
  }[];
}
