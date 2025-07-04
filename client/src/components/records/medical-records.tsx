import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Pill, FlaskConical, Eye, ArrowRight } from "lucide-react";
import { MedicalRecordSummary } from "@/types";

export default function MedicalRecords() {
  const { data: records = [], isLoading } = useQuery<MedicalRecordSummary[]>({
    queryKey: ["/api/demo/medical-records/doctor/1"], // Using doctor ID 1 for demo
  });

  // Mock data for demonstration
  const mockRecords: MedicalRecordSummary[] = [
    {
      id: 1,
      patientName: "Emily Chen",
      type: "Cardiology Consultation",
      date: "January 18, 2024",
      icon: "medical",
      color: "bg-medical-blue",
    },
    {
      id: 2,
      patientName: "John Smith",
      type: "Pill Update",
      date: "January 17, 2024",
      icon: "prescription",
      color: "bg-health-green",
    },
    {
      id: 3,
      patientName: "Robert Wilson",
      type: "Lab Test Results",
      date: "January 16, 2024",
      icon: "lab",
      color: "bg-yellow-500",
    },
  ];

  const displayRecords = records.length > 0 ? records : mockRecords;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "prescription":
        return Pill;
      case "lab":
        return FlaskConical;
      default:
        return FileText;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-charcoal">Recent Medical Records</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {displayRecords.map((record) => {
            const IconComponent = getIcon(record.icon);
            return (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${record.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${record.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal">{record.patientName}</h3>
                    <p className="text-sm text-gray-600">{record.type}</p>
                    <p className="text-xs text-gray-500">{record.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-medical-blue hover:text-blue-700">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>

        <Button variant="ghost" className="w-full mt-6 text-medical-blue hover:text-blue-700">
          View All Records <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
