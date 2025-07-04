import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const prompt = `You are a medical AI assistant providing preliminary symptom analysis for healthcare professionals. Analyze the following patient information and provide a structured medical assessment.

Patient Information:
- Symptoms: ${input.symptoms.join(", ")}
- Duration: ${input.duration}
- Severity Level: ${input.severity}
- Risk Factors: ${input.riskFactors?.join(", ") || "None reported"}
- Additional Information: ${input.additionalInfo || "None provided"}

Please provide a JSON response with the following structure:
{
  "possibleConditions": [
    {"condition": "condition name", "probability": 0.0-1.0}
  ],
  "severity": "Low|Medium|High",
  "urgency": "Non-urgent|Soon|Urgent", 
  "confidenceScore": 0.0-1.0,
  "recommendedActions": ["action1", "action2"],
  "disclaimerNote": "brief medical disclaimer"
}

Guidelines:
- List 3-5 most likely conditions based on symptoms
- Assign realistic probability scores (sum should be ≤ 1.0)
- Severity: Low (minor issues), Medium (needs attention), High (serious concern)
- Urgency: Non-urgent (routine care), Soon (within days), Urgent (immediate attention)
- Confidence should reflect certainty of analysis
- Actions should be practical medical recommendations
- Always include appropriate medical disclaimer`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a medical AI assistant providing preliminary symptom analysis. Always respond with valid JSON in the exact format requested. Be conservative with urgency assessments and always recommend professional medical consultation for serious symptoms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent medical advice
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate and sanitize the response
    return {
      possibleConditions: result.possibleConditions || [
        { condition: "Analysis Unavailable", probability: 0.5 }
      ],
      severity: ["Low", "Medium", "High"].includes(result.severity) 
        ? result.severity 
        : "Medium",
      urgency: ["Non-urgent", "Soon", "Urgent"].includes(result.urgency)
        ? result.urgency
        : "Soon",
      confidenceScore: Math.max(0, Math.min(1, result.confidenceScore || 0.6)),
      recommendedActions: Array.isArray(result.recommendedActions) 
        ? result.recommendedActions 
        : ["Consult with a healthcare professional"],
      disclaimerNote: result.disclaimerNote || 
        "This analysis is for preliminary assessment only. Always consult with a qualified healthcare professional for proper diagnosis and treatment."
    };

  } catch (error) {
    console.error("OpenAI analysis error:", error);
    
    // Fallback response if OpenAI fails
    return {
      possibleConditions: [
        { condition: "Analysis Service Temporarily Unavailable", probability: 1.0 }
      ],
      severity: "Medium",
      urgency: "Soon",
      confidenceScore: 0.3,
      recommendedActions: [
        "Consult with a healthcare professional for proper evaluation",
        "Monitor symptoms closely",
        "Seek immediate medical attention if symptoms worsen"
      ],
      disclaimerNote: "AI analysis service is currently unavailable. Please consult with a healthcare professional for proper medical evaluation."
    };
  }
}

// Health information analysis for additional context
export async function getHealthInsights(symptoms: string[], patientHistory?: string): Promise<string[]> {
  try {
    const prompt = `Based on the symptoms: ${symptoms.join(", ")} ${patientHistory ? `and patient history: ${patientHistory}` : ""}, provide 3-4 brief health insights or general wellness recommendations. Focus on preventive care and general health tips. Keep each insight to 1-2 sentences.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system", 
          content: "You are a health education AI providing general wellness insights. Focus on preventive care, lifestyle recommendations, and general health education. Always emphasize consulting healthcare professionals for medical advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 300
    });

    const insights = response.choices[0].message.content?.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 4) || [];

    return insights.length > 0 ? insights : [
      "Maintain regular sleep patterns and stay hydrated for overall health.",
      "Consider keeping a symptom diary to track patterns and triggers.",
      "Regular check-ups with healthcare providers support preventive care."
    ];

  } catch (error) {
    console.error("Health insights error:", error);
    return [
      "Maintain regular sleep patterns and stay hydrated for overall health.",
      "Consider keeping a symptom diary to track patterns and triggers.", 
      "Regular check-ups with healthcare providers support preventive care."
    ];
  }
}