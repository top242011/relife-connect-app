
'use client';

import { MembersTable } from "@/components/members/members-table";
import { getAllMembers } from "@/lib/supabase/queries";
import { useLanguage } from "@/hooks/use-language";
import * as React from "react";
import { Member } from "@/lib/types";

export default function ParliamentPage() {
    const { t } = useLanguage();
    const [mps, setMps] = React.useState<Member[]>([]);

    React.useEffect(() => {
        const fetchMembers = async () => {
            const members = await getAllMembers();
            const mpsData = members.filter(m => m.roles.includes('isMP'));
            setMps(mpsData);
        };
        fetchMembers();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('parliament_title')}</h1>
                <p className="text-muted-foreground">
                    {t('parliament_subtitle')}
                </p>
            </div>
            <MembersTable data={mps} type="mp" />
        </div>
    )
}
