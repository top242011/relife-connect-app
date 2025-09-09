import { MembersTable } from "@/components/members/members-table";
import { mps } from "@/lib/data";

export default function ParliamentPage() {
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
