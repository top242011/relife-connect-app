-- Create custom enum types for structured data
CREATE TYPE public.gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE public.status_enum AS ENUM ('Active', 'Inactive', 'Former Member');
CREATE TYPE public.meeting_type_enum AS ENUM ('การประชุมสภา', 'การประชุมพรรค', 'การประชุมกรรมาธิการ');
CREATE TYPE public.meeting_session_enum AS ENUM ('การประชุมสามัญ', 'การประชุมวิสามัญ');
CREATE TYPE public.vote_type_enum AS ENUM ('Aye', 'Nay', 'Abstain', 'Absent', 'Leave');

-- Create a table for locations/constituencies
CREATE TABLE public.locations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create a table for members
CREATE TABLE public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact TEXT,
    age INT,
    gender public.gender_enum,
    location TEXT REFERENCES public.locations(name),
    education TEXT,
    professional_background TEXT,
    roles TEXT[],
    activity_log TEXT,
    volunteer_work TEXT,
    status public.status_enum,
    -- MP-specific fields
    electoral_history TEXT,
    parliamentary_roles TEXT,
    key_policy_interests TEXT,
    voting_record TEXT
);

-- Create a table for committees
CREATE TABLE public.committees (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create a join table for the many-to-many relationship between members and committees
CREATE TABLE public.member_committees (
    member_id TEXT REFERENCES public.members(id) ON DELETE CASCADE,
    committee_id INT REFERENCES public.committees(id) ON DELETE CASCADE,
    PRIMARY KEY (member_id, committee_id)
);

-- Create a table for meetings
CREATE TABLE public.meetings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    presiding_officer TEXT,
    location TEXT REFERENCES public.locations(name),
    meeting_type public.meeting_type_enum,
    meeting_session public.meeting_session_enum,
    meeting_number TEXT,
    committee_name TEXT,
    related_documents JSON,
    attendees TEXT[]
);

-- Create a table for motion topics
CREATE TABLE public.motion_topics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create a table for motions within meetings
CREATE TABLE public.motions (
    id TEXT PRIMARY KEY,
    meeting_id TEXT REFERENCES public.meetings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_party_sponsored BOOLEAN DEFAULT false,
    topic TEXT,
    sponsor_id TEXT REFERENCES public.members(id),
    total_parliament_aye INT,
    total_parliament_nay INT,
    total_parliament_abstain INT
);

-- Create a table for votes on motions
CREATE TABLE public.votes (
    id TEXT PRIMARY KEY,
    motion_id TEXT REFERENCES public.motions(id) ON DELETE CASCADE,
    member_id TEXT REFERENCES public.members(id) ON DELETE CASCADE,
    vote public.vote_type_enum
);

-- Create a table for system logs
CREATE TABLE public.system_logs (
    id TEXT PRIMARY KEY,
    "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "user" TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT
);

-- Create a table for roles
CREATE TABLE public.roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create a table for permissions
CREATE TABLE public.permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create a join table for the many-to-many relationship between roles and permissions
CREATE TABLE public.role_permissions (
    role_id TEXT REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id TEXT REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
