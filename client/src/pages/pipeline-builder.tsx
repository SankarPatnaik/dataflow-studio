import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Play, Eye } from "lucide-react";
import PipelineCanvas from "@/components/pipeline/pipeline-canvas";
import ComponentToolbox from "@/components/pipeline/component-toolbox";
import YamlEditor from "@/components/pipeline/yaml-editor";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PipelineNode {
  id: string;
  type: string;
  sourceType?: string;
  transformType?: string;
  destinationType?: string;
  position: { x: number; y: number };
  data?: any;
}

interface PipelineConnection {
  source: string;
  target: string;
}

interface PipelineConfig {
  nodes: PipelineNode[];
  connections: PipelineConnection[];
  yamlConfig: string;
}

export default function PipelineBuilder() {
  const { toast } = useToast();
  const [pipelineName, setPipelineName] = useState("New Pipeline");
  const [pipelineDescription, setPipelineDescription] = useState("");
  const [pipelineConfig, setPipelineConfig] = useState<PipelineConfig>({
    nodes: [],
    connections: [],
    yamlConfig: `transformations:
  - name: "data_cleansing"
    type: "data_quality"
    rules:
      - field: "email"
        validation: "email_format"

sources:
  oracle_source:
    connection: "prod_oracle"
    query: "SELECT * FROM customers"
    
targets:
  hive_target:
    table: "analytics.customers_clean"
    mode: "append"`
  });

  const savePipelineMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/pipelines", {
        name: pipelineName,
        description: pipelineDescription,
        configuration: pipelineConfig,
        status: "draft"
      });
    },
    onSuccess: () => {
      toast({
        title: "Pipeline saved",
        description: "Your pipeline has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pipelines"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save pipeline. Please try again.",
        variant: "destructive",
      });
    }
  });

  const runPipelineMutation = useMutation({
    mutationFn: async () => {
      // First save the pipeline, then create a job
      const pipelineResponse = await apiRequest("POST", "/api/pipelines", {
        name: pipelineName,
        description: pipelineDescription,
        configuration: pipelineConfig,
        status: "active"
      });
      
      const pipeline = await pipelineResponse.json();
      
      return apiRequest("POST", "/api/jobs", {
        pipelineId: pipeline.id,
        status: "queued",
        progress: 0,
        logs: ["Pipeline queued for execution"]
      });
    },
    onSuccess: () => {
      toast({
        title: "Pipeline started",
        description: "Your pipeline has been queued for execution.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pipelines"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start pipeline. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAddNode = (nodeType: string, subType?: string) => {
    const newNode: PipelineNode = {
      id: `node_${Date.now()}`,
      type: nodeType,
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 200 + 100 
      }
    };

    if (nodeType === "source" && subType) {
      newNode.sourceType = subType;
    } else if (nodeType === "transform" && subType) {
      newNode.transformType = subType;
    } else if (nodeType === "destination" && subType) {
      newNode.destinationType = subType;
    }

    setPipelineConfig(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  const handleUpdateNodes = (nodes: PipelineNode[]) => {
    setPipelineConfig(prev => ({
      ...prev,
      nodes
    }));
  };

  const handleUpdateConnections = (connections: PipelineConnection[]) => {
    setPipelineConfig(prev => ({
      ...prev,
      connections
    }));
  };

  const handleYamlChange = (yaml: string) => {
    setPipelineConfig(prev => ({
      ...prev,
      yamlConfig: yaml
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-carbon-gray-100 mb-2">Pipeline Builder</h2>
            <p className="text-carbon-gray-70">Design and configure your ETL pipelines visually</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => savePipelineMutation.mutate()}
              disabled={savePipelineMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {savePipelineMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button 
              onClick={() => runPipelineMutation.mutate()}
              disabled={runPipelineMutation.isPending}
            >
              <Play className="h-4 w-4 mr-2" />
              {runPipelineMutation.isPending ? "Starting..." : "Run"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
              Pipeline Name
            </label>
            <Input
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="Enter pipeline name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
              Description
            </label>
            <Input
              value={pipelineDescription}
              onChange={(e) => setPipelineDescription(e.target.value)}
              placeholder="Enter pipeline description"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-carbon-gray-100">
                Pipeline Canvas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <PipelineCanvas
                nodes={pipelineConfig.nodes}
                connections={pipelineConfig.connections}
                onNodesChange={handleUpdateNodes}
                onConnectionsChange={handleUpdateConnections}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <ComponentToolbox onAddNode={handleAddNode} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-carbon-gray-100">
            YAML Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <YamlEditor
            value={pipelineConfig.yamlConfig}
            onChange={handleYamlChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
