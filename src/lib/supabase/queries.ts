
import { supabase } from "./client";
import type { Member, Meeting, Vote, Motion, SystemLog, Role, Permission } from '../types';
import { Tables, TablesInsert } from "./database.types";

// Helper to convert Supabase member to app Member type
const fromSupabaseMember = (member: Tables<'members'> | any): Member => {
    return {
        id: member.id,
        name: member.name,
        email: member.email,
        age: member.age,
        gender: member.gender,
        location: member.location,
        education: member.education,
        professionalBackground: member.professional_background,
        committeeMemberships: member.committee_memberships || [],
        activityLog: member.activity_log,
        volunteerWork: member.volunteer_work,
        contact: member.contact,
        roles: member.roles || [],
        status: member.status,
        electoralHistory: member.electoral_history,
        parliamentaryRoles: member.parliamentary_roles,
        votingRecord: member.voting_record,
        keyPolicyInterests: member.key_policy_interests,
    } as Member;
}

// Helper to convert Supabase meeting to app Meeting type
const fromSupabaseMeeting = (meeting: any): Meeting => {
    return {
      id: meeting.id,
      title: meeting.title,
      date: meeting.date,
      presidingOfficer: meeting.presiding_officer,
      location: meeting.location,
      meetingType: meeting.meeting_type,
      meetingSession: meeting.meeting_session,
      meetingNumber: meeting.meeting_number,
      committeeName: meeting.committee_name,
      relatedDocuments: meeting.related_documents || [],
      attendees: meeting.attendees || [],
      motions: meeting.motions.map(fromSupabaseMotion),
    };
};

const fromSupabaseMotion = (motion: any): Motion => {
    return {
        id: motion.id,
        title: motion.title,
        description: motion.description,
        isPartySponsored: motion.is_party_sponsored,
        topic: motion.topic,
        sponsorId: motion.sponsor_id,
        totalParliamentAye: motion.total_parliament_aye,
        totalParliamentNay: motion.total_parliament_nay,
        totalParliamentAbstain: motion.total_parliament_abstain,
    }
}


// Member Queries
export async function getAllMembers(): Promise<(Member)[]> {
    const { data, error } = await supabase.from('members').select('*, member_committees(committees(name))');
    if (error) {
        console.error('Error fetching members:', error);
        throw error;
    };

    const members = data.map(m => {
        const committee_memberships = (m.member_committees || []).map((mc: any) => mc.committees.name);
        return { ...m, committee_memberships };
    });

    return members.map(fromSupabaseMember);
}

export async function getMemberById(id: string): Promise<Member | null> {
     const { data, error } = await supabase.from('members').select('*, member_committees(committees(name))').eq('id', id).single();
    if (error) {
        console.error('Error fetching member by ID:', error);
        return null;
    }
    if (!data) return null;

    const committee_memberships = (data.member_committees || []).map((mc: any) => mc.committees.name);
    return fromSupabaseMember({ ...data, committee_memberships });
}

export async function createMember(memberData: Partial<Member>) {
    const newMemberId = `mem-${Date.now()}`;
    const newMember: TablesInsert<'members'> = {
        id: newMemberId,
        name: memberData.name!,
        email: memberData.email!,
        age: memberData.age,
        gender: memberData.gender,
        location: memberData.location,
        education: memberData.education,
        professional_background: memberData.professionalBackground,
        activity_log: memberData.activityLog,
        volunteer_work: memberData.volunteerWork,
        contact: memberData.contact,
        roles: memberData.roles,
        status: 'Active',
        electoral_history: memberData.electoralHistory,
        parliamentary_roles: memberData.parliamentaryRoles,
        voting_record: memberData.votingRecord,
        key_policy_interests: memberData.keyPolicyInterests,
    };
    
    const { error: memberError } = await supabase.from('members').insert(newMember);
    if (memberError) {
        console.error('Error creating member:', memberError);
        throw memberError;
    }

    if (memberData.committeeMemberships && memberData.committeeMemberships.length > 0) {
        const { data: committees } = await supabase.from('committees').select('id, name').in('name', memberData.committeeMemberships);
        if (committees) {
            const newMemberCommittees = committees.map(c => ({
                member_id: newMemberId,
                committee_id: c.id
            }));
            const { error: committeeError } = await supabase.from('member_committees').insert(newMemberCommittees);
            if (committeeError) {
                 console.error('Error adding committee memberships:', committeeError);
                 throw committeeError;
            }
        }
    }
}


// Meeting Queries
export async function getAllMeetings(): Promise<Meeting[]> {
    const { data, error } = await supabase
        .from('meetings')
        .select(`
            *,
            motions(*)
        `);

    if (error) {
        console.error('Error fetching meetings:', error);
        throw error;
    }
    return data.map(fromSupabaseMeeting);
}

export async function getMeetingById(id: string): Promise<Meeting | null> {
    const { data, error } = await supabase
        .from('meetings')
        .select(`
            *,
            motions(*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching meeting by ID:', error);
        return null;
    }
    
    return data ? fromSupabaseMeeting(data) : null;
}

// Vote Queries
export async function getAllVotes(): Promise<Vote[]> {
    const { data, error } = await supabase.from('votes').select('*');
    if (error) {
        console.error('Error fetching votes:', error);
        throw error;
    }
    return data as Vote[];
}


export async function getVotesByMotionId(motionId: string): Promise<Vote[]> {
    const { data, error } = await supabase.from('votes').select('*').eq('motion_id', motionId);
    if (error) throw error;
    return data as Vote[];
}

export async function getVotesByMemberId(memberId: string): Promise<Vote[]> {
    const { data, error } = await supabase.from('votes').select('*').eq('member_id', memberId);
    if (error) throw error;
    return data as Vote[];
}

// Generic Data Queries
export async function getMotionTopics(): Promise<string[]> {
    const { data, error } = await supabase.from('motion_topics').select('name');
    if (error) {
        console.error('Error fetching motion topics:', error);
        throw error;
    }
    return data.map(t => t.name);
}

export async function getCommitteeNames(): Promise<string[]> {
    const { data, error } = await supabase.from('committees').select('name');
    if (error) {
        console.error('Error fetching committee names:', error);
        throw error;
    }
    return data.map(c => c.name);
}

export async function getLocations(): Promise<string[]> {
    const { data, error } = await supabase.from('locations').select('name');
     if (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
    return data.map(l => l.name);
}


export async function getSystemLogs(): Promise<SystemLog[]> {
    const { data, error } = await supabase.from('system_logs').select('*').order('timestamp', { ascending: false });
    if (error) {
        console.error('Error fetching system logs:', error);
        throw error;
    }
    return data;
}

export async function getRolesAndPermissions(): Promise<{ roles: Role[], permissions: Permission[] }> {
    const { data: rolesData, error: rolesError } = await supabase.from('roles').select('*, role_permissions(permissions(id, name))');
    if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        throw rolesError;
    }
    
    const { data: permissionsData, error: permissionsError } = await supabase.from('permissions').select('*');
    if (permissionsError) {
        console.error('Error fetching permissions:', permissionsError);
        throw permissionsError;
    }

    const roles: Role[] = rolesData.map((r: any) => ({
        id: r.id,
        name: r.name,
        permissions: r.role_permissions.map((p: any) => p.permissions.id),
    }));

    return { roles, permissions: permissionsData };
}


    

    
