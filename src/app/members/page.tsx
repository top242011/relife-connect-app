import { MembersTable } from "@/components/members/members-table";
import { getAllMembers } from "@/lib/supabase/queries";

export default async function MembersPage() {
    const members = await getAllMembers();
    const partyMembers = members.filter(m => m.roles.includes('isPartyMember'));
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Party Members</h1>
                <p className="text-muted-foreground">
                    Browse and manage the demographic information of all party members.
                </p>
            </div>
            <MembersTable data={partyMembers} type="member" />
        </div>
    )
}
