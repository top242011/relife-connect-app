'use client'

import { MeetingsTable } from "@/components/meetings/meetings-table";
import { useLanguage } from "@/hooks/use-language";
import { meetings } from "@/lib/data";

export default function ManageMeetingsPage() {
    const { t } = useLanguage();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('meetings_manage_title')}</h1>
                <p className="text-muted-foreground">
                    {t('meetings_manage_subtitle')}
                </p>
            </div>
            <MeetingsTable data={meetings} />
        </div>
    )
}
