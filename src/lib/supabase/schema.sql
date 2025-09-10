-- Create tables
CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE committees (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE motion_topics (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE status_enum AS ENUM ('Active', 'Inactive', 'Former Member');

CREATE TABLE members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    year INT,
    gender gender_enum,
    location TEXT REFERENCES locations(name),
    education TEXT,
    faculty TEXT,
    activity_log TEXT,
    volunteer_work TEXT,
    contact TEXT,
    roles TEXT[],
    status status_enum,
    election_history TEXT,
    council_roles TEXT,
    voting_record TEXT,
    policy_interests TEXT
);

CREATE TABLE members_committees (
    member_id TEXT NOT NULL REFERENCES members(id),
    committee_id BIGINT NOT NULL REFERENCES committees(id),
    PRIMARY KEY (member_id, committee_id)
);


CREATE TYPE meeting_type_enum AS ENUM ('การประชุมสภา', 'การประชุมพรรค', 'การประชุมกรรมาธิการ');
CREATE TYPE meeting_session_enum AS ENUM ('การประชุมสามัญ', 'การประชุมวิสามัญ');

CREATE TABLE meetings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    presiding_officer TEXT,
    location TEXT REFERENCES locations(name),
    meeting_type meeting_type_enum,
    meeting_session meeting_session_enum,
    meeting_number TEXT,
    committee_name TEXT,
    related_documents JSON,
    attendees TEXT[]
);


CREATE TABLE motions (
    id TEXT PRIMARY KEY,
    meeting_id TEXT REFERENCES meetings(id),
    title TEXT NOT NULL,
    description TEXT,
    is_party_proposed BOOLEAN,
    topic TEXT,
    proposer_id TEXT REFERENCES members(id),
    total_council_aye INT,
    total_council_nay INT,
    total_council_abstain INT
);

CREATE TYPE vote_type_enum AS ENUM ('Aye', 'Nay', 'Abstain', 'Absent', 'Leave');

CREATE TABLE votes (
    id BIGSERIAL PRIMARY KEY,
    motion_id TEXT REFERENCES motions(id),
    member_id TEXT REFERENCES members(id),
    vote vote_type_enum,
    UNIQUE(motion_id, member_id)
);

CREATE TABLE permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE role_permissions (
    role_id TEXT NOT NULL REFERENCES roles(id),
    permission_id TEXT NOT NULL REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE system_logs (
    id TEXT PRIMARY KEY,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "user" TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT
);


-- Seed data
INSERT INTO locations (name) VALUES
('ท่าพระจันทร์'),
('รังสิต'),
('ลำปาง'),
('ส่วนกลาง'),
('พัทยา');

INSERT INTO committees (name) VALUES
('Finance'),
('Outreach'),
('Judiciary'),
('Economic Affairs'),
('Culture'),
('Strategy');

INSERT INTO motion_topics (name) VALUES
('Economy'),
('Social'),
('Security'),
('Foreign Affairs'),
('Education'),
('Environment');

INSERT INTO members (id, name, email, year, gender, location, education, faculty, activity_log, volunteer_work, contact, roles, status, election_history, council_roles, voting_record, policy_interests) VALUES
('mem-1', 'อานนท์', 'anon@example.com', 4, 'Male', 'ท่าพระจันทร์', 'M.A. Political Science', 'Policy Advisor', 'Active in 5 campaigns', '120 hours', '081-234-5678', '{"isPartyMember", "isExec"}', 'Active', NULL, NULL, NULL, NULL),
('mem-2', 'บุษบา', 'busaba@example.com', 3, 'Female', 'รังสิต', 'B.S. Economics', 'Economist', 'Organized 3 town halls', '80 hours', '082-345-6789', '{"isPartyMember"}', 'Active', NULL, NULL, NULL, NULL),
('mem-3', 'ชาติชาย', 'chatchai@example.com', 2, 'Male', 'ลำปาง', 'J.D.', 'Lawyer', 'Attended 20 meetings', '50 hours', '083-456-7890', '{"isPartyMember"}', 'Inactive', NULL, NULL, NULL, NULL),
('mem-4', 'ดวงพร', 'duangporn@example.com', 4, 'Female', 'ท่าพระจันทร์', 'Ph.D. History', 'Professor', 'Published 2 articles', '200 hours', '084-567-8901', '{"isPartyMember"}', 'Active', NULL, NULL, NULL, NULL),
('mem-5', 'เอกชัย', 'ekachai@example.com', 1, 'Male', 'รังสิต', 'MBA', 'Consultant', 'Led fundraising drive', '150 hours', '085-678-9012', '{"isPartyMember"}', 'Former Member', NULL, NULL, NULL, NULL),
('mp-1', 'สมชาย', 'somchai@example.com', 4, 'Male', 'ท่าพระจันทร์', 'M.A. Political Science', 'Policy Advisor', NULL, NULL, '091-234-5678', '{"isPartyMember", "isCouncilMember"}', 'Active', 'Elected 2018, 2022', 'Whip', '95% attendance', 'Healthcare, Social Justice'),
('mp-2', 'สมศรี', 'somsri@example.com', 3, 'Female', 'รังสิต', 'MPH', 'Public Health Admin', NULL, NULL, '092-345-6789', '{"isPartyMember", "isCouncilMember", "isExec"}', 'Active', 'Elected 2010, 2014, 2018, 2022', 'Committee Chair (Oversight)', '98% attendance', 'Government Transparency, Civil Liberties'),
('mp-3', 'เจษฎา', 'jesada@example.com', 2, 'Male', 'ลำปาง', 'B.A. Journalism', 'Journalist', NULL, NULL, '093-456-7890', '{"isPartyMember", "isCouncilMember"}', 'Active', 'Elected 2022', 'Backbencher', '92% attendance', 'Environmental Protection, Renewable Energy'),
('mp-4', 'กัลยา', 'kanlaya@example.com', 4, 'Female', 'รังสิต', 'M.S. Environmental Science', 'Scientist', NULL, NULL, '094-567-8901', '{"isPartyMember", "isCouncilMember"}', 'Active', 'Elected 2022', 'Backbencher', '94% attendance', 'Education, Social');

-- Seed member-committee relationships
INSERT INTO members_committees (member_id, committee_id) VALUES
('mem-1', (SELECT id from committees WHERE name = 'Strategy')),
('mem-1', (SELECT id from committees WHERE name = 'Finance')),
('mem-2', (SELECT id from committees WHERE name = 'Outreach')),
('mem-4', (SELECT id from committees WHERE name = 'Culture')),
('mp-1', (SELECT id from committees WHERE name = 'Judiciary')),
('mp-2', (SELECT id from committees WHERE name = 'Strategy')),
('mp-2', (SELECT id from committees WHERE name = 'Finance')),
('mp-3', (SELECT id from committees WHERE name = 'Outreach')),
('mp-4', (SELECT id from committees WHERE name = 'Culture'));


INSERT INTO meetings (id, title, date, presiding_officer, location, meeting_type, meeting_session, committee_name, attendees, meeting_number)
VALUES 
('meet-1', 'การประชุมสภาสามัญ', '2024-07-20', 'สมศรี', 'ส่วนกลาง', 'การประชุมสภา', 'การประชุมสามัญ', NULL, '{"mp-1", "mp-2", "mp-3", "mp-4"}', '1/2567'),
('meet-2', 'การประชุมพรรค', '2024-07-22', 'อานนท์', 'ท่าพระจันทร์', 'การประชุมพรรค', 'การประชุมสามัญ', NULL, '{"mem-1", "mem-2", "mem-3", "mem-4", "mp-1", "mp-2", "mp-3", "mp-4"}', NULL),
('meet-3', 'ประชุมกรรมาธิการการเงิน', '2024-07-25', 'สมศรี', 'ส่วนกลาง', 'การประชุมกรรมาธิการ', 'การประชุมวิสามัญ', 'Finance', '{"mem-1", "mp-2"}', NULL);

INSERT INTO motions (id, meeting_id, title, description, is_party_proposed, topic, proposer_id, total_council_aye, total_council_nay, total_council_abstain)
VALUES
('mot-1', 'meet-1', 'ญัตติลดค่าเทอม', 'เสนอให้ลดค่าเทอม 10%', true, 'Economy', 'mp-1', 150, 100, 10),
('mot-2', 'meet-1', 'ญัตติเพิ่มวันหยุด', 'เสนอให้เพิ่มวันหยุดนักขัตฤกษ์', false, 'Social', NULL, 80, 150, 20),
('mot-3', 'meet-2', 'เลือกตั้งคณะกรรมการบริหารชุดใหม่', 'เสนอวาระเลือกตั้งคณะกรรมการบริหารพรรคชุดใหม่', true, 'Strategy', NULL, NULL, NULL, NULL),
('mot-4', 'meet-3', 'พิจารณางบประมาณชมรม', 'พิจารณาอนุมัติงบประมาณสำหรับชมรมต่างๆ', true, 'Finance', 'mp-2', NULL, NULL, NULL);

INSERT INTO votes (motion_id, member_id, vote)
VALUES
('mot-1', 'mp-1', 'Aye'), ('mot-1', 'mp-2', 'Aye'), ('mot-1', 'mp-3', 'Nay'), ('mot-1', 'mp-4', 'Aye'),
('mot-2', 'mp-1', 'Nay'), ('mot-2', 'mp-2', 'Nay'), ('mot-2', 'mp-3', 'Nay'), ('mot-2', 'mp-4', 'Abstain');


INSERT INTO permissions (id, name) VALUES
('perm-create-member', 'Create Party Member'),
('perm-edit-mp', 'Edit MP Profile'),
('perm-view-analytics', 'View Analytics Dashboard'),
('perm-manage-meetings', 'Manage Meetings'),
('perm-record-votes', 'Record Votes'),
('perm-admin', 'Admin Access');

INSERT INTO roles (id, name) VALUES
('role-admin', 'Admin'),
('role-hr', 'HR Manager'),
('role-secretary', 'Meeting Secretary'),
('role-analyst', 'Data Analyst'),
('role-member', 'Party Member');

INSERT INTO role_permissions (role_id, permission_id) VALUES
('role-admin', 'perm-admin'),
('role-hr', 'perm-create-member'),
('role-hr', 'perm-edit-mp'),
('role-secretary', 'perm-manage-meetings'),
('role-secretary', 'perm-record-votes'),
('role-analyst', 'perm-view-analytics');

INSERT INTO system_logs (id, "timestamp", "user", action, details) VALUES
('log-1', '2024-07-21T10:00:00Z', 'admin@example.com', 'Login', 'Successful login from IP 192.168.1.1'),
('log-2', '2024-07-21T10:05:00Z', 'secretary@example.com', 'Edit Meeting', 'Edited meeting "meet-1"'),
('log-3', '2024-07-21T10:10:00Z', 'secretary@example.com', 'Record Vote', 'Recorded votes for motion "mot-1"'),
('log-4', '2024-07-21T11:00:00Z', 'hr@example.com', 'Create Meeting', 'Created new meeting "meet-4"'),
('log-5', '2024-07-21T11:05:00Z', 'system', 'Security Alert', 'Multiple failed login attempts for user "guest"'),
('log-6', '2024-07-21T11:10:00Z', 'admin@example.com', 'Edit Role', 'Updated permissions for role "role-hr"');
