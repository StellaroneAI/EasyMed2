import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, CheckCircle, Clock, Users, UserCheck, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AddPatientForm from "@/components/patients/add-patient-form";
import { useLanguage } from "@/contexts/language-context";

export default function Patients() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["/api/patients"],
  });

  // Mock data for demonstration since we may not have real patients yet
  const mockPatients = [
    {
      id: 1,
      user: { firstName: "Sarah", lastName: "Mitchell", email: "sarah.mitchell@email.com", phoneNumber: "+91-9876543210" },
      aadhaarVerified: true,
      dateOfBirth: "1992-05-15",
      gender: "Female",
      bloodGroup: "A+",
      insuranceProvider: "HDFC Health",
      lastVisit: "2024-01-15",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    },
    {
      id: 2,
      user: { firstName: "Michael", lastName: "Brown", email: "michael.brown@email.com", phoneNumber: "+91-9876543211" },
      aadhaarVerified: false,
      dateOfBirth: "1979-03-22",
      gender: "Male",
      bloodGroup: "O+",
      insuranceProvider: "Star Health",
      lastVisit: "2024-01-10",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    },
    {
      id: 3,
      user: { firstName: "Emily", lastName: "Chen", email: "emily.chen@email.com", phoneNumber: "+91-9876543212" },
      aadhaarVerified: true,
      dateOfBirth: "1985-09-08",
      gender: "Female",
      bloodGroup: "B+",
      insuranceProvider: "ICICI Lombard",
      lastVisit: "2024-01-18",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
    },
  ];

  const displayPatients = patients.length > 0 ? patients : mockPatients;

  const getAadhaarStatusBadge = (verified: boolean) => {
    if (verified) {
      return (
        <Badge variant="secondary" className="bg-health-green bg-opacity-10 text-health-green">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const totalPatients = displayPatients.length;
  const verifiedPatients = displayPatients.filter(p => p.aadhaarVerified).length;
  const pendingVerification = totalPatients - verifiedPatients;

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
        <h1 className="text-3xl font-bold text-charcoal mb-2">{t("patients.title")}</h1>
        <p className="text-gray-600">Manage patient records with Aadhaar integration and comprehensive healthcare data.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("patients.totalPatients")}</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{totalPatients}</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                <Users className="text-medical-blue text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("patients.aadhaarVerified")}</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{verifiedPatients}</p>
              </div>
              <div className="w-12 h-12 bg-health-green bg-opacity-10 rounded-lg flex items-center justify-center">
                <UserCheck className="text-health-green text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("patients.pendingVerification")}</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{pendingVerification}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-yellow-600 text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-charcoal">{t("nav.patients")}</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("patients.searchPatients")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              </div>
              <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-medical-blue hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {t("patients.addPatient")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{t("patients.addPatient")}</DialogTitle>
                  </DialogHeader>
                  <AddPatientForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Patients</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="pending">Pending Verification</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aadhaar Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medical Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Insurance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={patient.avatar} alt={`${patient.user.firstName} ${patient.user.lastName}`} />
                              <AvatarFallback>
                                {patient.user.firstName[0]}{patient.user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-charcoal">
                                {patient.user.firstName} {patient.user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {calculateAge(patient.dateOfBirth)} years old • {patient.gender}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.user.email}</div>
                          <div className="text-sm text-gray-500">{patient.user.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getAadhaarStatusBadge(patient.aadhaarVerified)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Blood Group: {patient.bloodGroup}</div>
                          <div className="text-sm text-gray-500">Last Visit: {patient.lastVisit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {patient.insuranceProvider}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button variant="ghost" size="sm" className="text-medical-blue hover:text-blue-700">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-health-green hover:text-green-700">
                            Schedule
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="verified">
              <div className="p-6">
                <p className="text-center text-gray-500">Showing only Aadhaar verified patients...</p>
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="p-6">
                <p className="text-center text-gray-500">Showing patients with pending Aadhaar verification...</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">Showing 1 to {totalPatients} of {totalPatients} patients</p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button size="sm" className="bg-medical-blue">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
