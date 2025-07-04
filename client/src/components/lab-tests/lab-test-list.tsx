import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Clock, FlaskConical, AlertTriangle, Eye, Download, CreditCard } from "lucide-react";

interface LabTest {
  id: number;
  patient: { user: { firstName: string; lastName: string } };
  testName: string;
  testType: string;
  status: string;
  labProvider: string;
  scheduledDate: string;
  cost: number;
  insuranceCovered: boolean;
  results?: any;
}

interface LabTestListProps {
  tests: LabTest[];
}

export default function LabTestList({ tests }: LabTestListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-health-green bg-opacity-10 text-health-green">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-medical-blue bg-opacity-10 text-medical-blue">
            <FlaskConical className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "sample_collected":
        return (
          <Badge variant="secondary" className="bg-yellow-500 bg-opacity-10 text-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Sample Collected
          </Badge>
        );
      case "ordered":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            <Clock className="w-3 h-3 mr-1" />
            Ordered
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 px-6 pb-6">
      {tests.map((test) => (
        <div
          key={test.id}
          className="flex items-start p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex-shrink-0">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {test.patient.user.firstName[0]}{test.patient.user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="ml-4 flex-grow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-charcoal">{test.testName}</h3>
                <p className="text-sm text-gray-600">
                  Patient: {test.patient.user.firstName} {test.patient.user.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Type: {test.testType} • Provider: {test.labProvider}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(test.status)}
                {test.insuranceCovered && (
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Insured
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-charcoal mb-1">Scheduled</h4>
                <p className="text-sm text-gray-600">{formatDate(test.scheduledDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-charcoal mb-1">Cost</h4>
                <p className="text-sm text-gray-600">₹{test.cost.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-charcoal mb-1">Status</h4>
                <p className="text-sm text-gray-600 capitalize">{test.status.replace('_', ' ')}</p>
              </div>
            </div>
            
            {test.results && (
              <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-charcoal mb-2">Results</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(test.results).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-xs text-gray-500">{key}</p>
                      <p className="text-sm font-medium text-charcoal">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Last updated: {formatDate(test.scheduledDate)}
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-medical-blue hover:text-blue-700">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                {test.results && (
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Download className="w-4 h-4 mr-1" />
                    Download Report
                  </Button>
                )}
                {test.insuranceCovered && (
                  <Button variant="ghost" size="sm" className="text-health-green hover:text-green-700">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Process Claim
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <div className="w-10 h-10 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-medical-blue" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
