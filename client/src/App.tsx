import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import PipelineBuilder from "@/pages/pipeline-builder";
import JobMonitor from "@/pages/job-monitor";
import Scheduler from "@/pages/scheduler";
import Connectors from "@/pages/connectors";
import Configuration from "@/pages/configuration";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex pt-16">
      <Sidebar />
      <main className="flex-1 lg:ml-0 ml-0">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/pipeline-builder" component={PipelineBuilder} />
          <Route path="/job-monitor" component={JobMonitor} />
          <Route path="/scheduler" component={Scheduler} />
          <Route path="/connectors" component={Connectors} />
          <Route path="/configuration" component={Configuration} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-carbon-gray-10 min-h-screen">
          <Header />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
