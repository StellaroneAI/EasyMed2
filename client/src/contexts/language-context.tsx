import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = "english" | "hindi" | "tamil" | "telugu";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  english: {
    // Header Navigation
    "nav.dashboard": "Dashboard",
    "nav.patients": "Patients", 
    "nav.appointments": "Appointments",
    "nav.records": "Records",
    "nav.labTests": "Lab Tests",
    "nav.aiChecker": "AI Checker",
    "nav.family": "Family Health",
    
    // Language Selector
    "language.english": "English",
    "language.hindi": "हिंदी (Hindi)",
    "language.tamil": "தமிழ் (Tamil)", 
    "language.telugu": "తెలుగు (Telugu)",
    
    // Dashboard
    "dashboard.title": "Welcome to EasyMed",
    "dashboard.todayAppointments": "Today's Appointments",
    "dashboard.activePatients": "Active Patients", 
    "dashboard.labResults": "Lab Results",
    "dashboard.prescriptions": "Prescriptions",
    "dashboard.recentActivities": "Recent Activities",
    "dashboard.patientConsultation": "Patient Consultation",
    "dashboard.labResultsReceived": "Lab results received",
    "dashboard.appointmentScheduled": "Appointment scheduled",
    "dashboard.prescriptionIssued": "Prescription issued",
    
    // Patients
    "patients.title": "Patient Management",
    "patients.addPatient": "Add Patient",
    "patients.searchPatients": "Search patients by name or ID...",
    "patients.name": "Name",
    "patients.age": "Age",
    "patients.gender": "Gender", 
    "patients.aadhaar": "Aadhaar",
    "patients.phone": "Phone",
    "patients.actions": "Actions",
    "patients.view": "View",
    "patients.edit": "Edit",
    "patients.totalPatients": "Total Patients",
    "patients.aadhaarVerified": "Aadhaar Verified",
    "patients.pendingVerification": "Pending Verification",
    
    // Appointments 
    "appointments.title": "Appointment Management",
    "appointments.newAppointment": "New Appointment",
    "appointments.todaySchedule": "Today's Schedule",
    "appointments.patientName": "Patient Name",
    "appointments.time": "Time",
    "appointments.type": "Type",
    "appointments.status": "Status",
    "appointments.inPerson": "In-Person",
    "appointments.telemedicine": "Telemedicine",
    "appointments.scheduled": "Scheduled",
    "appointments.completed": "Completed",
    "appointments.cancelled": "Cancelled",
    "appointments.totalAppointments": "Total Appointments",
    "appointments.scheduleAppointment": "Schedule Appointment",
    "appointments.scheduleNew": "Schedule New Appointment",
    
    // AI Checker
    "aiChecker.title": "AI-Powered Symptom Checker",
    "aiChecker.enterSymptoms": "Enter symptoms to get AI analysis",
    "aiChecker.analyzeSymptoms": "Analyze Symptoms",
    "aiChecker.symptoms": "Symptoms",
    "aiChecker.analysis": "AI Analysis",
    "aiChecker.possibleConditions": "Possible Conditions",
    "aiChecker.severity": "Severity", 
    "aiChecker.urgency": "Urgency",
    "aiChecker.confidence": "Confidence",
    "aiChecker.recommendations": "Recommended Actions",
    "aiChecker.disclaimer": "Disclaimer",
    "aiChecker.consultations": "AI Consultations",
    "aiChecker.pendingReviews": "Pending Reviews",
    "aiChecker.avgConfidence": "Avg Confidence",
    
    // Family Health
    "family.title": "Family Health Management",
    "family.addMember": "Add Family Member",
    "family.relationship": "Relationship",
    "family.healthStatus": "Health Status",
    "family.lastCheckup": "Last Checkup",
    
    // Records
    "records.title": "Medical Records",
    "records.patientRecords": "Patient Records",
    "records.diagnosis": "Diagnosis", 
    "records.treatment": "Treatment",
    "records.notes": "Notes",
    "records.date": "Date",
    
    // Lab Tests
    "labTests.title": "Lab Test Management",
    "labTests.orderTest": "Order New Test",
    "labTests.testName": "Test Name",
    "labTests.provider": "Provider",
    "labTests.results": "Results",
    "labTests.pending": "Pending",
    "labTests.completed": "Completed",
    
    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.print": "Print",
    "common.emergency": "Emergency",
    "common.call108": "Call 108"
  },
  
  hindi: {
    // Header Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.patients": "मरीज़",
    "nav.appointments": "अपॉइंटमेंट",
    "nav.records": "रिकॉर्ड",
    "nav.labTests": "लैब टेस्ट",
    "nav.aiChecker": "AI चेकर",
    "nav.family": "पारिवारिक स्वास्थ्य",
    
    // Language Selector
    "language.english": "English",
    "language.hindi": "हिंदी (Hindi)",
    "language.tamil": "தமிழ் (Tamil)",
    "language.telugu": "తెలుగు (Telugu)",
    
    // Dashboard
    "dashboard.title": "EasyMed में आपका स्वागत है",
    "dashboard.todayAppointments": "आज के अपॉइंटमेंट",
    "dashboard.activePatients": "सक्रिय मरीज़",
    "dashboard.labResults": "लैब परिणाम", 
    "dashboard.prescriptions": "नुस्खे",
    "dashboard.recentActivities": "हाल की गतिविधियां",
    "dashboard.patientConsultation": "मरीज़ परामर्श",
    "dashboard.labResultsReceived": "लैब परिणाम प्राप्त",
    "dashboard.appointmentScheduled": "अपॉइंटमेंट निर्धारित",
    "dashboard.prescriptionIssued": "नुस्खा जारी",
    
    // Patients
    "patients.title": "मरीज़ प्रबंधन",
    "patients.addPatient": "मरीज़ जोड़ें",
    "patients.searchPatients": "नाम या ID से मरीज़ खोजें...",
    "patients.name": "नाम",
    "patients.age": "उम्र",
    "patients.gender": "लिंग",
    "patients.aadhaar": "आधार",
    "patients.phone": "फोन",
    "patients.actions": "कार्य",
    "patients.view": "देखें",
    "patients.edit": "संपादित करें",
    "patients.totalPatients": "कुल मरीज़",
    "patients.aadhaarVerified": "आधार सत्यापित",
    "patients.pendingVerification": "सत्यापन लंबित",
    
    // Appointments
    "appointments.title": "अपॉइंटमेंट प्रबंधन",
    "appointments.newAppointment": "नया अपॉइंटमेंट",
    "appointments.todaySchedule": "आज का कार्यक्रम",
    "appointments.patientName": "मरीज़ का नाम",
    "appointments.time": "समय",
    "appointments.type": "प्रकार",
    "appointments.status": "स्थिति",
    "appointments.inPerson": "व्यक्तिगत",
    "appointments.telemedicine": "टेलीमेडिसिन",
    "appointments.scheduled": "निर्धारित",
    "appointments.completed": "पूर्ण",
    "appointments.cancelled": "रद्द",
    "appointments.totalAppointments": "कुल अपॉइंटमेंट",
    "appointments.scheduleAppointment": "अपॉइंटमेंट निर्धारित करें",
    "appointments.scheduleNew": "नया अपॉइंटमेंट निर्धारित करें",
    
    // AI Checker
    "aiChecker.title": "AI-संचालित लक्षण चेकर",
    "aiChecker.enterSymptoms": "AI विश्लेषण के लिए लक्षण दर्ज करें",
    "aiChecker.analyzeSymptoms": "लक्षणों का विश्लेषण करें",
    "aiChecker.symptoms": "लक्षण",
    "aiChecker.analysis": "AI विश्लेषण",
    "aiChecker.possibleConditions": "संभावित स्थितियां",
    "aiChecker.severity": "गंभीरता",
    "aiChecker.urgency": "तात्कालिकता",
    "aiChecker.confidence": "विश्वास",
    "aiChecker.recommendations": "सुझाए गए कार्य",
    "aiChecker.disclaimer": "अस्वीकरण",
    "aiChecker.consultations": "AI परामर्श",
    "aiChecker.pendingReviews": "लंबित समीक्षाएं",
    "aiChecker.avgConfidence": "औसत विश्वसनीयता",
    
    // Family Health
    "family.title": "पारिवारिक स्वास्थ्य प्रबंधन",
    "family.addMember": "परिवारिक सदस्य जोड़ें",
    "family.relationship": "रिश्ता",
    "family.healthStatus": "स्वास्थ्य स्थिति",
    "family.lastCheckup": "अंतिम जांच",
    
    // Records
    "records.title": "चिकित्सा रिकॉर्ड",
    "records.patientRecords": "मरीज़ रिकॉर्ड",
    "records.diagnosis": "निदान",
    "records.treatment": "उपचार",
    "records.notes": "नोट्स",
    "records.date": "तारीख",
    
    // Lab Tests
    "labTests.title": "लैब टेस्ट प्रबंधन",
    "labTests.orderTest": "नया टेस्ट ऑर्डर करें",
    "labTests.testName": "टेस्ट का नाम",
    "labTests.provider": "प्रदाता",
    "labTests.results": "परिणाम",
    "labTests.pending": "लंबित",
    "labTests.completed": "पूर्ण",
    
    // Common
    "common.loading": "लोड हो रहा है...",
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.edit": "संपादित करें",
    "common.delete": "हटाएं",
    "common.view": "देखें",
    "common.search": "खोजें",
    "common.filter": "फिल्टर",
    "common.export": "निर्यात",
    "common.print": "प्रिंट",
    "common.emergency": "आपातकाल",
    "common.call108": "108 कॉल करें"
  },
  
  tamil: {
    // Header Navigation 
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.patients": "நோயாளிகள்",
    "nav.appointments": "சந்திப்புகள்",
    "nav.records": "பதிவுகள்",
    "nav.labTests": "ஆய்வக சோதனைகள்",
    "nav.aiChecker": "AI சரிபார்ப்பாளர்",
    "nav.family": "குடும்ப ஆரோக்கியம்",
    
    // Language Selector
    "language.english": "English",
    "language.hindi": "हिंदी (Hindi)",
    "language.tamil": "தமிழ் (Tamil)",
    "language.telugu": "తెలుగు (Telugu)",
    
    // Dashboard
    "dashboard.title": "EasyMed க்கு வரவேற்கிறோம்",
    "dashboard.todayAppointments": "இன்றைய சந்திப்புகள்",
    "dashboard.activePatients": "செயலில் உள்ள நோயாளிகள்",
    "dashboard.labResults": "ஆய்வக முடிவுகள்",
    "dashboard.prescriptions": "மருந்துச் சீட்டுகள்",
    "dashboard.recentActivities": "சமீபத்திய செயல்பாடுகள்",
    "dashboard.patientConsultation": "நோயாளி ஆலோசனை",
    "dashboard.labResultsReceived": "ஆய்வக முடிவுகள் பெறப்பட்டன",
    "dashboard.appointmentScheduled": "சந்திப்பு திட்டமிடப்பட்டது",
    "dashboard.prescriptionIssued": "மருந்துச் சீட்டு வழங்கப்பட்டது",
    
    // Patients
    "patients.title": "நோயாளி மேலாண்மை",
    "patients.addPatient": "நோயாளியைச் சேர்க்கவும்",
    "patients.searchPatients": "பெயர் அல்லது ID மூலம் நோயாளிகளைத் தேடுங்கள்...",
    "patients.name": "பெயர்",
    "patients.age": "வயது",
    "patients.gender": "பாலினம்",
    "patients.aadhaar": "ஆதார்",
    "patients.phone": "தொலைபேசி",
    "patients.actions": "செயல்கள்",
    "patients.view": "பார்க்கவும்",
    "patients.edit": "திருத்தவும்",
    "patients.totalPatients": "மொத்த நோயாளிகள்",
    "patients.aadhaarVerified": "ஆதார் சரிபார்க்கப்பட்டது",
    "patients.pendingVerification": "சரிபார்ப்பு நிலுவையில்",
    
    // Appointments
    "appointments.title": "சந்திப்பு மேலாண்மை",
    "appointments.newAppointment": "புதிய சந்திப்பு",
    "appointments.todaySchedule": "இன்றைய அட்டவணை",
    "appointments.patientName": "நோயாளியின் பெயர்",
    "appointments.time": "நேரம்",
    "appointments.type": "வகை",
    "appointments.status": "நிலை",
    "appointments.inPerson": "நேரடியாக",
    "appointments.telemedicine": "தொலை மருத்துவம்",
    "appointments.scheduled": "திட்டமிடப்பட்டது",
    "appointments.completed": "முடிந்தது",
    "appointments.cancelled": "ரத்து செய்யப்பட்டது",
    "appointments.totalAppointments": "மொத்த சந்திப்புகள்",
    "appointments.scheduleAppointment": "சந்திப்பை திட்டமிடுங்கள்",
    "appointments.scheduleNew": "புதிய சந்திப்பை திட்டமிடுங்கள்",
    
    // AI Checker
    "aiChecker.title": "AI-இயங்கும் அறிகுறி சரிபார்ப்பாளர்",
    "aiChecker.enterSymptoms": "AI பகுப்பாய்வுக்கு அறிகுறிகளை உள்ளிடவும்",
    "aiChecker.analyzeSymptoms": "அறிகுறிகளை பகுப்பாய்வு செய்யவும்",
    "aiChecker.symptoms": "அறிகுறிகள்",
    "aiChecker.analysis": "AI பகுப்பாய்வு",
    "aiChecker.possibleConditions": "சாத்தியமான நிலைமைகள்",
    "aiChecker.severity": "தீவிரம்",
    "aiChecker.urgency": "அவசரம்",
    "aiChecker.confidence": "நம்பிக்கை",
    "aiChecker.recommendations": "பரிந்துரைக்கப்பட்ட செயல்கள்",
    "aiChecker.disclaimer": "மறுப்பு",
    "aiChecker.consultations": "AI ஆலோசனைகள்",
    "aiChecker.pendingReviews": "நிலுவையில் உள்ள மதிப்பீடுகள்",
    "aiChecker.avgConfidence": "சராசரி நம்பிக்கை",
    
    // Family Health
    "family.title": "குடும்ப ஆரோக்கிய மேலாண்மை",
    "family.addMember": "குடும்ப உறுப்பினரைச் சேர்க்கவும்",
    "family.relationship": "உறவு",
    "family.healthStatus": "ஆரோக்கிய நிலை",
    "family.lastCheckup": "கடைசி பரிசோதனை",
    
    // Records
    "records.title": "மருத்துவ பதிவுகள்",
    "records.patientRecords": "நோயாளி பதிவுகள்",
    "records.diagnosis": "நோய் கண்டறிதல்",
    "records.treatment": "சிகிச்சை",
    "records.notes": "குறிப்புகள்",
    "records.date": "தேதி",
    
    // Lab Tests
    "labTests.title": "ஆய்வக சோதனை மேலாண்மை",
    "labTests.orderTest": "புதிய சோதனையை ஆர்டர் செய்யவும்",
    "labTests.testName": "சோதனையின் பெயர்",
    "labTests.provider": "வழங்குநர்",
    "labTests.results": "முடிவுகள்",
    "labTests.pending": "நிலுவையில்",
    "labTests.completed": "முடிந்தது",
    
    // Common
    "common.loading": "ஏற்றுகிறது...",
    "common.save": "சேமிக்கவும்",
    "common.cancel": "ரத்து செய்யவும்",
    "common.edit": "திருத்தவும்",
    "common.delete": "நீக்கவும்",
    "common.view": "பார்க்கவும்",
    "common.search": "தேடவும்",
    "common.filter": "வடிகட்டவும்",
    "common.export": "ஏற்றுமதி",
    "common.print": "அச்சிடவும்",
    "common.emergency": "அவசரநிலை",
    "common.call108": "108 ஐ அழைக்கவும்"
  },
  
  telugu: {
    // Header Navigation
    "nav.dashboard": "డాష్‌బోర్డ్",
    "nav.patients": "రోగులు",
    "nav.appointments": "అపాయింట్‌మెంట్లు",
    "nav.records": "రికార్డులు",
    "nav.labTests": "ల్యాబ్ టెస్టులు",
    "nav.aiChecker": "AI చెకర్",
    "nav.family": "కుటుంబ ఆరోగ్యం",
    
    // Language Selector
    "language.english": "English",
    "language.hindi": "हिंदी (Hindi)",
    "language.tamil": "தமிழ் (Tamil)",
    "language.telugu": "తెలుగు (Telugu)",
    
    // Dashboard
    "dashboard.title": "EasyMed కు స్వాగతం",
    "dashboard.todayAppointments": "నేటి అపాయింట్‌మెంట్లు",
    "dashboard.activePatients": "చురుకైన రోగులు",
    "dashboard.labResults": "ల్యాబ్ ఫలితాలు",
    "dashboard.prescriptions": "మందుల వ్రాతలు",
    "dashboard.recentActivities": "ఇటీవలి కార్యకలాపాలు",
    "dashboard.patientConsultation": "రోగి సంప్రదింపులు",
    "dashboard.labResultsReceived": "ల్యాబ్ ఫలితాలు అందుకోబడ్డాయి",
    "dashboard.appointmentScheduled": "అపాయింట్‌మెంట్ షెడ్యూల్ చేయబడింది",
    "dashboard.prescriptionIssued": "మందుల వ్రాత జారీ చేయబడింది",
    
    // Patients
    "patients.title": "రోగి నిర్వహణ",
    "patients.addPatient": "రోగిని జోడించండి",
    "patients.searchPatients": "పేరు లేదా ID ద్వారా రోగులను వెతకండి...",
    "patients.name": "పేరు",
    "patients.age": "వయస్సు",
    "patients.gender": "లింగం",
    "patients.aadhaar": "ఆధార్",
    "patients.phone": "ఫోన్",
    "patients.actions": "చర్యలు",
    "patients.view": "చూడండి",
    "patients.edit": "సవరించండి",
    "patients.totalPatients": "మొత్తం రోగులు",
    "patients.aadhaarVerified": "ఆధార్ ధృవీకరించబడింది",
    "patients.pendingVerification": "ధృవీకరణ పెండింగ్‌లో",
    
    // Appointments
    "appointments.title": "అపాయింట్‌మెంట్ నిర్వహణ",
    "appointments.newAppointment": "కొత్త అపాయింట్‌మెంట్",
    "appointments.todaySchedule": "నేటి షెడ్యూల్",
    "appointments.patientName": "రోగి పేరు",
    "appointments.time": "సమయం",
    "appointments.type": "రకం",
    "appointments.status": "స్థితి",
    "appointments.inPerson": "ప్రత్యక్షంగా",
    "appointments.telemedicine": "టెలిమెడిసిన్",
    "appointments.scheduled": "షెడ్యూల్ చేయబడింది",
    "appointments.completed": "పూర్తయింది",
    "appointments.cancelled": "రద్దు చేయబడింది",
    "appointments.totalAppointments": "మొత్తం అపాయింట్‌మెంట్లు",
    "appointments.scheduleAppointment": "అపాయింట్‌మెంట్‌ను షెడ్యూల్ చేయండి",
    "appointments.scheduleNew": "కొత్త అపాయింట్‌మెంట్‌ను షెడ్యూల్ చేయండి",
    
    // AI Checker
    "aiChecker.title": "AI-శక్తితో కూడిన లక్షణ చెకర్",
    "aiChecker.enterSymptoms": "AI విశ్లేషణ కోసం లక్షణాలను నమోదు చేయండి",
    "aiChecker.analyzeSymptoms": "లక్షణాలను విశ్లేషించండి",
    "aiChecker.symptoms": "లక్షణాలు",
    "aiChecker.analysis": "AI విశ్లేషణ",
    "aiChecker.possibleConditions": "సాధ్యమైన పరిస్థితులు",
    "aiChecker.severity": "తీవ్రత",
    "aiChecker.urgency": "అత్యవసరం",
    "aiChecker.confidence": "విశ్వాసం",
    "aiChecker.recommendations": "సిఫార్సు చేయబడిన చర్యలు",
    "aiChecker.disclaimer": "నిరాకరణ",
    "aiChecker.consultations": "AI సంప్రదింపులు",
    "aiChecker.pendingReviews": "పెండింగ్ రివ్యూలు",
    "aiChecker.avgConfidence": "సరాసరి విశ్వాసం",
    
    // Family Health
    "family.title": "కుటుంబ ఆరోగ్య నిర్వహణ",
    "family.addMember": "కుటుంబ సభ్యుడిని జోడించండి",
    "family.relationship": "సంబంధం",
    "family.healthStatus": "ఆరోగ్య స్థితి",
    "family.lastCheckup": "చివరి చెకప్",
    
    // Records
    "records.title": "వైద్య రికార్డులు",
    "records.patientRecords": "రోగి రికార్డులు",
    "records.diagnosis": "రోగ నిర్ధారణ",
    "records.treatment": "చికిత్స",
    "records.notes": "గమనికలు",
    "records.date": "తేదీ",
    
    // Lab Tests
    "labTests.title": "ల్యాబ్ టెస్ట్ నిర్వహణ",
    "labTests.orderTest": "కొత్త టెస్ట్‌ను ఆర్డర్ చేయండి",
    "labTests.testName": "టెస్ట్ పేరు",
    "labTests.provider": "ప్రదాత",
    "labTests.results": "ఫలితాలు",
    "labTests.pending": "పెండింగ్‌లో",
    "labTests.completed": "పూర్తయింది",
    
    // Common
    "common.loading": "లోడ్ అవుతోంది...",
    "common.save": "సేవ్ చేయండి",
    "common.cancel": "రద్దు చేయండి",
    "common.edit": "సవరించండి",
    "common.delete": "తొలగించండి",
    "common.view": "చూడండి",
    "common.search": "వెతకండి",
    "common.filter": "ఫిల్టర్",
    "common.export": "ఎగుమతి",
    "common.print": "ప్రింట్",
    "common.emergency": "అత్యవసరం",
    "common.call108": "108 కు కాల్ చేయండి"
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("english");

  const t = (key: string): string => {
    return translations[language][key] || translations.english[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}