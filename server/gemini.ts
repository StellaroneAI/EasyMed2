const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

async function callGeminiAPI(prompt: string): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

interface SymptomAnalysisInput {
  symptoms: string[];
  duration: string;
  severity: string;
  riskFactors?: string[];
  additionalInfo?: string;
}

interface AnalysisResult {
  possibleConditions: Array<{
    condition: string;
    probability: number;
  }>;
  severity: "Low" | "Medium" | "High";
  urgency: "Non-urgent" | "Soon" | "Urgent";
  confidenceScore: number;
  recommendedActions: string[];
  disclaimerNote: string;
}

export async function analyzeSymptoms(input: SymptomAnalysisInput): Promise<AnalysisResult> {
  try {
    const systemPrompt = `You are a medical AI assistant providing preliminary symptom analysis for healthcare professionals in India. Analyze the following patient information and provide a structured medical assessment. Consider Indian healthcare context and common conditions in India.

Patient Information:
- Symptoms: ${input.symptoms.join(", ")}
- Duration: ${input.duration}
- Severity Level: ${input.severity}
- Risk Factors: ${input.riskFactors?.join(", ") || "None reported"}
- Additional Information: ${input.additionalInfo || "None provided"}

Provide analysis considering common Indian health conditions, seasonal factors, and healthcare accessibility.

Respond with JSON in this format: 
{
  "possibleConditions": [{"condition": "condition name", "probability": 0.0-1.0}],
  "severity": "Low|Medium|High",
  "urgency": "Non-urgent|Soon|Urgent", 
  "confidenceScore": 0.0-1.0,
  "recommendedActions": ["action1", "action2"],
  "disclaimerNote": "brief medical disclaimer"
}

Guidelines:
- List 3-5 most likely conditions based on symptoms, considering common Indian health conditions
- Include recommendations for consulting local healthcare providers or 108 emergency services if urgent`;

    const fullPrompt = systemPrompt + "\n\nAnalyze these symptoms: " + input.symptoms.join(", ");
    const responseText = await callGeminiAPI(fullPrompt);

    console.log('Gemini AI Response:', responseText);

    if (responseText) {
      // Try to parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]);
        return {
          possibleConditions: analysisResult.possibleConditions || [
            { condition: "Common viral infection", probability: 0.6 },
            { condition: "Seasonal flu", probability: 0.3 }
          ],
          severity: analysisResult.severity || input.severity,
          urgency: analysisResult.urgency || "Soon",
          confidenceScore: analysisResult.confidenceScore || 0.7,
          recommendedActions: analysisResult.recommendedActions || [
            "Rest and stay hydrated",
            "Monitor temperature regularly",
            "Consult a healthcare provider if symptoms worsen"
          ],
          disclaimerNote: analysisResult.disclaimerNote || "This is a preliminary AI analysis. Please consult with a qualified healthcare professional for proper medical evaluation."
        };
      }
    }
    
    throw new Error("Could not parse AI response");

  } catch (error) {
    console.error('Gemini analysis error:', error);
    
    // Intelligent fallback based on Indian healthcare context
    return {
      possibleConditions: [
        { condition: "Analysis Service Temporarily Unavailable", probability: 1.0 }
      ],
      severity: input.severity as "Low" | "Medium" | "High" || "Medium",
      urgency: "Soon",
      confidenceScore: 0.3,
      recommendedActions: [
        "Visit your nearest Primary Health Centre (PHC) or Community Health Centre (CHC)",
        "Consult with a local doctor or healthcare provider",
        "Call 108 for emergency medical assistance if symptoms worsen",
        "Monitor symptoms and seek immediate medical attention if condition deteriorates"
      ],
      disclaimerNote: "AI analysis service is currently unavailable. Please consult with a healthcare professional immediately for proper medical evaluation. In case of emergency, call 108."
    };
  }
}

export async function getHealthInsights(symptoms: string[], patientHistory?: string): Promise<string[]> {
  try {
    const prompt = `As a healthcare AI assistant for Indian patients, provide 3 practical health insights and recommendations based on these symptoms: ${symptoms.join(", ")}
    
    Patient history: ${patientHistory || "Not provided"}
    
    Consider Indian healthcare context, common conditions, seasonal factors, and provide advice suitable for Indian healthcare system. Include preventive care suggestions, lifestyle recommendations, and when to seek medical help.
    
    Return exactly 3 practical insights as a JSON array of strings.`;

    const responseText = await callGeminiAPI(prompt);

    console.log('Gemini Health Insights Response:', responseText);

    if (responseText) {
      // Try to parse JSON array
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const insights = JSON.parse(jsonMatch[0]);
        return Array.isArray(insights) ? insights : [
          "Stay hydrated and maintain a balanced diet rich in seasonal fruits and vegetables.",
          "Practice good hygiene and follow preventive measures for common infections.",
          "Consult with a local healthcare provider for personalized medical advice."
        ];
      } else {
        // Extract insights from text response
        const lines = responseText.split('\n').filter(line => line.trim().length > 10);
        return lines.slice(0, 3).map(line => line.replace(/^\d+\.?\s*/, '').trim());
      }
    } else {
      throw new Error("Empty response from Gemini AI");
    }

  } catch (error) {
    console.error('Gemini health insights error:', error);
    
    // Indian healthcare context fallback insights
    return [
      "Maintain regular sleep patterns and stay hydrated, especially during hot weather.",
      "Include immunity-boosting foods like tulsi, ginger, and turmeric in your diet.",
      "Schedule regular health check-ups at your nearest government health center or private clinic."
    ];
  }
}

// Multilingual symptom analysis for Indian languages
export async function analyzeMultilingualSymptoms(
  symptoms: string[], 
  language: 'hindi' | 'tamil' | 'telugu' | 'english' = 'english'
): Promise<AnalysisResult> {
  const languagePrompts = {
    hindi: "कृपया हिंदी में चिकित्सा सलाह प्रदान करें। भारतीय स्वास्थ्य सेवा प्रणाली के संदर्भ में सुझाव दें।",
    tamil: "தயவுசெய்து தமிழில் மருத்துவ ஆலோசனை வழங்கவும். இந்திய சுகாதார அமைப்பின் சூழலில் பரிந்துரைகளை வழங்கவும்।",
    telugu: "దయచేసి తెలుగులో వైద్య సలహా అందించండి. భారతీయ ఆరోగ్య సేవా వ్యవస్థ సందర్భంలో సిఫార్సులు అందించండి।",
    english: "Please provide medical advice in English, considering the Indian healthcare system context."
  };

  try {
    const prompt = `You are a medical AI assistant for Indian patients. Analyze these symptoms: ${symptoms.join(", ")}
    
    ${languagePrompts[language]}
    
    Provide analysis considering common Indian health conditions, seasonal factors, and healthcare accessibility.
    
    Return a JSON response with medical analysis including possible conditions, severity, urgency, and recommendations suitable for Indian healthcare context.`;

    const responseText = await callGeminiAPI(prompt);

    console.log('Multilingual Analysis Response:', responseText);

    // Parse and return analysis
    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysisResult = JSON.parse(jsonMatch[0]);
      return {
        possibleConditions: analysisResult.possibleConditions || [
          { condition: "Common health concern", probability: 0.6 }
        ],
        severity: analysisResult.severity || "Medium",
        urgency: analysisResult.urgency || "Soon",
        confidenceScore: analysisResult.confidenceScore || 0.7,
        recommendedActions: analysisResult.recommendedActions || [
          "स्वास्थ्य सेवा प्रदाता से सलाह लें",
          "लक्षणों पर नज़र रखें",
          "यदि आवश्यक हो तो 108 पर कॉल करें"
        ],
        disclaimerNote: "यह एक प्रारंभिक AI विश्लेषण है। उचित चिकित्सा मूल्यांकन के लिए योग्य स्वास्थ्य सेवा प्रदाता से सलाह लें।"
      };
    }
  } catch (error) {
    console.error('Multilingual analysis error:', error);
  }

  // Fallback to English analysis
  return analyzeSymptoms({
    symptoms,
    duration: "Not specified",
    severity: "Medium"
  });
}