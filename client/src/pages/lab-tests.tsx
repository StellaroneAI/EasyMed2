import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FlaskConical, Clock, CheckCircle, AlertTriangle, Plus, DollarSign, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LabTestForm from "@/components/lab-tests/lab-test-form";
import LabTestList from "@/components/lab-tests/lab-test-list";

export default function LabTests() {
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);

  const { data: labTests = [], isLoading } = useQuery({
    queryKey: ["/api/lab-tests/doctor/1"], // Using doctor ID 1 for demo
  });

  const { data: pendingTests = [], isLoading: isPendingLoading } = useQuery({
    queryKey: ["/api/lab-tests/doctor/1/pending"],
  });

  // Mock data for demonstration
  const mockLabTests = [
    {
      id: 1,
      patient: { user: { firstName: "John", lastName: "Smith" } },
      testName: "Complete Blood Count",
      testType: "Hematology",
      status: "completed",
      labProvider: "Apollo Diagnostics",
      scheduledDate: "2024-01-15T09:00:00Z",
      cost: 450.00,
      insuranceCovered: true,
      results: {
        "WBC": "7.2 K/uL",
        "RBC": "4.8 M/uL",
        "Hemoglobin": "14.5 g/dL",
        "Hematocrit": "42.3%"
      },
      normalRanges: {
        "WBC": "4.0-11.0 K/uL",
        "RBC": "4.2-5.4 M/uL",
        "Hemoglobin": "12.0-16.0 g/dL",
        "Hematocrit": "36.0-46.0%"
      }
    },
    {
      id: 2,
      patient: { user: { firstName: "Emily", lastName: "Chen" } },
      testName: "Lipid Profile",
      testType: "Biochemistry",
      status: "in_progress",
      labProvider: "SRL Diagnostics",
      scheduledDate: "2024-01-18T10:30:00Z",
      cost: 800.00,
      insuranceCovered: true,
      results: null,
      normalRanges: null
    },
    {
      id: 3,
      patient: { user: { firstName: "Robert", lastName: "Wilson" } },
      testName: "HbA1c",
      testType: "Endocrinology",
      status: "sample_collected",
      labProvider: "Dr. Lal Pathlabs",
      scheduledDate: "2024-01-19T08:15:00Z",
      cost: 650.00,
      insuranceCovered: false,
      results: null,
      normalRanges: null
    },
    {
      id: 4,
      patient: { user: { firstName: "Sarah", lastName: "Mitchell" } },
      testName: "Thyroid Function Test",
      testType: "Endocrinology",
      status: "ordered",
      labProvider: "Metropolis Healthcare",
      scheduledDate: "2024-01-22T11:00:00Z",
      cost: 950.00,
      insuranceCovered: true,
      results: null,
      normalRanges: null
    },
  ];

  const displayLabTests = labTests.length > 0 ? labTests : mockLabTests;

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
            <FileText className="w-3 h-3 mr-1" />
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

  const totalTests = displayLabTests.length;
  const completedTests = displayLabTests.filter(test => test.status === "completed").length;
  const pendingTestsCount = displayLabTests.filter(test => test.status !== "completed").length;
  const totalCost = displayLabTests.reduce((sum, test) => sum + test.cost, 0);

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
        <h1 className="text-3xl font-bold text-charcoal mb-2">Lab Tests</h1>
        <p className="text-gray-600">Order and manage laboratory tests with insurance claims processing.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{totalTests}</p>
              </div>
              <div className="w-12 h-12 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                <FlaskConical className="text-medical-blue text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{completedTests}</p>
              </div>
              <div className="w-12 h-12 bg-health-green bg-opacity-10 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-health-green text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-charcoal mt-2">{pendingTestsCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600 text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-3xl font-bold text-charcoal mt-2">₹{totalCost.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-digital-purple bg-opacity-10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-digital-purple text-xl w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Lab Tests List */}
        <div className="lg:col-span-3">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-charcoal">Laboratory Tests</CardTitle>
                <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-medical-blue hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Order Lab Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Order New Lab Test</DialogTitle>
                    </DialogHeader>
                    <LabTestForm />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All Tests</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="urgent">Urgent</TabsTrigger>
                    <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  <LabTestList tests={displayLabTests} />
                </TabsContent>

                <TabsContent value="completed">
                  <div className="p-6">
                    <p className="text-center text-gray-500">Showing completed tests...</p>
                  </div>
                </TabsContent>

                <TabsContent value="pending">
                  <div className="p-6">
                    <p className="text-center text-gray-500">Showing pending tests...</p>
                  </div>
                </TabsContent>

                <TabsContent value="urgent">
                  <div className="p-6">
                    <p className="text-center text-gray-500">Showing urgent tests...</p>
                  </div>
                </TabsContent>

                <TabsContent value="insurance">
                  <div className="p-6">
                    <p className="text-center text-gray-500">Showing insurance covered tests...</p>
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
                <FlaskConical className="w-4 h-4 mr-2" />
                Order Lab Test
              </Button>
              <Button className="w-full bg-health-green hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                View Results
              </Button>
              <Button className="w-full bg-digital-purple hover:bg-purple-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Process Insurance
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold">Urgent Results</h2>
              </div>
              
              <p className="text-orange-100 text-sm mb-4">
                2 lab results require immediate attention and review.
              </p>
              
              <Button className="w-full bg-white text-orange-600 font-medium py-2 px-4 rounded-lg hover:bg-orange-50 transition-colors">
                Review Urgent Results
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-sm font-semibold text-charcoal">Popular Tests</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Complete Blood Count</span>
                  <span className="font-medium text-charcoal">₹450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lipid Profile</span>
                  <span className="font-medium text-charcoal">₹800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thyroid Function</span>
                  <span className="font-medium text-charcoal">₹950</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">HbA1c</span>
                  <span className="font-medium text-charcoal">₹650</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
