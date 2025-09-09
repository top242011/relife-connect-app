import { MembersTable } from "@/components/members/members-table";
import { members } from "@/lib/data";

export default function MembersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Party Members</h1>
                <p className="text-muted-foreground">
                    Browse and manage the demographic information of all party members.
                </p>
            </div>
            <MembersTable data={members} type="member" />
        </div>
    )
}
