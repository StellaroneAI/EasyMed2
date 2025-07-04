import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, ArrowRight, CheckCircle, Clock, Calendar } from "lucide-react";
import { AppointmentWithPatient } from "@/types";

export default function TodaySchedule() {
  const { data: appointments = [], isLoading } = useQuery<AppointmentWithPatient[]>({
    queryKey: ["/api/appointments/doctor/1/today"], // Using doctor ID 1 for demo
  });

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-charcoal">Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-20"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demonstration since we don't have real appointments yet
  const mockAppointments: AppointmentWithPatient[] = [
    {
      id: 1,
      patientName: "John Smith",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      time: "9:00 AM",
      reason: "Annual Checkup",
      aadhaar: "****-****-1234",
      status: "completed",
      type: "in-person",
    },
    {
      id: 2,
      patientName: "Emily Chen",
      patientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      time: "10:30 AM",
      reason: "Follow-up Consultation",
      aadhaar: "****-****-5678",
      status: "current",
      type: "telemedicine",
    },
    {
      id: 3,
      patientName: "Robert Wilson",
      patientAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      time: "12:00 PM",
      reason: "Prescription Review",
      aadhaar: "****-****-9012",
      status: "scheduled",
      type: "in-person",
    },
  ];

  const displayAppointments = appointments.length > 0 ? appointments : mockAppointments;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-health-green bg-opacity-10 text-health-green">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "current":
        return (
          <Badge variant="secondary" className="bg-medical-blue bg-opacity-10 text-medical-blue">
            <Clock className="w-3 h-3 mr-1" />
            Current
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            <Calendar className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        );
    }
  };

  const getCardBackground = (status: string) => {
    return status === "current" ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200";
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-charcoal">Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {displayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`flex items-center p-4 rounded-lg border ${getCardBackground(appointment.status)}`}
            >
              <div className="flex-shrink-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                  <AvatarFallback>
                    {appointment.patientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-sm font-semibold text-charcoal">{appointment.patientName}</h3>
                <p className="text-sm text-gray-600">{appointment.reason}</p>
                <p className="text-xs text-gray-500">Aadhaar: {appointment.aadhaar}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-charcoal">{appointment.time}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(appointment.status)}
                  <Button variant="ghost" size="sm" className="text-medical-blue hover:text-blue-700">
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="ghost" className="w-full text-medical-blue hover:text-blue-700">
            View All Appointments <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
