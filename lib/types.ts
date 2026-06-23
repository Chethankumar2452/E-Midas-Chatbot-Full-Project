// Auth Types
export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "staff";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  token: string;
  userId: string;
  expiresAt: number;
}

// Lead Types
export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  source?: string;
  status?: "new" | "contacted" | "converted";
  createdAt: Date;
  updatedAt: Date;
}

// Patient Types
export interface Patient {
  _id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: "male" | "female" | "other";
  address: string;
  notes?: string;
  medicalHistory?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Doctor Types
export interface Doctor {
  _id: string;
  doctorName: string;
  specialization: string;
  qualification: string;
  experience: number;
  clinic: string;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  status: "active" | "inactive";
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Clinic Types
export interface Clinic {
  _id: string;
  clinicName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Appointment Types
export interface Appointment {
  _id: string;
  patientName: string;
  patientId?: string;
  phone: string;
  email: string;
  doctor: string;
  doctorId?: string;
  clinic: string;
  clinicId?: string;
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email Template Types
export interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Email Log Types
export interface EmailLog {
  _id: string;
  to: string;
  subject: string;
  status: "sent" | "failed";
  error?: string;
  createdAt: Date;
}

// Chat Types
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  lead?: Partial<Lead>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalLeads: number;
  totalPatients: number;
  totalDoctors: number;
  totalClinics: number;
  appointmentsToday: number;
  revenue: number;
}

// Analytics Types
export interface AnalyticsData {
  date: string;
  leads: number;
  appointments: number;
  revenue: number;
}

export interface DoctorBookingStats {
  doctorName: string;
  bookings: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PatientFormData {
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  notes?: string;
}

export interface DoctorFormData {
  doctorName: string;
  specialization: string;
  qualification: string;
  experience: number;
  clinic: string;
  availableDays: string[];
  startTime: string;
  endTime: string;
  status: string;
}

export interface ClinicFormData {
  clinicName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
}

export interface AppointmentFormData {
  patientName: string;
  phone: string;
  email: string;
  doctor: string;
  clinic: string;
  date: string;
  time: string;
  notes?: string;
}
