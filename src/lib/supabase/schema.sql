-- Drop existing tables and types to start fresh (optional, use with caution)
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.motions CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;
DROP TABLE IF EXISTS public.member_committees CASCADE;
DROP TABLE IF EXISTS public.committees CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;
DROP TABLE IF EXISTS public.motion_topics CASCADE;
DROP TABLE IF EXISTS public.system_logs CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;

DROP TYPE IF EXISTS public.gender_enum;
DROP TYPE IF EXISTS public.status_enum;
DROP TYPE IF EXISTS public.vote_type_enum;
DROP TYPE IF EXISTS public.meeting_type_enum;
DROP TYPE IF EXISTS public.meeting_session_enum;


-- Create ENUM types
CREATE TYPE public.gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE public.status_enum AS ENUM ('Active', 'Inactive', 'Former Member');
CREATE TYPE public.vote_type_enum AS ENUM ('Aye', 'Nay', 'Abstain', 'Absent', 'Leave');
CREATE TYPE public.meeting_type_enum AS ENUM ('การประชุมสภา', 'การประชุมพรรค', 'การประชุมกรรมาธิการ');
CREATE TYPE public.meeting_session_enum AS ENUM ('การประชุมสามัญ', 'การประชุมวิสามัญ');

-- Create tables
CREATE TABLE public.locations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.committees (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.motion_topics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    year INT,
    gender public.gender_enum,
    location TEXT REFERENCES public.locations(name),
    education TEXT,
    faculty TEXT,
    contact TEXT,
    roles TEXT[],
    status public.status_enum,
    election_history TEXT,
    council_roles TEXT,
    voting_record TEXT,
    policy_interests TEXT,
    activity_log TEXT,
    volunteer_work TEXT
);

CREATE TABLE public.member_committees (
    member_id TEXT REFERENCES public.members(id) ON DELETE CASCADE,
    committee_id INT REFERENCES public.committees(id) ON DELETE CASCADE,
    PRIMARY KEY (member_id, committee_id)
);

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

CREATE TABLE public.motions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    meeting_id TEXT REFERENCES public.meetings(id) ON DELETE CASCADE,
    is_party_proposed BOOLEAN,
    topic TEXT,
    proposer_id TEXT REFERENCES public.members(id),
    total_council_aye INT,
    total_council_nay INT,
    total_council_abstain INT
);

CREATE TABLE public.votes (
    id TEXT PRIMARY KEY,
    motion_id TEXT REFERENCES public.motions(id) ON DELETE CASCADE,
    member_id TEXT REFERENCES public.members(id) ON DELETE CASCADE,
    vote public.vote_type_enum,
    UNIQUE (motion_id, member_id)
);

CREATE TABLE public.system_logs (
    id TEXT PRIMARY KEY,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "user" TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT
);

CREATE TABLE public.permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.role_permissions (
    role_id TEXT REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id TEXT REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Insert initial data
INSERT INTO public.locations (name) VALUES 
('ท่าพระจันทร์'), ('รังสิต'), ('ลำปาง'), ('พัทยา'), ('ส่วนกลาง');

INSERT INTO public.committees (name) VALUES 
('Finance'), ('Outreach'), ('Judiciary'), ('Economic Affairs'), ('Culture'), ('Strategy');

INSERT INTO public.motion_topics (name) VALUES
('Economy'), ('Social'), ('Security'), ('Foreign Affairs'), ('Education'), ('Environment');

INSERT INTO public.permissions (id, name) VALUES
('CREATE_PARTY_MEMBER', 'Create Party Member'),
('EDIT_MP_PROFILE', 'Edit MP Profile'),
('VIEW_ANALYTICS_DASHBOARD', 'View Analytics Dashboard'),
('MANAGE_MEETINGS', 'Manage Meetings'),
('RECORD_VOTES', 'Record Votes'),
('ADMIN_ACCESS', 'Admin Access');

INSERT INTO public.roles (id, name) VALUES
('ADMIN', 'Admin'),
('HR_MANAGER', 'HR Manager'),
('MEETING_SECRETARY', 'Meeting Secretary'),
('DATA_ANALYST', 'Data Analyst'),
('PARTY_MEMBER', 'Party Member');

INSERT INTO public.role_permissions (role_id, permission_id) VALUES
('ADMIN', 'CREATE_PARTY_MEMBER'),
('ADMIN', 'EDIT_MP_PROFILE'),
('ADMIN', 'VIEW_ANALYTICS_DASHBOARD'),
('ADMIN', 'MANAGE_MEETINGS'),
('ADMIN', 'RECORD_VOTES'),
('ADMIN', 'ADMIN_ACCESS'),
('HR_MANAGER', 'CREATE_PARTY_MEMBER'),
('HR_MANAGER', 'EDIT_MP_PROFILE'),
('MEETING_SECRETARY', 'MANAGE_MEETINGS'),
('MEETING_SECRETARY', 'RECORD_VOTES'),
('DATA_ANALYST', 'VIEW_ANALYTICS_DASHBOARD');

INSERT INTO public.members (id, name, email, year, gender, location, education, faculty, contact, roles, status, election_history, council_roles, policy_interests, activity_log, volunteer_work) VALUES
('mem-1', 'สมชาย ใจดี', 'somchai.jaidee@example.com', 4, 'Male', 'ท่าพระจันทร์', 'เศรษฐศาสตรบัณฑิต', 'เศรษฐศาสตร์', '0812345678', '{"isPartyMember", "isExec"}', 'Active', NULL, NULL, NULL, 'จัดเวทีเสวนา 3 ครั้ง', '80 ชั่วโมง'),
('mem-2', 'สมหญิง รักไทย', 'somying.rakthai@example.com', 3, 'Female', 'รังสิต', 'นิติศาสตรบัณฑิต', 'นิติศาสตร์', '0823456789', '{"isPartyMember", "isCouncilMember"}', 'Active', 'ได้รับเลือกตั้งปี 2565', 'กรรมาธิการ', 'การศึกษา, สิ่งแวดล้อม', 'เข้าร่วมประชุม 20 ครั้ง', '50 ชั่วโมง'),
('mem-3', 'มานะ อดทน', 'mana.odton@example.com', 2, 'Male', 'ลำปาง', 'วิทยาศาสตรบัณฑิต', 'วิทยาศาสตร์และเทคโนโลยี', '0834567890', '{"isPartyMember"}', 'Active', NULL, NULL, NULL, 'ช่วยจัดกิจกรรมพรรค 2 ครั้ง', '30 ชั่วโมง'),
('mem-4', 'ปิติ ยินดี', 'piti.yindee@example.com', 4, 'Male', 'ท่าพระจันทร์', 'ศิลปศาสตรบัณฑิต', 'วารสารศาสตร์', '0845678901', '{"isPartyMember"}', 'Inactive', NULL, NULL, NULL, 'เคยเป็นหัวหน้าทีมหาเสียง', '150 ชั่วโมง'),
('mem-5', 'เมตตา กรุณา', 'metta.karuna@example.com', 1, 'Female', 'รังสิต', 'ศิลปศาสตรบัณฑิต', 'ศิลปศาสตร์', '0856789012', '{"isPartyMember"}', 'Active', NULL, NULL, NULL, 'ร่วมกิจกรรมรับน้อง', '20 ชั่วโมง');

INSERT INTO public.member_committees (member_id, committee_id) VALUES
('mem-1', (SELECT id FROM public.committees WHERE name = 'Strategy')),
('mem-2', (SELECT id FROM public.committees WHERE name = 'Judiciary')),
('mem-2', (SELECT id FROM public.committees WHERE name = 'Finance'));

INSERT INTO public.meetings (id, title, date, presiding_officer, location, meeting_type, meeting_session, meeting_number, attendees) VALUES
('meet-1', 'ประชุมพรรคสามัญ', '2024-07-20', 'สมชาย ใจดี', 'ท่าพระจันทร์', 'การประชุมพรรค', 'การประชุมสามัญ', '1/2567', '{"mem-1", "mem-2", "mem-3", "mem-4", "mem-5"}'),
('meet-2', 'ประชุมสภานักศึกษา', '2024-07-22', 'อธิการบดี', 'ส่วนกลาง', 'การประชุมสภา', 'การประชุมสามัญ', '5/2567', '{"mem-2"}');

INSERT INTO public.motions (id, title, description, meeting_id, is_party_proposed, topic, proposer_id, total_council_aye, total_council_nay, total_council_abstain) VALUES
('motion-1', 'เสนอปรับปรุงห้องสมุด', 'เสนอญัตติเพื่อขออนุมัติงบประมาณปรับปรุงห้องสมุดคณะนิติศาสตร์', 'meet-1', true, 'Education', 'mem-2', NULL, NULL, NULL),
('motion-2', 'เสนอโครงการลดขยะพลาสติก', 'เสนอโครงการรณรงค์ลดการใช้ขยะพลาสติกในมหาวิทยาลัย', 'meet-2', true, 'Environment', 'mem-2', 25, 5, 2);

INSERT INTO public.votes (id, motion_id, member_id, vote) VALUES
('vote-1', 'motion-1', 'mem-1', 'Aye'),
('vote-2', 'motion-1', 'mem-2', 'Aye'),
('vote-3', 'motion-1', 'mem-3', 'Nay'),
('vote-4', 'motion-1', 'mem-4', 'Absent'),
('vote-5', 'motion-1', 'mem-5', 'Abstain'),
('vote-6', 'motion-2', 'mem-2', 'Aye');

INSERT INTO public.system_logs (id, "timestamp", "user", action, details) VALUES
('log-1', '2024-07-26 10:00:00+07', 'admin@polity.com', 'Login', 'Successful login from IP 192.168.1.1'),
('log-2', '2024-07-26 10:05:00+07', 'admin@polity.com', 'Edit Meeting', 'Edited meeting "meet-1"'),
('log-3', '2024-07-26 10:10:00+07', 'admin@polity.com', 'Record Vote', 'Recorded votes for motion "motion-1"'),
('log-4', '2024-07-25 09:00:00+07', 'secretary@polity.com', 'Create Meeting', 'Created new meeting "meet-2"'),
('log-5', '2024-07-25 09:05:00+07', 'security-bot', 'Security Alert', 'Multiple failed login attempts for user "someone@evil.com"'),
('log-6', '2024-07-25 09:10:00+07', 'admin@polity.com', 'Edit Role', 'Updated permissions for role "HR_MANAGER"');
