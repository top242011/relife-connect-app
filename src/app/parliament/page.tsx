import { MembersTable } from "@/components/members/members-table";
import { getAllMembers } from "@/lib/supabase/queries";

export default async function ParliamentPage() {
    const members = await getAllMembers();
    const mps = members.filter(m => m.roles.includes('isMP'));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Members of Parliament</h1>
                <p className="text-muted-foreground">
                    Manage data for elected members, including roles, voting records, and policy interests.
                </p>
            </div>
            <MembersTable data={mps} type="mp" />
        </div>
    )
}
