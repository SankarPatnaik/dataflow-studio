import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import ConnectorCard from "@/components/connectors/connector-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

export default function Connectors() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    host: "",
    port: "",
    database: "",
    username: "",
    password: "",
    connectionString: ""
  });

  const { data: connectors = [], isLoading } = useQuery<Connector[]>({
    queryKey: ["/api/connectors"],
  });

  const createConnectorMutation = useMutation({
    mutationFn: async () => {
      const configuration: any = {};
      
      if (formData.type === "oracle" || formData.type === "mysql" || formData.type === "postgresql") {
        configuration.host = formData.host;
        configuration.port = parseInt(formData.port);
        configuration.database = formData.database;
        configuration.username = formData.username;
        configuration.password = formData.password;
      } else if (formData.type === "mongodb") {
        configuration.connectionString = formData.connectionString;
        configuration.database = formData.database;
      } else if (formData.type === "hive") {
        configuration.server = formData.host;
        configuration.port = parseInt(formData.port);
        configuration.database = formData.database;
      }

      return apiRequest("POST", "/api/connectors", {
        name: formData.name,
        type: formData.type,
        configuration,
        status: "inactive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Connector created",
        description: "Data connector has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connectors"] });
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        type: "",
        host: "",
        port: "",
        database: "",
        username: "",
        password: "",
        connectionString: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create connector. Please try again.",
        variant: "destructive",
      });
    }
  });

  const testConnectorMutation = useMutation({
    mutationFn: async (connectorId: number) => {
      return apiRequest("POST", `/api/connectors/${connectorId}/test`);
    },
    onSuccess: (response) => {
      response.json().then((data) => {
        toast({
          title: data.success ? "Connection successful" : "Connection failed",
          description: data.success 
            ? "Connector is working properly." 
            : "Failed to connect. Please check configuration.",
          variant: data.success ? "default" : "destructive",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/connectors"] });
      });
    }
  });

  const deleteConnectorMutation = useMutation({
    mutationFn: async (connectorId: number) => {
      return apiRequest("DELETE", `/api/connectors/${connectorId}`);
    },
    onSuccess: () => {
      toast({
        title: "Connector deleted",
        description: "Data connector has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connectors"] });
    }
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDefaultPort = (type: string) => {
    const ports: { [key: string]: string } = {
      oracle: "1521",
      mysql: "3306",
      postgresql: "5432",
      hive: "10000"
    };
    return ports[type] || "";
  };

  const renderConnectionFields = () => {
    if (formData.type === "mongodb") {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
              Connection String
            </label>
            <Input
              value={formData.connectionString}
              onChange={(e) => handleFormChange("connectionString", e.target.value)}
              placeholder="mongodb+srv://username:password@cluster.mongodb.net"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
              Database
            </label>
            <Input
              value={formData.database}
              onChange={(e) => handleFormChange("database", e.target.value)}
              placeholder="database_name"
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
              Host
            </label>
            <Input
              value={formData.host}
              onChange={(e) => handleFormChange("host", e.target.value)}
              placeholder="hostname or IP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
              Port
            </label>
            <Input
              value={formData.port}
              onChange={(e) => handleFormChange("port", e.target.value)}
              placeholder={getDefaultPort(formData.type)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
            Database
          </label>
          <Input
            value={formData.database}
            onChange={(e) => handleFormChange("database", e.target.value)}
            placeholder="database_name"
          />
        </div>
        {formData.type !== "hive" && (
          <>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Username
              </label>
              <Input
                value={formData.username}
                onChange={(e) => handleFormChange("username", e.target.value)}
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleFormChange("password", e.target.value)}
                placeholder="password"
              />
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-carbon-gray-100 mb-2">Data Connectors</h2>
            <p className="text-carbon-gray-70">Manage connections to your data sources</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Connector
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Data Connector</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                    Connection Type
                  </label>
                  <Select value={formData.type} onValueChange={(value) => {
                    handleFormChange("type", value);
                    handleFormChange("port", getDefaultPort(value));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select connector type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oracle">Oracle Database</SelectItem>
                      <SelectItem value="mongodb">MongoDB</SelectItem>
                      <SelectItem value="hive">Apache Hive</SelectItem>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                    Connection Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="Enter a descriptive name..."
                  />
                </div>
                {formData.type && renderConnectionFields()}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => createConnectorMutation.mutate()}
                    disabled={!formData.name || !formData.type || createConnectorMutation.isPending}
                  >
                    {createConnectorMutation.isPending ? "Creating..." : "Create Connector"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Connectors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg border border-carbon-gray-20 h-48"></div>
          ))}
        </div>
      ) : connectors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Plus className="h-12 w-12 text-carbon-gray-50 mx-auto mb-4" />
            <p className="text-carbon-gray-50 text-lg mb-2">No connectors configured</p>
            <p className="text-carbon-gray-50 mb-4">
              Add your first data connector to start building pipelines
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Connector
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectors.map((connector) => (
            <ConnectorCard
              key={connector.id}
              connector={connector}
              onTest={() => testConnectorMutation.mutate(connector.id)}
              onDelete={() => deleteConnectorMutation.mutate(connector.id)}
              isTestingId={testConnectorMutation.isPending ? connector.id : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
