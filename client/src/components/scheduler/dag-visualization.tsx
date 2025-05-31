import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Play } from "lucide-react";

interface DagNode {
  id: string;
  name: string;
  status: "completed" | "running" | "pending" | "failed";
  position: { x: number; y: number };
}

interface DagConnection {
  from: string;
  to: string;
}

const sampleDags = [
  {
    id: "daily_sales_etl",
    name: "Daily Sales ETL",
    nodes: [
      { id: "start", name: "Start", status: "completed" as const, position: { x: 20, y: 32 } },
      { id: "extract", name: "Extract", status: "completed" as const, position: { x: 120, y: 32 } },
      { id: "transform", name: "Transform", status: "running" as const, position: { x: 220, y: 32 } },
      { id: "load", name: "Load", status: "pending" as const, position: { x: 320, y: 32 } },
    ],
    connections: [
      { from: "start", to: "extract" },
      { from: "extract", to: "transform" },
      { from: "transform", to: "load" },
    ],
    runInfo: {
      status: "Running",
      startTime: "2024-01-15 02:00:00",
      duration: "2m 15s",
      progress: "3/4 tasks completed"
    }
  },
  {
    id: "customer_sync",
    name: "Customer Sync",
    nodes: [
      { id: "start", name: "Start", status: "completed" as const, position: { x: 20, y: 32 } },
      { id: "validate", name: "Validate", status: "completed" as const, position: { x: 120, y: 32 } },
      { id: "sync", name: "Sync", status: "completed" as const, position: { x: 220, y: 32 } },
      { id: "notify", name: "Notify", status: "completed" as const, position: { x: 320, y: 32 } },
    ],
    connections: [
      { from: "start", to: "validate" },
      { from: "validate", to: "sync" },
      { from: "sync", to: "notify" },
    ],
    runInfo: {
      status: "Completed",
      startTime: "2024-01-15 01:45:00",
      duration: "45s",
      progress: "4/4 tasks completed"
    }
  },
  {
    id: "weekly_report",
    name: "Weekly Report ETL",
    nodes: [
      { id: "start", name: "Start", status: "failed" as const, position: { x: 20, y: 32 } },
      { id: "collect", name: "Collect", status: "pending" as const, position: { x: 120, y: 32 } },
      { id: "analyze", name: "Analyze", status: "pending" as const, position: { x: 220, y: 32 } },
      { id: "report", name: "Report", status: "pending" as const, position: { x: 320, y: 32 } },
    ],
    connections: [
      { from: "start", to: "collect" },
      { from: "collect", to: "analyze" },
      { from: "analyze", to: "report" },
    ],
    runInfo: {
      status: "Failed",
      startTime: "2024-01-14 06:00:00",
      duration: "5s",
      progress: "0/4 tasks completed"
    }
  }
];

export default function DagVisualization() {
  const [selectedDag, setSelectedDag] = useState(sampleDags[0]);

  const getNodeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "running":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-400";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getNodeIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "running":
        return <Play className="h-3 w-3 animate-pulse" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "failed":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Running":
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "Failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderConnections = () => {
    return selectedDag.connections.map((connection, index) => {
      const fromNode = selectedDag.nodes.find(n => n.id === connection.from);
      const toNode = selectedDag.nodes.find(n => n.id === connection.to);
      
      if (!fromNode || !toNode) return null;
      
      const startX = fromNode.position.x + 40; // Node width / 2
      const startY = fromNode.position.y + 15; // Node height / 2
      const endX = toNode.position.x;
      const endY = toNode.position.y + 15;
      
      return (
        <line
          key={index}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="hsl(var(--carbon-blue))"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 border-b border-carbon-gray-20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-carbon-gray-100">DAG Visualization</h3>
          <Select 
            value={selectedDag.id} 
            onValueChange={(value) => {
              const dag = sampleDags.find(d => d.id === value);
              if (dag) setSelectedDag(dag);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sampleDags.map((dag) => (
                <SelectItem key={dag.id} value={dag.id}>
                  {dag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="p-6">
        <div className="bg-carbon-gray-10 rounded-lg p-6 min-h-32 relative overflow-hidden">
          {/* SVG for connections */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--carbon-blue))" />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          {/* Task nodes */}
          {selectedDag.nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute ${getNodeColor(node.status)} text-white p-3 rounded text-sm text-center w-20 shadow-md`}
              style={{
                left: node.position.x,
                top: node.position.y
              }}
            >
              <div className="mb-1 font-medium">{node.name}</div>
              <div className="flex justify-center">
                {getNodeIcon(node.status)}
              </div>
            </div>
          ))}
        </div>

        {/* DAG Run Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base font-medium text-carbon-gray-100">
              DAG Run Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-carbon-gray-70">Status:</span>
                <div className="mt-1">
                  {getStatusBadge(selectedDag.runInfo.status)}
                </div>
              </div>
              <div>
                <span className="text-carbon-gray-70">Started:</span>
                <div className="mt-1 font-medium text-carbon-gray-100">
                  {selectedDag.runInfo.startTime}
                </div>
              </div>
              <div>
                <span className="text-carbon-gray-70">Duration:</span>
                <div className="mt-1 font-medium text-carbon-gray-100">
                  {selectedDag.runInfo.duration}
                </div>
              </div>
              <div>
                <span className="text-carbon-gray-70">Progress:</span>
                <div className="mt-1 font-medium text-carbon-gray-100">
                  {selectedDag.runInfo.progress}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
