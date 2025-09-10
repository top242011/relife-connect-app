
import { MeetingsTable } from "@/components/meetings/meetings-table";
import { getAllMeetings } from "@/lib/supabase/queries";

export default async function ManageMeetingsPage() {
    const meetings = await getAllMeetings();
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage Meetings</h1>
                <p className="text-muted-foreground">
                    Create, view, edit, and delete meeting records.
                </p>
            </div>
            <MeetingsTable data={meetings} />
        </div>
    )
}
