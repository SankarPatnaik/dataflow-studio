import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, 
  Play, 
  Pause, 
  Square, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import JobStatusCard from "@/components/jobs/job-status-card";

interface Job {
  id: number;
  pipelineId: number;
  status: string;
  startTime?: string;
  endTime?: string;
  progress: number;
  logs: string[];
  errorMessage?: string;
  createdAt: string;
}

interface Pipeline {
  id: number;
  name: string;
  description?: string;
  status: string;
}

export default function JobMonitor() {
  const { data: jobs = [], isLoading: jobsLoading, refetch } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  const { data: pipelines = [] } = useQuery<Pipeline[]>({
    queryKey: ["/api/pipelines"],
  });

  const getPipelineName = (pipelineId: number) => {
    const pipeline = pipelines.find(p => p.id === pipelineId);
    return pipeline?.name || `Pipeline ${pipelineId}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Play className="h-4 w-4 text-carbon-green" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-carbon-green" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-carbon-red" />;
      case "queued":
        return <Clock className="h-4 w-4 text-carbon-yellow" />;
      default:
        return <AlertCircle className="h-4 w-4 text-carbon-gray-50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "queued":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDuration = (startTime?: string, endTime?: string) => {
    if (!startTime) return "-";
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  const activeJobs = jobs.filter(job => job.status === "running" || job.status === "queued");
  const completedJobs = jobs.filter(job => job.status === "completed");
  const failedJobs = jobs.filter(job => job.status === "failed");

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-carbon-gray-100 mb-2">Job Monitor</h2>
            <p className="text-carbon-gray-70">Monitor and manage pipeline execution jobs</p>
          </div>
          <Button onClick={() => refetch()} disabled={jobsLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${jobsLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon-gray-50 mb-1">Active Jobs</p>
                <p className="text-2xl font-semibold text-carbon-gray-100">{activeJobs.length}</p>
              </div>
              <Play className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon-gray-50 mb-1">Completed</p>
                <p className="text-2xl font-semibold text-carbon-gray-100">{completedJobs.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-carbon-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon-gray-50 mb-1">Failed</p>
                <p className="text-2xl font-semibold text-carbon-gray-100">{failedJobs.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-carbon-red" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon-gray-50 mb-1">Total Jobs</p>
                <p className="text-2xl font-semibold text-carbon-gray-100">{jobs.length}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-carbon-gray-100">
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <JobStatusCard key={job.id} job={job} pipelineName={getPipelineName(job.pipelineId)} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-carbon-gray-100">
            Job History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse bg-carbon-gray-10 rounded-lg h-16"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-carbon-gray-50 mx-auto mb-4" />
              <p className="text-carbon-gray-50 text-lg mb-2">No jobs found</p>
              <p className="text-carbon-gray-50">Jobs will appear here when pipelines are executed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-carbon-gray-20">
                    <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Job ID</th>
                    <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Pipeline</th>
                    <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Progress</th>
                    <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Started</th>
                    <th className="text-left py-3 px-4 font-medium text-carbon-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-carbon-gray-20 hover:bg-carbon-gray-10">
                      <td className="py-3 px-4 text-carbon-gray-100">#{job.id}</td>
                      <td className="py-3 px-4 text-carbon-gray-100">
                        {getPipelineName(job.pipelineId)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(job.status)}
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Progress value={job.progress} className="w-20" />
                          <span className="text-sm text-carbon-gray-70">{job.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-carbon-gray-70">
                        {formatDuration(job.startTime, job.endTime)}
                      </td>
                      <td className="py-3 px-4 text-carbon-gray-70">
                        {job.startTime ? new Date(job.startTime).toLocaleString() : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {job.status === "running" && (
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
