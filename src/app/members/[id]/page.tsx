'use client';

import { members } from "@/lib/data";
import { MemberProfile } from "@/components/members/member-profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function MemberProfilePage({ params }: { params: { id: string } }) {
    const { t } = useLanguage();
    const member = members.find(m => m.id === params.id);

    if (!member) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">{t('member_not_found_title')}</h1>
                <p className="text-muted-foreground">{t('member_not_found_subtitle')}</p>
                 <Button asChild className="mt-4">
                    <Link href="/members">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('back_to_members_list')}
                    </Link>
                </Button>
            </div>
        )
    }

    return <MemberProfile member={member} />;
}
