

  export interface Member {
    id: string;
    name: string;
    email: string;
    age: number | null;
    gender: 'Male' | 'Female' | 'Other' | null;
    location: Location | null;
    education: string | null;
    professionalBackground: string | null;
    committeeMemberships: string[] | null;
    activityLog: string | null;
    volunteerWork: string | null;
    contact: string | null;
    roles: string[] | null;
    status: 'Active' | 'Inactive' | 'Former Member' | null;
    // MP fields - only present if roles includes 'MP'
    electoralHistory?: string | null;
    parliamentaryRoles?: string | null;
    votingRecord?: string | null;
    keyPolicyInterests?: string | null;
  }
  
  export interface PerformanceData {
    month: string;
    engagement: number;
    legislation: number;
    attendance: number;
  };
  
  export type DemographicsData = {
    region: string;
    members: number;
  };

  export interface Motion {
    id: string;
    title: string;
    description: string | null;
    isPartySponsored: boolean | null;
    topic: string | null;
    sponsorId?: string | null;
    totalParliamentAye?: number | null;
    totalParliamentNay?: number | null;
    totalParliamentAbstain?: number | null;
  }
  
  export type MeetingType = 'การประชุมสภา' | 'การประชุมพรรค' | 'การประชุมกรรมาธิการ';
  export type MeetingSession = 'การประชุมสามัญ' | 'การประชุมวิสามัญ';
  export type Location = 'ท่าพระจันทร์' | 'รังสิต' | 'ลำปาง' | 'ส่วนกลาง';


  export interface Meeting {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    attendees: string[]; // array of Member IDs
    presidingOfficer: string | null;
    motions: Motion[];
    relatedDocuments?: { name: string; url: string }[] | null;
    location: Location | null;
    meetingType: MeetingType | null;
    meetingSession: MeetingSession | null;
    meetingNumber?: string | null;
    committeeName?: string | null;
  }
  
  export type VoteType = 'Aye' | 'Nay' | 'Abstain' | 'Absent' | 'Leave';

  export interface Vote {
    id: string;
    motionId: string | null;
    memberId: string | null;
    vote: VoteType | null;
  }

  export interface Permission {
    id: string;
    name: string;
  }

  export interface Role {
    id: string;
    name: string;
    permissions: string[];
  }

  export interface SystemLog {
      id: string;
      timestamp: string;
      user: string;
      action: string;
      details: string;
  }
