import { 
  users, doctors, patients, appointments, medicalRecords, 
  prescriptions, labTests, aiConsultations, insuranceClaims,
  type User, type Doctor, type Patient, type Appointment, 
  type MedicalRecord, type Prescription, type LabTest, 
  type AiConsultation, type InsuranceClaim,
  type InsertUser, type InsertDoctor, type InsertPatient, 
  type InsertAppointment, type InsertMedicalRecord, 
  type InsertPrescription, type InsertLabTest, 
  type InsertAiConsultation, type InsertInsuranceClaim
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, gte, lte, count } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

  // Doctor management
  getDoctor(id: number): Promise<Doctor | undefined>;
  getDoctorByUserId(userId: number): Promise<Doctor | undefined>;
  getDoctorByMedicalCouncilId(councilId: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor>;
  getAllDoctors(): Promise<Doctor[]>;

  // Patient management
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByUserId(userId: number): Promise<Patient | undefined>;
  getPatientByAadhaar(aadhaarNumber: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient>;
  getAllPatients(): Promise<Patient[]>;

  // Appointment management
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: number): Promise<Appointment[]>;
  getTodaysAppointments(doctorId: number): Promise<Appointment[]>;
  getUpcomingAppointments(doctorId: number): Promise<Appointment[]>;

  // Medical Records management
  getMedicalRecord(id: number): Promise<MedicalRecord | undefined>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord>;
  getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]>;
  getMedicalRecordsByDoctor(doctorId: number): Promise<MedicalRecord[]>;

  // Prescription management
  getPrescription(id: number): Promise<Prescription | undefined>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  updatePrescription(id: number, prescription: Partial<InsertPrescription>): Promise<Prescription>;
  getPrescriptionsByPatient(patientId: number): Promise<Prescription[]>;
  getPrescriptionsByDoctor(doctorId: number): Promise<Prescription[]>;

  // Lab Test management
  getLabTest(id: number): Promise<LabTest | undefined>;
  createLabTest(labTest: InsertLabTest): Promise<LabTest>;
  updateLabTest(id: number, labTest: Partial<InsertLabTest>): Promise<LabTest>;
  getLabTestsByPatient(patientId: number): Promise<LabTest[]>;
  getLabTestsByDoctor(doctorId: number): Promise<LabTest[]>;
  getPendingLabTests(doctorId: number): Promise<LabTest[]>;

  // AI Consultation management
  getAiConsultation(id: number): Promise<AiConsultation | undefined>;
  createAiConsultation(consultation: InsertAiConsultation): Promise<AiConsultation>;
  updateAiConsultation(id: number, consultation: Partial<InsertAiConsultation>): Promise<AiConsultation>;
  getAiConsultationsByPatient(patientId: number): Promise<AiConsultation[]>;

  // Insurance Claims management
  getInsuranceClaim(id: number): Promise<InsuranceClaim | undefined>;
  createInsuranceClaim(claim: InsertInsuranceClaim): Promise<InsuranceClaim>;
  updateInsuranceClaim(id: number, claim: Partial<InsertInsuranceClaim>): Promise<InsuranceClaim>;
  getInsuranceClaimsByPatient(patientId: number): Promise<InsuranceClaim[]>;

  // Dashboard statistics
  getDashboardStats(doctorId: number): Promise<{
    todayAppointments: number;
    activePatients: number;
    pendingLabs: number;
    aiConsultations: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Doctor management
  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor || undefined;
  }

  async getDoctorByUserId(userId: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
    return doctor || undefined;
  }

  async getDoctorByMedicalCouncilId(councilId: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.medicalCouncilId, councilId));
    return doctor || undefined;
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const [newDoctor] = await db.insert(doctors).values(doctor).returning();
    return newDoctor;
  }

  async updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor> {
    const [updatedDoctor] = await db
      .update(doctors)
      .set(doctor)
      .where(eq(doctors.id, id))
      .returning();
    return updatedDoctor;
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  // Patient management
  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async getPatientByUserId(userId: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.userId, userId));
    return patient || undefined;
  }

  async getPatientByAadhaar(aadhaarNumber: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.aadhaarNumber, aadhaarNumber));
    return patient || undefined;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient> {
    const [updatedPatient] = await db
      .update(patients)
      .set(patient)
      .where(eq(patients.id, id))
      .returning();
    return updatedPatient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  // Appointment management
  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set(appointment)
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId)).orderBy(desc(appointments.appointmentDate));
  }

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.patientId, patientId)).orderBy(desc(appointments.appointmentDate));
  }

  async getTodaysAppointments(doctorId: number): Promise<Appointment[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          gte(appointments.appointmentDate, startOfDay),
          lte(appointments.appointmentDate, endOfDay)
        )
      )
      .orderBy(appointments.appointmentDate);
  }

  async getUpcomingAppointments(doctorId: number): Promise<Appointment[]> {
    const now = new Date();
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          gte(appointments.appointmentDate, now),
          eq(appointments.status, "scheduled")
        )
      )
      .orderBy(appointments.appointmentDate);
  }

  // Medical Records management
  async getMedicalRecord(id: number): Promise<MedicalRecord | undefined> {
    const [record] = await db.select().from(medicalRecords).where(eq(medicalRecords.id, id));
    return record || undefined;
  }

  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const [newRecord] = await db.insert(medicalRecords).values(record).returning();
    return newRecord;
  }

  async updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord> {
    const [updatedRecord] = await db
      .update(medicalRecords)
      .set(record)
      .where(eq(medicalRecords.id, id))
      .returning();
    return updatedRecord;
  }

  async getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]> {
    return await db.select().from(medicalRecords).where(eq(medicalRecords.patientId, patientId)).orderBy(desc(medicalRecords.createdAt));
  }

  async getMedicalRecordsByDoctor(doctorId: number): Promise<MedicalRecord[]> {
    return await db.select().from(medicalRecords).where(eq(medicalRecords.doctorId, doctorId)).orderBy(desc(medicalRecords.createdAt));
  }

  // Prescription management
  async getPrescription(id: number): Promise<Prescription | undefined> {
    const [prescription] = await db.select().from(prescriptions).where(eq(prescriptions.id, id));
    return prescription || undefined;
  }

  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [newPrescription] = await db.insert(prescriptions).values(prescription).returning();
    return newPrescription;
  }

  async updatePrescription(id: number, prescription: Partial<InsertPrescription>): Promise<Prescription> {
    const [updatedPrescription] = await db
      .update(prescriptions)
      .set(prescription)
      .where(eq(prescriptions.id, id))
      .returning();
    return updatedPrescription;
  }

  async getPrescriptionsByPatient(patientId: number): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId)).orderBy(desc(prescriptions.createdAt));
  }

  async getPrescriptionsByDoctor(doctorId: number): Promise<Prescription[]> {
    return await db.select().from(prescriptions).where(eq(prescriptions.doctorId, doctorId)).orderBy(desc(prescriptions.createdAt));
  }

  // Lab Test management
  async getLabTest(id: number): Promise<LabTest | undefined> {
    const [labTest] = await db.select().from(labTests).where(eq(labTests.id, id));
    return labTest || undefined;
  }

  async createLabTest(labTest: InsertLabTest): Promise<LabTest> {
    const [newLabTest] = await db.insert(labTests).values(labTest).returning();
    return newLabTest;
  }

  async updateLabTest(id: number, labTest: Partial<InsertLabTest>): Promise<LabTest> {
    const [updatedLabTest] = await db
      .update(labTests)
      .set(labTest)
      .where(eq(labTests.id, id))
      .returning();
    return updatedLabTest;
  }

  async getLabTestsByPatient(patientId: number): Promise<LabTest[]> {
    return await db.select().from(labTests).where(eq(labTests.patientId, patientId)).orderBy(desc(labTests.createdAt));
  }

  async getLabTestsByDoctor(doctorId: number): Promise<LabTest[]> {
    return await db.select().from(labTests).where(eq(labTests.doctorId, doctorId)).orderBy(desc(labTests.createdAt));
  }

  async getPendingLabTests(doctorId: number): Promise<LabTest[]> {
    return await db
      .select()
      .from(labTests)
      .where(
        and(
          eq(labTests.doctorId, doctorId),
          or(
            eq(labTests.status, "ordered"),
            eq(labTests.status, "sample_collected"),
            eq(labTests.status, "in_progress")
          )
        )
      )
      .orderBy(desc(labTests.createdAt));
  }

  // AI Consultation management
  async getAiConsultation(id: number): Promise<AiConsultation | undefined> {
    const [consultation] = await db.select().from(aiConsultations).where(eq(aiConsultations.id, id));
    return consultation || undefined;
  }

  async createAiConsultation(consultation: InsertAiConsultation): Promise<AiConsultation> {
    const [newConsultation] = await db.insert(aiConsultations).values(consultation).returning();
    return newConsultation;
  }

  async updateAiConsultation(id: number, consultation: Partial<InsertAiConsultation>): Promise<AiConsultation> {
    const [updatedConsultation] = await db
      .update(aiConsultations)
      .set(consultation)
      .where(eq(aiConsultations.id, id))
      .returning();
    return updatedConsultation;
  }

  async getAiConsultationsByPatient(patientId: number): Promise<AiConsultation[]> {
    return await db.select().from(aiConsultations).where(eq(aiConsultations.patientId, patientId)).orderBy(desc(aiConsultations.createdAt));
  }

  // Insurance Claims management
  async getInsuranceClaim(id: number): Promise<InsuranceClaim | undefined> {
    const [claim] = await db.select().from(insuranceClaims).where(eq(insuranceClaims.id, id));
    return claim || undefined;
  }

  async createInsuranceClaim(claim: InsertInsuranceClaim): Promise<InsuranceClaim> {
    const [newClaim] = await db.insert(insuranceClaims).values(claim).returning();
    return newClaim;
  }

  async updateInsuranceClaim(id: number, claim: Partial<InsertInsuranceClaim>): Promise<InsuranceClaim> {
    const [updatedClaim] = await db
      .update(insuranceClaims)
      .set(claim)
      .where(eq(insuranceClaims.id, id))
      .returning();
    return updatedClaim;
  }

  async getInsuranceClaimsByPatient(patientId: number): Promise<InsuranceClaim[]> {
    return await db.select().from(insuranceClaims).where(eq(insuranceClaims.patientId, patientId)).orderBy(desc(insuranceClaims.submittedDate));
  }

  // Dashboard statistics
  async getDashboardStats(doctorId: number): Promise<{
    todayAppointments: number;
    activePatients: number;
    pendingLabs: number;
    aiConsultations: number;
  }> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const [todayAppointmentsResult] = await db
      .select({ count: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          gte(appointments.appointmentDate, startOfDay),
          lte(appointments.appointmentDate, endOfDay)
        )
      );

    const [activePatientsResult] = await db
      .select({ count: count() })
      .from(appointments)
      .where(eq(appointments.doctorId, doctorId));

    const [pendingLabsResult] = await db
      .select({ count: count() })
      .from(labTests)
      .where(
        and(
          eq(labTests.doctorId, doctorId),
          or(
            eq(labTests.status, "ordered"),
            eq(labTests.status, "sample_collected"),
            eq(labTests.status, "in_progress")
          )
        )
      );

    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const [aiConsultationsResult] = await db
      .select({ count: count() })
      .from(aiConsultations)
      .where(gte(aiConsultations.createdAt, startOfWeek));

    return {
      todayAppointments: todayAppointmentsResult.count,
      activePatients: activePatientsResult.count,
      pendingLabs: pendingLabsResult.count,
      aiConsultations: aiConsultationsResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
