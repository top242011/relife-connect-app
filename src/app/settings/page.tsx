'use client';
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
import { useLanguage } from "@/hooks/use-language";

export default function SettingsPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings_title')}</h1>
        <p className="text-muted-foreground">
          {t('settings_subtitle')}
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            {t('settings_general_tab')}
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="mr-2 h-4 w-4" />
            {t('settings_roles_tab')}
          </TabsTrigger>
          <TabsTrigger value="data">
            <HardDrive className="mr-2 h-4 w-4" />
            {t('settings_data_tab')}
          </TabsTrigger>
          <TabsTrigger value="logs">
            <ScrollText className="mr-2 h-4 w-4" />
            {t('settings_logs_tab')}
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
