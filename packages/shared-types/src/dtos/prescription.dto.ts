/** Upload / save a prescription */
export interface CreatePrescriptionDto {
  name: string;              // Patient's name
  rightSph?: number;
  rightCyl?: number;
  rightAxis?: number;
  rightAdd?: number;
  leftSph?: number;
  leftCyl?: number;
  leftAxis?: number;
  leftAdd?: number;
  pd?: number;               // Pupillary distance
  validUntil?: string;       // ISO date string
  consentGiven: boolean;     // DPDP Act consent
}

/** Prescription record returned to client */
export interface PrescriptionDto {
  id: string;
  name: string;
  rightSph?: number;
  rightCyl?: number;
  rightAxis?: number;
  rightAdd?: number;
  leftSph?: number;
  leftCyl?: number;
  leftAxis?: number;
  leftAdd?: number;
  pd?: number;
  fileUrl?: string;
  validUntil?: string;
  consentGiven: boolean;
  createdAt: string;
}
