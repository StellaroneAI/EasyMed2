import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Users, FileText } from "lucide-react";

interface AiResultsProps {
  consultation: {
    id: number;
    patient?: {
      user: {
        firstName: string;
        lastName: string;
      };
    };
    symptoms: string[];
    aiAnalysis: {
      possibleConditions: Array<{
        condition: string;
        probability: number;
      }>;
      severity: string;
      urgency: string;
    };
    confidenceScore: string;
    recommendedActions: string[];
    status: string;
    createdAt: string;
  };
}

export default function AiResults({ consultation }: AiResultsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'soon':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'non-urgent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const confidencePercentage = parseFloat(consultation.confidenceScore) * 100;

  return (
    <div className="space-y-6">
      {/* Analysis Summary */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-charcoal flex items-center justify-between">
            <span>AI Analysis Results</span>
            <Badge 
              variant="outline" 
              className={`${getSeverityColor(consultation.aiAnalysis.severity)} border`}
            >
              {consultation.aiAnalysis.severity} Severity
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Patient & Symptoms */}
          {consultation.patient && (
            <div className="pb-4 border-b border-gray-100">
              <h3 className="font-medium text-charcoal mb-2">
                Patient: {consultation.patient.user.firstName} {consultation.patient.user.lastName}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Symptoms:</span>
                {consultation.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">AI Confidence Score</span>
              <span className="text-lg font-bold text-digital-purple">
                {confidencePercentage.toFixed(0)}%
              </span>
            </div>
            <Progress value={confidencePercentage} className="w-full h-2" />
          </div>

          {/* Urgency Assessment */}
          <Alert className={`${getSeverityColor(consultation.aiAnalysis.severity)} border`}>
            <div className="flex items-center space-x-2">
              {getUrgencyIcon(consultation.aiAnalysis.urgency)}
              <AlertDescription className="font-medium">
                Urgency Level: {consultation.aiAnalysis.urgency}
              </AlertDescription>
            </div>
          </Alert>
        </CardContent>
      </Card>

      {/* Possible Conditions */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-digital-purple" />
            Possible Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultation.aiAnalysis.possibleConditions.map((condition, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-charcoal">{condition.condition}</span>
                  <span className="text-sm text-gray-600">
                    {(condition.probability * 100).toFixed(0)}% probability
                  </span>
                </div>
                <Progress 
                  value={condition.probability * 100} 
                  className="w-full h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-charcoal flex items-center">
            <FileText className="w-5 h-5 mr-2 text-health-green" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consultation.recommendedActions.map((action, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-health-green bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-health-green">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Metadata */}
      <Card className="bg-gray-50 border border-gray-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Analysis Date:</span>
              <p className="font-medium text-charcoal">
                {new Date(consultation.createdAt).toLocaleDateString()} at{' '}
                {new Date(consultation.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <p className="font-medium text-charcoal capitalize">{consultation.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Medical Disclaimer:</strong> This AI analysis is for preliminary assessment only. 
          Always consult with a qualified healthcare professional for proper diagnosis and treatment.
        </AlertDescription>
      </Alert>
    </div>
  );
}