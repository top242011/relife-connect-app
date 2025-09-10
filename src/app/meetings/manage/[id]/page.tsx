import { getMeetingById } from "@/lib/supabase/queries";
import { MeetingDetails } from "@/components/meetings/meeting-details";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MeetingDetailsPage({ params }: { params: { id: string } }) {
    const meeting = await getMeetingById(params.id);

    if (!meeting) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Meeting not found</h1>
                <p className="text-muted-foreground">The requested meeting could not be located.</p>
                 <Button asChild className="mt-4">
                    <Link href="/meetings/manage">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Meetings
                    </Link>
                </Button>
            </div>
        )
    }

    return <MeetingDetails meeting={meeting} />;
}
