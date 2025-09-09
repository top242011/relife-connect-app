export interface Member {
    id: string;
    name: string;
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
  