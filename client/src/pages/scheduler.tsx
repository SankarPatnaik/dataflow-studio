import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Play, 
  Pause, 
  Clock, 
  Calendar,
  Settings,
  Trash2
} from "lucide-react";
import DagVisualization from "@/components/scheduler/dag-visualization";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Schedule {
  id: number;
  pipelineId: number;
  cronExpression: string;
  isActive: boolean;
  nextRun?: string;
  lastRun?: string;
  createdAt: string;
}

interface Pipeline {
  id: number;
  name: string;
  description?: string;
  status: string;
}

export default function Scheduler() {
  const { toast } = useToast();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>("");
  const [cronExpression, setCronExpression] = useState("0 2 * * *");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: schedules = [], isLoading: schedulesLoading } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
  });

  const { data: pipelines = [] } = useQuery<Pipeline[]>({
    queryKey: ["/api/pipelines"],
  });

  const createScheduleMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/schedules", {
        pipelineId: parseInt(selectedPipelineId),
        cronExpression,
        isActive: true,
        nextRun: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      });
    },
    onSuccess: () => {
      toast({
        title: "Schedule created",
        description: "Pipeline schedule has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      setIsCreateDialogOpen(false);
      setSelectedPipelineId("");
      setCronExpression("0 2 * * *");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create schedule. Please try again.",
        variant: "destructive",
      });
    }
  });

  const toggleScheduleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return apiRequest("PUT", `/api/schedules/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
    }
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/schedules/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Schedule deleted",
        description: "Pipeline schedule has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
    }
  });

  const getPipelineName = (pipelineId: number) => {
    const pipeline = pipelines.find(p => p.id === pipelineId);
    return pipeline?.name || `Pipeline ${pipelineId}`;
  };

  const formatCronExpression = (cron: string) => {
    // Simple cron expression formatter
    const cronMap: { [key: string]: string } = {
      "0 2 * * *": "Daily at 2:00 AM",
      "*/15 * * * *": "Every 15 minutes",
      "0 6 * * 0": "Sundays at 6:00 AM",
      "0 0 1 * *": "First day of every month",
    };
    
    return cronMap[cron] || cron;
  };

  const formatNextRun = (nextRun?: string) => {
    if (!nextRun) return "Not scheduled";
    
    const date = new Date(nextRun);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs < 0) return "Overdue";
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `In ${days} days`;
    if (hours > 0) return `In ${hours} hours`;
    return `In ${minutes} minutes`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-carbon-gray-100 mb-2">Pipeline Scheduler</h2>
            <p className="text-carbon-gray-70">Schedule and manage automated pipeline executions</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Pipeline Schedule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                    Pipeline
                  </label>
                  <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pipeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelines.map((pipeline) => (
                        <SelectItem key={pipeline.id} value={pipeline.id.toString()}>
                          {pipeline.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                    Schedule
                  </label>
                  <Select value={cronExpression} onValueChange={setCronExpression}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0 2 * * *">Daily at 2:00 AM</SelectItem>
                      <SelectItem value="*/15 * * * *">Every 15 minutes</SelectItem>
                      <SelectItem value="0 6 * * 0">Sundays at 6:00 AM</SelectItem>
                      <SelectItem value="0 0 1 * *">First day of every month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => createScheduleMutation.mutate()}
                    disabled={!selectedPipelineId || createScheduleMutation.isPending}
                  >
                    {createScheduleMutation.isPending ? "Creating..." : "Create Schedule"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Scheduled Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-carbon-gray-100">
              Scheduled Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {schedulesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-carbon-gray-10 rounded-lg h-20"></div>
                ))}
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-carbon-gray-50 mx-auto mb-4" />
                <p className="text-carbon-gray-50">No scheduled jobs</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border border-carbon-gray-30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-carbon-gray-100">
                          {getPipelineName(schedule.pipelineId)}
                        </div>
                        <div className="text-sm text-carbon-gray-50">
                          {formatCronExpression(schedule.cronExpression)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={schedule.isActive ? "default" : "secondary"}>
                          {schedule.isActive ? "Active" : "Paused"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleScheduleMutation.mutate({
                            id: schedule.id,
                            isActive: !schedule.isActive
                          })}
                        >
                          {schedule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteScheduleMutation.mutate(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-carbon-gray-70">
                      <div>Next: <span>{formatNextRun(schedule.nextRun)}</span></div>
                      <div>
                        Last: <span>
                          {schedule.lastRun 
                            ? new Date(schedule.lastRun).toLocaleDateString()
                            : "Never"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* DAG Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-carbon-gray-100">
              DAG Visualization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DagVisualization />
          </CardContent>
        </Card>
      </div>

      {/* Schedule Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-carbon-gray-100">
            Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-carbon-gray-20">
                  <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Pipeline</th>
                  <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Schedule</th>
                  <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Next Run</th>
                  <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Last Run</th>
                  <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b border-carbon-gray-20 hover:bg-carbon-gray-10">
                    <td className="py-3 px-4 text-carbon-gray-100">
                      {getPipelineName(schedule.pipelineId)}
                    </td>
                    <td className="py-3 px-4 text-carbon-gray-70">
                      {formatCronExpression(schedule.cronExpression)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={schedule.isActive ? "default" : "secondary"}>
                        {schedule.isActive ? "Active" : "Paused"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-carbon-gray-70">
                      {formatNextRun(schedule.nextRun)}
                    </td>
                    <td className="py-3 px-4 text-carbon-gray-70">
                      {schedule.lastRun 
                        ? new Date(schedule.lastRun).toLocaleDateString()
                        : "Never"
                      }
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleScheduleMutation.mutate({
                            id: schedule.id,
                            isActive: !schedule.isActive
                          })}
                        >
                          {schedule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteScheduleMutation.mutate(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
