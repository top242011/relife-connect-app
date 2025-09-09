
import { members } from "@/lib/data";
import { MemberProfile } from "@/components/members/member-profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MemberProfilePage({ params }: { params: { id: string } }) {
    const member = members.find(m => m.id === params.id);

    if (!member) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Member not found</h1>
                <p className="text-muted-foreground">The requested member could not be located.</p>
                 <Button asChild className="mt-4">
                    <Link href="/members">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Members List
                    </Link>
                </Button>
            </div>
        )
    }

    return <MemberProfile member={member} />;
}
