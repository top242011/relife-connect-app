

  export interface Member {
    id: string;
    name: string;
    email: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    location: Location;
    education: string;
    professionalBackground: string;
    committeeMemberships: string[];
    activityLog: string;
    volunteerWork: string;
    contact: string;
    roles: ('MP' | 'Executive')[];
    status: 'Active' | 'Inactive' | 'Former Member';
    // MP fields - only present if roles includes 'MP'
    electoralHistory?: string;
    parliamentaryRoles?: string;
    votingRecord?: string;
    keyPolicyInterests?: string;
  }
  
  // This type is now deprecated in favor of the unified Member type
  export interface MP extends Member {
    electoralHistory: string;
    parliamentaryRoles: string;
    votingRecord: string;
    keyPolicyInterests: string;
  }

  export type PerformanceData = {
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
    description: string;
    isPartySponsored: boolean;
    topic: string;
    sponsorId?: string;
    totalParliamentAye?: number;
    totalParliamentNay?: number;
    totalParliamentAbstain?: number;
  }
  
  export type MeetingType = 'การประชุมสภา' | 'การประชุมพรรค' | 'การประชุมกรรมาธิการ';
  export type MeetingSession = 'การประชุมสามัญ' | 'การประชุมวิสามัญ';
  export type Location = 'ท่าพระจันทร์' | 'รังสิต' | 'ลำปาง' | 'ส่วนกลาง';


  export interface Meeting {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    attendees: string[]; // array of Member IDs
    presidingOfficer: string; // Member name (can be external)
    motions: Motion[];
    relatedDocuments?: { name: string; url: string }[];
    location: Location;
    meetingType: MeetingType;
    meetingSession: MeetingSession;
    meetingNumber?: string;
    committeeName?: string;
  }
  
  export type VoteType = 'Aye' | 'Nay' | 'Abstain' | 'Absent';

  export interface Vote {
    id: string;
    motionId: string;
    memberId: string; // Member or MP ID
    vote: VoteType;
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


