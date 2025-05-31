import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Play, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Activity,
  BarChart3
} from "lucide-react";
import JobStatusCard from "@/components/jobs/job-status-card";
import YamlEditor from "@/components/pipeline/yaml-editor";

interface DashboardStats {
  activePipelines: number;
  dataSources: number;
  jobsToday: number;
  dataProcessed: string;
  successRate: string;
}

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

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: pipelines = [] } = useQuery({
    queryKey: ["/api/pipelines"],
  });

  const activeJobs = jobs.filter(job => job.status === "running" || job.status === "queued");

  const sampleYamlConfig = `transformations:
  - name: "customer_cleansing"
    type: "data_quality"
    rules:
      - field: "email"
        validation: "email_format"
      - field: "phone"
        standardize: "e164_format"
      - field: "address"
        geocode: true
        
  - name: "order_aggregation"
    type: "aggregate"
    group_by: ["customer_id", "date"]
    aggregates:
      total_amount: "sum(amount)"
      order_count: "count(*)"
      avg_value: "avg(amount)"

sources:
  oracle_orders:
    connection: "prod_oracle"
    query: "SELECT * FROM orders WHERE created_date >= '2024-01-01'"
    
targets:
  hive_warehouse:
    table: "analytics.customer_orders_daily"
    mode: "append"
    partition_by: ["date"]`;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-carbon-gray-100 mb-2">Dashboard Overview</h2>
        <p className="text-carbon-gray-70">Monitor your ETL pipelines and data workflows</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon-gray-50 mb-1">Active Pipelines</p>
                <p className="text-2xl font-semibold text-carbon-gray-100">
                  {statsLoading ? "..." : stats?.activePipelines || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-carbon-green mr-1" />
              <span className="text-carbon-green text-sm">+12%</span>
              <span className="text-carbon-gray-50 text-sm ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon-gray-50 mb-1">Data Sources</p>
                <p className="text-2xl font-semibold text-carbon-gray-100">
                  {statsLoading ? "..." : stats?.dataSources || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="h-4 w-4 text-carbon-green mr-1" />
              <span className="text-carbon-green text-sm">3 new</span>
              <span className="text-carbon-gray-50 text-sm ml-2">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon-gray-50 mb-1">Jobs Today</p>
                <p className="text-2xl font-semibold text-carbon-gray-100">
                  {statsLoading ? "..." : stats?.jobsToday || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="h-4 w-4 text-carbon-green mr-1" />
              <span className="text-carbon-green text-sm">
                {statsLoading ? "..." : stats?.successRate || "0"}%
              </span>
              <span className="text-carbon-gray-50 text-sm ml-2">success rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-carbon-gray-50 mb-1">Data Processed</p>
                <p className="text-2xl font-semibold text-carbon-gray-100">
                  {statsLoading ? "..." : stats?.dataProcessed || "0GB"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-carbon-green mr-1" />
              <span className="text-carbon-green text-sm">+8.2%</span>
              <span className="text-carbon-gray-50 text-sm ml-2">vs yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs and YAML Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-carbon-gray-100">Active Jobs</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-carbon-gray-10 rounded-lg h-20"></div>
                ))}
              </div>
            ) : activeJobs.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-carbon-gray-50 mx-auto mb-4" />
                <p className="text-carbon-gray-50">No active jobs</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.slice(0, 3).map((job) => (
                  <JobStatusCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-carbon-gray-100">
                Transformation Config
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Validate</Button>
                <Button size="sm">Apply</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <YamlEditor value={sampleYamlConfig} readOnly />
          </CardContent>
        </Card>
      </div>

      {/* Recent Pipeline Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-carbon-gray-100">
            Recent Pipeline Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelines.slice(0, 5).map((pipeline: any) => (
              <div key={pipeline.id} className="flex items-center justify-between p-4 bg-carbon-gray-10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    pipeline.status === "active" ? "bg-carbon-green" :
                    pipeline.status === "error" ? "bg-carbon-red" : "bg-carbon-yellow"
                  }`}></div>
                  <div>
                    <div className="font-medium text-carbon-gray-100">{pipeline.name}</div>
                    <div className="text-sm text-carbon-gray-50">{pipeline.description || "No description"}</div>
                  </div>
                </div>
                <Badge variant={pipeline.status === "active" ? "default" : "secondary"}>
                  {pipeline.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
