import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Heart, Activity, Shield, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function FamilyHealth() {
  const [selectedMember, setSelectedMember] = useState(null);

  const { data: familyMembers = [], isLoading } = useQuery({
    queryKey: ["/api/family-members/1"], // Mock patient ID for demo
  });

  // Mock data for demonstration
  const mockFamilyMembers = [
    {
      id: 1,
      name: "राधा शर्मा",
      relation: "Mother",
      age: 58,
      bloodGroup: "O+",
      aadhaarVerified: true,
      healthStatus: "Good",
      lastCheckup: "2024-01-10",
      avatar: "RS",
      phone: "+91-9876543210",
      allergies: ["Dust"],
      medications: ["Calcium supplements"],
      conditions: ["Arthritis"]
    },
    {
      id: 2,
      name: "அருண் குமார்",
      relation: "Father",
      age: 62,
      bloodGroup: "B+",
      aadhaarVerified: true,
      healthStatus: "Diabetes monitoring",
      lastCheckup: "2024-01-08",
      avatar: "AK",
      phone: "+91-9876543211",
      allergies: ["Peanuts"],
      medications: ["Metformin", "Insulin"],
      conditions: ["Type 2 Diabetes", "High BP"]
    },
    {
      id: 3,
      name: "આયુષ પટેલ",
      relation: "Son",
      age: 8,
      bloodGroup: "A+",
      aadhaarVerified: false,
      healthStatus: "Healthy",
      lastCheckup: "2024-01-12",
      avatar: "AP",
      phone: "+91-9876543212",
      allergies: [],
      medications: [],
      conditions: []
    }
  ];

  const displayMembers = familyMembers.length > 0 ? familyMembers : mockFamilyMembers;

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "good":
      case "healthy":
        return "bg-green-100 text-green-800";
      case "diabetes monitoring":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              Family Health Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage health records for your entire family in one place
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Family Member</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Family Overview</TabsTrigger>
          <TabsTrigger value="health">Health Summary</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-gray-600">{member.relation}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{member.age} years</Badge>
                        <Badge variant="outline">{member.bloodGroup}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Health Status:</span>
                    <Badge className={getHealthStatusColor(member.healthStatus)}>
                      {member.healthStatus}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Aadhaar:</span>
                    <Badge variant={member.aadhaarVerified ? "default" : "secondary"}>
                      {member.aadhaarVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Checkup:</span>
                    <span className="text-sm font-medium">{member.lastCheckup}</span>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      View Health Records
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Activity className="w-4 h-4 mr-2" />
                      Schedule Checkup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Family Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Family Members:</span>
                    <Badge>{displayMembers.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Aadhaar Verified:</span>
                    <Badge variant="default">
                      {displayMembers.filter(m => m.aadhaarVerified).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Medications:</span>
                    <Badge variant="secondary">
                      {displayMembers.reduce((sum, m) => sum + (m.medications?.length || 0), 0)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chronic Conditions:</span>
                    <Badge variant="destructive">
                      {displayMembers.reduce((sum, m) => sum + (m.conditions?.length || 0), 0)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Upcoming Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm font-medium">राधा शर्मा - Calcium Supplement</p>
                    <p className="text-xs text-gray-600">Due today at 8:00 PM</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm font-medium">அருண் குமார் - Blood Sugar Check</p>
                    <p className="text-xs text-gray-600">Due tomorrow at 7:00 AM</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm font-medium">આયુષ પટેલ - Annual Checkup</p>
                    <p className="text-xs text-gray-600">Due in 2 weeks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayMembers.map((member) => (
                  <div key={member.id} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-red-100 text-red-600">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.relation}</p>
                        <p className="text-sm font-medium text-blue-600">{member.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Emergency Services</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>Ambulance:</strong> 108
                  </div>
                  <div>
                    <strong>Police:</strong> 100
                  </div>
                  <div>
                    <strong>Fire:</strong> 101
                  </div>
                  <div>
                    <strong>Women Helpline:</strong> 1091
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Family Insurance Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800">CGHS Coverage</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Policy Number:</span>
                      <p className="font-medium">CGHS/2024/FAM/001</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Coverage Amount:</span>
                      <p className="font-medium">₹5,00,000</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Used Amount:</span>
                      <p className="font-medium">₹45,000</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Remaining:</span>
                      <p className="font-medium text-green-600">₹4,55,000</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {displayMembers.map((member) => (
                    <div key={member.id} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{member.name}</span>
                      </div>
                      <Badge variant="default" className="w-full justify-center">
                        Covered
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}