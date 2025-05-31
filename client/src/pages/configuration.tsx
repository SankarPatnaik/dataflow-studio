import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Database, 
  Bell, 
  Shield, 
  Users, 
  Server,
  HardDrive,
  Network
} from "lucide-react";

export default function Configuration() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-carbon-gray-100 mb-2">Configuration</h2>
        <p className="text-carbon-gray-70">Manage system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>System Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                System Name
              </label>
              <Input defaultValue="DataFlow Studio" />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Default Timezone
              </label>
              <Input defaultValue="UTC" />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Max Concurrent Jobs
              </label>
              <Input type="number" defaultValue="10" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-carbon-gray-100">Auto-save Pipelines</div>
                <div className="text-sm text-carbon-gray-50">Automatically save pipeline changes</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-carbon-gray-100">Debug Mode</div>
                <div className="text-sm text-carbon-gray-50">Enable detailed logging</div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Database Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Connection Pool Size
              </label>
              <Input type="number" defaultValue="20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Query Timeout (seconds)
              </label>
              <Input type="number" defaultValue="300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Backup Schedule
              </label>
              <Input defaultValue="0 2 * * *" placeholder="Cron expression" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-carbon-gray-100">Auto Backup</div>
                <div className="text-sm text-carbon-gray-50">Enable automated backups</div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Email Server (SMTP)
              </label>
              <Input placeholder="smtp.company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                From Email Address
              </label>
              <Input placeholder="dataflow@company.com" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-carbon-gray-100">Job Failure Alerts</div>
                <div className="text-sm text-carbon-gray-50">Email notifications for failed jobs</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-carbon-gray-100">Daily Reports</div>
                <div className="text-sm text-carbon-gray-50">Send daily execution summary</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-carbon-gray-100">Slack Integration</div>
                <div className="text-sm text-carbon-gray-50">Send alerts to Slack channels</div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Session Timeout (minutes)
              </label>
              <Input type="number" defaultValue="480" />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Password Policy
              </label>
              <Textarea 
                placeholder="Minimum 8 characters, include uppercase, lowercase, numbers and symbols"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-carbon-gray-100">Two-Factor Authentication</div>
                <div className="text-sm text-carbon-gray-50">Require 2FA for all users</div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-carbon-gray-100">API Key Rotation</div>
                <div className="text-sm text-carbon-gray-50">Auto-rotate API keys monthly</div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Resource Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Resource Limits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Memory Limit per Job (GB)
              </label>
              <Input type="number" defaultValue="8" />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                CPU Cores per Job
              </label>
              <Input type="number" defaultValue="4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Max Job Duration (hours)
              </label>
              <Input type="number" defaultValue="12" />
            </div>
            <div>
              <label className="block text-sm font-medium text-carbon-gray-100 mb-2">
                Temp Storage Limit (GB)
              </label>
              <Input type="number" defaultValue="100" />
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <span>System Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-carbon-gray-70">Version</span>
              <Badge>v2.1.0</Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-carbon-gray-70">Uptime</span>
              <span className="text-carbon-gray-100">5 days, 12 hours</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-carbon-gray-70">CPU Usage</span>
              <span className="text-carbon-gray-100">23%</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-carbon-gray-70">Memory Usage</span>
              <span className="text-carbon-gray-100">4.2 GB / 16 GB</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-carbon-gray-70">Disk Usage</span>
              <span className="text-carbon-gray-100">450 GB / 1 TB</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-carbon-gray-70">Active Connections</span>
              <span className="text-carbon-gray-100">8</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Configuration</Button>
      </div>
    </div>
  );
}
