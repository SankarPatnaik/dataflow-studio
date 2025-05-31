import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Filter, Warehouse, ArrowRight, X, Settings } from "lucide-react";

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

interface PipelineCanvasProps {
  nodes: PipelineNode[];
  connections: PipelineConnection[];
  onNodesChange: (nodes: PipelineNode[]) => void;
  onConnectionsChange: (connections: PipelineConnection[]) => void;
}

export default function PipelineCanvas({
  nodes,
  connections,
  onNodesChange,
  onConnectionsChange,
}: PipelineCanvasProps) {
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodeIcon = (node: PipelineNode) => {
    if (node.type === "source") {
      switch (node.sourceType) {
        case "oracle":
          return <Database className="h-5 w-5 text-red-600" />;
        case "mongodb":
          return <Database className="h-5 w-5 text-green-600" />;
        case "hive":
          return <Database className="h-5 w-5 text-yellow-600" />;
        default:
          return <Database className="h-5 w-5 text-blue-600" />;
      }
    } else if (node.type === "transform") {
      return <Filter className="h-5 w-5 text-purple-600" />;
    } else if (node.type === "destination") {
      return <Warehouse className="h-5 w-5 text-indigo-600" />;
    }
    return <Database className="h-5 w-5 text-gray-600" />;
  };

  const getNodeColor = (node: PipelineNode) => {
    if (node.type === "source") {
      switch (node.sourceType) {
        case "oracle":
          return "bg-red-500";
        case "mongodb":
          return "bg-green-500";
        case "hive":
          return "bg-yellow-500";
        default:
          return "bg-blue-500";
      }
    } else if (node.type === "transform") {
      return "bg-purple-500";
    } else if (node.type === "destination") {
      return "bg-indigo-500";
    }
    return "bg-gray-500";
  };

  const getNodeLabel = (node: PipelineNode) => {
    if (node.type === "source") {
      switch (node.sourceType) {
        case "oracle":
          return "Oracle DB";
        case "mongodb":
          return "MongoDB";
        case "hive":
          return "Hive Table";
        default:
          return "Data Source";
      }
    } else if (node.type === "transform") {
      switch (node.transformType) {
        case "filter":
          return "Filter";
        case "join":
          return "Join";
        case "aggregate":
          return "Aggregate";
        default:
          return "Transform";
      }
    } else if (node.type === "destination") {
      switch (node.destinationType) {
        case "warehouse":
          return "Data Warehouse";
        case "file":
          return "File Export";
        default:
          return "Destination";
      }
    }
    return "Node";
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setDraggedNode(nodeId);
    setSelectedNode(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - node.position.x,
        y: e.clientY - node.position.y
      });
    }
  }, [nodes]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedNode) {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;
      
      const updatedNodes = nodes.map(node =>
        node.id === draggedNode
          ? { ...node, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : node
      );
      onNodesChange(updatedNodes);
    }
  }, [draggedNode, dragOffset, nodes, onNodesChange]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData("text/plain");
    
    if (componentData) {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      
      const [type, subType] = componentData.split(':');
      const newNode: PipelineNode = {
        id: `node_${Date.now()}`,
        type,
        position: { x, y }
      };

      if (type === "source" && subType) {
        newNode.sourceType = subType;
      } else if (type === "transform" && subType) {
        newNode.transformType = subType;
      } else if (type === "destination" && subType) {
        newNode.destinationType = subType;
      }

      onNodesChange([...nodes, newNode]);
    }
  }, [nodes, onNodesChange]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    const updatedConnections = connections.filter(
      conn => conn.source !== nodeId && conn.target !== nodeId
    );
    onNodesChange(updatedNodes);
    onConnectionsChange(updatedConnections);
    setSelectedNode(null);
  }, [nodes, connections, onNodesChange, onConnectionsChange]);

  const renderConnections = () => {
    return connections.map((connection, index) => {
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const startX = sourceNode.position.x + 80; // Node width / 2
      const startY = sourceNode.position.y + 30; // Node height / 2
      const endX = targetNode.position.x;
      const endY = targetNode.position.y + 30;
      
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
    <div
      className="bg-carbon-gray-10 rounded-lg p-6 min-h-96 relative border-2 border-dashed border-carbon-gray-30 overflow-hidden"
      onDrop={handleCanvasDrop}
      onDragOver={handleCanvasDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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

      {/* Render nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`absolute pipeline-node cursor-move ${getNodeColor(node)} text-white p-4 rounded-lg shadow-lg w-40 select-none ${
            selectedNode === node.id ? "ring-2 ring-carbon-blue ring-offset-2" : ""
          }`}
          style={{
            left: node.position.x,
            top: node.position.y,
            zIndex: selectedNode === node.id ? 10 : 1
          }}
          onMouseDown={(e) => handleMouseDown(e, node.id)}
        >
          <div className="flex items-center justify-between mb-2">
            {getNodeIcon(node)}
            {selectedNode === node.id && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(node.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="font-medium text-sm">{getNodeLabel(node)}</div>
          <div className="text-xs opacity-80">
            {node.type === "source" ? "Source" : 
             node.type === "transform" ? "Transform" : "Target"}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-carbon-gray-50">
            <ArrowRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Drag components here to build your pipeline</p>
            <p className="text-sm">Connect data sources, transformations, and destinations</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-carbon-gray-50 text-sm">
        Drag components from the toolbox to build your pipeline
      </div>
    </div>
  );
}
