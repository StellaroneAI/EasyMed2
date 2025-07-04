import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { PrescriptionSummary } from "@/types";

export default function PrescriptionManagement() {
  const { data: prescriptions = [], isLoading } = useQuery<PrescriptionSummary[]>({
    queryKey: ["/api/demo/prescriptions/doctor/1"], // Using doctor ID 1 for demo
  });

  // Mock data for demonstration
  const mockPrescriptions: PrescriptionSummary[] = [
    {
      id: 1,
      patientName: "Sarah Mitchell",
      medication: "Lisinopril 10mg",
      dosage: "Once daily",
      duration: "30 days",
      date: "Jan 15, 2024",
      status: "active",
    },
    {
      id: 2,
      patientName: "Michael Brown",
      medication: "Metformin 500mg",
      dosage: "Twice daily",
      duration: "90 days",
      date: "Jan 12, 2024",
      status: "pending",
    },
  ];

  const displayPrescriptions = prescriptions.length > 0 ? prescriptions : mockPrescriptions;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-health-green bg-opacity-10 text-health-green">
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            Completed
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-charcoal">Digital Prescriptions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <Button className="w-full bg-medical-blue hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Prescription
          </Button>
        </div>

        <div className="space-y-4">
          {displayPrescriptions.map((prescription) => (
            <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-charcoal">{prescription.patientName}</h3>
                {getStatusBadge(prescription.status)}
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Medication:</strong> {prescription.medication}
                </p>
                <p>
                  <strong>Dosage:</strong> {prescription.dosage}
                </p>
                <p>
                  <strong>Duration:</strong> {prescription.duration}
                </p>
                <p>
                  <strong>Issued:</strong> {prescription.date}
                </p>
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-medical-blue hover:text-blue-700">
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-health-green hover:text-green-700">
                  {prescription.status === "pending" ? "Send" : "Renew"}
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
