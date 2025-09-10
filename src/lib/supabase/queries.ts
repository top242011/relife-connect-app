import { supabase } from "./client";
import type { Member, Meeting, Vote, Motion } from '../types';
import { Tables } from "./database.types";

// Helper to convert Supabase member to app Member type
const fromSupabaseMember = (member: Tables<'members'> | any): Member => {
    return {
        ...member,
        roles: member.roles || [],
        committeeMemberships: member.committeeMemberships || [],
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
      attendees: meeting.meeting_attendees.map((a: any) => a.member_id),
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
    const { data, error } = await supabase.from('members').select('*');
    if (error) throw error;
    return data.map(fromSupabaseMember);
}

export async function getMemberById(id: string): Promise<Member | null> {
    const { data, error } = await supabase.from('members').select('*').eq('id', id).single();
    if (error) {
        console.error('Error fetching member by ID:', error);
        return null;
    }
    return data ? fromSupabaseMember(data) : null;
}

// Meeting Queries
export async function getAllMeetings(): Promise<Meeting[]> {
    const { data, error } = await supabase
        .from('meetings')
        .select(`
            *,
            meeting_attendees(member_id),
            motions(*)
        `);

    if (error) throw error;
    return data.map(fromSupabaseMeeting);
}

export async function getMeetingById(id: string): Promise<Meeting | null> {
    const { data, error } = await supabase
        .from('meetings')
        .select(`
            *,
            meeting_attendees(member_id),
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
    if (error) throw error;
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
    if (error) throw error;
    return data.map(t => t.name);
}

export async function getCommitteeNames(): Promise<string[]> {
    const { data, error } = await supabase.from('committees').select('name');
    if (error) throw error;
    return data.map(c => c.name);
}

export async function getSystemLogs() {
    // This would query a 'system_logs' table if it existed.
    // For now, returning a static example.
    return [
        { id: 'log-1', timestamp: '2024-08-01 10:00:00', user: 'Alice Johnson', action: 'Login', details: 'Successful login from IP 192.168.1.1' },
        { id: 'log-2', timestamp: '2024-08-01 10:05:23', user: 'Alice Johnson', action: 'Edit Meeting', details: 'Edited meeting "Q3 Budget Committee Session"' },
        { id: 'log-3', timestamp: '2024-08-01 10:15:00', user: 'George Orwell', action: 'Record Vote', details: 'Recorded votes for motion "Approve allocation for infrastructure projects"' },
        { id: 'log-4', timestamp: '2024-08-01 11:30:10', user: 'Fiona Gallagher', action: 'Create Meeting', details: 'Created new meeting "Emergency Press Briefing"' },
        { id: 'log-5', timestamp: '2024-08-01 12:00:00', user: 'System', action: 'Security Alert', details: 'Multiple failed login attempts for user "charlie.b@example.com"' },
        { id: 'log-6', timestamp: '2024-08-01 14:00:45', user: 'Alice Johnson', action: 'Edit Role', details: 'Updated permissions for role "Data Analyst"' }
    ];
}

export async function getRolesAndPermissions() {
    // This is static for now as it's less frequently changed.
    // Could be moved to Supabase if needed.
    const permissions = [
        { id: 'perm-1', name: 'Create Party Member' },
        { id: 'perm-2', name: 'Edit MP Profile' },
        { id: 'perm-3', name: 'View Analytics Dashboard' },
        { id: 'perm-4', name: 'Manage Meetings' },
        { id: 'perm-5', name: 'Record Votes' },
        { id: 'perm-6', name: 'Admin Access' }
    ];

    const roles = [
        { id: 'role-1', name: 'Admin', permissions: ['perm-1', 'perm-2', 'perm-3', 'perm-4', 'perm-5', 'perm-6'] },
        { id: 'role-2', name: 'HR Manager', permissions: ['perm-1', 'perm-2'] },
        { id: 'role-3', name: 'Meeting Secretary', permissions: ['perm-4', 'perm-5'] },
        { id: 'role-4', name: 'Data Analyst', permissions: ['perm-3'] },
        { id: 'role-5', name: 'Member', permissions: [] }
    ];
    return { permissions, roles };
}
