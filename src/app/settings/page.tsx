
import { GeneralSettings } from "@/components/settings/general-settings";
import { RolesPermissions } from "@/components/settings/roles-permissions";
import { DataManagement } from "@/components/settings/data-management";
import { SystemLogs } from "@/components/settings/system-logs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Settings, Shield, HardDrive, ScrollText } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage user roles, system settings, and view system logs.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="mr-2 h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="data">
            <HardDrive className="mr-2 h-4 w-4" />
            Data Management
          </TabsTrigger>
          <TabsTrigger value="logs">
            <ScrollText className="mr-2 h-4 w-4" />
            System Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="roles">
          <RolesPermissions />
        </TabsContent>
        
        <TabsContent value="data">
            <DataManagement />
        </TabsContent>

        <TabsContent value="logs">
            <SystemLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
