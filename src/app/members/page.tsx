
'use client';

import { MembersTable } from "@/components/members/members-table";
import { getAllMembers } from "@/lib/supabase/queries";
import { useLanguage } from "@/hooks/use-language";
import * as React from "react";
import { Member } from "@/lib/types";

export default function MembersPage() {
    const { t } = useLanguage();
    const [members, setMembers] = React.useState<Member[]>([]);

    React.useEffect(() => {
        const fetchMembers = async () => {
            const allMembers = await getAllMembers();
            const partyMembers = allMembers.filter(m => m.roles.includes('isPartyMember'));
            setMembers(partyMembers);
        };
        fetchMembers();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('members_title')}</h1>
                <p className="text-muted-foreground">
                    {t('members_subtitle')}
                </p>
            </div>
            <MembersTable data={members} type="member" />
        </div>
    )
}
