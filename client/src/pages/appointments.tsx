import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Video, Users, CalendarPlus, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AppointmentForm from "@/components/appointments/appointment-form";
import { useLanguage } from "@/contexts/language-context";

export default function Appointments() {
  const { t } = useLanguage();
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments/doctor/1"], // Using doctor ID 1 for demo
  });

  // Mock data for demonstration
  const mockAppointments = [
    {
      id: 1,
      patient: { user: { firstName: "John", lastName: "Smith" } },
      appointmentDate: "2024-01-20T09:00:00Z",
      duration: 30,
      status: "scheduled",
      type: "in-person",
      reason: "Annual Checkup",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    },
    {
      id: 2,
      patient: { user: { firstName: "Emily", lastName: "Chen" } },
      appointmentDate: "2024-01-20T10:30:00Z",
      duration: 45,
      status: "in-progress",
      type: "telemedicine",
      reason: "Follow-up Consultation",
      patientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    },
    {
      id: 3,
      patient: { user: { firstName: "Robert", lastName: "Wilson" } },
      appointmentDate: "2024-01-20T14:00:00Z",
      duration: 30,
      status: "completed",
      type: "in-person",
      reason: "Prescription Review",
      patientAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    },
    {
      id: 4,
      patient: { user: { firstName: "Sarah", lastName: "Mitchell" } },
      appointmentDate: "2024-01-21T11:00:00Z",
      duration: 60,
      status: "scheduled",
      type: "telemedicine",
      reason: "Cardiology Consultation",
      patientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    },
  ];

  const displayAppointments = appointments.length > 0 ? appointments : mockAppointments;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-health-green bg-opacity-10 text-health-green">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-medical-blue bg-opacity-10 text-medical-blue">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
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

  const getTypeBadge = (type: string) => {
    return type === "telemedicine" ? (
      <Badge variant="outline" className="text-digital-purple border-digital-purple">
        <Video className="w-3 h-3 mr-1" />
        Video Call
      </Badge>
    ) : (
      <Badge variant="outline" className="text-gray-600 border-gray-300">
        <Users className="w-3 h-3 mr-1" />
        In-Person
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const todayAppointments = displayAppointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = displayAppointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    const today = new Date();
    return aptDate > today;
  });

  const totalAppointments = displayAppointments.length;
  const todayCount = todayAppointments.length;
  const telemedicineCount = displayAppointments.filter(apt => apt.type === "telemedicine").length;

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
        <h1 className="text-3xl font-bold text-charcoal mb-2">{t("appointments.title")}</h1>
        <p className="text-gray-600">Manage patient appointments with telemedicine support and scheduling.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("appointments.totalAppointments")}</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{totalAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                <Calendar className="text-medical-blue text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("dashboard.todayAppointments")}</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{todayCount}</p>
              </div>
              <div className="w-12 h-12 bg-health-green bg-opacity-10 rounded-lg flex items-center justify-center">
                <CalendarPlus className="text-health-green text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("appointments.telemedicine")}</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{telemedicineCount}</p>
              </div>
              <div className="w-12 h-12 bg-digital-purple bg-opacity-10 rounded-lg flex items-center justify-center">
                <Video className="text-digital-purple text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Appointment List */}
        <div className="lg:col-span-3">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-charcoal">{t("nav.appointments")}</CardTitle>
                <Dialog open={isAddAppointmentOpen} onOpenChange={setIsAddAppointmentOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-medical-blue hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      {t("appointments.scheduleAppointment")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t("appointments.scheduleNew")}</DialogTitle>
                    </DialogHeader>
                    <AppointmentForm />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="telemedicine">Telemedicine</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-4 px-6 pb-6">
                    {displayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`flex items-center p-4 rounded-lg border ${
                          appointment.status === "in-progress" ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.patientAvatar} alt={`${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`} />
                            <AvatarFallback>
                              {appointment.patient.user.firstName[0]}{appointment.patient.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="text-sm font-semibold text-charcoal">
                            {appointment.patient.user.firstName} {appointment.patient.user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500">
                              {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}
                            </p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">{appointment.duration} minutes</p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(appointment.status)}
                            {getTypeBadge(appointment.type)}
                          </div>
                          <div className="flex items-center space-x-2">
                            {appointment.type === "telemedicine" && (
                              <Button variant="ghost" size="sm" className="text-medical-blue hover:text-blue-700">
                                <Video className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="today">
                  <div className="p-6">
                    <p className="text-center text-gray-500">Showing today's appointments...</p>
                  </div>
                </TabsContent>

                <TabsContent value="upcoming">
                  <div className="p-6">
                    <p className="text-center text-gray-500">Showing upcoming appointments...</p>
                  </div>
                </TabsContent>

                <TabsContent value="telemedicine">
                  <div className="p-6">
                    <p className="text-center text-gray-500">Showing telemedicine appointments...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-charcoal">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button className="w-full bg-medical-blue hover:bg-blue-700">
                <CalendarPlus className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button className="w-full bg-digital-purple hover:bg-purple-700">
                <Video className="w-4 h-4 mr-2" />
                Start Video Call
              </Button>
              <Button className="w-full bg-health-green hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-digital-purple to-purple-600 text-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold">Telemedicine</h2>
              </div>
              
              <p className="text-purple-100 text-sm mb-4">
                Conduct secure video consultations with patients from anywhere.
              </p>
              
              <Button className="w-full bg-white text-digital-purple font-medium py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors">
                Start Video Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
