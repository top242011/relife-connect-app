

export interface Member {
    id: string;
    name: string;
    email: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    location: string;
    education: string;
    professionalBackground: string;
    committeeMemberships: string[];
    activityLog: string;
    volunteerWork: string;
    contact: string;
  }
  
  export interface MP {
    id: string;
    name: string;
    email: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    location: string;
    electoralHistory: string;
    parliamentaryRoles: string;
    votingRecord: string;
    keyPolicyInterests: string;
    education: string;
    professionalBackground: string;
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
  }
  
  export type MeetingType = 'การประชุมสภา' | 'การประชุมพรรค';
  export type MeetingSession = 'การประชุมสามัญ' | 'การประชุมวิสามัญ';
  export type Location = 'ท่าพระจันทร์' | 'รังสิต' | 'ลำปาง' | 'ส่วนกลาง';


  export interface Meeting {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    attendees: string[]; // array of Member or MP IDs
    presidingOfficer: string; // Member or MP ID
    motions: Motion[];
    relatedDocuments?: { name: string; url: string }[];
    location: Location;
    meetingType: MeetingType;
    meetingSession: MeetingSession;
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
