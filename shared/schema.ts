import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users (Doctors and Patients)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(), // 'doctor', 'patient', 'admin'
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Doctors
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  medicalCouncilId: text("medical_council_id").notNull().unique(),
  specialization: text("specialization").notNull(),
  qualifications: text("qualifications").notNull(),
  experience: integer("experience"), // years
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }),
  isVerified: boolean("is_verified").default(false),
  hospitalAffiliation: text("hospital_affiliation"),
  availableSlots: jsonb("available_slots"), // JSON array of time slots
});

// Patients
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  aadhaarNumber: text("aadhaar_number").unique(),
  aadhaarVerified: boolean("aadhaar_verified").default(false),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  bloodGroup: text("blood_group"),
  emergencyContact: text("emergency_contact"),
  address: text("address"),
  insuranceProvider: text("insurance_provider"),
  insuranceNumber: text("insurance_number"),
  medicalHistory: jsonb("medical_history"), // JSON array of medical conditions
  allergies: text("allergies"),
});

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").default(30), // minutes
  status: text("status").default("scheduled"), // 'scheduled', 'completed', 'cancelled', 'in-progress'
  type: text("type").default("in-person"), // 'in-person', 'telemedicine'
  reason: text("reason"),
  notes: text("notes"),
  videoCallLink: text("video_call_link"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medical Records
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  recordType: text("record_type").notNull(), // 'consultation', 'diagnosis', 'treatment', 'lab_result'
  title: text("title").notNull(),
  description: text("description"),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  attachments: jsonb("attachments"), // JSON array of file URLs
  isConfidential: boolean("is_confidential").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Prescriptions
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  medications: jsonb("medications").notNull(), // JSON array of medications with dosage, frequency, duration
  instructions: text("instructions"),
  status: text("status").default("active"), // 'active', 'completed', 'cancelled'
  validUntil: timestamp("valid_until"),
  digitalSignature: text("digital_signature"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lab Tests
export const labTests = pgTable("lab_tests", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  testName: text("test_name").notNull(),
  testType: text("test_type").notNull(),
  status: text("status").default("ordered"), // 'ordered', 'sample_collected', 'in_progress', 'completed'
  labProvider: text("lab_provider"),
  scheduledDate: timestamp("scheduled_date"),
  results: jsonb("results"), // JSON object with test results
  normalRanges: jsonb("normal_ranges"),
  reportUrl: text("report_url"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  insuranceCovered: boolean("insurance_covered").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Consultations
export const aiConsultations = pgTable("ai_consultations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  symptoms: jsonb("symptoms").notNull(), // JSON array of symptoms
  riskFactors: jsonb("risk_factors"),
  aiAnalysis: jsonb("ai_analysis"), // JSON object with AI recommendations
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
  recommendedActions: jsonb("recommended_actions"),
  doctorReview: text("doctor_review"),
  status: text("status").default("pending"), // 'pending', 'reviewed', 'dismissed'
  createdAt: timestamp("created_at").defaultNow(),
});

// Insurance Claims
export const insuranceClaims = pgTable("insurance_claims", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  labTestId: integer("lab_test_id").references(() => labTests.id),
  claimAmount: decimal("claim_amount", { precision: 10, scale: 2 }).notNull(),
  approvedAmount: decimal("approved_amount", { precision: 10, scale: 2 }),
  status: text("status").default("submitted"), // 'submitted', 'processing', 'approved', 'rejected'
  claimNumber: text("claim_number").unique(),
  submittedDate: timestamp("submitted_date").defaultNow(),
  processedDate: timestamp("processed_date"),
  notes: text("notes"),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  doctor: one(doctors, { fields: [users.id], references: [doctors.userId] }),
  patient: one(patients, { fields: [users.id], references: [patients.userId] }),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, { fields: [doctors.userId], references: [users.id] }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
  prescriptions: many(prescriptions),
  labTests: many(labTests),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, { fields: [patients.userId], references: [users.id] }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
  prescriptions: many(prescriptions),
  labTests: many(labTests),
  aiConsultations: many(aiConsultations),
  insuranceClaims: many(insuranceClaims),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  patient: one(patients, { fields: [appointments.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [appointments.doctorId], references: [doctors.id] }),
  medicalRecords: many(medicalRecords),
  prescriptions: many(prescriptions),
  insuranceClaims: many(insuranceClaims),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(patients, { fields: [medicalRecords.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [medicalRecords.doctorId], references: [doctors.id] }),
  appointment: one(appointments, { fields: [medicalRecords.appointmentId], references: [appointments.id] }),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  patient: one(patients, { fields: [prescriptions.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [prescriptions.doctorId], references: [doctors.id] }),
  appointment: one(appointments, { fields: [prescriptions.appointmentId], references: [appointments.id] }),
}));

export const labTestsRelations = relations(labTests, ({ one, many }) => ({
  patient: one(patients, { fields: [labTests.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [labTests.doctorId], references: [doctors.id] }),
  insuranceClaims: many(insuranceClaims),
}));

export const aiConsultationsRelations = relations(aiConsultations, ({ one }) => ({
  patient: one(patients, { fields: [aiConsultations.patientId], references: [patients.id] }),
}));

export const insuranceClaimsRelations = relations(insuranceClaims, ({ one }) => ({
  patient: one(patients, { fields: [insuranceClaims.patientId], references: [patients.id] }),
  appointment: one(appointments, { fields: [insuranceClaims.appointmentId], references: [appointments.id] }),
  labTest: one(labTests, { fields: [insuranceClaims.labTestId], references: [labTests.id] }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  createdAt: true,
});

export const insertLabTestSchema = createInsertSchema(labTests).omit({
  id: true,
  createdAt: true,
});

export const insertAiConsultationSchema = createInsertSchema(aiConsultations).omit({
  id: true,
  createdAt: true,
});

export const insertInsuranceClaimSchema = createInsertSchema(insuranceClaims).omit({
  id: true,
  submittedDate: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;

export type LabTest = typeof labTests.$inferSelect;
export type InsertLabTest = z.infer<typeof insertLabTestSchema>;

export type AiConsultation = typeof aiConsultations.$inferSelect;
export type InsertAiConsultation = z.infer<typeof insertAiConsultationSchema>;

export type InsuranceClaim = typeof insuranceClaims.$inferSelect;
export type InsertInsuranceClaim = z.infer<typeof insertInsuranceClaimSchema>;