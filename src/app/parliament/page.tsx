'use client';
import { MembersTable } from "@/components/members/members-table";
import { useLanguage } from "@/hooks/use-language";
import { mps } from "@/lib/data";

export default function ParliamentPage() {
    const { t } = useLanguage();
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
