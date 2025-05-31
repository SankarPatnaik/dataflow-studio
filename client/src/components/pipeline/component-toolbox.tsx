import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Filter, ArrowLeftRight, Calculator, Warehouse, FileText } from "lucide-react";

interface ComponentToolboxProps {
  onAddNode: (type: string, subType?: string) => void;
}

interface ToolboxItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: string;
  subType?: string;
  color: string;
}

const toolboxSections = [
  {
    title: "Data Sources",
    items: [
      {
        id: "oracle",
        name: "Oracle",
        icon: <Database className="h-4 w-4" />,
        type: "source",
        subType: "oracle",
        color: "text-red-500"
      },
      {
        id: "mongodb",
        name: "MongoDB",
        icon: <Database className="h-4 w-4" />,
        type: "source",
        subType: "mongodb",
        color: "text-green-500"
      },
      {
        id: "hive",
        name: "Hive",
        icon: <Database className="h-4 w-4" />,
        type: "source",
        subType: "hive",
        color: "text-yellow-500"
      }
    ]
  },
  {
    title: "Transformations",
    items: [
      {
        id: "filter",
        name: "Filter",
        icon: <Filter className="h-4 w-4" />,
        type: "transform",
        subType: "filter",
        color: "text-purple-500"
      },
      {
        id: "join",
        name: "Join",
        icon: <ArrowLeftRight className="h-4 w-4" />,
        type: "transform",
        subType: "join",
        color: "text-blue-500"
      },
      {
        id: "aggregate",
        name: "Aggregate",
        icon: <Calculator className="h-4 w-4" />,
        type: "transform",
        subType: "aggregate",
        color: "text-orange-500"
      }
    ]
  },
  {
    title: "Destinations",
    items: [
      {
        id: "warehouse",
        name: "Data Warehouse",
        icon: <Warehouse className="h-4 w-4" />,
        type: "destination",
        subType: "warehouse",
        color: "text-indigo-500"
      },
      {
        id: "file",
        name: "File Export",
        icon: <FileText className="h-4 w-4" />,
        type: "destination",
        subType: "file",
        color: "text-pink-500"
      }
    ]
  }
];

export default function ComponentToolbox({ onAddNode }: ComponentToolboxProps) {
  const handleDragStart = (e: React.DragEvent, item: ToolboxItem) => {
    e.dataTransfer.setData("text/plain", `${item.type}:${item.subType}`);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = (item: ToolboxItem) => {
    onAddNode(item.type, item.subType);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-carbon-gray-100">
          Component Toolbox
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {toolboxSections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-medium text-carbon-gray-70 mb-3">
              {section.title}
            </h4>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="drag-zone p-3 border border-carbon-gray-30 rounded-lg cursor-move hover:border-carbon-blue transition-all duration-200 hover:shadow-md"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => handleClick(item)}
                  title={`Drag to canvas or click to add ${item.name}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={item.color}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-carbon-gray-100">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-800">
            <div className="font-medium mb-1">💡 How to use:</div>
            <div>• Drag components to the canvas</div>
            <div>• Click to add at random position</div>
            <div>• Connect components by positioning them</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
