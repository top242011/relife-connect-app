export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      committees: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          attendees: string[] | null
          committee_name: string | null
          date: string
          id: string
          location: string | null
          meeting_number: string | null
          meeting_session:
            | Database["public"]["Enums"]["meeting_session_enum"]
            | null
          meeting_type: Database["public"]["Enums"]["meeting_type_enum"] | null
          presiding_officer: string | null
          related_documents: Json | null
          title: string
        }
        Insert: {
          attendees?: string[] | null
          committee_name?: string | null
          date: string
          id: string
          location?: string | null
          meeting_number?: string | null
          meeting_session?:
            | Database["public"]["Enums"]["meeting_session_enum"]
            | null
          meeting_type?: Database["public"]["Enums"]["meeting_type_enum"] | null
          presiding_officer?: string | null
          related_documents?: Json | null
          title: string
        }
        Update: {
          attendees?: string[] | null
          committee_name?: string | null
          date?: string
          id?: string
          location?: string | null
          meeting_number?: string | null
          meeting_session?:
            | Database["public"]["Enums"]["meeting_session_enum"]
            | null
          meeting_type?: Database["public"]["Enums"]["meeting_type_enum"] | null
          presiding_officer?: string | null
          related_documents?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_location_fkey"
            columns: ["location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["name"]
          },
        ]
      }
      member_committees: {
        Row: {
          committee_id: number
          member_id: string
        }
        Insert: {
          committee_id: number
          member_id: string
        }
        Update: {
          committee_id?: number
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_committees_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_committees_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          activity_log: string | null
          age: number | null
          contact: string | null
          education: string | null
          electoral_history: string | null
          email: string
          gender: Database["public"]["Enums"]["gender_enum"] | null
          id: string
          key_policy_interests: string | null
          location: string | null
          name: string
          parliamentary_roles: string | null
          professional_background: string | null
          roles: string[] | null
          status: Database["public"]["Enums"]["status_enum"] | null
          volunteer_work: string | null
          voting_record: string | null
        }
        Insert: {
          activity_log?: string | null
          age?: number | null
          contact?: string | null
          education?: string | null
          electoral_history?: string | null
          email: string
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id: string
          key_policy_interests?: string | null
          location?: string | null
          name: string
          parliamentary_roles?: string | null
          professional_background?: string | null
          roles?: string[] | null
          status?: Database["public"]["Enums"]["status_enum"] | null
          volunteer_work?: string | null
          voting_record?: string | null
        }
        Update: {
          activity_log?: string | null
          age?: number | null
          contact?: string | null
          education?: string | null
          electoral_history?: string | null
          email?: string
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id?: string
          key_policy_interests?: string | null
          location?: string | null
          name?: string
          parliamentary_roles?: string | null
          professional_background?: string | null
          roles?: string[] | null
          status?: Database["public"]["Enums"]["status_enum"] | null
          volunteer_work?: string | null
          voting_record?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_location_fkey"
            columns: ["location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["name"]
          },
        ]
      }
      motion_topics: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      motions: {
        Row: {
          description: string | null
          id: string
          is_party_sponsored: boolean | null
          meeting_id: string | null
          sponsor_id: string | null
          title: string
          topic: string | null
          total_parliament_abstain: number | null
          total_parliament_aye: number | null
          total_parliament_nay: number | null
        }
        Insert: {
          description?: string | null
          id: string
          is_party_sponsored?: boolean | null
          meeting_id?: string | null
          sponsor_id?: string | null
          title: string
          topic?: string | null
          total_parliament_abstain?: number | null
          total_parliament_aye?: number | null
          total_parliament_nay?: number | null
        }
        Update: {
          description?: string | null
          id?: string
          is_party_sponsored?: boolean | null
          meeting_id?: string | null
          sponsor_id?: string | null
          title?: string
          topic?: string | null
          total_parliament_abstain?: number | null
          total_parliament_aye?: number | null
          total_parliament_nay?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "motions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "motions_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action: string
          details: string | null
          id: string
          timestamp: string
          user: string
        }
        Insert: {
          action: string
          details?: string | null
          id: string
          timestamp: string
          user: string
        }
        Update: {
          action?: string
          details?: string | null
          id?: string
          timestamp?: string
          user?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: string
          member_id: string | null
          motion_id: string | null
          vote: Database["public"]["Enums"]["vote_type_enum"] | null
        }
        Insert: {
          id: string
          member_id?: string | null
          motion_id?: string | null
          vote?: Database["public"]["Enums"]["vote_type_enum"] | null
        }
        Update: {
          id?: string
          member_id?: string | null
          motion_id?: string | null
          vote?: Database["public"]["Enums"]["vote_type_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_motion_id_fkey"
            columns: ["motion_id"]
            isOneToOne: false
            referencedRelation: "motions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender_enum: "Male" | "Female" | "Other"
      meeting_session_enum: "การประชุมสามัญ" | "การประชุมวิสามัญ"
      meeting_type_enum: "การประชุมสภา" | "การประชุมพรรค" | "การประชุมกรรมาธิการ"
      status_enum: "Active" | "Inactive" | "Former Member"
      vote_type_enum: "Aye" | "Nay" | "Abstain" | "Absent" | "Leave"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
