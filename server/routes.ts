import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertDoctorSchema, insertPatientSchema, insertAppointmentSchema, insertMedicalRecordSchema, insertPrescriptionSchema, insertLabTestSchema, insertAiConsultationSchema, insertInsuranceClaimSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to authenticate JWT tokens
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User created successfully',
        user: { ...user, password: undefined },
        token,
      });
    } catch (error) {
      res.status(400).json({ message: 'Invalid user data', error });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        user: { ...user, password: undefined },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error });
    }
  });

  // User routes
  app.get('/api/users/me', authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user', error });
    }
  });

  // Doctor routes
  app.post('/api/doctors', authenticateToken, async (req, res) => {
    try {
      const doctorData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(doctorData);
      res.status(201).json(doctor);
    } catch (error) {
      res.status(400).json({ message: 'Invalid doctor data', error });
    }
  });

  app.get('/api/doctors', async (req, res) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get doctors', error });
    }
  });

  app.get('/api/doctors/:id', async (req, res) => {
    try {
      const doctor = await storage.getDoctor(parseInt(req.params.id));
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get doctor', error });
    }
  });

  // Patient routes
  app.post('/api/patients', authenticateToken, async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ message: 'Invalid patient data', error });
    }
  });

  app.get('/api/patients', authenticateToken, async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get patients', error });
    }
  });

  app.get('/api/patients/:id', authenticateToken, async (req, res) => {
    try {
      const patient = await storage.getPatient(parseInt(req.params.id));
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get patient', error });
    }
  });

  app.post('/api/patients/verify-aadhaar', authenticateToken, async (req, res) => {
    try {
      const { patientId, aadhaarNumber } = req.body;
      
      // Simulate Aadhaar verification (in real implementation, integrate with UIDAI API)
      const isValid = aadhaarNumber && aadhaarNumber.length === 12;
      
      if (isValid) {
        await storage.updatePatient(patientId, {
          aadhaarNumber,
          aadhaarVerified: true,
        });
        res.json({ message: 'Aadhaar verified successfully', verified: true });
      } else {
        res.status(400).json({ message: 'Invalid Aadhaar number', verified: false });
      }
    } catch (error) {
      res.status(500).json({ message: 'Aadhaar verification failed', error });
    }
  });

  // Appointment routes
  app.post('/api/appointments', authenticateToken, async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ message: 'Invalid appointment data', error });
    }
  });

  app.get('/api/appointments/doctor/:doctorId', authenticateToken, async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByDoctor(parseInt(req.params.doctorId));
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get appointments', error });
    }
  });

  app.get('/api/appointments/doctor/:doctorId/today', authenticateToken, async (req, res) => {
    try {
      const appointments = await storage.getTodaysAppointments(parseInt(req.params.doctorId));
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get today\'s appointments', error });
    }
  });

  app.patch('/api/appointments/:id', authenticateToken, async (req, res) => {
    try {
      const appointment = await storage.updateAppointment(parseInt(req.params.id), req.body);
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update appointment', error });
    }
  });

  // Medical Records routes
  app.post('/api/medical-records', authenticateToken, async (req, res) => {
    try {
      const recordData = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: 'Invalid medical record data', error });
    }
  });

  app.get('/api/medical-records/patient/:patientId', authenticateToken, async (req, res) => {
    try {
      const records = await storage.getMedicalRecordsByPatient(parseInt(req.params.patientId));
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get medical records', error });
    }
  });

  app.get('/api/medical-records/doctor/:doctorId', authenticateToken, async (req, res) => {
    try {
      const records = await storage.getMedicalRecordsByDoctor(parseInt(req.params.doctorId));
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get medical records', error });
    }
  });

  // Prescription routes
  app.post('/api/prescriptions', authenticateToken, async (req, res) => {
    try {
      const prescriptionData = insertPrescriptionSchema.parse(req.body);
      const prescription = await storage.createPrescription(prescriptionData);
      res.status(201).json(prescription);
    } catch (error) {
      res.status(400).json({ message: 'Invalid prescription data', error });
    }
  });

  app.get('/api/prescriptions/doctor/:doctorId', authenticateToken, async (req, res) => {
    try {
      const prescriptions = await storage.getPrescriptionsByDoctor(parseInt(req.params.doctorId));
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get prescriptions', error });
    }
  });

  // Lab Test routes
  app.post('/api/lab-tests', authenticateToken, async (req, res) => {
    try {
      const labTestData = insertLabTestSchema.parse(req.body);
      const labTest = await storage.createLabTest(labTestData);
      res.status(201).json(labTest);
    } catch (error) {
      res.status(400).json({ message: 'Invalid lab test data', error });
    }
  });

  app.get('/api/lab-tests/doctor/:doctorId', authenticateToken, async (req, res) => {
    try {
      const labTests = await storage.getLabTestsByDoctor(parseInt(req.params.doctorId));
      res.json(labTests);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get lab tests', error });
    }
  });

  app.get('/api/lab-tests/doctor/:doctorId/pending', authenticateToken, async (req, res) => {
    try {
      const pendingTests = await storage.getPendingLabTests(parseInt(req.params.doctorId));
      res.json(pendingTests);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get pending lab tests', error });
    }
  });

  // AI Consultation routes
  app.post('/api/ai-consultations', authenticateToken, async (req, res) => {
    try {
      const consultationData = insertAiConsultationSchema.parse(req.body);
      
      // Simulate AI analysis (in real implementation, integrate with AI/ML service)
      const aiAnalysis = {
        possibleConditions: [
          { condition: "Common Cold", probability: 0.7 },
          { condition: "Allergic Rhinitis", probability: 0.3 }
        ],
        severity: "Low",
        urgency: "Non-urgent",
      };

      const consultation = await storage.createAiConsultation({
        ...consultationData,
        aiAnalysis,
        confidenceScore: "0.75",
        recommendedActions: [
          "Rest and hydration",
          "Over-the-counter pain relief if needed",
          "Consult doctor if symptoms persist"
        ],
      });

      res.status(201).json(consultation);
    } catch (error) {
      res.status(400).json({ message: 'Invalid consultation data', error });
    }
  });

  app.get('/api/ai-consultations/patient/:patientId', authenticateToken, async (req, res) => {
    try {
      const consultations = await storage.getAiConsultationsByPatient(parseInt(req.params.patientId));
      res.json(consultations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get AI consultations', error });
    }
  });

  // Insurance Claims routes
  app.post('/api/insurance-claims', authenticateToken, async (req, res) => {
    try {
      const claimData = insertInsuranceClaimSchema.parse(req.body);
      const claimNumber = `CLM${Date.now()}`;
      const claim = await storage.createInsuranceClaim({
        ...claimData,
        claimNumber,
      });
      res.status(201).json(claim);
    } catch (error) {
      res.status(400).json({ message: 'Invalid claim data', error });
    }
  });

  // Demo routes for development - returns mock data without authentication
  app.get('/api/demo/dashboard/stats/:doctorId', async (req, res) => {
    res.json({
      todayAppointments: 8,
      activePatients: 142,
      pendingLabs: 5,
      aiConsultations: 23
    });
  });

  app.get('/api/demo/appointments/doctor/:doctorId/today', async (req, res) => {
    res.json([
      {
        id: 1,
        patientName: "Dr. Priya Sharma",
        patientAvatar: "PS",
        time: "09:00 AM",
        reason: "Regular Checkup",
        aadhaar: "****-****-1234",
        status: "scheduled",
        type: "in-person"
      },
      {
        id: 2,
        patientName: "Raj Kumar",
        patientAvatar: "RK",
        time: "10:30 AM",
        reason: "Follow-up Consultation",
        aadhaar: "****-****-5678",
        status: "current",
        type: "telemedicine"
      },
      {
        id: 3,
        patientName: "Anita Desai",
        patientAvatar: "AD",
        time: "02:15 PM",
        reason: "Diabetes Management",
        aadhaar: "****-****-9101",
        status: "scheduled",
        type: "in-person"
      }
    ]);
  });

  app.get('/api/demo/patients', async (req, res) => {
    res.json([
      {
        id: 1,
        name: "Dr. Priya Sharma",
        age: 45,
        avatar: "PS",
        aadhaarStatus: "verified",
        lastVisit: "2024-01-15",
        insurance: "CGHS"
      },
      {
        id: 2,
        name: "Raj Kumar",
        age: 32,
        avatar: "RK",
        aadhaarStatus: "verified",
        lastVisit: "2024-01-10",
        insurance: "Private"
      },
      {
        id: 3,
        name: "Anita Desai",
        age: 58,
        avatar: "AD",
        aadhaarStatus: "pending",
        lastVisit: "2024-01-08",
        insurance: "ESI"
      }
    ]);
  });

  app.get('/api/demo/medical-records/doctor/:doctorId', async (req, res) => {
    res.json([
      {
        id: 1,
        patientName: "Dr. Priya Sharma",
        type: "Consultation",
        date: "2024-01-15",
        icon: "FileText",
        color: "blue"
      },
      {
        id: 2,
        patientName: "Raj Kumar",
        type: "Lab Results",
        date: "2024-01-10",
        icon: "Activity",
        color: "green"
      }
    ]);
  });

  app.get('/api/demo/prescriptions/doctor/:doctorId', async (req, res) => {
    res.json([
      {
        id: 1,
        patientName: "Dr. Priya Sharma",
        medication: "Metformin",
        dosage: "500mg",
        duration: "30 days",
        date: "2024-01-15",
        status: "active"
      },
      {
        id: 2,
        patientName: "Raj Kumar",
        medication: "Lisinopril",
        dosage: "10mg",
        duration: "60 days",
        date: "2024-01-10",
        status: "active"
      }
    ]);
  });

  app.get('/api/demo/doctors', async (req, res) => {
    res.json([
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Cardiology",
        medicalCouncilId: "MC123456"
      },
      {
        id: 2,
        name: "Dr. Michael Chen",
        specialization: "Internal Medicine", 
        medicalCouncilId: "MC789012"
      },
      {
        id: 3,
        name: "Dr. Emily Rodriguez",
        specialization: "Pediatrics",
        medicalCouncilId: "MC345678"
      }
    ]);
  });

  // Demo form submission endpoints
  app.post('/api/demo/appointments', async (req, res) => {
    const appointmentData = req.body;
    res.status(201).json({
      id: Date.now(),
      ...appointmentData,
      status: "scheduled",
      createdAt: new Date().toISOString()
    });
  });

  app.post('/api/demo/patients', async (req, res) => {
    const patientData = req.body;
    res.status(201).json({
      id: Date.now(),
      ...patientData,
      aadhaarStatus: "pending",
      createdAt: new Date().toISOString()
    });
  });

  app.post('/api/demo/prescriptions', async (req, res) => {
    const prescriptionData = req.body;
    res.status(201).json({
      id: Date.now(),
      ...prescriptionData,
      status: "active",
      createdAt: new Date().toISOString()
    });
  });

  app.post('/api/demo/lab-tests', async (req, res) => {
    const labTestData = req.body;
    res.status(201).json({
      id: Date.now(),
      ...labTestData,
      status: "ordered",
      createdAt: new Date().toISOString()
    });
  });

  app.post('/api/demo/ai-consultations', async (req, res) => {
    try {
      const consultationData = req.body;
      
      // Import OpenAI service
      const { analyzeSymptoms } = await import('./openai');
      
      // Perform real AI analysis
      const analysis = await analyzeSymptoms({
        symptoms: consultationData.symptoms || [],
        duration: consultationData.duration || "Unknown",
        severity: consultationData.severity || "Medium",
        riskFactors: consultationData.riskFactors || [],
        additionalInfo: consultationData.additionalInfo || ""
      });

      res.status(201).json({
        id: Date.now(),
        patientId: consultationData.patientId,
        symptoms: consultationData.symptoms,
        aiAnalysis: {
          possibleConditions: analysis.possibleConditions,
          severity: analysis.severity,
          urgency: analysis.urgency
        },
        recommendedActions: analysis.recommendedActions,
        confidenceScore: analysis.confidenceScore.toString(),
        status: "completed",
        disclaimerNote: analysis.disclaimerNote,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI consultation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ 
        message: "Failed to analyze symptoms", 
        error: errorMessage
      });
    }
  });

  // Health insights endpoint using OpenAI
  app.post('/api/demo/health-insights', async (req, res) => {
    try {
      const { symptoms, patientHistory } = req.body;
      
      const { getHealthInsights } = await import('./openai');
      
      const insights = await getHealthInsights(symptoms || [], patientHistory);
      
      res.json({
        insights,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Health insights error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ 
        message: "Failed to generate health insights", 
        error: errorMessage
      });
    }
  });

  // Symptom Checker endpoint (mentioned in README)
  app.post('/api/symptom-checker', authenticateToken, async (req, res) => {
    try {
      const { symptoms, duration, severity, riskFactors, additionalInfo } = req.body;
      
      const { analyzeSymptoms } = await import('./openai');
      
      const analysis = await analyzeSymptoms({
        symptoms: symptoms || [],
        duration: duration || "Unknown",
        severity: severity || "Medium",
        riskFactors: riskFactors || [],
        additionalInfo: additionalInfo || ""
      });

      res.json(analysis);
    } catch (error) {
      console.error("Symptom checker error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ 
        message: "Failed to analyze symptoms", 
        error: errorMessage
      });
    }
  });

  // Multilingual Voice Assistant endpoint for Indian languages
  app.post('/api/voice-assistant', authenticateToken, async (req, res) => {
    try {
      const { transcript, language, context } = req.body;
      
      // Multilingual intent recognition for Indian healthcare
      const multilingualIntents = {
        english: {
          'go to appointments': { action: 'navigate', target: '/appointments', response: 'Opening appointments' },
          'check symptoms': { action: 'navigate', target: '/ai-checker', response: 'Opening symptom checker' },
          'emergency': { action: 'emergency', target: 'call_108', response: 'Calling emergency services' },
          'call 108': { action: 'emergency', target: 'call_108', response: 'Calling 108 ambulance service' },
          'book appointment': { action: 'navigate', target: '/appointments', response: 'Opening appointment booking' },
          'find doctor': { action: 'navigate', target: '/doctors', response: 'Showing available doctors' },
          'health records': { action: 'navigate', target: '/records', response: 'Opening health records' },
          'family health': { action: 'navigate', target: '/family', response: 'Opening family health' },
          'medicine reminder': { action: 'navigate', target: '/prescriptions', response: 'Opening medicine reminders' }
        },
        hindi: {
          'अपॉइंटमेंट पर जाएं': { action: 'navigate', target: '/appointments', response: 'अपॉइंटमेंट खोल रहे हैं' },
          'लक्षण जांचें': { action: 'navigate', target: '/ai-checker', response: 'लक्षण चेकर खोल रहे हैं' },
          'आपातकाल': { action: 'emergency', target: 'call_108', response: 'आपातकालीन सेवा बुला रहे हैं' },
          '108 कॉल करें': { action: 'emergency', target: 'call_108', response: '108 एम्बुलेंस सेवा बुला रहे हैं' },
          'डॉक्टर खोजें': { action: 'navigate', target: '/doctors', response: 'उपलब्ध डॉक्टर दिखा रहे हैं' },
          'स्वास्थ्य रिकॉर्ड': { action: 'navigate', target: '/records', response: 'स्वास्थ्य रिकॉर्ड खोल रहे हैं' },
          'दवा रिमाइंडर': { action: 'navigate', target: '/prescriptions', response: 'दवा रिमाइंडर खोल रहे हैं' }
        },
        tamil: {
          'சந்திப்புகளுக்கு செல்': { action: 'navigate', target: '/appointments', response: 'சந்திப்புகளைத் திறக்கிறோம்' },
          'அறிகுறிகளைச் சரிபார்': { action: 'navigate', target: '/ai-checker', response: 'அறிகுறி சரிபார்ப்பாளரைத் திறக்கிறோம்' },
          'அவசரநிலை': { action: 'emergency', target: 'call_108', response: 'அவசர சேவையை அழைக்கிறோம்' },
          '108 அழைக்கவும்': { action: 'emergency', target: 'call_108', response: '108 ஆம்புலன்ஸ் சேவையை அழைக்கிறோம்' },
          'மருத்துவர் கண்டுபிடி': { action: 'navigate', target: '/doctors', response: 'கிடைக்கும் மருத்துவர்களைக் காட்டுகிறோம்' },
          'உடல்நலம் பதிவுகள்': { action: 'navigate', target: '/records', response: 'உடல்நலம் பதிவுகளைத் திறக்கிறோம்' }
        },
        telugu: {
          'అపాయింట్‌మెంట్‌లకు వెళ్లండి': { action: 'navigate', target: '/appointments', response: 'అపాయింట్‌మెంట్‌లను తెరుస్తున్నాం' },
          'లక్షణాలు తనిఖీ చేయండి': { action: 'navigate', target: '/ai-checker', response: 'లక్షణ చెకర్‌ను తెరుస్తున్నాం' },
          'అత్యవసరం': { action: 'emergency', target: 'call_108', response: 'అత్యవసర సేవలను పిలుస్తున్నాం' },
          '108 కాల్ చేయండి': { action: 'emergency', target: 'call_108', response: '108 అంబులెన్స్ సేవను పిలుస్తున్నాం' },
          'వైద్యుడిని కనుగొనండి': { action: 'navigate', target: '/doctors', response: 'అందుబాటులో ఉన్న వైద్యులను చూపిస్తున్నాం' },
          'ఆరోగ్య రికార్డులు': { action: 'navigate', target: '/records', response: 'ఆరోగ్య రికార్డులను తెరుస్తున్నాం' }
        }
      };

      const selectedLanguage = language || 'english';
      const intents = multilingualIntents[selectedLanguage] || multilingualIntents.english;
      
      const lowerTranscript = transcript.toLowerCase();
      let matchedIntent = null;

      for (const [command, intent] of Object.entries(intents)) {
        if (lowerTranscript.includes(command.toLowerCase())) {
          matchedIntent = intent;
          break;
        }
      }

      if (matchedIntent) {
        res.json({
          success: true,
          intent: matchedIntent,
          response: matchedIntent.response,
          language: selectedLanguage,
          transcript: transcript
        });
      } else {
        const fallbackMessages = {
          english: "Sorry, I didn't understand that command. Try saying 'go to appointments' or 'check symptoms'.",
          hindi: "खुशी, मैं वह कमांड समझ नहीं पाया। 'अपॉइंटमेंट पर जाएं' या 'लक्षण जांचें' कहने की कोशिश करें।",
          tamil: "மன்னிக்கவும், அந்த கட்டளையை என்னால் புரிந்து கொள்ள முடியவில்லை। 'சந்திப்புகளுக்கு செல்' அல்லது 'அறிகுறிகளைச் சரிபார்' என்று சொல்ல முயற்சி செய்யுங்கள்।",
          telugu: "క్షమించండి, ఆ కమాండ్ నాకు అర్థం కాలేదు. 'అపాయింట్‌మెంట్‌లకు వెళ్లండి' లేదా 'లక్షణాలు తనిఖీ చేయండి' అని చెప్పడానికి ప్రయత్నించండి."
        };
        
        res.json({
          success: false,
          message: fallbackMessages[selectedLanguage] || fallbackMessages.english,
          language: selectedLanguage
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Voice assistant error', error });
    }
  });

  // Indian Emergency 108 service endpoint with multilingual support
  app.post('/api/emergency/108', authenticateToken, async (req, res) => {
    try {
      const { patientId, location, emergency_type, language } = req.body;
      
      // In a real implementation, this would integrate with actual Indian emergency services
      const emergencyCall = {
        id: Date.now(),
        patientId,
        location: location || "Location not provided",
        emergency_type: emergency_type || "Medical Emergency",
        status: "dispatched",
        call_time: new Date().toISOString(),
        estimated_arrival: "15-20 minutes",
        ambulance_type: "108 Free Ambulance Service",
        contact_number: "108"
      };

      const responseMessages = {
        english: "Emergency services contacted. 108 ambulance is on the way.",
        hindi: "आपातकालीन सेवाओं से संपर्क किया गया। 108 एम्बुलेंस रास्ते में है।",
        tamil: "அவசர சேவைகளைத் தொடர்பு கொண்டோம். 108 ஆம்புலன்ஸ் வருகிறது.",
        telugu: "అత్యవసర సేవలను సంప్రదించాము. 108 అంబులెన్స్ రాబోతోంది."
      };

      res.json({
        success: true,
        message: responseMessages[language || 'english'] || responseMessages.english,
        call_details: emergencyCall,
        instructions: {
          english: "Stay calm. Keep the patient stable. Do not move if spinal injury is suspected.",
          hindi: "शांत रहें। रोगी को स्थिर रखें। रीढ़ की चोट का संदेह हो तो हिलाएं नहीं।",
          tamil: "அமைதியாக இருங்கள். நோயாளியை நிலையாக வைத்திருங்கள். முதுகுத்தண்டு காயம் சந்தேகம் இருந்தால் நகர்த்த வேண்டாம்।",
          telugu: "ప్రశాంతంగా ఉండండి. రోగిని స్థిరంగా ఉంచండి. వెన్నెముక గాయం అనుమానం ఉంటే కదిలించవద్దు."
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Emergency service error', error });
    }
  });

  // Patient dashboard data endpoint (mentioned in README)
  app.get('/api/dashboard/patient-data', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const patient = await storage.getPatientByUserId(userId);
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Gather comprehensive patient data
      const appointments = await storage.getAppointmentsByPatient(patient.id);
      const medicalRecords = await storage.getMedicalRecordsByPatient(patient.id);
      const prescriptions = await storage.getPrescriptionsByPatient(patient.id);
      const labTests = await storage.getLabTestsByPatient(patient.id);
      const aiConsultations = await storage.getAiConsultationsByPatient(patient.id);

      res.json({
        patient: { ...patient, aadhaarNumber: undefined }, // Hide sensitive Aadhaar number
        appointments: appointments.slice(0, 5), // Recent 5 appointments
        medicalRecords: medicalRecords.slice(0, 10), // Recent 10 records
        prescriptions: prescriptions.filter(p => p.status === 'active'), // Active prescriptions
        labTests: labTests.slice(0, 5), // Recent 5 lab tests
        aiConsultations: aiConsultations.slice(0, 3), // Recent 3 AI consultations
        summary: {
          totalAppointments: appointments.length,
          activeSharedPrescriptions: prescriptions.filter(p => p.status === 'active').length,
          pendingLabTests: labTests.filter(l => l.status === 'pending').length,
          recentAiConsultations: aiConsultations.length
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get patient data', error });
    }
  });

  // Family Health Management endpoints for Indian healthcare
  app.post('/api/family-members', authenticateToken, async (req: any, res) => {
    try {
      const { patientId, name, relation, age, aadhaarNumber, bloodGroup, allergies } = req.body;
      
      // In a real implementation, this would create family member records
      const familyMember = {
        id: Date.now(),
        patientId,
        name,
        relation,
        age,
        aadhaarNumber: aadhaarNumber || null,
        bloodGroup: bloodGroup || "Unknown",
        allergies: allergies || [],
        emergencyContact: true,
        createdAt: new Date().toISOString()
      };

      res.status(201).json(familyMember);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add family member', error });
    }
  });

  app.get('/api/family-members/:patientId', authenticateToken, async (req, res) => {
    try {
      // Mock family members for demo
      const familyMembers = [
        {
          id: 1,
          name: "राधा शर्मा",
          relation: "Mother",
          age: 58,
          bloodGroup: "O+",
          aadhaarVerified: true,
          healthStatus: "Good",
          lastCheckup: "2024-01-10"
        },
        {
          id: 2,
          name: "அருண் குமார்",
          relation: "Father", 
          age: 62,
          bloodGroup: "B+",
          aadhaarVerified: true,
          healthStatus: "Diabetes monitoring",
          lastCheckup: "2024-01-08"
        }
      ];

      res.json(familyMembers);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get family members', error });
    }
  });

  // Insurance and Claims Management (Indian healthcare context)
  app.post('/api/insurance/verify-eligibility', authenticateToken, async (req, res) => {
    try {
      const { aadhaarNumber, insuranceProvider, policyNumber } = req.body;
      
      // Mock insurance verification for Indian providers
      const eligibilityCheck = {
        eligible: true,
        provider: insuranceProvider || "CGHS",
        policyNumber: policyNumber || "POL123456789",
        coverageAmount: "₹5,00,000",
        validUntil: "2025-03-31",
        networkHospitals: 2500,
        claimsUsed: "₹45,000",
        remainingCoverage: "₹4,55,000"
      };

      res.json(eligibilityCheck);
    } catch (error) {
      res.status(500).json({ message: 'Failed to verify insurance eligibility', error });
    }
  });

  // Aadhaar-based patient lookup (Indian healthcare)
  app.post('/api/patients/lookup-aadhaar', authenticateToken, async (req, res) => {
    try {
      const { aadhaarNumber } = req.body;
      
      // Mock Aadhaar-based patient lookup
      if (aadhaarNumber && aadhaarNumber.length === 12) {
        const patient = {
          found: true,
          patient: {
            id: 1,
            name: "प्रिया शर्मा",
            age: 35,
            aadhaarNumber: aadhaarNumber,
            verified: true,
            address: "Mumbai, Maharashtra",
            emergencyContact: "+91-9876543210",
            bloodGroup: "A+",
            allergies: ["Penicillin"],
            chronicConditions: ["Hypertension"]
          }
        };
        res.json(patient);
      } else {
        res.status(404).json({ found: false, message: "Patient not found with provided Aadhaar number" });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to lookup patient', error });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats/:doctorId', authenticateToken, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(parseInt(req.params.doctorId));
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get dashboard stats', error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}