import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, Pill, FlaskConical, Heart, Eye, Download, Plus, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Records() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["/api/medical-records/doctor/1"], // Using doctor ID 1 for demo
  });

  // Mock data for demonstration
  const mockRecords = [
    {
      id: 1,
      patient: { user: { firstName: "Emily", lastName: "Chen" } },
      recordType: "consultation",
      title: "Cardiology Consultation",
      description: "Routine cardiac examination with ECG",
      diagnosis: "Normal sinus rhythm, no abnormalities detected",
      treatment: "Continue current medications, follow-up in 6 months",
      createdAt: "2024-01-18T10:30:00Z",
      patientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      isConfidential: false,
    },
    {
      id: 2,
      patient: { user: { firstName: "John", lastName: "Smith" } },
      recordType: "diagnosis",
      title: "Hypertension Management",
      description: "Blood pressure monitoring and medication adjustment",
      diagnosis: "Essential hypertension, well controlled",
      treatment: "Increased Lisinopril dosage to 10mg daily",
      createdAt: "2024-01-17T14:15:00Z",
      patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      isConfidential: true,
    },
    {
      id: 3,
      patient: { user: { firstName: "Robert", lastName: "Wilson" } },
      recordType: "lab_result",
      title: "Complete Blood Count",
      description: "Routine blood work analysis",
      diagnosis: "All parameters within normal range",
      treatment: "No action required, continue current regimen",
      createdAt: "2024-01-16T09:45:00Z",
      patientAvatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      isConfidential: false,
    },
    {
      id: 4,
      patient: { user: { firstName: "Sarah", lastName: "Mitchell" } },
      recordType: "treatment",
      title: "Physical Therapy Plan",
      description: "Post-surgery rehabilitation protocol",
      diagnosis: "Successful knee replacement recovery",
      treatment: "6-week physical therapy program, twice weekly sessions",
      createdAt: "2024-01-15T11:20:00Z",
      patientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      isConfidential: false,
    },
  ];

  const displayRecords = records.length > 0 ? records : mockRecords;

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return Heart;
      case "diagnosis":
        return FileText;
      case "lab_result":
        return FlaskConical;
      case "treatment":
        return Pill;
      default:
        return FileText;
    }
  };

  const getRecordTypeBadge = (type: string) => {
    switch (type) {
      case "consultation":
        return <Badge className="bg-medical-blue bg-opacity-10 text-medical-blue">Consultation</Badge>;
      case "diagnosis":
        return <Badge className="bg-health-green bg-opacity-10 text-health-green">Diagnosis</Badge>;
      case "lab_result":
        return <Badge className="bg-yellow-500 bg-opacity-10 text-yellow-600">Lab Result</Badge>;
      case "treatment":
        return <Badge className="bg-digital-purple bg-opacity-10 text-digital-purple">Treatment</Badge>;
      default:
        return <Badge variant="secondary">Record</Badge>;
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

  const totalRecords = displayRecords.length;
  const consultationRecords = displayRecords.filter(r => r.recordType === "consultation").length;
  const labRecords = displayRecords.filter(r => r.recordType === "lab_result").length;

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
        <h1 className="text-3xl font-bold text-charcoal mb-2">Medical Records</h1>
        <p className="text-gray-600">Comprehensive digital health records and medical documentation.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{totalRecords}</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                <FileText className="text-medical-blue text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultations</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{consultationRecords}</p>
              </div>
              <div className="w-12 h-12 bg-health-green bg-opacity-10 rounded-lg flex items-center justify-center">
                <Heart className="text-health-green text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lab Results</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{labRecords}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                <FlaskConical className="text-yellow-600 text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-charcoal">Medical Records</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-medical-blue hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Records</TabsTrigger>
                <TabsTrigger value="consultation">Consultations</TabsTrigger>
                <TabsTrigger value="diagnosis">Diagnoses</TabsTrigger>
                <TabsTrigger value="lab_result">Lab Results</TabsTrigger>
                <TabsTrigger value="treatment">Treatments</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4 px-6 pb-6">
                {displayRecords.map((record) => {
                  const IconComponent = getRecordTypeIcon(record.recordType);
                  return (
                    <div
                      key={record.id}
                      className="flex items-start p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={record.patientAvatar} alt={`${record.patient.user.firstName} ${record.patient.user.lastName}`} />
                          <AvatarFallback>
                            {record.patient.user.firstName[0]}{record.patient.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-charcoal">{record.title}</h3>
                            <p className="text-sm text-gray-600">
                              Patient: {record.patient.user.firstName} {record.patient.user.lastName}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getRecordTypeBadge(record.recordType)}
                            {record.isConfidential && (
                              <Badge variant="destructive" className="text-xs">Confidential</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-charcoal mb-1">Description</h4>
                            <p className="text-sm text-gray-600">{record.description}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-charcoal mb-1">Diagnosis</h4>
                            <p className="text-sm text-gray-600">{record.diagnosis}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-charcoal mb-1">Treatment</h4>
                          <p className="text-sm text-gray-600">{record.treatment}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Created: {formatDate(record.createdAt)}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-medical-blue hover:text-blue-700">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                              <Download className="w-4 h-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-10 h-10 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-medical-blue" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="consultation">
              <div className="p-6">
                <p className="text-center text-gray-500">Showing consultation records...</p>
              </div>
            </TabsContent>

            <TabsContent value="diagnosis">
              <div className="p-6">
                <p className="text-center text-gray-500">Showing diagnosis records...</p>
              </div>
            </TabsContent>

            <TabsContent value="lab_result">
              <div className="p-6">
                <p className="text-center text-gray-500">Showing lab result records...</p>
              </div>
            </TabsContent>

            <TabsContent value="treatment">
              <div className="p-6">
                <p className="text-center text-gray-500">Showing treatment records...</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">Showing 1 to {totalRecords} of {totalRecords} records</p>
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
