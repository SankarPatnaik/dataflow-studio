import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  Square, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Activity
} from "lucide-react";

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

interface JobStatusCardProps {
  job: Job;
  pipelineName?: string;
}

export default function JobStatusCard({ job, pipelineName }: JobStatusCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "queued":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
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

  const getStatusPulseColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "queued":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
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

  const getEstimatedRemaining = (progress: number, duration: string) => {
    if (job.status !== "running" || progress === 0) return "";
    
    const [minutes, seconds] = duration.replace('m', '').replace('s', '').split(' ').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    const estimatedTotal = totalSeconds / (progress / 100);
    const remaining = estimatedTotal - totalSeconds;
    
    const remainingMinutes = Math.floor(remaining / 60);
    const remainingSeconds = Math.floor(remaining % 60);
    
    if (remainingMinutes > 0) {
      return `~${remainingMinutes}m remaining`;
    }
    return `~${remainingSeconds}s remaining`;
  };

  const getJobDescription = () => {
    switch (job.status) {
      case "running":
        return `Processing - ${job.progress}% complete`;
      case "completed":
        return "Completed successfully";
      case "failed":
        return job.errorMessage || "Job failed";
      case "queued":
        return "Queued - Waiting to start";
      default:
        return job.status;
    }
  };

  const duration = formatDuration(job.startTime, job.endTime);
  const estimatedRemaining = getEstimatedRemaining(job.progress, duration);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={`w-3 h-3 ${getStatusPulseColor(job.status)} rounded-full ${
              job.status === "running" ? "animate-pulse" : ""
            }`}></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="font-medium text-carbon-gray-100 truncate">
                  {pipelineName || `Job #${job.id}`}
                </div>
                <Badge className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
              </div>
              <div className="text-sm text-carbon-gray-50 mb-2">
                {getJobDescription()}
              </div>
              
              {job.status === "running" && (
                <div className="space-y-2">
                  <Progress value={job.progress} className="w-full" />
                  <div className="flex justify-between text-xs text-carbon-gray-50">
                    <span>{job.progress}% complete</span>
                    <span>{estimatedRemaining}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 ml-4">
            <div className="text-right text-sm">
              <div className="font-medium text-carbon-gray-100">{duration}</div>
              <div className="text-carbon-gray-50">
                {job.startTime ? new Date(job.startTime).toLocaleTimeString() : "Not started"}
              </div>
            </div>
            
            <div className="flex space-x-1">
              {job.status === "running" && (
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Latest log entry */}
        {job.logs && job.logs.length > 0 && (
          <div className="mt-3 p-2 bg-carbon-gray-10 rounded text-xs text-carbon-gray-70 font-mono">
            {job.logs[job.logs.length - 1]}
          </div>
        )}

        {/* Error message */}
        {job.status === "failed" && job.errorMessage && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
            <strong>Error:</strong> {job.errorMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
