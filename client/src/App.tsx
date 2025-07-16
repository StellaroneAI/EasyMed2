import { Switch, Route, useLocation } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import Appointments from "@/pages/appointments";
import Records from "@/pages/records";
import LabTests from "@/pages/lab-tests";
import AiChecker from "@/pages/ai-checker";
import FamilyHealth from "@/pages/family-health";
import Header from "@/components/layout/header";
import VoiceAssistantButton from "@/components/voice/voice-assistant-button";

function Router() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<"english" | "hindi" | "tamil" | "telugu">("english");

  const handleVoiceNavigation = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-clinical-bg">
      <Header />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/patients" component={Patients} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/records" component={Records} />
        <Route path="/lab-tests" component={LabTests} />
        <Route path="/ai-checker" component={AiChecker} />
        <Route path="/family" component={FamilyHealth} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Floating Voice Assistant Button */}
      <VoiceAssistantButton 
        language={language}
        onNavigate={handleVoiceNavigation}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;