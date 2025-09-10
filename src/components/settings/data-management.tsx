'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download } from "lucide-react";

export function DataManagement() {
    const { toast } = useToast();
    const { t } = useLanguage();

    const handleExport = () => {
        toast({
            title: t('toast_export_started_title'),
            description: t('toast_export_started_desc'),
        });
    };
    
    const handleImport = () => {
        toast({
            title: t('toast_import_complete_title'),
            description: t('toast_import_complete_desc'),
            variant: 'default',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('data_management_title')}</CardTitle>
                <CardDescription>{t('data_management_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-medium">{t('export_data_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('export_data_subtitle')}</p>
                    <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        {t('export_all_data_button')}
                    </Button>
                </div>
                 <div className="space-y-2">
                    <h3 className="font-medium">{t('import_data_title')}</h3>
                     <p className="text-sm text-muted-foreground">{t('import_data_subtitle')}</p>
                    <div className="flex items-center space-x-2">
                        <Input type="file" className="max-w-xs" />
                        <Button onClick={handleImport}>
                            <Upload className="mr-2 h-4 w-4" />
                            {t('import_data_button')}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
