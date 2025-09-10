
'use client';

import { MeetingsTable } from "@/components/meetings/meetings-table";
import { getAllMeetings } from "@/lib/supabase/queries";
import { useLanguage } from "@/hooks/use-language";
import * as React from "react";
import { Meeting } from "@/lib/types";

export default function ManageMeetingsPage() {
    const { t } = useLanguage();
    const [meetings, setMeetings] = React.useState<Meeting[]>([]);

    React.useEffect(() => {
        const fetchMeetings = async () => {
            const allMeetings = await getAllMeetings();
            setMeetings(allMeetings);
        };
        fetchMeetings();
    }, []);
    
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
