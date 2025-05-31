import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Leaf, 
  Table, 
  Server, 
  TestTube, 
  Settings, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

interface Connector {
  id: number;
  name: string;
  type: string;
  configuration: any;
  status: string;
  lastTested?: string;
  createdAt: string;
  userId: number;
}

interface ConnectorCardProps {
  connector: Connector;
  onTest: () => void;
  onDelete: () => void;
  isTestingId: number | null;
}

export default function ConnectorCard({ 
  connector, 
  onTest, 
  onDelete, 
  isTestingId 
}: ConnectorCardProps) {
  const getConnectorIcon = (type: string) => {
    switch (type) {
      case "oracle":
        return <Database className="text-red-600" />;
      case "mongodb":
        return <Leaf className="text-green-600" />;
      case "hive":
        return <Table className="text-yellow-600" />;
      case "postgresql":
        return <Database className="text-blue-600" />;
      case "mysql":
        return <Database className="text-orange-600" />;
      default:
        return <Server className="text-gray-600" />;
    }
  };

  const getConnectorBgColor = (type: string) => {
    switch (type) {
      case "oracle":
        return "bg-red-100";
      case "mongodb":
        return "bg-green-100";
      case "hive":
        return "bg-yellow-100";
      case "postgresql":
        return "bg-blue-100";
      case "mysql":
        return "bg-orange-100";
      default:
        return "bg-gray-100";
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "oracle":
        return "Oracle Database";
      case "mongodb":
        return "MongoDB";
      case "hive":
        return "Apache Hive";
      case "postgresql":
        return "PostgreSQL";
      case "mysql":
        return "MySQL";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  const getConnectionInfo = () => {
    const config = connector.configuration;
    
    if (connector.type === "mongodb") {
      return [
        { label: "Database", value: config.database },
        { label: "Connection", value: config.connectionString ? "Configured" : "Not set" }
      ];
    }
    
    return [
      { label: "Host", value: config.host || "Not set" },
      { label: "Database", value: config.database || "Not set" },
      { label: "Port", value: config.port?.toString() || "Default" }
    ];
  };

  const formatLastTested = (lastTested?: string) => {
    if (!lastTested) return "Never tested";
    
    const date = new Date(lastTested);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours >= 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes >= 1) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return "Just now";
    }
  };

  const connectionInfo = getConnectionInfo();
  const isTesting = isTestingId === connector.id;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${getConnectorBgColor(connector.type)} rounded-lg flex items-center justify-center`}>
              {getConnectorIcon(connector.type)}
            </div>
            <div>
              <div className="font-medium text-carbon-gray-100">{connector.name}</div>
              <div className="text-sm text-carbon-gray-50">{getTypeName(connector.type)}</div>
            </div>
          </div>
          {getStatusBadge(connector.status)}
        </div>

        <div className="space-y-2 text-sm text-carbon-gray-70 mb-4">
          {connectionInfo.map((info, index) => (
            <div key={index} className="flex justify-between">
              <span>{info.label}:</span>
              <span className="font-medium truncate ml-2 max-w-32" title={info.value}>
                {info.value}
              </span>
            </div>
          ))}
          <div className="flex justify-between">
            <span>Last Test:</span>
            <span className="font-medium">{formatLastTested(connector.lastTested)}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTest}
            disabled={isTesting}
            className="flex-1"
          >
            <TestTube className="h-4 w-4 mr-1" />
            {isTesting ? "Testing..." : "Test"}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
