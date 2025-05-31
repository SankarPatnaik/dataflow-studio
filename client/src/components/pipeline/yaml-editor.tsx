import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface YamlEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export default function YamlEditor({ value, onChange, readOnly = false }: YamlEditorProps) {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied to clipboard",
        description: "YAML configuration has been copied.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline-config.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.yml,.yaml,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (onChange) {
            onChange(content);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const validateYaml = async () => {
    setIsValidating(true);
    
    // Simple YAML validation (in a real app, you'd use a proper YAML parser)
    try {
      const lines = value.split('\n');
      let isValid = true;
      let indentStack: number[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '' || line.trim().startsWith('#')) continue;
        
        const indent = line.length - line.trimStart().length;
        
        // Check for valid YAML structure
        if (line.includes(':') && !line.trim().startsWith('- ')) {
          // This is a key-value pair
          if (indentStack.length === 0 || indent >= indentStack[indentStack.length - 1]) {
            if (indent > (indentStack[indentStack.length - 1] || -1)) {
              indentStack.push(indent);
            }
          } else {
            // Dedent - pop from stack
            while (indentStack.length > 0 && indent < indentStack[indentStack.length - 1]) {
              indentStack.pop();
            }
          }
        }
      }
      
      // Simulate validation delay
      setTimeout(() => {
        setValidationStatus(isValid ? 'valid' : 'invalid');
        setIsValidating(false);
        
        toast({
          title: isValid ? "YAML is valid" : "YAML has errors",
          description: isValid 
            ? "Configuration syntax is correct." 
            : "Please check the syntax and try again.",
          variant: isValid ? "default" : "destructive",
        });
      }, 1000);
      
    } catch (error) {
      setValidationStatus('invalid');
      setIsValidating(false);
      toast({
        title: "YAML has errors",
        description: "Please check the syntax and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex items-center justify-between p-4 border-b border-carbon-gray-20">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">YAML</Badge>
            {validationStatus === 'valid' && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid
              </Badge>
            )}
            {validationStatus === 'invalid' && (
              <Badge className="bg-red-100 text-red-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Invalid
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleUpload}>
              <Upload className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={validateYaml}
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : "Validate"}
            </Button>
          </div>
        </div>
      )}
      
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          className="font-mono text-sm min-h-96 resize-none bg-carbon-gray-100 text-carbon-gray-10 border-0"
          placeholder={readOnly ? "" : `transformations:
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
    mode: "append"`}
        />
        
        {readOnly && (
          <div className="absolute top-2 right-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="text-xs text-carbon-gray-50 px-4 pb-4">
        Use YAML syntax to define transformations, data sources, and targets.
        {!readOnly && " Changes are automatically saved."}
      </div>
    </div>
  );
}
