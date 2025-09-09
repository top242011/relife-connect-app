
import type { Member, MP, PerformanceData, DemographicsData, Meeting, Vote, Role, Permission, SystemLog } from './types';

export const members: Member[] = [
  { id: 'mem-1', name: 'Alice Johnson', email: 'alice.j@example.com', age: 34, gender: 'Female', location: 'Capital City', education: 'M.A. Political Science', professionalBackground: 'Policy Advisor', committeeMemberships: ['Finance', 'Outreach'], activityLog: 'Active in 5 campaigns', volunteerWork: '120 hours', contact: 'alice.j@example.com' },
  { id: 'mem-2', name: 'Bob Williams', email: 'bob.w@example.com', age: 45, gender: 'Male', location: 'Northwood', education: 'B.S. Economics', professionalBackground: 'Economist', committeeMemberships: ['Economic Affairs'], activityLog: 'Organized 3 town halls', volunteerWork: '80 hours', contact: 'bob.w@example.com' },
  { id: 'mem-3', name: 'Charlie Brown', email: 'charlie.b@example.com', age: 28, gender: 'Male', location: 'Eastwood', education: 'J.D.', professionalBackground: 'Lawyer', committeeMemberships: ['Judiciary'], activityLog: 'Attended 20 meetings', volunteerWork: '50 hours', contact: 'charlie.b@example.com' },
  { id: 'mem-4', name: 'Diana Prince', email: 'diana.p@example.com', age: 52, gender: 'Female', location: 'Westwood', education: 'Ph.D. History', professionalBackground: 'Professor', committeeMemberships: ['Education', 'Culture'], activityLog: 'Published 2 articles', volunteerWork: '200 hours', contact: 'diana.p@example.com' },
  { id: 'mem-5', name: 'Ethan Hunt', email: 'ethan.h@example.com', age: 39, gender: 'Male', location: 'Southdale', education: 'MBA', professionalBackground: 'Consultant', committeeMemberships: ['Strategy'], activityLog: 'Led fundraising drive', volunteerWork: '150 hours', contact: 'ethan.h@example.com' },
];

export const mps: MP[] = [
  { id: 'mp-1', name: 'Fiona Gallagher', email: 'fiona.g@example.com', age: 48, gender: 'Female', location: 'Capital City Central', electoralHistory: 'Elected 2018, 2022', parliamentaryRoles: 'Whip', votingRecord: '95% attendance', keyPolicyInterests: 'Healthcare, Social Justice', education: 'MPH', professionalBackground: 'Public Health Admin' },
  { id: 'mp-2', name: 'George Orwell', email: 'george.o@example.com', age: 55, gender: 'Male', location: 'Northwood District', electoralHistory: 'Elected 2010, 2014, 2018, 2022', parliamentaryRoles: 'Committee Chair (Oversight)', votingRecord: '98% attendance', keyPolicyInterests: 'Government Transparency, Civil Liberties', education: 'B.A. Journalism', professionalBackground: 'Journalist' },
  { id: 'mp-3', name: 'Hannah Abbott', email: 'hannah.a@example.com', age: 41, gender: 'Female', location: 'Eastwood Borough', electoralHistory: 'Elected 2022', parliamentaryRoles: 'Backbencher', votingRecord: '92% attendance', keyPolicyInterests: 'Environmental Protection, Renewable Energy', education: 'M.S. Environmental Science', professionalBackground: 'Scientist' },
];

export const meetings: Meeting[] = [
    {
        id: 'meet-1',
        title: 'Q3 Budget Committee Session',
        date: '2024-07-20',
        attendees: ['mp-1', 'mp-2', 'mem-1', 'mem-2'],
        presidingOfficer: 'mp-2',
        motions: [
            { id: 'motion-1', title: 'Approve allocation for infrastructure projects', description: 'To approve the proposed budget of $5M for the new bridge construction.', isPartySponsored: true, topic: 'Economy', sponsorId: 'mp-1'},
            { id: 'motion-2', title: 'Review healthcare subsidy proposal', description: 'Discuss and vote on the new public healthcare subsidy program.', isPartySponsored: true, topic: 'Social', sponsorId: 'mp-1'}
        ],
        relatedDocuments: [{ name: 'Q3 Budget Proposal.pdf', url: '#'}]
    },
    {
        id: 'meet-2',
        title: 'Party Policy Debate on Environment',
        date: '2024-07-25',
        attendees: ['mp-1', 'mp-2', 'mp-3', 'mem-1', 'mem-4'],
        presidingOfficer: 'mp-1',
        motions: [
            { id: 'motion-3', title: 'Adopt Carbon Neutrality Goal by 2040', description: 'Commit the party to a policy of achieving carbon neutrality across the nation by the year 2040.', isPartySponsored: true, topic: 'Environment', sponsorId: 'mp-3'},
            { id: 'motion-4', title: 'Opposition motion on industrial regulations', description: 'Vote on an opposition party motion to relax industrial emission standards.', isPartySponsored: false, topic: 'Economy' }
        ],
        relatedDocuments: []
    }
];

export let votes: Vote[] = [
    // Votes for motion-1
    { id: 'vote-1', motionId: 'motion-1', memberId: 'mp-1', vote: 'Aye' },
    { id: 'vote-2', motionId: 'motion-1', memberId: 'mp-2', vote: 'Aye' },
    { id: 'vote-3', motionId: 'motion-1', memberId: 'mem-1', vote: 'Abstain' },
    { id: 'vote-4', motionId: 'motion-1', memberId: 'mem-2', vote: 'Nay' },
    // Votes for motion-2
    { id: 'vote-5', motionId: 'motion-2', memberId: 'mp-1', vote: 'Aye' },
    { id: 'vote-6', motionId: 'motion-2', memberId: 'mp-2', vote: 'Nay' },
    { id: 'vote-7', motionId: 'motion-2', memberId: 'mem-1', vote: 'Aye' },
    { id: 'vote-8', motionId: 'motion-2', memberId: 'mem-2', vote: 'Absent' },
    // Votes for motion-3
    { id: 'vote-9', motionId: 'motion-3', memberId: 'mp-1', vote: 'Aye' },
    { id: 'vote-10', motionId: 'motion-3', memberId: 'mp-2', vote: 'Nay' },
    { id: 'vote-11', motionId: 'motion-3', memberId: 'mp-3', vote: 'Aye' },
    { id: 'vote-12', motionId: 'motion-3', memberId: 'mem-1', vote: 'Abstain' },
    { id: 'vote-13', motionId: 'motion-3', memberId: 'mem-4', vote: 'Aye' },
     // Votes for motion-4
     { id: 'vote-14', motionId: 'motion-4', memberId: 'mp-1', vote: 'Nay' },
     { id: 'vote-15', motionId: 'motion-4', memberId: 'mp-2', vote: 'Nay' },
     { id: 'vote-16', motionId: 'motion-4', memberId: 'mp-3', vote: 'Nay' },
     { id: 'vote-17', motionId: 'motion-4', memberId: 'mem-1', vote: 'Abstain' },
     { id: 'vote-18', motionId: 'motion-4', memberId: 'mem-4', vote: 'Nay' },
];


export const performanceData: PerformanceData[] = [
    { month: 'Jan', engagement: 65, legislation: 2, attendance: 90 },
    { month: 'Feb', engagement: 70, legislation: 3, attendance: 92 },
    { month: 'Mar', engagement: 72, legislation: 3, attendance: 88 },
    { month: 'Apr', engagement: 80, legislation: 4, attendance: 95 },
    { month: 'May', engagement: 75, legislation: 5, attendance: 93 },
    { month: 'Jun', engagement: 85, legislation: 6, attendance: 97 },
];

export const demographicsData: DemographicsData[] = [
    { region: 'Northwood', members: 120 },
    { region: 'Southdale', members: 98 },
    { region: 'Eastwood', members: 154 },
    { region: 'Westwood', members: 85 },
    { region: 'Capital City', members: 210 },
]

export const permissions: Permission[] = [
    { id: 'perm-1', name: 'Create Party Member' },
    { id: 'perm-2', name: 'Edit MP Profile' },
    { id: 'perm-3', name: 'View Analytics Dashboard' },
    { id: 'perm-4', name: 'Manage Meetings' },
    { id: 'perm-5', name: 'Record Votes' },
    { id: 'perm-6', name: 'Admin Access' }
];

export const roles: Role[] = [
    { id: 'role-1', name: 'Admin', permissions: ['perm-1', 'perm-2', 'perm-3', 'perm-4', 'perm-5', 'perm-6'] },
    { id: 'role-2', name: 'HR Manager', permissions: ['perm-1', 'perm-2'] },
    { id: 'role-3', name: 'Meeting Secretary', permissions: ['perm-4', 'perm-5'] },
    { id: 'role-4', name: 'Data Analyst', permissions: ['perm-3'] },
    { id: 'role-5', name: 'Member', permissions: [] }
];

export const systemLogs: SystemLog[] = [
    { id: 'log-1', timestamp: '2024-08-01 10:00:00', user: 'Alice Johnson', action: 'Login', details: 'Successful login from IP 192.168.1.1' },
    { id: 'log-2', timestamp: '2024-08-01 10:05:23', user: 'Alice Johnson', action: 'Edit Meeting', details: 'Edited meeting "Q3 Budget Committee Session"' },
    { id: 'log-3', timestamp: '2024-08-01 10:15:00', user: 'George Orwell', action: 'Record Vote', details: 'Recorded votes for motion "Approve allocation for infrastructure projects"' },
    { id: 'log-4', timestamp: '2024-08-01 11:30:10', user: 'Fiona Gallagher', action: 'Create Meeting', details: 'Created new meeting "Emergency Press Briefing"' },
    { id: 'log-5', timestamp: '2024-08-01 12:00:00', user: 'System', action: 'Security Alert', details: 'Multiple failed login attempts for user "charlie.b@example.com"' },
    { id: 'log-6', timestamp: '2024-08-01 14:00:45', user: 'Alice Johnson', action: 'Edit Role', details: 'Updated permissions for role "Data Analyst"' }
];
