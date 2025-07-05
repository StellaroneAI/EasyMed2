import { Switch, Route } from "wouter";
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
import Header from "@/components/layout/header";

function Router() {
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
        <Route component={NotFound} />
      </Switch>
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