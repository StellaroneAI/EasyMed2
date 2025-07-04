export interface DashboardStats {
  todayAppointments: number;
  activePatients: number;
  pendingLabs: number;
  aiConsultations: number;
}

export interface AppointmentWithPatient {
  id: number;
  patientName: string;
  patientAvatar?: string;
  time: string;
  reason: string;
  aadhaar: string;
  status: "scheduled" | "current" | "completed" | "cancelled";
  type: "in-person" | "telemedicine";
}

export interface RecentActivity {
  id: number;
  type: "lab_result" | "prescription" | "ai_consultation" | "appointment";
  patientName: string;
  description: string;
  timestamp: string;
  color: string;
}

export interface PatientTableData {
  id: number;
  name: string;
  age: number;
  avatar?: string;
  aadhaarStatus: "verified" | "pending" | "unverified";
  lastVisit: string;
  insurance: string;
}

export interface MedicalRecordSummary {
  id: number;
  patientName: string;
  type: string;
  date: string;
  icon: string;
  color: string;
}

export interface PrescriptionSummary {
  id: number;
  patientName: string;
  medication: string;
  dosage: string;
  duration: string;
  date: string;
  status: "active" | "pending" | "completed";
}
