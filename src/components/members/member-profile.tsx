
import { Member, MP } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { EditProfileForm } from "./edit-profile-form";
import Link from "next/link";
import { allPartyMembers } from "@/lib/data";

export function MemberProfile({ member }: { member: Member | MP }) {
    const isMP = 'electoralHistory' in member;

    const fullMemberInfo = allPartyMembers.find(m => m.id === member.id);
    const status = fullMemberInfo?.status || 'Active';

    return (
         <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold">{member.name}</h1>
                        <p className="text-muted-foreground">
                            {isMP ? (member as MP).parliamentaryRoles : member.professionalBackground}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                             <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>
                             {member.roles.includes('MP') && <Badge variant="secondary">Member of Parliament</Badge>}
                             {member.roles.includes('Executive') && <Badge variant="destructive">Executive Committee</Badge>}
                        </div>
                    </div>
                </div>
                 <EditProfileForm member={member} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="font-semibold">Email:</span> {member.email || 'N/A'}</div>
                    <div><span className="font-semibold">Location:</span> {member.location}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div><span className="font-semibold">Age:</span> {member.age}</div>
                    <div><span className="font-semibold">Gender:</span> {member.gender}</div>
                    <div><span className="font-semibold">Education:</span> {member.education}</div>
                    <div><span className="font-semibold">Professional Background:</span> {member.professionalBackground}</div>
                </CardContent>
            </Card>
            
            {!isMP && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Party Involvement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <h3 className="font-semibold mb-2">Committee Memberships</h3>
                            <div className="flex flex-wrap gap-2">
                                {(member as Member).committeeMemberships.map(c => <Badge key={c} variant="outline">{c}</Badge>)}
                            </div>
                        </div>
                         <div>
                            <h3 className="font-semibold">Activity Log</h3>
                            <p className="text-muted-foreground">{(member as Member).activityLog}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold">Volunteer Work</h3>
                            <p className="text-muted-foreground">{(member as Member).volunteerWork}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isMP && (
                <>
                <Card>
                    <CardHeader>
                        <CardTitle>Parliamentary Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div><span className="font-semibold">Constituency:</span> {member.location}</div>
                        <div><span className="font-semibold">Electoral History:</span> {(member as MP).electoralHistory}</div>
                        <div><span className="font-semibold">Parliamentary Roles:</span> {(member as MP).parliamentaryRoles}</div>
                        <div>
                            <h3 className="font-semibold mb-2">Key Policy Interests</h3>
                             <div className="flex flex-wrap gap-2">
                                {(member as MP).keyPolicyInterests.split(', ').map(interest => (
                                    <Badge key={interest} variant="secondary">{interest}</Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                         <CardTitle>Voting Record</CardTitle>
                        <CardDescription>A log of all recorded votes on parliamentary and party motions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Detailed voting record will be displayed here. <Link href={`/parliament/${member.id}`} className="text-primary hover:underline">View Full Record</Link></p>
                    </CardContent>
                </Card>
                </>
            )}
        </div>
    );
}
