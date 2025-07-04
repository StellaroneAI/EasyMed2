import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Bot, Plus, X, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const symptomCheckerSchema = z.object({
  symptoms: z.array(z.string()).min(1, "At least one symptom is required"),
  duration: z.string().min(1, "Duration is required"),
  severity: z.string().min(1, "Severity is required"),
  riskFactors: z.array(z.string()).optional(),
  additionalInfo: z.string().optional(),
});

type SymptomCheckerFormData = z.infer<typeof symptomCheckerSchema>;

interface SymptomCheckerProps {
  onConsultationComplete: (consultation: any) => void;
}

const commonSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Vomiting",
  "Chest pain", "Shortness of breath", "Dizziness", "Back pain",
  "Stomach pain", "Muscle aches", "Sore throat", "Runny nose",
  "Joint pain", "Skin rash", "Insomnia", "Loss of appetite"
];

const riskFactors = [
  "Diabetes", "High blood pressure", "Heart disease", "Smoking",
  "Obesity", "Family history", "Age over 65", "Pregnancy",
  "Recent travel", "Chronic illness", "Medications", "Allergies"
];

export default function SymptomChecker({ onConsultationComplete }: SymptomCheckerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SymptomCheckerFormData>({
    resolver: zodResolver(symptomCheckerSchema),
    defaultValues: {
      symptoms: [],
      duration: "",
      severity: "",
      riskFactors: [],
      additionalInfo: "",
    },
  });

  const analyzeSymptomsMutation = useMutation({
    mutationFn: async (data: SymptomCheckerFormData) => {
      const response = await apiRequest("POST", "/api/demo/ai-consultations", {
        patientId: 1, // Mock patient ID for demo
        symptoms: data.symptoms,
        riskFactors: data.riskFactors,
        duration: data.duration,
        severity: data.severity,
        additionalInfo: data.additionalInfo,
      });

      return response.json();
    },
    onSuccess: (consultation) => {
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your symptoms. Review the results below.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/demo/ai-consultations"] });
      onConsultationComplete(consultation);
      form.reset();
      setSelectedSymptoms([]);
      setSelectedRiskFactors([]);
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze symptoms",
        variant: "destructive",
      });
    },
  });

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      const newSymptoms = [...selectedSymptoms, symptom];
      setSelectedSymptoms(newSymptoms);
      form.setValue("symptoms", newSymptoms);
    }
  };

  const removeSymptom = (symptom: string) => {
    const newSymptoms = selectedSymptoms.filter(s => s !== symptom);
    setSelectedSymptoms(newSymptoms);
    form.setValue("symptoms", newSymptoms);
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      addSymptom(customSymptom.trim());
      setCustomSymptom("");
    }
  };

  const toggleRiskFactor = (factor: string) => {
    const newFactors = selectedRiskFactors.includes(factor)
      ? selectedRiskFactors.filter(f => f !== factor)
      : [...selectedRiskFactors, factor];
    setSelectedRiskFactors(newFactors);
    form.setValue("riskFactors", newFactors);
  };

  const onSubmit = (data: SymptomCheckerFormData) => {
    analyzeSymptomsMutation.mutate(data);
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-digital-purple bg-opacity-10 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-digital-purple" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-charcoal">AI Symptom Analysis</h2>
            <p className="text-sm text-gray-600">Describe your symptoms for AI-powered preliminary diagnosis</p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Symptoms Selection */}
          <div>
            <Label className="text-sm font-medium text-charcoal mb-3 block">
              Select Symptoms <span className="text-red-500">*</span>
            </Label>
            
            {/* Common Symptoms */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {commonSymptoms.map((symptom) => (
                <Button
                  key={symptom}
                  type="button"
                  variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                  size="sm"
                  onClick={() => 
                    selectedSymptoms.includes(symptom) 
                      ? removeSymptom(symptom) 
                      : addSymptom(symptom)
                  }
                  className="text-xs h-auto py-2 px-3"
                >
                  {symptom}
                </Button>
              ))}
            </div>

            {/* Custom Symptom Input */}
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="Add custom symptom..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSymptom())}
              />
              <Button type="button" onClick={addCustomSymptom} variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected Symptoms */}
            {selectedSymptoms.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-charcoal">Selected Symptoms:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <Badge key={symptom} variant="secondary" className="bg-medical-blue bg-opacity-10 text-medical-blue">
                      {symptom}
                      <button
                        type="button"
                        onClick={() => removeSymptom(symptom)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {form.formState.errors.symptoms && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.symptoms.message}</p>
            )}
          </div>

          {/* Duration and Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration <span className="text-red-500">*</span></Label>
              <select 
                id="duration"
                {...form.register("duration")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              >
                <option value="">Select duration</option>
                <option value="less_than_24h">Less than 24 hours</option>
                <option value="1_3_days">1-3 days</option>
                <option value="4_7_days">4-7 days</option>
                <option value="1_2_weeks">1-2 weeks</option>
                <option value="more_than_2_weeks">More than 2 weeks</option>
              </select>
              {form.formState.errors.duration && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.duration.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="severity">Severity <span className="text-red-500">*</span></Label>
              <select 
                id="severity"
                {...form.register("severity")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              >
                <option value="">Select severity</option>
                <option value="mild">Mild - Minimal impact on daily activities</option>
                <option value="moderate">Moderate - Some impact on daily activities</option>
                <option value="severe">Severe - Significant impact on daily activities</option>
                <option value="very_severe">Very Severe - Unable to perform daily activities</option>
              </select>
              {form.formState.errors.severity && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.severity.message}</p>
              )}
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <Label className="text-sm font-medium text-charcoal mb-3 block">Risk Factors (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {riskFactors.map((factor) => (
                <div key={factor} className="flex items-center space-x-2">
                  <Checkbox
                    id={factor}
                    checked={selectedRiskFactors.includes(factor)}
                    onCheckedChange={() => toggleRiskFactor(factor)}
                  />
                  <Label htmlFor={factor} className="text-sm font-normal cursor-pointer">
                    {factor}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              {...form.register("additionalInfo")}
              placeholder="Any additional details about your symptoms, medical history, or concerns..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-digital-purple hover:bg-purple-700"
            disabled={analyzeSymptomsMutation.isPending}
          >
            {analyzeSymptomsMutation.isPending ? (
              <>
                <Bot className="w-4 h-4 mr-2 animate-spin" />
                AI Analyzing Symptoms...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analyze with OpenAI
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
