import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./lib/i18n";
import { DataProvider } from "@/lib/DataContext";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import Research from "@/pages/research";
import ProjectDetail from "@/pages/ProjectDetail";
import AllActivities from "@/pages/AllActivities";
import ActivitiesDetails from "@/pages/ActivitiesDetails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/research" component={Research} />
      <Route path="/project/:id" component={ProjectDetail} />
      <Route path="/activities" component={AllActivities} />
      <Route path="/activity/:id" component={ActivitiesDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <DataProvider>
            <Toaster />
            <SonnerToaster />
            <Router />
          </DataProvider>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;