
import { supabase } from "./client";
import type { Member, Meeting, Vote, Motion, SystemLog, Role, Permission } from '../types';
import { Tables, TablesInsert, TablesUpdate } from "./database.types";

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

export async function updateMember(id: string, memberData: Partial<Member>) {
    const memberUpdate: TablesUpdate<'members'> = {
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
        electoral_history: memberData.electoralHistory,
        parliamentary_roles: memberData.parliamentaryRoles,
        key_policy_interests: memberData.keyPolicyInterests,
    };

    const { error: memberError } = await supabase.from('members').update(memberUpdate).eq('id', id);
    if (memberError) throw memberError;

    // Handle committee memberships update
    await supabase.from('member_committees').delete().eq('member_id', id);
    if (memberData.committeeMemberships && memberData.committeeMemberships.length > 0) {
        const { data: committees } = await supabase.from('committees').select('id, name').in('name', memberData.committeeMemberships);
        if (committees) {
            const newMemberCommittees = committees.map(c => ({
                member_id: id,
                committee_id: c.id
            }));
            const { error: committeeError } = await supabase.from('member_committees').insert(newMemberCommittees);
            if (committeeError) throw committeeError;
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

export async function updateMeeting(id: string, meetingData: Partial<Meeting>) {
    const meetingUpdate: TablesUpdate<'meetings'> = {
        title: meetingData.title,
        date: meetingData.date,
        presiding_officer: meetingData.presidingOfficer,
        attendees: meetingData.attendees,
        location: meetingData.location,
        meeting_type: meetingData.meetingType,
        meeting_session: meetingData.meetingSession,
        meeting_number: meetingData.meetingNumber,
        committee_name: meetingData.committeeName,
    };
    const { error: meetingError } = await supabase.from('meetings').update(meetingUpdate).eq('id', id);
    if (meetingError) throw meetingError;

    // Delete existing motions for this meeting
    await supabase.from('motions').delete().eq('meeting_id', id);

    // Insert new/updated motions
    if (meetingData.motions && meetingData.motions.length > 0) {
        const motionsToInsert = meetingData.motions.map(motion => ({
            id: motion.id,
            meeting_id: id,
            title: motion.title,
            description: motion.description,
            is_party_sponsored: motion.isPartySponsored,
            topic: motion.topic,
            sponsor_id: motion.sponsorId || null
        }));
        const { error: motionsError } = await supabase.from('motions').insert(motionsToInsert);
        if (motionsError) throw motionsError;
    }
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

export async function updateVotes(motionId: string, votes: { memberId: string, vote: string }[], motionUpdates: Partial<TablesUpdate<'motions'>>) {
    // Update motion totals
    if (Object.keys(motionUpdates).length > 0) {
        const { error: motionError } = await supabase.from('motions').update(motionUpdates).eq('id', motionId);
        if (motionError) {
            console.error("Error updating motion totals:", motionError);
            throw motionError;
        }
    }
    
    // Upsert votes
    const votesToUpsert = votes.map(v => ({
        motion_id: motionId,
        member_id: v.memberId,
        vote: v.vote,
    }));

    const { error } = await supabase.from('votes').upsert(votesToUpsert, { onConflict: 'motion_id, member_id' });
    if (error) {
        console.error("Error upserting votes:", error);
        throw error;
    }
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

export async function addMotionTopic(name: string) {
    const { error } = await supabase.from('motion_topics').insert({ name });
    if (error) throw error;
}
export async function deleteMotionTopic(name: string) {
    const { error } = await supabase.from('motion_topics').delete().eq('name', name);
    if (error) throw error;
}
export async function updateMotionTopic(oldName: string, newName: string) {
    const { error } = await supabase.from('motion_topics').update({ name: newName }).eq('name', oldName);
    if (error) throw error;
}

export async function getCommitteeNames(): Promise<string[]> {
    const { data, error } = await supabase.from('committees').select('name');
    if (error) {
        console.error('Error fetching committee names:', error);
        throw error;
    }
    return data.map(c => c.name);
}

export async function addCommitteeName(name: string) {
    const { error } = await supabase.from('committees').insert({ name });
    if (error) throw error;
}
export async function deleteCommitteeName(name: string) {
    const { error } = await supabase.from('committees').delete().eq('name', name);
    if (error) throw error;
}
export async function updateCommitteeName(oldName: string, newName: string) {
    const { error } = await supabase.from('committees').update({ name: newName }).eq('name', oldName);
    if (error) throw error;
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
