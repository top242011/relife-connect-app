'use client';
import { MembersTable } from "@/components/members/members-table";
import { useLanguage } from "@/hooks/use-language";
import { members } from "@/lib/data";

export default function MembersPage() {
    const { t } = useLanguage();
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
