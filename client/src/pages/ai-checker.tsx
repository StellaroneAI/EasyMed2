import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, TrendingUp, Users, Lightbulb, Brain, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SymptomChecker from "@/components/ai-checker/symptom-checker";
import AiResults from "@/components/ai-checker/ai-results";

export default function AiChecker() {
  const [currentConsultation, setCurrentConsultation] = useState(null);

  const { data: aiConsultations = [], isLoading } = useQuery({
    queryKey: ["/api/ai-consultations/patient/1"], // Mock patient ID for demo
  });

  // Mock data for demonstration
  const mockConsultations = [
    {
      id: 1,
      patient: { user: { firstName: "John", lastName: "Smith" } },
      symptoms: ["headache", "fever", "fatigue"],
      aiAnalysis: {
        possibleConditions: [
          { condition: "Common Cold", probability: 0.7 },
          { condition: "Influenza", probability: 0.2 },
          { condition: "Tension Headache", probability: 0.1 }
        ],
        severity: "Low",
        urgency: "Non-urgent"
      },
      confidenceScore: "0.75",
      recommendedActions: [
        "Rest and stay hydrated",
        "Over-the-counter pain relief if needed",
        "Monitor symptoms for 48 hours"
      ],
      status: "reviewed",
      createdAt: "2024-01-18T10:30:00Z"
    },
    {
      id: 2,
      patient: { user: { firstName: "Emily", lastName: "Chen" } },
      symptoms: ["chest pain", "shortness of breath", "dizziness"],
      aiAnalysis: {
        possibleConditions: [
          { condition: "Cardiac Event", probability: 0.6 },
          { condition: "Panic Attack", probability: 0.3 },
          { condition: "Respiratory Issue", probability: 0.1 }
        ],
        severity: "High",
        urgency: "Urgent"
      },
      confidenceScore: "0.85",
      recommendedActions: [
        "Seek immediate medical attention",
        "Call emergency services if symptoms worsen",
        "Avoid physical exertion"
      ],
      status: "pending",
      createdAt: "2024-01-17T14:15:00Z"
    },
  ];

  const displayConsultations = aiConsultations.length > 0 ? aiConsultations : mockConsultations;

  const totalConsultations = displayConsultations.length;
  const pendingReviews = displayConsultations.filter(c => c.status === "pending").length;
  const avgConfidence = displayConsultations.reduce((sum, c) => sum + parseFloat(c.confidenceScore), 0) / totalConsultations;

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">AI Symptom Checker</h1>
        <p className="text-gray-600">Advanced AI-powered preliminary diagnosis and health recommendations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Consultations</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{totalConsultations}</p>
              </div>
              <div className="w-12 h-12 bg-digital-purple bg-opacity-10 rounded-lg flex items-center justify-center">
                <Bot className="text-digital-purple text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{pendingReviews}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                <Brain className="text-yellow-600 text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{(avgConfidence * 100).toFixed(0)}%</p>
              </div>
              <div className="w-12 h-12 bg-health-green bg-opacity-10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-health-green text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Symptom Checker */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
                <Bot className="w-5 h-5 mr-2 text-digital-purple" />
                AI Symptom Analysis
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs defaultValue="checker" className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="checker">Symptom Checker</TabsTrigger>
                    <TabsTrigger value="results">Recent Results</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="checker" className="mt-6">
                  <div className="px-6 pb-6">
                    <SymptomChecker onConsultationComplete={setCurrentConsultation} />
                  </div>
                </TabsContent>

                <TabsContent value="results" className="mt-6">
                  <div className="px-6 pb-6">
                    {currentConsultation ? (
                      <AiResults consultation={currentConsultation} />
                    ) : (
                      <div className="text-center py-12">
                        <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No recent analysis available. Start a new symptom check.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      {displayConsultations.map((consultation) => (
                        <div key={consultation.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-charcoal">
                                {consultation.patient.user.firstName} {consultation.patient.user.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Symptoms: {consultation.symptoms.join(", ")}
                              </p>
                              <p className="text-sm text-gray-600">
                                Primary condition: {consultation.aiAnalysis.possibleConditions[0]?.condition}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(consultation.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-digital-purple">
                                {(parseFloat(consultation.confidenceScore) * 100).toFixed(0)}%
                              </div>
                              <p className="text-xs text-gray-500">Confidence</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-digital-purple to-purple-600 text-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold">AI Insights</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">AI-Powered Analysis</h3>
                  <p className="text-xs text-purple-100">
                    Real-time symptom analysis using OpenAI's latest GPT-4o model for accurate preliminary assessments.
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Smart Recommendations</h3>
                  <p className="text-xs text-purple-100">
                    Evidence-based action plans and urgency assessments powered by advanced AI technology.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-charcoal">AI Features</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-medical-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-charcoal">Rapid Analysis</h3>
                  <p className="text-xs text-gray-500">Get instant preliminary diagnosis</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-health-green bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-health-green" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-charcoal">Pattern Recognition</h3>
                  <p className="text-xs text-gray-500">Identify symptom patterns and trends</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-digital-purple bg-opacity-10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-digital-purple" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-charcoal">Risk Assessment</h3>
                  <p className="text-xs text-gray-500">Evaluate urgency and severity levels</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-sm font-semibold text-charcoal">Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-medium text-charcoal">12 consultations</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average Accuracy</span>
                  <span className="font-medium text-charcoal">87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Urgent Cases</span>
                  <span className="font-medium text-charcoal">2 identified</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
