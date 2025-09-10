import { getMemberById } from "@/lib/supabase/queries";
import { MPProfileContent } from "@/components/parliament/mp-profile-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MPProfilePage({ params }: { params: { id: string } }) {
    const mp = await getMemberById(params.id);

    if (!mp || !mp.roles.includes('isCouncilMember')) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Member of Parliament not found</h1>
                <p className="text-muted-foreground">The requested MP could not be located.</p>
                <Button asChild className="mt-4">
                    <Link href="/parliament">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Parliament List
                    </Link>
                </Button>
            </div>
        )
    }

    return <MPProfileContent mp={mp} />;
}
